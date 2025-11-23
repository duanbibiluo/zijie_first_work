// src/App.tsx

import React from 'react';
import { Layout, Typography, theme } from 'antd';
import ProductListPage from './pages/ProductListPage';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* 头部区域：用于展示应用名称 */}
            <Header style={{ background: '#001529', padding: '0 50px' }}>
                <Title level={3} style={{ color: 'white', margin: 0, lineHeight: '64px' }}>
                    🛒 电商商品列表 (RTK + AntD 实践)
                </Title>
            </Header>

            {/* 内容区域：商品列表页面的核心区域 */}
            <Content style={{ padding: '0 50px' }}>
                <div
                    style={{
                        padding: 24,
                        minHeight: 'calc(100vh - 134px)', // 减去 Header 和 Footer 的高度
                        background: colorBgContainer,
                        marginTop: 20,
                        borderRadius: 8
                    }}
                >
                    {/* 引入主页面组件 */}
                    <ProductListPage />
                </div>
            </Content>

            {/* 底部区域 */}
            <Footer style={{ textAlign: 'center' }}>
                Ecommerce Product List ©2025 Created by Gemini
            </Footer>
        </Layout>
    );
};

export default App;