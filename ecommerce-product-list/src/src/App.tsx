// src/App.tsx
import React from 'react';
import { Layout, Typography, theme } from 'antd';
import AppRoutes from './app/routes'; // 导入路由配置

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>

            {/* 头部区域 */}
            <Header style={{ background: '#001529', padding: '0 50px' }}>
                <Title level={3} style={{ color: 'white', margin: 0, lineHeight: '64px' }}>
                    🛒 电商商品列表
                </Title>
            </Header>

            {/* 内容区域 */}
            <Content style={{ padding: '0 50px' }}>
                <div
                    style={{
                        padding: 24,
                        minHeight: 'calc(100vh - 134px)',
                        background: colorBgContainer,
                        marginTop: 20,
                        borderRadius: 8
                    }}
                >
                    {/* 引入 AppRoutes 负责根据 URL 渲染列表或详情 */}
                    <AppRoutes />
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