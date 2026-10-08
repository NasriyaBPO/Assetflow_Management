export interface Category {
  id: string;
  name: string;
  description: string | null;
  active: boolean;

  _count?: {
    assets: number;
  };
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  active?: boolean;
}