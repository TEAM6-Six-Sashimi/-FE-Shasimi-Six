import Link from 'next/link';

export default function Footer() {
  return (
    <div className="bg-[#1E2125] py-1 border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 pt-8 pb-8">
        <div className="flex flex-col gap-2">
          <div className="text-[15px] font-semibold text-[#CFEE5D]">회사 소개</div>
          <div className="flex flex-col gap-1.5">
            <a
              href="https://www.wanted.co.kr/?utm_source=google&utm_medium=sa&utm_campaign=kr_recruit_web_sa_signup&utm_term=%EC%9B%90%ED%8B%B0%EB%93%9C&utm_content=brand_new&airbridge_referrer=airbridge%3Dtrue%26channel%3Dgoogle.adwords%26campaign%3D1732347827%26campaign_id%3D1732347827%26ad_group%3D148879638611%26ad_group_id%3D148879638611%26ad_creative%3D696367802555%26ad_creative_id%3D696367802555%26term%3D%EC%9B%90%ED%8B%B0%EB%93%9C%26sub_id%3Dg%26sub_id_1%3D%26sub_id_2%3D%26sub_id_3%3Db%26click_id%3DCj0KCQjww8rQBhDjARIsAE43KPMSL53Xo0nSguUZR0qYW_HeMWsQBA0etm48vx3WXC9Kh1uES2gUtLEaAhurEALw_wcB%26gclid%3DCj0KCQjww8rQBhDjARIsAE43KPMSL53Xo0nSguUZR0qYW_HeMWsQBA0etm48vx3WXC9Kh1uES2gUtLEaAhurEALw_wcB%26ad_type%3Dclick&gad_source=1&gad_campaignid=1732347827&gbraid=0AAAAADK3HCdloBylE9nEOLa3CgYWvj6Al&gclid=Cj0KCQjww8rQBhDjARIsAE43KPMSL53Xo0nSguUZR0qYW_HeMWsQBA0etm48vx3WXC9Kh1uES2gUtLEaAhurEALw_wcB"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-[#E5E7EB] hover:text-[#D1D5DB]"
            >
              회사 소개
            </a>
            <a
              href="https://www.wanted.co.kr/?utm_source=google&utm_medium=sa&utm_campaign=kr_recruit_web_sa_signup&utm_term=%EC%9B%90%ED%8B%B0%EB%93%9C&utm_content=brand_new&airbridge_referrer=airbridge%3Dtrue%26channel%3Dgoogle.adwords%26campaign%3D1732347827%26campaign_id%3D1732347827%26ad_group%3D148879638611%26ad_group_id%3D148879638611%26ad_creative%3D696367802555%26ad_creative_id%3D696367802555%26term%3D%EC%9B%90%ED%8B%B0%EB%93%9C%26sub_id%3Dg%26sub_id_1%3D%26sub_id_2%3D%26sub_id_3%3Db%26click_id%3DCj0KCQjww8rQBhDjARIsAE43KPMSL53Xo0nSguUZR0qYW_HeMWsQBA0etm48vx3WXC9Kh1uES2gUtLEaAhurEALw_wcB%26gclid%3DCj0KCQjww8rQBhDjARIsAE43KPMSL53Xo0nSguUZR0qYW_HeMWsQBA0etm48vx3WXC9Kh1uES2gUtLEaAhurEALw_wcB%26ad_type%3Dclick&gad_source=1&gad_campaignid=1732347827&gbraid=0AAAAADK3HCdloBylE9nEOLa3CgYWvj6Al&gclid=Cj0KCQjww8rQBhDjARIsAE43KPMSL53Xo0nSguUZR0qYW_HeMWsQBA0etm48vx3WXC9Kh1uES2gUtLEaAhurEALw_wcB"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-[#E5E7EB] hover:text-[#D1D5DB]"
            >
              채용
            </a>
            <a
              href="https://www.wanted.co.kr/?utm_source=google&utm_medium=sa&utm_campaign=kr_recruit_web_sa_signup&utm_term=%EC%9B%90%ED%8B%B0%EB%93%9C&utm_content=brand_new&airbridge_referrer=airbridge%3Dtrue%26channel%3Dgoogle.adwords%26campaign%3D1732347827%26campaign_id%3D1732347827%26ad_group%3D148879638611%26ad_group_id%3D148879638611%26ad_creative%3D696367802555%26ad_creative_id%3D696367802555%26term%3D%EC%9B%90%ED%8B%B0%EB%93%9C%26sub_id%3Dg%26sub_id_1%3D%26sub_id_2%3D%26sub_id_3%3Db%26click_id%3DCj0KCQjww8rQBhDjARIsAE43KPMSL53Xo0nSguUZR0qYW_HeMWsQBA0etm48vx3WXC9Kh1uES2gUtLEaAhurEALw_wcB%26gclid%3DCj0KCQjww8rQBhDjARIsAE43KPMSL53Xo0nSguUZR0qYW_HeMWsQBA0etm48vx3WXC9Kh1uES2gUtLEaAhurEALw_wcB%26ad_type%3Dclick&gad_source=1&gad_campaignid=1732347827&gbraid=0AAAAADK3HCdloBylE9nEOLa3CgYWvj6Al&gclid=Cj0KCQjww8rQBhDjARIsAE43KPMSL53Xo0nSguUZR0qYW_HeMWsQBA0etm48vx3WXC9Kh1uES2gUtLEaAhurEALw_wcB"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-[#E5E7EB] hover:text-[#D1D5DB]"
            >
              파트너
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[15px] font-semibold text-[#CFEE5D]">고객 지원</div>
          <div className="flex flex-col gap-1.5">
            <Link
              href="/customer-service"
              className="text-[14px] text-[#E5E7EB] hover:text-[#D1D5DB]"
            >
              공지사항
            </Link>
            <Link
              href="/customer-service"
              className="text-[14px] text-[#E5E7EB] hover:text-[#D1D5DB]"
            >
              1:1 문의
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[15px] font-semibold text-[#CFEE5D]">서비스</div>
          <div className="flex flex-col gap-1.5">
            <Link href="/courses" className="text-[14px] text-[#E5E7EB] hover:text-[#D1D5DB]">
              전체 강의
            </Link>
            <Link
              href="/recommendations"
              className="text-[14px] text-[#E5E7EB] hover:text-[#D1D5DB]"
            >
              AI 서비스
            </Link>
            <Link href="/compare" className="text-[14px] text-[#E5E7EB] hover:text-[#D1D5DB]">
              강의 비교
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-[15px] font-semibold text-[#CFEE5D]">소셜 미디어</div>
          <div className="flex flex-col gap-1.5">
            <a
              href="https://github.com/TEAM6-Six-Sashimi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-[#E5E7EB] hover:text-[#D1D5DB]"
            >
              GitHub
            </a>
            <a
              href="https://www.figma.com/design/exzc72UCc2ZD4oMkvYK1UO/%EC%9C%A1%EC%82%AC%EC%8B%9C%EB%AF%B8%EC%A1%B0?node-id=0-1&t=ExjZtToaTpytkqle-1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-[#E5E7EB] hover:text-[#D1D5DB]"
            >
              Figma
            </a>
            <a
              href="https://www.notion.so/ohgiraffers/6-34c649136c11809fb109e8652d5982a1?source=copy_link"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-[#E5E7EB] hover:text-[#D1D5DB]"
            >
              Team Notion
            </a>
          </div>
        </div>
      </div>
      <div className="flex max-w-[95%] mx-auto justify-between items-center pt-4 pb-4 border-t border-[#99A1AF]">
        <p className="text-[14px] text-[#99A1AF]">
          © 2026 온라인 강의 플랫폼 (주)핏격. All rights reserved.
        </p>
        <div className="flex gap-3">
          <p className="text-[14px] text-[#99A1AF]">이용약관</p>
          <p className="text-[14px] text-[#99A1AF]">개인정보처리방침</p>
          <p className="text-[14px] text-[#99A1AF]">사업자정보</p>
        </div>
      </div>
    </div>
  );
}
