import { cache } from 'react';
import {
  ChatMessageEvent,
  InstructorChatRoom,
  StudentChatRoom,
} from '@/features/user/coffee-chat/types';
import { handleAuthErrorResponse } from '@/features/auth/auth-error';
import { parseAuthErrorMessage } from '@/features/auth/auth-error-messages';
import { AuthSessionError } from '@/features/auth/errors';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 학생 - 내 채팅방 목록 조회
// 상단 메뉴 알림 배지(레이아웃)와 커피챗 페이지 본문이 같은 요청 안에서 각자 이 함수를
// 부르는 경우가 있어, React cache()로 감싸서 같은 렌더 패스 안에서는 중복 호출돼도
// 실제 네트워크 요청은 한 번만 나가도록 한다.
export const fetchStudentChatRooms = cache(async (accessToken: string): Promise<StudentChatRoom[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/student/coffee-chats`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      // 페이지 렌더링 중(Server Component) 직접 호출되므로 쿠키를 지울 수 없다.
      // 순수 파싱 버전으로 던지고, 쿠키 정리는 호출부의 SessionExpiredRedirect가 담당한다.
      const authMessage = await parseAuthErrorMessage(res);
      if (authMessage) throw new AuthSessionError(authMessage);
      return [];
    }

    return await res.json();
  } catch (e) {
    if (e instanceof AuthSessionError) throw e;
    return [];
  }
});

// 강사 - 요청 목록(대기 중인 커피챗) 조회 (레이아웃 배지 계산과 페이지 본문이 같은 요청
// 안에서 중복 호출할 수 있어 cache()로 감쌈 - fetchStudentChatRooms 주석 참고)
export const fetchInstructorPendingChats = cache(
  async (accessToken: string): Promise<InstructorChatRoom[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/instructor/coffee-chats/pending`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        const authMessage = await parseAuthErrorMessage(res);
        if (authMessage) throw new AuthSessionError(authMessage);
        return [];
      }

      return await res.json();
    } catch (e) {
      if (e instanceof AuthSessionError) throw e;
      return [];
    }
  },
);

// 강사 - 채팅방 목록(수락된 커피챗) 조회 (마찬가지로 cache()로 중복 호출 방지)
export const fetchInstructorActiveChats = cache(
  async (accessToken: string): Promise<InstructorChatRoom[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/instructor/coffee-chats/active`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        const authMessage = await parseAuthErrorMessage(res);
        if (authMessage) throw new AuthSessionError(authMessage);
        return [];
      }

      return await res.json();
    } catch (e) {
      if (e instanceof AuthSessionError) throw e;
      return [];
    }
  },
);

// 강사 - 커피챗 요청 승인
export async function acceptInstructorChat(
  accessToken: string,
  chatId: number,
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/instructor/coffee-chats/${chatId}/accept`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) await handleAuthErrorResponse(res);

    return res.ok;
  } catch {
    return false;
  }
}

// 강사 - 커피챗 요청 거절
export async function rejectInstructorChat(
  accessToken: string,
  chatId: number,
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/instructor/coffee-chats/${chatId}/reject`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) await handleAuthErrorResponse(res);

    return res.ok;
  } catch {
    return false;
  }
}

// 강사 - 채팅방 나가기
export async function leaveInstructorChat(
  accessToken: string,
  chatId: number,
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/instructor/coffee-chats/${chatId}/leave`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) await handleAuthErrorResponse(res);

    return res.ok;
  } catch {
    return false;
  }
}

// 메시지 조회 API는 페이지네이션이 있고 기본 size가 20이라, 파라미터 없이 호출하면
// 오래된 메시지 20개만 오고 최신 메시지가 잘려서 안 보인다. 아직 무한 스크롤/페이지네이션 UI가
// 없으므로, 100개까지 한 번에 받아오도록 요청한다. (대화가 100개를 넘으면 별도 페이지네이션 필요)
const MESSAGE_PAGE_SIZE = 100;

// 채팅방 메시지 히스토리 조회 (강사 기준)
export async function fetchInstructorMessages(
  accessToken: string,
  chatId: number,
): Promise<ChatMessageEvent[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/instructor/coffee-chats/${chatId}/messages?page=0&size=${MESSAGE_PAGE_SIZE}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      await handleAuthErrorResponse(res);
      return [];
    }

    return await res.json();
  } catch {
    return [];
  }
}

// 채팅방 메시지 히스토리 조회 (학생 기준)
export async function fetchChatMessages(
  accessToken: string,
  chatId: number,
): Promise<ChatMessageEvent[]> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/student/coffee-chats/${chatId}/messages?page=0&size=${MESSAGE_PAGE_SIZE}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      await handleAuthErrorResponse(res);
      return [];
    }

    return await res.json();
  } catch {
    return [];
  }
}
