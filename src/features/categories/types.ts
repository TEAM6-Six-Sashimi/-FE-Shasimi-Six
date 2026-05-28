export interface Category {
  mainCategoryId: number;
  name: string;
  subCategories: string[];
  options: CategoryOption[];
}

export interface CategoryOption {
  id: number;
  name: string;
}
