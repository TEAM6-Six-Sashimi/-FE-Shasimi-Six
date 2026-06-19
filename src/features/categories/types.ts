export interface Category {
  mainCategoryId: number;
  name: string;
  options: CategoryOption[];
}

export interface CategoryOption {
  id: number;
  name: string;
}
