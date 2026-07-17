import { ChatMessage } from './types';

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    role: 'bot',
    text: '저는 여러분의 진로와 커리어 고민을 함께 고민하는 **AI 진로 상담사**입니다.😊',
  },
  {
    id: 2,
    role: 'bot',
    text: '진로, 취업, 대외활동, 대학원, 자격증, 직무 선택 등 **어떤 고민이든 편하게 이야기**해주세요.',
  },
  {
    id: 3,
    role: 'bot',
    text: '예를 들어 **이런 질문들을 할 수 있어요**.\n· 개발자로 취업하려면 어떤 스펙이 필요한가요?\n· 비전공자도 IT 직무에 지원할 수 있나요?\n· 대학원과 취업 중 어떤 선택이 나을까요?\n· 자격증은 어떤 것을 따는 게 좋을까요?\n· 포트폴리오는 어떻게 준비해야 하나요?\n· 직무 변경을 고려하고 있는데 어떻게 시작할까요?',
  },
  {
    id: 4,
    role: 'bot',
    text: '지금 가장 고민되는 것이 무엇인가요?',
  },
];

// 하드코딩된 안내 메시지들 사이의 간격
export const INTRO_MESSAGE_GAP_MS = 400;
