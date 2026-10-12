'use client';

import React, { useRef } from 'react';
import { adjustCrop, drawCrop, type CropHandle, type CropRect } from '@/lib/clip-crop';

const handles: { id: CropHandle; label: string; left: string; top: string }[] = [
  { id: 'nw', label: 'top left', left: '0%', top: '0%' },
  { id: 'n', label: 'top', left: '50%', top: '0%' },
  { id: 'ne', label: 'top right', left: '100%', top: '0%' },
  { id: 'e', label: 'right', left: '100%', top: '50%' },
  { id: 'se', label: 'bottom right', left: '100%', top: '100%' },
  { id: 's', label: 'bottom', left: '50%', top: '100%' },
  { id: 'sw', label: 'bottom left', left: '0%', top: '100%' },
  { id: 'w', label: 'left', left: '0%', top: '50%' },
];

export function CropSelection({ crop, onChange, drawing, onDrawEnd }: {
  crop: CropRect; onChange: (crop: CropRect) => void; drawing: boolean; onDrawEnd: () => void;
}) {
  const drag = useRef<{ pointer: number; x: number; y: number; rect: CropRect; handle: CropHandle | 'draw' } | null>(null);
  const point = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)), y: Math.max(0, Math.min(100, (event.clientY - bounds.top) / bounds.height * 100)) };
  };
  const keyboard = (event: React.KeyboardEvent, handle: CropHandle) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const step = event.shiftKey ? 5 : 0.5;
    onChange(adjustCrop(crop, handle, event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0, event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0));
  };
  return (
    <div className={`absolute inset-0 overflow-hidden touch-none ${drawing ? 'cursor-crosshair' : ''}`}
      data-testid="crop-overlay"
      onPointerDown={event => {
        if (event.button !== 0) return;
        event.preventDefault();
        const { x, y } = point(event);
        const handle = drawing ? 'draw' : ((event.target as HTMLElement).closest<HTMLElement>('[data-crop-handle]')?.dataset.cropHandle as CropHandle || 'draw');
        drag.current = { pointer: event.pointerId, x, y, rect: crop, handle };
        event.currentTarget.setPointerCapture(event.pointerId);
        if (handle === 'draw') onChange(drawCrop(x, y, x, y));
      }}
      onPointerMove={event => {
        const start = drag.current;
        if (!start || start.pointer !== event.pointerId) return;
        const { x, y } = point(event);
        onChange(start.handle === 'draw' ? drawCrop(start.x, start.y, x, y) : adjustCrop(start.rect, start.handle, x - start.x, y - start.y));
      }}
      onPointerUp={event => {
        if (drag.current?.pointer !== event.pointerId) return;
        drag.current = null;
        event.currentTarget.releasePointerCapture(event.pointerId);
        onDrawEnd();
      }}
      onPointerCancel={() => { drag.current = null; onDrawEnd(); }}>
      <div role="group" tabIndex={0} aria-label="Move crop selection" data-crop-handle="move"
        onKeyDown={event => keyboard(event, 'move')}
        className="absolute border-2 border-red-600 cursor-move focus:outline-none focus:border-blue-500"
        style={{ left: `${crop.x}%`, top: `${crop.y}%`, width: `${crop.width}%`, height: `${crop.height}%`, boxShadow: '0 0 0 99999px rgba(0,0,0,.55)' }}>
        {handles.map(handle => (
          <button key={handle.id} type="button" data-crop-handle={handle.id} aria-label={`Resize crop ${handle.label}`}
            onKeyDown={event => { event.stopPropagation(); keyboard(event, handle.id); }}
            className="absolute w-7 h-7 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            style={{ left: handle.left, top: handle.top, cursor: `${handle.id}-resize` }}>
            <span className="block w-3 h-3 border-2 border-white bg-red-600 shadow" />
          </button>
        ))}
      </div>
    </div>
  );
}
