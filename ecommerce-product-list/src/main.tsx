// src/index.tsx 或 src/main.tsx (确保结构正确)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
// 导入 BrowserRouter
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
);