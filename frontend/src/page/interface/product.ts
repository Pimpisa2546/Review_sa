// src/types/Product.ts

export interface Product {
    ID: number;
    Title: string;
    Description: string;
    Price: number;
    Category: string;
    Picture_product: string;
    Condition: string;
    Weight: number;
    Status: string;
    SellerID?: number;
  }
  