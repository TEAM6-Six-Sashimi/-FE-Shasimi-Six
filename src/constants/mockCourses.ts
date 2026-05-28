export interface Course {
  id: number;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  reviewCount: number;
  price: number;
  duration: number;
  level: '입문' | '초급' | '중급' | '고급';
  category: string;
  subCategory: string;
  badge?: 'NEW' | '인기';
}

export const MOCK_COURSES: Course[] = [
  // ── ai (17개) ──
  { id: 1,  title: 'ChatGPT 완전정복 A to Z',              instructor: '김AI',   thumbnail: '/mock/course1.jpg',  rating: 4.9, reviewCount: 10234, price: 12900, duration: 24, level: '입문', category: 'ai', subCategory: 'ChatGPT 활용',      badge: '인기' },
  { id: 2,  title: 'ChatGPT로 업무 자동화하기',             instructor: '이챗',   thumbnail: '/mock/course2.jpg',  rating: 4.7, reviewCount: 5432,  price: 9900,  duration: 18, level: '초급', category: 'ai', subCategory: 'ChatGPT 활용',      badge: 'NEW' },
  { id: 3,  title: 'ChatGPT 비즈니스 활용 전략',            instructor: '박챗봇', thumbnail: '/mock/course3.jpg',  rating: 4.8, reviewCount: 7654,  price: 11900, duration: 22, level: '초급', category: 'ai', subCategory: 'ChatGPT 활용' },
  { id: 4,  title: 'ChatGPT로 콘텐츠 만들기',               instructor: '최콘텐', thumbnail: '/mock/course4.jpg',  rating: 4.6, reviewCount: 3210,  price: 8900,  duration: 15, level: '입문', category: 'ai', subCategory: 'ChatGPT 활용' },
  { id: 5,  title: 'ChatGPT API 개발 입문',                 instructor: '정개발', thumbnail: '/mock/course5.jpg',  rating: 4.7, reviewCount: 4321,  price: 14900, duration: 28, level: '중급', category: 'ai', subCategory: 'ChatGPT 활용',      badge: 'NEW' },
  { id: 6,  title: 'ChatGPT 고급 활용 마스터',              instructor: '한AI',   thumbnail: '/mock/course6.jpg',  rating: 4.5, reviewCount: 2109,  price: 13900, duration: 20, level: '고급', category: 'ai', subCategory: 'ChatGPT 활용' },
  { id: 7,  title: 'ChatGPT로 수익화하는 법',               instructor: '윤수익', thumbnail: '/mock/course7.jpg',  rating: 4.8, reviewCount: 8901,  price: 9900,  duration: 16, level: '입문', category: 'ai', subCategory: 'ChatGPT 활용',      badge: '인기' },
  { id: 8,  title: 'ChatGPT 이미지 생성 완전정복',          instructor: '임이미', thumbnail: '/mock/course8.jpg',  rating: 4.6, reviewCount: 3456,  price: 10900, duration: 19, level: '초급', category: 'ai', subCategory: 'ChatGPT 활용' },
  { id: 9,  title: '프롬프트 엔지니어링 마스터클래스',      instructor: '박프롬', thumbnail: '/mock/course9.jpg',  rating: 4.9, reviewCount: 9876,  price: 15900, duration: 35, level: '중급', category: 'ai', subCategory: '프롬프트 엔지니어링', badge: '인기' },
  { id: 10, title: '실무에서 바로 쓰는 프롬프트 설계',      instructor: '최엔지', thumbnail: '/mock/course10.jpg', rating: 4.7, reviewCount: 5678,  price: 12900, duration: 25, level: '초급', category: 'ai', subCategory: '프롬프트 엔지니어링' },
  { id: 11, title: '프롬프트 엔지니어링 기초',              instructor: '강프롬', thumbnail: '/mock/course11.jpg', rating: 4.6, reviewCount: 3210,  price: 9900,  duration: 18, level: '입문', category: 'ai', subCategory: '프롬프트 엔지니어링', badge: 'NEW' },
  { id: 12, title: 'AI 프롬프트 실전 200가지',              instructor: '조실전', thumbnail: '/mock/course12.jpg', rating: 4.8, reviewCount: 7654,  price: 11900, duration: 22, level: '초급', category: 'ai', subCategory: '프롬프트 엔지니어링' },
  { id: 13, title: '고급 프롬프트 최적화 전략',             instructor: '신최적', thumbnail: '/mock/course1.jpg',  rating: 4.7, reviewCount: 4567,  price: 14900, duration: 30, level: '고급', category: 'ai', subCategory: '프롬프트 엔지니어링' },
  { id: 14, title: '프롬프트로 이미지 생성하기',            instructor: '류이미', thumbnail: '/mock/course2.jpg',  rating: 4.5, reviewCount: 2345,  price: 8900,  duration: 15, level: '입문', category: 'ai', subCategory: '프롬프트 엔지니어링', badge: 'NEW' },
  { id: 15, title: 'LLM 프롬프트 엔지니어링 심화',         instructor: '오심화', thumbnail: '/mock/course3.jpg',  rating: 4.9, reviewCount: 6789,  price: 17900, duration: 40, level: '고급', category: 'ai', subCategory: '프롬프트 엔지니어링', badge: '인기' },
  { id: 16, title: 'ChatGPT + 프롬프트 통합 과정',         instructor: '서통합', thumbnail: '/mock/course4.jpg',  rating: 4.7, reviewCount: 5432,  price: 19900, duration: 45, level: '중급', category: 'ai', subCategory: 'ChatGPT 활용' },
  { id: 17, title: 'AI 툴 마스터 패키지',                  instructor: '문마스', thumbnail: '/mock/course5.jpg',  rating: 4.8, reviewCount: 8765,  price: 24900, duration: 50, level: '중급', category: 'ai', subCategory: 'ChatGPT 활용',      badge: '인기' },

  // ── 건강 자격증 (17개) ──
  { id: 18, title: '요가 지도사 자격증 단기 완성',          instructor: '김요가', thumbnail: '/mock/course6.jpg',  rating: 4.8, reviewCount: 6543,  price: 13900, duration: 35, level: '초급', category: '건강 자격증', subCategory: '요가 지도사',    badge: '인기' },
  { id: 19, title: '요가 지도사 실기 완전정복',             instructor: '이아사', thumbnail: '/mock/course7.jpg',  rating: 4.7, reviewCount: 4321,  price: 10900, duration: 28, level: '중급', category: '건강 자격증', subCategory: '요가 지도사' },
  { id: 20, title: '요가 지도사 필기 한방에 끝내기',        instructor: '박요기', thumbnail: '/mock/course8.jpg',  rating: 4.6, reviewCount: 3210,  price: 9900,  duration: 20, level: '초급', category: '건강 자격증', subCategory: '요가 지도사',    badge: 'NEW' },
  { id: 21, title: '요가 지도사 합격 전략 총정리',          instructor: '최합격', thumbnail: '/mock/course9.jpg',  rating: 4.9, reviewCount: 8765,  price: 12900, duration: 32, level: '초급', category: '건강 자격증', subCategory: '요가 지도사',    badge: '인기' },
  { id: 22, title: '요가 기초부터 지도법까지',              instructor: '정지도', thumbnail: '/mock/course10.jpg', rating: 4.5, reviewCount: 2109,  price: 8900,  duration: 18, level: '입문', category: '건강 자격증', subCategory: '요가 지도사' },
  { id: 23, title: '요가 지도사 모의고사 특강',             instructor: '한모의', thumbnail: '/mock/course11.jpg', rating: 4.7, reviewCount: 5432,  price: 7900,  duration: 15, level: '초급', category: '건강 자격증', subCategory: '요가 지도사',    badge: 'NEW' },
  { id: 24, title: '요가 해부학 & 지도 기술',               instructor: '윤해부', thumbnail: '/mock/course12.jpg', rating: 4.8, reviewCount: 6543,  price: 14900, duration: 38, level: '중급', category: '건강 자격증', subCategory: '요가 지도사' },
  { id: 25, title: '요가 지도사 2급 완전정복',              instructor: '임이급', thumbnail: '/mock/course1.jpg',  rating: 4.6, reviewCount: 3456,  price: 11900, duration: 25, level: '초급', category: '건강 자격증', subCategory: '요가 지도사' },
  { id: 26, title: '퍼스널트레이너 자격증 합격 전략',       instructor: '박PT',   thumbnail: '/mock/course2.jpg',  rating: 4.9, reviewCount: 9876,  price: 15900, duration: 42, level: '초급', category: '건강 자격증', subCategory: '퍼스널트레이너', badge: '인기' },
  { id: 27, title: '퍼스널트레이너 실전 트레이닝',          instructor: '최트레', thumbnail: '/mock/course3.jpg',  rating: 4.6, reviewCount: 3456,  price: 12900, duration: 32, level: '중급', category: '건강 자격증', subCategory: '퍼스널트레이너', badge: 'NEW' },
  { id: 28, title: '퍼스널트레이너 필기 단기 완성',         instructor: '강필기', thumbnail: '/mock/course4.jpg',  rating: 4.7, reviewCount: 5678,  price: 9900,  duration: 22, level: '초급', category: '건강 자격증', subCategory: '퍼스널트레이너' },
  { id: 29, title: 'PT 운동 프로그래밍 마스터',             instructor: '조프로', thumbnail: '/mock/course5.jpg',  rating: 4.8, reviewCount: 7654,  price: 14900, duration: 35, level: '중급', category: '건강 자격증', subCategory: '퍼스널트레이너', badge: '인기' },
  { id: 30, title: '퍼스널트레이너 영양학 완전정복',        instructor: '신영양', thumbnail: '/mock/course6.jpg',  rating: 4.5, reviewCount: 2345,  price: 10900, duration: 25, level: '초급', category: '건강 자격증', subCategory: '퍼스널트레이너' },
  { id: 31, title: '퍼스널트레이너 실기 특강',              instructor: '류실기', thumbnail: '/mock/course7.jpg',  rating: 4.7, reviewCount: 4567,  price: 8900,  duration: 18, level: '초급', category: '건강 자격증', subCategory: '퍼스널트레이너', badge: 'NEW' },
  { id: 32, title: '퍼스널트레이너 고객 관리 전략',         instructor: '오고객', thumbnail: '/mock/course8.jpg',  rating: 4.6, reviewCount: 3210,  price: 11900, duration: 20, level: '중급', category: '건강 자격증', subCategory: '퍼스널트레이너' },
  { id: 33, title: '퍼스널트레이너 2급 → 1급 승급',        instructor: '서승급', thumbnail: '/mock/course9.jpg',  rating: 4.9, reviewCount: 8901,  price: 17900, duration: 45, level: '고급', category: '건강 자격증', subCategory: '퍼스널트레이너', badge: '인기' },
  { id: 34, title: 'PT 해부학 & 운동역학 심화',             instructor: '문심화', thumbnail: '/mock/course10.jpg', rating: 4.8, reviewCount: 6789,  price: 15900, duration: 38, level: '고급', category: '건강 자격증', subCategory: '퍼스널트레이너' },

  // ── 나머지 카테고리 ──
  { id: 35, title: '집에서 즐기는 홈쿠킹 클래스',          instructor: '김셰프', thumbnail: '/mock/course11.jpg', rating: 4.8, reviewCount: 7654,  price: 8900,  duration: 15, level: '입문', category: '라이프',    subCategory: '요리',       badge: 'NEW' },
  { id: 36, title: 'SNS 마케팅 실전 전략',                  instructor: '김마케', thumbnail: '/mock/course12.jpg', rating: 4.8, reviewCount: 6789,  price: 13900, duration: 25, level: '초급', category: '마케팅',    subCategory: 'SNS 마케팅', badge: '인기' },
  { id: 37, title: '왕초보 영어 말하기 30일 완성',          instructor: '김영어', thumbnail: '/mock/course1.jpg',  rating: 4.9, reviewCount: 12345, price: 12900, duration: 30, level: '입문', category: '외국어',    subCategory: '영어',       badge: '인기' },
  { id: 38, title: '주식 투자 입문 완전정복',               instructor: '김주식', thumbnail: '/mock/course2.jpg',  rating: 4.8, reviewCount: 9012,  price: 13900, duration: 22, level: '입문', category: '재테크',    subCategory: '주식',       badge: '인기' },
  { id: 39, title: '수채화 입문 드로잉 클래스',             instructor: '김화가', thumbnail: '/mock/course3.jpg',  rating: 4.8, reviewCount: 5432,  price: 9900,  duration: 18, level: '입문', category: '취미,문화', subCategory: '그림',       badge: 'NEW' },
];