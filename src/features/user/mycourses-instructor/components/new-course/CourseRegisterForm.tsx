'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category } from '@/features/categories/types';
import type {
  CourseFormData,
  CreateCourseRequest,
  Session,
} from '@/features/user/mycourses-instructor/types';
import { createCourseAction } from '../../actions';
import TwoButtonModal from '@/components/modals/TwoButtonModal';
import FullScreenLoading from '@/components/ui/FullScreenLoading';
import BasicInfoSection, { TITLE_MAX, DESCRIPTION_MAX } from './sections/BasicInfo';
import CurriculumSection, { SESSION_MAX_COUNT } from './sections/Curriculum';
import SalesPolicyAgreement from './sections/SalesPolicyAgreement';
import FormActionButtons from './sections/FormActions';
import { SESSION_TITLE_MAX } from './sections/SessionItem';
import { resizeImageFile } from '@/lib/resizeimagefile';

interface CourseRegisterFormProps {
  categories: Category[];
}

const DIFFICULTY_MAP: Record<string, 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'> = {
  초급: 'BEGINNER',
  중급: 'INTERMEDIATE',
  고급: 'ADVANCED',
};

const DEFAULT_SESSION: Omit<Session, 'id'> = {
  title: '',
  videoFile: null,
  videoUrl: '',
  durationSeconds: 0,
  materialFile: null,
  materialUrl: '',
  preview: false,
};

interface FieldErrors {
  title?: string;
  description?: string;
  category?: string;
  subCategory?: string;
  price?: string;
  level?: string;
  thumbnail?: string;
  sessions?: string;
  agreement?: string;
}

