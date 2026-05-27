export interface CurriculumItem {
  id: number;
  title: string;
  duration: string; // "10:30"
  isPreview: boolean; // 구매 전 미리보기 가능 여부
  progress: number;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  content: string;
}

export interface RatingDistribution {
  star: number;
  percentage: number;
}

export interface CourseDetail {
  id: number;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  thumbnail: string;
  price: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  duration: number; // 총 강의 시간 (시간)
  lectureCount: number; // 총 강의 수
  level: '입문' | '초급' | '중급' | '고급';
  updatedAt: string;
  instructor: {
    name: string;
    avatar: string;
    bio: string;
    careers: string[];
  };
  ncs: {
    category: string;
    competency: string;
    code: string;
  };
  curriculum: CurriculumItem[];
  ratingDistribution: RatingDistribution[];
  reviews: Review[];
}

export const MOCK_COURSE_DETAIL: CourseDetail = {
  id: 1,
  title: '[2026 최신판!] 정보처리기사 필기 완전정복',
  description: '이 강의를 통해 전공지식 지식에 실무 능력을 키워보세요.',
  category: '건강·자격증',
  subCategory: '정보처리기사',
  thumbnail: '/mock/course1.jpg',
  price: 12900,
  rating: 4.9,
  reviewCount: 3,
  studentCount: 19234,
  duration: 40,
  lectureCount: 200,
  level: '초급',
  updatedAt: '2026-01-19',
  instructor: {
    name: '김정보',
    avatar: '/mock/instructor1.jpg',
    bio: '10년 이상의 산업 현장을 바탕으로 실무 중심의 강의를 제공합니다. 수강한 수강생들이 강의를 통해 전문가로 성장합니다.',
    careers: ['정보처리기사', '빅데이터 분석가', '데이터베이스 전문가', '○○기업 수석 연구원 (10년)'],
  },
  ncs: {
    category: 'NCS 분류: 소프트웨어 / 응용SW 엔지니어링',
    competency: 'NCS 능력단위명: 화면 설계, 데이터베이스 구현',
    code: 'NCS 코드: 20010201_14v2',
  },
  curriculum: [
    { id: 1, title: '강의 소개 및 학습 목표',     duration: '10:30', isPreview: true, progress: 100 },
    { id: 2, title: '개발 환경 설정하기',          duration: '15:20', isPreview: true,  progress: 100 },
    { id: 3, title: '기본 문법 이해하기',          duration: '25:40', isPreview: false, progress: 20 },
    { id: 4, title: '실습 프로젝트 1 - 계산기 만들기', duration: '30:15', isPreview: false, progress: 100 },
    { id: 5, title: '자료구조의 이해',             duration: '28:50', isPreview: false, progress: 90 },
    { id: 6, title: '알고리즘 기초',               duration: '22:10', isPreview: false, progress: 70 },
    { id: 7, title: '데이터베이스 개론',           duration: '35:00', isPreview: false, progress: 0 },
    { id: 8, title: '네트워크 기초 이론',          duration: '18:45', isPreview: false, progress: 30 },
  ],
  ratingDistribution: [
    { star: 5, percentage: 80 },
    { star: 4, percentage: 20 },
    { star: 3, percentage: 10 },
    { star: 2, percentage: 3 },
    { star: 1, percentage: 2 },
  ],
  reviews: [
    {
      id: 1,
      author: '김학생',
      rating: 5,
      date: '2026-05-01',
      content: '정말 유익한 강의였어요! 내용도도 쉽게 따라갈 수 있어서 설명해주셔서 좋았어요!',
    },
    {
      id: 2,
      author: '박수강',
      rating: 4,
      date: '2026-04-18',
      content: '전반적으로 좋은 강의인데, 중간 내용에 조금 더 심화로 다뤄줬으면 좋겠습니다.',
    },
    {
      id: 3,
      author: '이케팔',
      rating: 5,
      date: '2026-04-25',
      content: '강사의 설명이 명확하고 쉽게 따라하기 위해서가 됩니다.',
    },
  ],
};

