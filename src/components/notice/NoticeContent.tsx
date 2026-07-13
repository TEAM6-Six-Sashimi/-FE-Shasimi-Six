'use client';

import { useMemo } from 'react';
import { getThumbnailUrl } from '@/lib/thumbnail';

// 공지사항 content에 ![alt](url) 형태로 삽입된 이미지를 실제 <img>로 렌더링
const IMAGE_MARKDOWN_REGEX = /!\[([^\]]*)\]\(([^)]+)\)/g;

interface ContentPart {
  type: 'text' | 'image';
  value: string;
  alt?: string;
}

function parseContent(content: string): ContentPart[] {
  const parts: ContentPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  IMAGE_MARKDOWN_REGEX.lastIndex = 0;
  while ((match = IMAGE_MARKDOWN_REGEX.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'image', value: match[2], alt: match[1] });
    lastIndex = IMAGE_MARKDOWN_REGEX.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push({ type: 'text', value: content.slice(lastIndex) });
  }

  return parts;
}

interface NoticeContentProps {
  content: string;
}

export default function NoticeContent({ content }: NoticeContentProps) {
  const parts = useMemo(() => parseContent(content), [content]);

  return (
    <div className="text-[14px] text-[#1E2125] leading-relaxed break-words">
      {parts.map((part, idx) => {
        if (part.type === 'text') {
          return (
            <span key={idx} className="whitespace-pre-wrap">
              {part.value}
            </span>
          );
        }

        const resolvedUrl = getThumbnailUrl(part.value);
        if (!resolvedUrl) return null;

        return (
          // eslint-disable-next-line @next/next/no-img-element -- 첨부 이미지는 크기를 알 수 없어 비율 유지가 필요, next/image는 부적합
          <img
            key={idx}
            src={resolvedUrl}
            alt={part.alt || '공지 이미지'}
            className="block max-w-full h-auto rounded-lg border border-[#E5E7EB] my-3"
          />
        );
      })}
    </div>
  );
}
