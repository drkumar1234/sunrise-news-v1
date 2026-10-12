import { safeUrl } from '@/lib/content-safety';
import { Author, Language } from '@/types';

interface AuthorAvatarProps {
  author: Pick<Author, 'name' | 'nameTe' | 'avatar' | 'avatarFit'>;
  lang?: Language;
  className?: string;
}

export function AuthorAvatar({ author, lang = 'en', className = '' }: AuthorAvatarProps) {
  const authorName = lang === 'te' && author.nameTe ? author.nameTe : author.name;
  const isLogo = author.avatarFit === 'contain';

  return (
    <span className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ${className}`}>
      <img
        src={safeUrl(author.avatar, '/brand/sunrise-news-logo.jpg')}
        alt={authorName}
        className={`h-full w-full ${isLogo ? 'object-contain' : 'object-cover'}`}
        style={isLogo ? { padding: '10%' } : undefined}
      />
    </span>
  );
}
