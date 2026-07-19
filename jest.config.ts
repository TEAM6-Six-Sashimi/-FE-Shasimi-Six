import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Playwright e2e 스펙(tests/**/*.spec.ts)과 같은 tests/ 루트를 공유하므로
  // 폴더가 아니라 파일명 규칙(.test. vs .spec.)으로만 구분함
  testMatch: ['<rootDir>/tests/**/*.test.[jt]s?(x)'],
  // .next 빌드 산출물의 package.json과 이름 충돌(haste collision) 방지
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  // 일반 import는 SWC가 '@/...'를 알아서 변환해주지만, jest.mock('@/...')처럼
  // 문자열 그대로 jest 리졸버가 처리해야 하는 경우엔 이 매핑이 없으면 못 찾음
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default createJestConfig(config);