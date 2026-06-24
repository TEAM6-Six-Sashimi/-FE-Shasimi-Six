'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AdminCategory } from '../../type';
import CategoryRegisterModal from './CategoryRegisterModal';

interface Props {
  categories: AdminCategory[];
}

export default function CategoryManage({ categories }: Props) {
  const rows = categories;
  const [openRegisterModal, setOpenRegisterModal] = useState(false);

  const handleEdit = (row: AdminCategory) => {
    alert(`"${row.mainCategoryName} > ${row.subCategory}" 수정 기능은 준비 중입니다.`);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-extrabold text-[#1E2125]">카테고리 관리</h2>
        <Button
          onClick={() => setOpenRegisterModal(true)}
          className="h-10 px-4 bg-[#CFEE5D] hover:bg-[#A8D014] text-[#1E2125] text-[13px] font-semibold cursor-pointer"
        >
          + 카테고리 등록
        </Button>
      {openRegisterModal && (
        <CategoryRegisterModal
          categories={categories}
          onClose={() => setOpenRegisterModal(false)}
          onSubmit={(data) => {
            console.log(data);
            setOpenRegisterModal(false);
          }}
        />
      )}
      </div>

      <table className="w-full text-[13px] table-fixed">
        <thead>
          <tr className="border-b border-[#E5E7EB]">
            <th className="py-3 w-[6%] text-center font-semibold text-[#1E2125]">#</th>
            <th className="py-3 w-[17%] text-center font-semibold text-[#1E2125]">
              세부 카테고리 ID
            </th>
            <th className="py-3 w-[20%] text-center font-semibold text-[#1E2125]">카테고리명</th>
            <th className="py-3 w-[25%] text-center font-semibold text-[#1E2125]">
              세부 카테고리명
            </th>
            <th className="py-3 w-[22%] text-center font-semibold text-[#1E2125]">관리</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-16 text-center text-[#6A7282]">
                등록된 카테고리가 없습니다.
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={row.code}
                className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors"
              >
                <td className="py-3 text-center text-[#6A7282]">{idx + 1}</td>
                <td className="py-3 text-center text-[#6A7282]">{row.code}</td>
                <td className="py-3 text-center font-semibold text-[#1E2125]">
                  {row.mainCategoryName}
                </td>
                <td className="py-3 text-center text-[#6A7282]">{row.subCategory}</td>
                <td className="py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(row)}
                      className="h-8 px-4 border-[#D1D5DB] text-[#1E2125] text-[12px] font-semibold hover:bg-white hover:border-[#6A7282] cursor-pointer"
                    >
                      수정
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 px-4 text-[12px] font-semibold border-0 cursor-pointer bg-[#FF5F5F] hover:bg-[#D14848] text-white"
                    >
                      삭제
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
