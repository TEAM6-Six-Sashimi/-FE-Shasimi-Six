'use client';

import Image from "next/image";
import { CourseItem } from "../types";

interface EnrollmentContentProps {
    items: CourseItem[];
}

export default function EnrollmentContent({ items }: EnrollmentContentProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">주문 목록</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <CourseCard key={item.id} item={item} />
              ))}
            </div>
        </div>
    );
}

function CourseCard({ item }: {item: CourseItem }) {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
            <div className="relative w-[120px] h-[80px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // fallback: 이미지 없을 때 회색 배경 유지
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-1">{item.category}</p>
                <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                        정
                    </span>
                    <span className="text-sm text-gray-500">{item.instructor}</span>
                </div>
            </div>

            {/* Price */}
            <div className="flex-shrink-0 text-right">
              <span className="text-[17px] font-bold text-rose-500">
                {item.price.toLocaleString()} 크레딧
              </span>
            </div>
        </div>
    )
}