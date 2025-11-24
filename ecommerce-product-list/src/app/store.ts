// src/app/store.ts (修改后的完整代码)

import { configureStore } from '@reduxjs/toolkit';
import productListReducer from '../features/productList/productListSlice'; // <-- 引入Reducer
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
    reducer: {
        // 注册商品列表模块的 reducer，key 为 'productList'
        productList: productListReducer,
        cart: cartReducer,
    },
});

// 定义 RootState 和 AppDispatch 类型，它们现在包含了 productList 的结构
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;