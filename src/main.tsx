// src/index.tsx 或 src/main.tsx (确保结构正确)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
// 导入 BrowserRouter
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'antd/dist/reset.css';

// 使用非空断言确保 root 元素存在
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* 1. Redux Provider 提供状态管理 */}
        <Provider store={store}>
            {/* 2. BrowserRouter 提供路由上下文 */}
            <BrowserRouter>
                {/* 3. App 是应用的根组件，负责布局和加载 AppRoutes */}
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
);