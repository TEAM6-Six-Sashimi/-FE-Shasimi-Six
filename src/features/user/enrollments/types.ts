export interface EnrollmentCourseItem {
  courseId: number;
  title: string;
  category: string;
  instructorName: string;
  price: number;
  thumbnail: string;
}

export interface EnrollmentSummary {
  items: EnrollmentCourseItem[];
  totalPrice: number;
  ownedCredits: number;
  remainingCredits: number;
  shortfallCredits: number;
  source: 'single' | 'cart';
}

export interface EnrollmentFormState {
  agreedToTerms: boolean;
  agreedToRefundPolicy: boolean;
}