export default function CourseRegisterForm({ categories }: CourseRegisterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('처리 중입니다...');

  const [form, setForm] = useState<CourseFormData>({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    price: '',
    level: '',
    thumbnail: '',
    thumbnailFile: null,
    sessions: [{ id: 1, ...DEFAULT_SESSION }],
  });

  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  // 회차별 업로드 진행 상태(영상/자료)를 부모에서 추적 — 제출 버튼 비활성화에 사용
  const [uploadingMap, setUploadingMap] = useState<Record<number, boolean>>({});
  const setSessionUploading = (id: number, value: boolean) => {
    setUploadingMap((prev) => ({ ...prev, [id]: value }));
  };
  const isAnySessionUploading = Object.values(uploadingMap).some(Boolean);

  const [confirmModal, setConfirmModal] = useState<{
    type: 'save' | 'submit' | 'cancel';
  } | null>(null);

  const MODAL_CONFIG = {
    save: {
      title: '강의를 임시 저장 하시겠습니까?',
      message: '강의가 보관 상태로 저장되며 목록으로 돌아갑니다.',
    },
    submit: {
      title: '강의 승인을 요청하시겠습니까?',
      message: '승인 요청 후 관리자 검토를 거쳐 수강생에게 공개됩니다.',
    },
    cancel: {
      title: '작성 중인 내용이 있습니다.\n페이지를 나가시겠습니까?',
      message: '저장되지 않은 내용은 사라집니다.',
    },
  };

  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState('');

  const handleField = <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setForm((prev) => ({ ...prev, category: value, subCategory: '' }));
  };

  // 썸네일: object URL 미리보기 + 실제 업로드 API 호출 → form.thumbnail에 URL 저장
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    if (!rawFile.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, thumbnail: '이미지 파일만 업로드할 수 있습니다.' }));
      return;
    }

    // 업로드 전 클라이언트 측 리사이징 (최대 1200px, JPEG 85%)
    const file = await resizeImageFile(rawFile, { maxWidth: 1200, maxHeight: 1200, quality: 0.85 });

    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreviewUrl(previewUrl);
    setForm((prev) => ({ ...prev, thumbnailFile: file, thumbnail: '' })); // CourseEditForm은 thumbnail: '' 줄 없이 유지
    setErrors((prev) => ({ ...prev, thumbnail: undefined }));

    try {
      setThumbnailUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload/image', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('업로드 실패');
      const data = await res.json();
      handleField('thumbnail', data.url);
    } catch {
      setErrors((prev) => ({ ...prev, thumbnail: '이미지 업로드에 실패했습니다.' }));
    } finally {
      setThumbnailUploading(false);
    }
  };

  // ── 세션 핸들러 ──────────────────────────────────────────────
  const updateSession = <K extends keyof Session>(id: number, key: K, value: Session[K]) => {
    setForm((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) => (s.id === id ? { ...s, [key]: value } : s)),
    }));
  };

  const addSession = () => {
    if (form.sessions.length >= SESSION_MAX_COUNT) return;
    setForm((prev) => ({
      ...prev,
      sessions: [...prev.sessions, { id: Date.now(), ...DEFAULT_SESSION }],
    }));
  };

  const removeSession = (id: number) => {
    if (form.sessions.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.id !== id),
    }));
    setUploadingMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // ── 유효성 검사 ──────────────────────────────────────────────
  const validate = (): FieldErrors => {
    const next: FieldErrors = {};

    if (!form.title.trim()) next.title = '강의 제목을 입력해주세요.';
    else if (form.title.length > TITLE_MAX)
      next.title = `강의 제목은 ${TITLE_MAX}자 이하로 입력해주세요.`;

    if (!form.description.trim()) next.description = '강의 설명을 입력해주세요.';
    else if (form.description.length > DESCRIPTION_MAX)
      next.description = `강의 설명은 ${DESCRIPTION_MAX}자 이하로 입력해주세요.`;

    if (!form.category) next.category = '카테고리를 선택해주세요.';
    if (!form.subCategory) next.subCategory = '세부 카테고리를 선택해주세요.';
    if (form.price === '') next.price = '가격을 입력해주세요.';
    if (!form.level) next.level = '난이도를 선택해주세요.';
    if (!form.thumbnail) next.thumbnail = '대표 이미지를 업로드해주세요.';

    if (form.sessions.length === 0) {
      next.sessions = '최소 1개 이상의 회차가 필요합니다.';
    } else if (form.sessions.some((s) => !s.title.trim() || !s.videoUrl)) {
      next.sessions =
        '모든 회차의 소제목과 강의 영상을 입력해주세요. (영상 업로드가 완료될 때까지 기다려주세요)';
    } else if (form.sessions.some((s) => s.title.length > SESSION_TITLE_MAX)) {
      next.sessions = `회차 소제목은 ${SESSION_TITLE_MAX}자 이하로 입력해주세요.`;
    }

    if (!agreed) next.agreement = '강의 판매 정책에 동의해주세요.';

    return next;
  };

  // ── 제출 ────────────────────────────────────────────────────
  const handleSubmit = async (type: 'save' | 'submit') => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const selectedCat = categories.find((c) => c.name === form.category);
    const selectedSub = selectedCat?.options.find((o) => String(o.id) === form.subCategory);
    if (!selectedSub) {
      setErrors((prev) => ({ ...prev, subCategory: '세부 카테고리를 다시 선택해주세요.' }));
      return;
    }

    const payload: CreateCourseRequest = {
      subCategoryName: selectedSub.name,
      title: form.title,
      description: form.description,
      price: form.price as number,
      difficulty: DIFFICULTY_MAP[form.level],
      thumbnail: form.thumbnail,
      initialStatus: type === 'save' ? 'DRAFT' : 'PENDING',
      sessions: form.sessions.map((s) => ({
        title: s.title,
        videoUrl: s.videoUrl,
        durationSeconds: s.durationSeconds ?? 0,
        attachmentName: s.materialFile?.name,
        attachmentUrl: s.materialUrl,
        attachmentType: s.materialFile?.type,
        attachmentSize: s.materialFile?.size,
        preview: s.preview,
      })),
    };

    setLoadingMessage(type === 'save' ? '임시 저장 중입니다...' : '승인 요청 중입니다...');
    setIsLoading(true);

    const result = await createCourseAction(payload);

    if (result.success) {
      router.push('/mycourses-instructor?tab=pending');
    } else {
      setErrors((prev) => ({
        ...prev,
        sessions: result.message,
      }));
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading || !agreed || thumbnailUploading || isAnySessionUploading;

  return (
    <main className="max-w-3xl mx-auto py-8 px-6">
      {isLoading && <FullScreenLoading message={loadingMessage} />}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-8"
      >
        <header>
          <h1 className="text-[22px] font-bold text-[#1E2125]">새 강의 등록</h1>
        </header>

        <BasicInfoSection
          categories={categories}
          title={form.title}
          description={form.description}
          category={form.category}
          subCategory={form.subCategory}
          price={form.price}
          level={form.level}
          thumbnail={form.thumbnail}
          thumbnailPreviewUrl={thumbnailPreviewUrl}
          thumbnailUploading={thumbnailUploading}
          isLoading={isLoading}
          errors={errors}
          onTitleChange={(v) => handleField('title', v)}
          onDescriptionChange={(v) => handleField('description', v)}
          onCategoryChange={handleCategoryChange}
          onSubCategoryChange={(v) => handleField('subCategory', v)}
          onPriceChange={(v) => handleField('price', v)}
          onLevelChange={(v) => handleField('level', v)}
          onThumbnailUpload={handleThumbnailUpload}
        />

        <CurriculumSection
          sessions={form.sessions}
          isLoading={isLoading}
          error={errors.sessions}
          onUpdateSession={updateSession}
          onRemoveSession={removeSession}
          onAddSession={addSession}
          onSessionUploadingChange={setSessionUploading}
        />

        <SalesPolicyAgreement
          agreed={agreed}
          isLoading={isLoading}
          error={errors.agreement}
          onChange={(checked) => {
            setAgreed(checked);
            if (checked) setErrors((prev) => ({ ...prev, agreement: undefined }));
          }}
        />

        <FormActionButtons
          mode="create"
          isLoading={isLoading}
          isSubmitDisabled={isSubmitDisabled}
          onSave={() => setConfirmModal({ type: 'save' })}
          onSubmit={() => setConfirmModal({ type: 'submit' })}
          onCancel={() => setConfirmModal({ type: 'cancel' })}
        />
      </form>

      {confirmModal && (
        <TwoButtonModal
          title={MODAL_CONFIG[confirmModal.type].title}
          message={MODAL_CONFIG[confirmModal.type].message}
          confirmLabel="확인"
          cancelLabel="취소"
          onConfirm={() => {
            setConfirmModal(null);
            if (confirmModal.type === 'cancel') {
              router.back();
            } else {
              handleSubmit(confirmModal.type);
            }
          }}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </main>
  );
}
