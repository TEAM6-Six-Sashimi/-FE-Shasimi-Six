export interface CourseItem {
  id: string;
  title: string;
  category: string;
  instructor: string;
  price: number;
  thumbnailUrl: string;
}

export interface EnrollmentSummary {
  items: CourseItem[];
  totalPrice: number;
  ownedCredits: number;
  remainingCredits: number;
  shortfallCredits: number;
}

export interface EnrollmentFormState {
  agreedToTerms: boolean;
  agreedToRefundPolicy: boolean;
}