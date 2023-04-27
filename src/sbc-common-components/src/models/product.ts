export enum ProductType {
  Internal = 'INTERNAL',
  Partner = 'PARTNER'
}

export interface Product {
  name: string;
  description: string;
  url: string;
  type: ProductType;
  mdiIcon: string;
}

export type Products = Product[];
