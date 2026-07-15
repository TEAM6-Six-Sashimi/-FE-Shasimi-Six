'use client';

import { useState } from 'react';
import { UserMe } from '@/features/auth/types';
import Image from 'next/image';
import ChatRoomList from './ChatRoomList';
import { StudentChatRoom } from '../types';

type CoffeeChatTab = 'requests' | 'rooms';

const ALL_TABS: {
  key: CoffeeChatTab;
  label: string;
  iconActive: string;
  iconInactive: string;
}[] = [
  {
    key: 'requests',
    label: '요청 목록',
    iconActive: '/chat/request-active.svg',
    iconInactive: '/chat/request-inactive.svg',
  },
  {
    key: 'rooms',
    label: '채팅방',
    iconActive: '/chat/chat-active.svg',
    iconInactive: '/chat/chat-inactive.svg',
  },
];

interface CoffeeChatSidebarProps {
  role: UserMe['role'];
  studentChatRooms: StudentChatRoom[];
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
}

export default function CoffeeChatSidebar({
  role,
  studentChatRooms,
  selectedChatId,
  onSelectChat,
}: CoffeeChatSidebarProps) {
  const isInstructor = role === 'INSTRUCTOR';
  const tabs = isInstructor ? ALL_TABS : ALL_TABS.filter((tab) => tab.key !== 'requests');

  const [activeTab, setActiveTab] = useState<CoffeeChatTab>(isInstructor ? 'requests' : 'rooms');

  const handleTabChange = (tab: CoffeeChatTab) => {
    setActiveTab(tab);
  };

  const tabButtonCls = (tab: CoffeeChatTab) =>
    `flex-1 flex items-center justify-center gap-1.5 py-3.5 text-[14px] border-b-2 transition-colors cursor-pointer ${
      activeTab === tab
        ? 'border-[#FF5E5E] text-[#FF5E5E] font-semibold'
        : 'border-transparent text-[#9CA3AF] hover:text-[#6A7282]'
    }`;

  return (
    <div className="flex flex-col h-full border-r border-[#E5E7EB]">
      <div className="flex items-center border-b border-[#E5E7EB]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={tabButtonCls(tab.key)}
            >
              <span className="relative flex items-center shrink-0 w-4.5 h-4.5">
                <Image
                  src={isActive ? tab.iconActive : tab.iconInactive}
                  alt=""
                  width={16}
                  height={16}
                />
              </span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TODO: 강사용 RequestList */}
      {activeTab === 'rooms' && (
        <ChatRoomList
          rooms={studentChatRooms}
          selectedChatId={selectedChatId}
          onSelect={onSelectChat}
        />
      )}

      <div className="p-6 bg-[#FFFDEB]">
        <h3 className="text-[18px] font-bold text-[#1E2125] mb-1">핏격 커피챗</h3>
        <p className="text-[13px] text-[#6A7282] leading-relaxed">
          수강 중인 강의의 강사와 네트워킹하며 커리어 고민을 가볍게 나눠보세요.
        </p>
        <p className="text-[11px] text-[#9CA3AF] mt-0.5">
          ※ 단순 강의 내용 질문이나 Q&A는 거절될 수 있습니다.
        </p>
      </div>
    </div>
  );
}
