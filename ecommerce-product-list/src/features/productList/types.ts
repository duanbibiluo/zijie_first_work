// src/features/productList/types.ts

// 商品数据结构
import type {ReactNode} from "react";

export interface Product {
    description: ReactNode;
    title: ReactNode;
    id: number;
    name: string;
    price: number;
    category: 'Electronics' | 'Apparel' | 'Home Goods' | 'Books' | string;
    brand: string;
    rating: number; // 1.0 - 5.0
    inStock: boolean;
    sales: number; // 销量

    // ✅ 新增字段
    imageUrl: string; // 商品图片 URL
    createdAt: Date;  // 商品上架时间 (用于“最新”排序)
}

// 筛选条件结构
export interface ProductFilters {
    searchTerm: string;          // 搜索关键词
    category: string | null;     // 选中的分类
    priceRange: [number, number]; // [min, max] 价格区间
    brand: string[];             // 选中的品牌列表
    rating: number;              // min rating (最低评分，例如 4.0)
}

// 整体状态结构 (保持不变，但其依赖的 Product 结构已更新)
export interface ProductListState {
    allProducts: Product[];
    displayProducts: Product[];
    filters: ProductFilters;
    sortBy: 'price' | 'rating' | 'sales' | 'default' | 'createdAt';
    sortOrder: 'asc' | 'desc';
    currentPage: number;
    pageSize: number;
    totalCount: number;
    loading: boolean;
    error: string | null;
}