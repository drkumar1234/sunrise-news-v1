import 'server-only';
import { randomUUID } from 'node:crypto';
import { readJSON, mutateJSON } from './storage';
import { ApiError } from './auth';
import { object, onlyKeys, string } from './validation';
import { readMedia } from './media-store';
import type { StaffInput, StaffMember } from '../types/staff';

const STORE = 'sunrise-staff';
const KEY = 'register-v1';
export async function staffInput(value: unknown): Promise<StaffInput> {
  const input = object(value);
  onlyKeys(input, ['name', 'idNumber', 'age', 'fatherName', 'designation', 'experience', 'accreditationNumber', 'dateOfJoining', 'photoUrl', 'joiningLetterUrl']);
  const result: StaffInput = {
    name: string(input.name, 'name', 200, true),
    idNumber: string(input.idNumber, 'ID number', 80, true),
    age: input.age as number,
    fatherName: string(input.fatherName, 'father name', 200, true),
    designation: string(input.designation, 'designation', 200, true),
    experience: string(input.experience, 'experience', 2000, true),
    accreditationNumber: string(input.accreditationNumber, 'accreditation number', 100),
    dateOfJoining: string(input.dateOfJoining, 'date of joining', 10, true),
    photoUrl: string(input.photoUrl, 'photo', 200),
    joiningLetterUrl: string(input.joiningLetterUrl, 'joining letter', 200),
  };
  if (!Number.isInteger(result.age) || result.age < 18 || result.age > 100) throw new ApiError(400, 'Age must be a whole number between 18 and 100.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result.dateOfJoining) || !Number.isFinite(Date.parse(result.dateOfJoining)) || new Date(result.dateOfJoining).toISOString().slice(0, 10) !== result.dateOfJoining) throw new ApiError(400, 'Enter a valid date of joining.');
  for (const [url, types] of [[result.photoUrl, ['image/jpeg', 'image/png', 'image/webp']], [result.joiningLetterUrl, ['application/pdf', 'image/jpeg']]] as const) {
    if (!url) continue;
    if (!/^\/api\/media\/[0-9a-f-]{36}\.(pdf|jpe?g|png|webp)$/.test(url)) throw new ApiError(400, 'Select an uploaded staff file.');
    const media = await readMedia(url.slice('/api/media/'.length));
    if (!media?.metadata.private || !(types as readonly string[]).includes(media.metadata.contentType)) throw new ApiError(400, 'Invalid staff attachment.');
  }
  return result;
}
export function getStaff() { return readJSON<StaffMember[]>(STORE, KEY, () => []); }
export function saveStaff(input: StaffInput, id?: string) {
  return mutateJSON<StaffMember[], StaffMember>(STORE, KEY, () => [], members => {
    const index = id ? members.findIndex(member => member.id === id) : -1;
    if (id && index < 0) throw new ApiError(404, 'Staff member not found.');
    if (members.some(member => member.id !== id && member.idNumber.toLowerCase() === input.idNumber.toLowerCase())) throw new ApiError(409, 'That staff ID number is already enrolled.');
    const now = new Date().toISOString();
    const member = { ...input, id: id || randomUUID(), createdAt: index < 0 ? now : members[index].createdAt, updatedAt: now };
    if (index < 0) members.unshift(member); else members[index] = member;
    return member;
  });
}
export function removeStaff(id: string) {
  return mutateJSON<StaffMember[], boolean>(STORE, KEY, () => [], members => {
    const index = members.findIndex(member => member.id === id);
    if (index < 0) throw new ApiError(404, 'Staff member not found.');
    members.splice(index, 1);
    return true;
  });
}
