export interface CategoryOption {
  id: number;
  name: string;
}

export interface Category {
  mainCategoryId: number;
  name: string;
  subCategories: string[];
  options: CategoryOption[];
}