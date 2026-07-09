import { UserMeWithAgreements } from '../../types';
import InfoSection from './InfoSection';
import AgreementSection from './AgreementSection';
import AccountActions from './AccountActions';

interface MypageMainProps {
  user: UserMeWithAgreements;
}

export default function MypageMain({ user }: MypageMainProps) {
  const agreements = user.agreements ?? {
    privacy: true,
    marketing: false,
    emailNotice: false,
    aiUsage: false,
  };

  return (
    <div>
      {/* 상단 프로필 */}
      <div className="pb-5 border-b border-[#E5E7EB]">
        <p className="text-[18px] font-bold text-[#1E2125]">{user.name}</p>
      </div>

      <InfoSection user={user} />
      <AgreementSection agreements={agreements} />
      <AccountActions user={user} agreements={agreements} />
    </div>
  );
}
