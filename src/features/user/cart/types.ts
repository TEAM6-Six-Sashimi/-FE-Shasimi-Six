export interface CartCourseItem {
  cartItemId: number;
  courseId: number;
  title: string;
  thumbnail: string;
  instructorName: string;
  price: number;
  selected: boolean;
}

export interface CartResponse {
  items: CartCourseItem[];
  totalPrice: number;
  itemCount: number;
  selectedItemCount: number;
}

export interface CartDeleteRequest {
  courseIds: number[];
}
