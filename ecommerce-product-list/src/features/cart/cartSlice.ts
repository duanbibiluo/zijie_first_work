// src/features/cart/cartSlice.ts

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';

// 定义购物车中商品的类型
export interface CartItem {
    productId: number;
    quantity: number;
}

// 定义购物车状态类型
export interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // 动作 1: 添加/更新商品
        addItem: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
            const { productId, quantity } = action.payload;
            const existingItem = state.items.find(item => item.productId === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ productId, quantity });
            }
        },

        // 动作 2: 移除商品
        removeItem: (state, action: PayloadAction<number>) => {
            const productIdToRemove = action.payload;
            state.items = state.items.filter(item => item.productId !== productIdToRemove);
        },

        // 动作 3: 清空购物车
        clearCart: (state) => {
            state.items = [];
        },

        //  动作 4: 更新商品数量
        updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(i => i.productId === productId);

            if (item) {
                // 确保数量至少为 1
                item.quantity = Math.max(1, quantity);
            }
        }
    },
});

// 导出 Actions
export const { addItem, removeItem, clearCart, updateQuantity } = cartSlice.actions;

// 导出 Selector (计算购物车总商品数量)
export const selectCartItemCount = (state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0);

// 导出 Reducer
export default cartSlice.reducer;