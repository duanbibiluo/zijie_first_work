// src/app/routes.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductListPage from '../pages/ProductListPage';

// 负责定义所有页面的路由规则
const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* 商品列表页：首页或 /products 路径 */}
            <Route path="/" element={<ProductListPage />} />
            <Route path="/products" element={<ProductListPage />} />

            {/* 商品详情页：/product/:id 动态路径 */}
            {/*<Route path="/product/:id" element={<ProductDetailPage />} />*/}

            {/* 默认 404 页面 */}
            <Route path="*" element={<div style={{ textAlign: 'center', padding: 100 }}><h1>404 | 页面未找到</h1></div>} />
        </Routes>
    );
};

export default AppRoutes;