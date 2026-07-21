'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AdminCategory } from '../../type';
import CategoryRegisterModal from './CategoryRegisterModal';
import { createAdminCategory, deleteAdminCategory, updateAdminCategory } from '../../action';
import { useToast } from '@/components/ui/ToastContext';
import TwoButtonModal from '@/components/modals/TwoButtonModal';

interface Props {
  categories: AdminCategory[];
  accessToken: string;
}

export default function CategoryManage({ categories, accessToken }: Props) {
  const router = useRouter();
  const rows = categories;
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const [editTarget, setEditTarget] = useState<AdminCategory | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    type: 'create' | 'edit' | 'delete';
    payload?: any;
  } | null>(null);

  const handleEdit = (row: AdminCategory) => {
    setEditTarget(row);
  };

  const handleModalSubmit = (data: { name: string; subCategory: string }) => {
    if (editTarget) {
      setConfirmModal({ type: 'edit', payload: data });
    } else {
      setConfirmModal({ type: 'create', payload: data });
    }
  };

  const handleRegisterSubmit = async (data: { name: string; subCategory: string }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const result = await createAdminCategory(accessToken, {
      name: data.name,
      subCategory: data.subCategory,
    });

    if (result.success) {
      showToast('카테고리가 등록되었습니다.');
      setOpenRegisterModal(false);
      router.refresh();
    } else {
      showToast(result.message, 'negative');
    }
    setConfirmModal(null);
    setIsSubmitting(false);
  };

  const handleEditSubmit = async (data: { subCategory: string }) => {
    if (!editTarget || isSubmitting) return;
    setIsSubmitting(true);

    const result = await updateAdminCategory(accessToken, editTarget.id, {
      subCategory: data.subCategory,
    });

    if (result.success) {
      showToast('카테고리가 수정되었습니다.');
      setEditTarget(null);
      router.refresh();
    } else {
      showToast(result.message, 'negative');
    }
    setConfirmModal(null);
    setIsSubmitting(false);
  };

  const handleDeleteSubmit = async (id: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const result = await deleteAdminCategory(accessToken, id);

    if (result.success) {
      showToast('카테고리가 삭제되었습니다.');
      router.refresh();
    } else {
      showToast(result.message, 'negative');
    }
    setConfirmModal(null);
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-extrabold text-[#1E2125]">카테고리 관리</h2>
          <Button
            onClick={() => setOpenRegisterModal(true)}
            className="h-10 px-4 bg-[#CFEE5D] hover:bg-[#A8D014] text-[#1E2125] text-[13px] font-semibold cursor-pointer"
          >
            + 카테고리 등록
          </Button>

          {/* 등록 및 수정 모달 통합 처리 */}
          {(openRegisterModal || editTarget) && (
            <CategoryRegisterModal
              categories={categories}
              mode={editTarget ? 'edit' : 'create'}
              initialData={editTarget ?? undefined}
              onClose={() => {
                setOpenRegisterModal(false);
                setEditTarget(null);
              }}
              onSubmit={handleModalSubmit}
            />
          )}
        </div>

        <table className="w-full text-[13px] table-fixed">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              <th className="py-3 w-[6%] text-center font-semibold text-[#1E2125]">#</th>
              <th className="py-3 w-[15%] text-center font-semibold text-[#1E2125]">
                세부 카테고리 ID
              </th>
              <th className="py-3 w-[20%] text-center font-semibold text-[#1E2125]">카테고리명</th>
              <th className="py-3 w-[20%] text-center font-semibold text-[#1E2125]">
                세부 카테고리명
              </th>
              <th className="py-3 w-[10%] text-center font-semibold text-[#1E2125]">상태</th>
              <th className="py-3 w-[22%] text-center font-semibold text-[#1E2125]">관리</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-[#6A7282]">
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

                  {/* 상태값에 따른 분기 라벨 노출 부분 */}
                  <td className="py-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                        row.active
                          ? 'bg-[#F9FBE7] text-[#827717]' // 활성
                          : 'bg-[#F9FAFB] text-[#6A7282]' // 비활성
                      }`}
                    >
                      {row.active ? '공개' : '비공개'}
                    </span>
                  </td>

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
                        onClick={() => setConfirmModal({ type: 'delete', payload: row.id })}
                        className="h-8 px-4 text-[12px] font-semibold border-0 cursor-pointer bg-[#FF5F5F] hover:bg-[#D14848] text-white"
                      >
                        비공개
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 팝업 모달 분기 처리 */}
      {confirmModal?.type === 'create' && (
        <TwoButtonModal
          title="카테고리 등록"
          message="해당 카테고리를 등록하시겠습니까?"
          confirmLabel="등록"
          onCancel={() => setConfirmModal(null)}
          onConfirm={() => handleRegisterSubmit(confirmModal.payload)}
        />
      )}

      {confirmModal?.type === 'edit' && (
        <TwoButtonModal
          title="카테고리 수정"
          message="카테고리 정보를 수정하시겠습니까?"
          confirmLabel="수정"
          onCancel={() => setConfirmModal(null)}
          onConfirm={() => handleEditSubmit(confirmModal.payload)}
        />
      )}

      {confirmModal?.type === 'delete' && (
        <TwoButtonModal
          title="카테고리 삭제"
          message="카테고리를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다."
          confirmLabel="삭제"
          onCancel={() => setConfirmModal(null)}
          onConfirm={() => handleDeleteSubmit(confirmModal.payload)}
        />
      )}
    </>
  );
}
