export interface CategoryOption {
  id: number;
  name: string;
}

export interface Category {
  name: string;
  subCategories: string[];
  options: CategoryOption[];
}