import { ISubcategory } from './subcategory.interface';

export interface ICategory {
  id: string;
  name: string;
  subCategories: ISubcategory[];
}
