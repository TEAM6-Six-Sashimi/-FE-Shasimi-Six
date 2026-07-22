import { isFutureDate, isValidYearMonth, isValidYearMonthDay } from '@/lib/utils';
import { CareerItem, CertificationItem, EducationItem } from './types';

// 학력 필수 필드 + 형식 검증 - 문제없으면 빈 문자열, 있으면 에러 메시지 반환
export function getEducationError(educations: EducationItem[]): string {
  if (educations.length === 0) {
    return '학력 사항을 한 개 이상 입력해주세요.';
  }
  const hasEmpty = educations.some(
    (e) =>
      !e.schoolName ||
      !e.startYearMonth ||
      !e.endYearMonth ||
      !e.graduationStatus ||
      !e.major ||
      !e.degree,
  );
  if (hasEmpty) {
    return '학력 사항의 필수 항목을 모두 입력해주세요.';
  }
  const hasInvalidDate = educations.some(
    (e) => !isValidYearMonth(e.startYearMonth) || !isValidYearMonth(e.endYearMonth),
  );
  if (hasInvalidDate) {
    return '학력 사항의 입학/졸업 연월을 올바른 형식으로 입력해주세요.';
  }
  const hasInvalidOrder = educations.some((e) => e.startYearMonth > e.endYearMonth);
  if (hasInvalidOrder) {
    return '학력 사항의 입학 연월이 졸업 연월보다 늦을 수 없습니다.';
  }
  return '';
}

// 경력 필수 필드 + 형식 검증 - 신입이면 통과
export function getCareerError(careers: CareerItem[], isNewGraduate: boolean): string {
  if (isNewGraduate) return '';

  if (careers.length === 0) {
    return '경력 사항을 한 개 이상 입력하거나 신입에 체크해주세요.';
  }
  const hasEmpty = careers.some(
    (c) =>
      !c.companyName ||
      !c.startYearMonth ||
      (!c.currentlyEmployed && !c.endYearMonth) ||
      !c.employmentType ||
      (c.employmentType === 'OTHER' && !c.customEmploymentType) ||
      !c.jobTitle,
  );
  if (hasEmpty) {
    return '경력 사항의 필수 항목을 모두 입력해주세요.';
  }
  const hasInvalidDate = careers.some(
    (c) =>
      !isValidYearMonth(c.startYearMonth) ||
      (!c.currentlyEmployed && !isValidYearMonth(c.endYearMonth)),
  );
  if (hasInvalidDate) {
    return '경력 사항의 입사/퇴사 연월을 올바른 형식으로 입력해주세요.';
  }
  const hasInvalidOrder = careers.some(
    (c) => !c.currentlyEmployed && c.startYearMonth > c.endYearMonth,
  );
  if (hasInvalidOrder) {
    return '경력 사항의 입사 연월이 퇴사 연월보다 늦을 수 없습니다.';
  }
  return '';
}

// 자격증 필수 필드 + 형식 검증
export function getCertificationError(certifications: CertificationItem[]): string {
  if (certifications.length === 0) {
    return '보유 기술 및 자격증을 한 개 이상 입력해주세요.';
  }
  const hasEmpty = certifications.some(
    (cert) => !cert.type || !cert.name || !cert.issuer || !cert.acquiredDate,
  );
  if (hasEmpty) {
    return '보유 기술 및 자격증의 필수 항목을 모두 입력해주세요.';
  }
  const hasInvalidDate = certifications.some((cert) => !isValidYearMonthDay(cert.acquiredDate));
  if (hasInvalidDate) {
    return '취득일자를 올바른 형식으로 입력해주세요.';
  }
  const hasFutureDate = certifications.some((cert) => isFutureDate(cert.acquiredDate));
  if (hasFutureDate) {
    return '취득일자는 미래 날짜로 입력할 수 없습니다.';
  }
  return '';
}
