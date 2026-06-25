'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { OrderLineItem } from '../types';
import type { Category } from '@/features/categories/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface PaymentContentProps {
  items: OrderLineItem[];
  categories: Category[];
}

function getThumbnailUrl(thumbnail: string | null | undefined): string | null {
  if (!thumbnail) return null;
  return thumbnail.startsWith('http') ? thumbnail : `${API_BASE_URL}/${thumbnail}`;
}

export default function PaymentContent({ items, categories }: PaymentContentProps) {
  // 세부카테고리명 → 대카테고리명 매핑 (item.subtitle은 세부카테고리명만 담고 있음)
  const subToMainMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((cat) => {
      cat.options.forEach((opt) => {
        map.set(opt.name, cat.name);
      });
    });
    return map;
  }, [categories]);

  const getCategoryLabel = (subCategoryName: string) => {
    if (!subCategoryName) return '';
    const mainCategoryName = subToMainMap.get(subCategoryName);
    return mainCategoryName ? `${mainCategoryName} > ${subCategoryName}` : subCategoryName;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">주문 목록</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <OrderLineCard key={item.id} item={item} categoryLabel={getCategoryLabel(item.subtitle)} />
        ))}
      </div>
    </div>
  );
}

function OrderLineCard({
  item,
  categoryLabel,
}: {
  item: OrderLineItem;
  categoryLabel: string;
}) {
  const thumbnailUrl = getThumbnailUrl(item.thumbnail);

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-[#D1D5DB]">
      {/* 썸네일 */}
      <div className="relative w-30 h-20 shrink-0 rounded-lg overflow-hidden bg-[#D1D5DB]">
        {thumbnailUrl && (
          <Image src={thumbnailUrl} alt={item.title} fill unoptimized className="object-cover" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
        {categoryLabel && <p className="text-xs text-[#FF5F5F] mb-1">{categoryLabel}</p>}
        {item.meta && <p className="text-sm text-gray-500 mt-1.5">{item.meta}</p>}
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