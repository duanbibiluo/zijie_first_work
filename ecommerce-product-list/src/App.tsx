// src/App.tsx (新增 CartIcon)

import React from 'react';
import { Layout, Typography, theme } from 'antd';
import AppRoutes from './app/routes';
import CartIcon from './components/CartIcon'; // 🚀 导入购物车图标组件

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>

            {/* 头部区域 - 包含购物车图标 */}
            <Header style={{ background: '#001529', padding: '0 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={3} style={{ color: 'white', margin: 0, lineHeight: '64px' }}>
                    🛒 电商商品列表
                </Title>
                {/* 🚀 放置购物车图标 */}
                <CartIcon />
            </Header>

            {/* 内容区域 ... [保持不变] */}
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
                    <AppRoutes />
                </div>
            </Content>

            <Footer style={{ textAlign: 'center' }}>
            </Footer>
        </Layout>
    );
};

export default App;