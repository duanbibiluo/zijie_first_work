// src/features/productList/productListSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {Product, ProductFilters, ProductListState} from './types';
import { mockProducts } from './mockData';
import type {RootState} from "../../app/store.ts";

// 定义 Product 上可以用于排序的键（排除 'default'）
type SortableKeys = Exclude<ProductListState['sortBy'], 'default'>;

// --- 初始状态 ---
const initialState: ProductListState = {
    allProducts: mockProducts,
    displayProducts: [],
    filters: {                 // 默认筛选条件
        searchTerm: '',
        category: null,
        priceRange: [0, 1000],
        brand: [],
        rating: 0,
    },
    sortBy: 'createdAt', // 默认按最新上架时间排序
    sortOrder: 'desc',   // 默认降序
    currentPage: 1,
    pageSize: 10,
    totalCount: mockProducts.length,
    loading: false,
    error: null,
};

// --- 核心逻辑函数：筛选、排序、分页 (性能关键点) ---
/**
 * 根据当前 Redux State 计算出应展示的商品列表。
 * @param state - productList 的局部状态
 * @returns 经过 FSP (Filter, Sort, Paginate) 处理后的当前页商品数组
 */
const applyFiltersAndSort = (state: ProductListState): Product[] => {
    let result = state.allProducts;
    const { filters, sortBy, sortOrder } = state;

    // 1. 筛选 (Filtering)
    result = result.filter(product => {
        // 1.1 搜索词筛选 (大小写不敏感)
        const matchesSearch = product.name.toLowerCase().includes(filters.searchTerm.toLowerCase());

        // 1.2 分类筛选
        const matchesCategory = !filters.category || product.category === filters.category;

        // 1.3 价格范围筛选
        const [minPrice, maxPrice] = filters.priceRange;
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

        // 1.4 品牌筛选
        const matchesBrand = filters.brand.length === 0 || filters.brand.includes(product.brand);

        // 1.5 评分筛选 (只显示大于等于此评分的)
        const matchesRating = product.rating >= filters.rating;

        return matchesSearch && matchesCategory && matchesPrice && matchesBrand && matchesRating;
    });

    // 2. 排序 (Sorting)
    if (sortBy !== 'default') {
        // 确保 key 是 Product 上的有效属性，消除 TS7053 错误
        const key = sortBy as SortableKeys;

        // 使用 sort() 方法进行排序
        result.sort((a, b) => {
            let comparison = 0;

            let aValue: number | Date;
            let bValue: number | Date;

            if (key === 'createdAt') {
                // 如果是日期，直接使用 Date 对象进行比较
                aValue = a.createdAt;
                bValue = b.createdAt;
            } else {
                // 其他字段（price, rating, sales）视为数字
                // TypeScript 现在知道 key 只能是 'price', 'rating', 'sales'
                aValue = a[key];
                bValue = b[key];
            }

            if (aValue > bValue) { comparison = 1; }
            else if (aValue < bValue) { comparison = -1; }

            // 根据 sortOrder (升序/降序) 调整结果
            return sortOrder === 'asc' ? comparison : comparison * -1;
        });
    }

    // 3. 更新总数 (重要：用于分页组件展示)
    state.totalCount = result.length;

    // 4. 分页 (Slicing) - 只返回当前页数据
    const start = (state.currentPage - 1) * state.pageSize;
    const end = start + state.pageSize;

    return result.slice(start, end);
};


const productListSlice = createSlice({
    name: 'productList',
    initialState,
    reducers: {
        // 1. 接收新的筛选条件
        setFilters: (state, action: PayloadAction<ProductFilters>) => {
            state.filters = action.payload;
            state.currentPage = 1; // 筛选条件变动，页码必须重置为 1
            state.displayProducts = applyFiltersAndSort(state);
        },

        // 2. 接收新的排序条件
        setSort: (state, action: PayloadAction<{ sortBy: ProductListState['sortBy']; sortOrder: ProductListState['sortOrder'] }>) => {
            state.sortBy = action.payload.sortBy;
            state.sortOrder = action.payload.sortOrder;
            state.currentPage = 1; // 排序变动，页码必须重置为 1
            state.displayProducts = applyFiltersAndSort(state);
        },

        // 3. 接收新的页码
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
            // 仅改变页码，不重置筛选或排序
            state.displayProducts = applyFiltersAndSort(state);
        },

        // 4. 初始化数据（第一次加载时使用）
        initializeProducts: (state) => {
            state.displayProducts = applyFiltersAndSort(state);
        }
    },
});

export const { setFilters, setSort, setCurrentPage, initializeProducts } = productListSlice.actions;

export default productListSlice.reducer;

export const selectProductById = (state: RootState, productId: number) => {
    // 逻辑：访问 productList 切片中的 allProducts 数组，然后查找匹配 ID 的商品
    return state.productList.allProducts.find(product => product.id === productId);
};

export const selectAllProducts = (state: RootState) => state.productList.allProducts;