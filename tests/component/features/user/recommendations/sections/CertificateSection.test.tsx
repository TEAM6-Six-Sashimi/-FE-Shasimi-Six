import { render, screen } from '@testing-library/react';
import CertificateSection from '@/features/user/recommendations/sections/CertificateSection';
import { RecommendedCertificate } from '@/features/user/recommendations/types';

const baseCert: RecommendedCertificate = {
  certificationId: 1,
  name: '정보처리기사',
  reason: '직무 연관성이 높습니다.',
  relatedSkills: ['SQL', '알고리즘'],
  difficulty: '중급',
  nextExamDate: '',
  applicationStartDate: '',
  applicationEndDate: '',
};

describe('CertificateSection', () => {
  it('추천 자격증이 없으면(빈 배열) 안내 문구를 보여준다', () => {
    render(<CertificateSection certificates={[]} />);

    expect(screen.getByText('추천할 자격증 정보가 없습니다.')).toBeInTheDocument();
  });

  it('시험 일정이 없는 자격증은 날짜 대신 안내 문구를 보여준다', () => {
    render(<CertificateSection certificates={[baseCert]} />);

    expect(screen.getByText('정보처리기사')).toBeInTheDocument();
    expect(screen.getAllByText('시험 일정 정보가 없습니다.')).toHaveLength(2);
  });

  it('시험 일정이 있으면 다음 시험일과 D-day를 보여준다', () => {
    render(
      <CertificateSection
        certificates={[{ ...baseCert, nextExamDate: '2099-01-01' }]}
      />,
    );

    expect(screen.getByText(/2099-01-01/)).toBeInTheDocument();
  });
});
