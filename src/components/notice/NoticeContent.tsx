'use client';

import { ReactNode, useMemo } from 'react';
import { getThumbnailUrl } from '@/lib/thumbnail';

// 공지사항 content에 들어간 간단한 서식 문법을 렌더링
// - ![alt](url) : 이미지
// - [size=N]text[/size] : 글씨 크기 (내부에 **볼드**도 중첩 가능)
// - **text** : 볼드
const INLINE_PATTERN =
  '!\\[([^\\]]*)\\]\\(([^)]+)\\)' + // 1: alt, 2: url
  '|\\[size=(\\d+)\\]([\\s\\S]*?)\\[/size\\]' + // 3: px, 4: inner
  '|\\*\\*([^*]+)\\*\\*'; // 5: bold text

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const regex = new RegExp(INLINE_PATTERN, 'g');
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`${keyPrefix}-t${idx++}`} className="whitespace-pre-wrap">
          {text.slice(lastIndex, match.index)}
        </span>,
      );
    }

    const [, alt, url, sizePx, sizeInner, boldText] = match;

    if (url !== undefined) {
      const resolvedUrl = getThumbnailUrl(url);
      if (resolvedUrl) {
        nodes.push(
          // eslint-disable-next-line @next/next/no-img-element -- 첨부 이미지는 크기를 알 수 없어 비율 유지가 필요, next/image는 부적합
          <img
            key={`${keyPrefix}-img${idx++}`}
            src={resolvedUrl}
            alt={alt || '공지 이미지'}
            className="block max-w-full h-auto rounded-lg border border-[#E5E7EB] my-3"
          />,
        );
      }
    } else if (sizeInner !== undefined) {
      nodes.push(
        <span key={`${keyPrefix}-sz${idx}`} style={{ fontSize: `${sizePx}px` }}>
          {renderInline(sizeInner, `${keyPrefix}-sz${idx++}`)}
        </span>,
      );
    } else if (boldText !== undefined) {
      nodes.push(
        <strong key={`${keyPrefix}-b${idx++}`} className="whitespace-pre-wrap">
          {boldText}
        </strong>,
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(
      <span key={`${keyPrefix}-t${idx++}`} className="whitespace-pre-wrap">
        {text.slice(lastIndex)}
      </span>,
    );
  }

  return nodes;
}

interface NoticeContentProps {
  content: string;
}

export default function NoticeContent({ content }: NoticeContentProps) {
  const nodes = useMemo(() => renderInline(content, 'root'), [content]);

  return <div className="text-[14px] text-[#1E2125] leading-relaxed wrap-break-word">{nodes}</div>;
}
