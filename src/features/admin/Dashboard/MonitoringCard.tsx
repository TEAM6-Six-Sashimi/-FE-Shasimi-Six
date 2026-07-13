'use client';

import { Button } from '@/components/ui/button';

export default function MonitoringCard() {
  return (
    <>
      <div className="flex items-center justify-between px-5 py-4 rounded-xl border border-[#E5E7EB] bg-white shadow-sm mb-3">
        <span className="text-[14px] font-semibold text-[#1E2125]">그라파나 - 시스템 관리</span>

        <Button
          asChild
          variant="outline"
          className="h-9 w-22 px-4 border-[1.5px] border-[#D1D5DB] text-[#1E2125] text-[13px] font-semibold hover:bg-[#F9FAFB] hover:border-[#6A7282] cursor-pointer"
        >
          <Button
            asChild
            variant="outline"
            className="h-9 w-22 px-4 border-[1.5px] border-[#D1D5DB] text-[#1E2125] text-[13px] font-semibold hover:bg-[#F9FAFB] hover:border-[#6A7282] cursor-pointer"
          >
            <a
              href="http://54.180.81.89:3000/d/sashimi-overview/sashimi-overview?orgId=1&refresh=10s"
              target="_blank"
              rel="noopener noreferrer"
            >
              바로가기
            </a>
          </Button>
        </Button>
      </div>

      <div className="flex items-center justify-between px-5 py-4 rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        <span className="text-[14px] font-semibold text-[#1E2125]">그라파나 - 비즈니스 관리</span>

        <Button
          asChild
          variant="outline"
          className="h-9 w-22 px-4 border-[1.5px] border-[#D1D5DB] text-[#1E2125] text-[13px] font-semibold hover:bg-[#F9FAFB] hover:border-[#6A7282] cursor-pointer"
        >
          <Button
            asChild
            variant="outline"
            className="h-9 w-22 px-4 border-[1.5px] border-[#D1D5DB] text-[#1E2125] text-[13px] font-semibold hover:bg-[#F9FAFB] hover:border-[#6A7282] cursor-pointer"
          >
            <a
              href="http://54.180.81.89:3000/d/sashimi-business/sashimi-business?orgId=1&from=1782336980945&to=1783028180945"
              target="_blank"
              rel="noopener noreferrer"
            >
              바로가기
            </a>
          </Button>
        </Button>
      </div>
    </>
  );
}
