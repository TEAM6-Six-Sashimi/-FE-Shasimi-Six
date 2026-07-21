'use server';

import { fetchCourses, fetchCourseDetail } from '@/services/course.service';
import { fetchCategories } from '@/services/categories.service';

export async function fetchCategoriesAction() {
  return fetchCategories();
}

// 자격증 선택 시 그에 속한 강의 목록 조회
export async function fetchCoursesBySubCategoryAction(categoryName: string, subCategoryId: string) {
  return fetchCourses(categoryName, subCategoryId);
}

// 비교용 강의 상세 조회
export async function fetchCourseDetailAction(courseId: string) {
  return fetchCourseDetail(courseId);
}
