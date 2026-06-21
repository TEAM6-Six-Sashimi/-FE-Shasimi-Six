'use client';

import { Button } from '@/components/ui/button';
import type { Category } from '@/features/categories/types';

interface Props {
  categories: Category[];
}

interface FlatRow {
  rowId: string;
  mainCategoryId: number;
  mainCategoryName: string;
  optionId: number;
  optionName: string;
}

export default function CategoryManage({ categories }: Props) {
  const rows: FlatRow[] = categories.flatMap((cat) =>
    cat.options.map((opt) => ({
      rowId: `cat-${String(opt.id).padStart(3, '0')}`,
      mainCategoryId: cat.mainCategoryId,
      mainCategoryName: cat.name,
      optionId: opt.id,
      optionName: opt.name,
    })),
  );

  // TODO: 카테고리 등록/수정 기능 연결
  const handleRegister = () => {
    alert('카테고리 등록 기능은 준비 중입니다.');
  };

  const handleEdit = (row: FlatRow) => {
    alert(`"${row.mainCategoryName} > ${row.optionName}" 수정 기능은 준비 중입니다.`);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-extrabold text-[#1E2125]">카테고리 관리</h2>
        <Button
          onClick={handleRegister}
          className="h-10 px-4 bg-[#CFEE5D] hover:bg-[#A8D014] text-[#1E2125] text-[13px] font-semibold cursor-pointer"
        >
          + 카테고리 등록
        </Button>
      </div>

      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[6%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[20%] text-center font-semibold text-[#1E2125]">
              세부 카테고리 ID
            </th>
            <th className="py-3 w-[24%] text-center font-semibold text-[#1E2125]">카테고리명</th>
            <th className="py-3 w-[34%] text-center font-semibold text-[#1E2125]">
              세부 카테고리명
            </th>
            <th className="py-3 w-[16%] text-center font-semibold text-[#1E2125]">관리</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-16 text-center text-[#6A7282]">
                등록된 카테고리가 없습니다.
              </td>?
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={row.rowId}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center text-[#6A7282]">{idx + 1}</td>
                <td className="py-3 text-center text-[#6A7282]">{row.rowId}</td>
                <td className="py-3 text-center font-semibold text-[#1E2125]">
                  {row.mainCategoryName}
                </td>
                <td className="py-3 text-center text-[#6A7282]">{row.optionName}</td>
                <td className="py-3 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(row)}
                    className="h-8 px-4 border-[#D1D5DB] text-[#1E2125] text-[12px] font-semibold hover:bg-white cursor-pointer"
                  >
                    수정
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
