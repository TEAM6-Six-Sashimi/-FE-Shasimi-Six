'use client';

import Image from 'next/image';
import { EnrollmentCourseItem } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface EnrollmentContentProps {
  items: EnrollmentCourseItem[];
}

function getThumbnailUrl(thumbnail: string | null | undefined): string | null {
  if (!thumbnail) return null;
  return thumbnail.startsWith('http') ? thumbnail : `${API_BASE_URL}/${thumbnail}`;
}

export default function EnrollmentContent({ items }: EnrollmentContentProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">주문 목록</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <CourseCard key={item.courseId} item={item} />
        ))}
      </div>
    </div>
  );
}

function CourseCard({ item }: { item: EnrollmentCourseItem }) {
  const thumbnailUrl = getThumbnailUrl(item.thumbnail);

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-[#D1D5DB]">
      {/* 썸네일 */}
      <div className="relative w-30 h-20 shrink-0 rounded-lg overflow-hidden bg-[#D1D5DB]">
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={item.title}
            fill
            unoptimized
            className="object-cover"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
        <p className="text-xs text-[#FF5F5F] mb-1">{item.category}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#6A7282] text-white text-[10px] font-bold" />
          <span className="text-sm text-gray-500">{item.instructorName}</span>
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <span className="text-[17px] font-bold text-[#FF5F5F]">
          {item.price.toLocaleString()} 크레딧
        </span>
      </div>
    </div>
  );
}
