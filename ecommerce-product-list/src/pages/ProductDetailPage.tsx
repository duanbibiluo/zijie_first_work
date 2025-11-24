// src/pages/ProductDetailPage.tsx 
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 引入 useNavigate
import { Row, Col, Card, Typography, Descriptions, Divider, Tag, Space, Alert, Button } from 'antd'; // 引入 Button
import { StarFilled, FireOutlined, ArrowLeftOutlined } from '@ant-design/icons'; // 引入返回图标
import { useAppSelector } from '../app/hooks';
import { selectProductById } from '../features/productList/productListSlice';

const { Title, Text } = Typography;

// 格式化日期为 YYYY-MM-DD，处理 Redux 存储的 ISO 字符串
const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch {
        return "日期无效";
    }
};

const ProductDetailPage: React.FC = () => {
    // 🚀 使用 useNavigate 获取导航函数
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const productId = id ? parseInt(id, 10) : undefined;

    // 从 Redux 获取商品详情
    const product = useAppSelector(state =>
        productId !== undefined ? selectProductById(state, productId) : undefined
    );

    // --- 早期返回处理：如果找不到商品 ---
    if (productId === undefined || !product) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <Alert
                    message="商品未找到"
                    description={`ID 为 ${id} 的商品不存在，或数据加载失败。`}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    const productName = product.name || "无名称商品";

    // --- 渲染完整详情 ---
    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>

            {/* 🚀 返回按钮区域 */}
            <div style={{ marginBottom: 20 }}>
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)} // 点击返回上一页
                >
                    返回商品列表
                </Button>
            </div>
            {/* 🚀 结束返回按钮区域 */}

            <Title level={2}>{productName}</Title>
            <Divider />

            <Row gutter={[32, 32]}>
                {/* 左侧：商品图片 (占 10 份) */}
                <Col xs={24} lg={10}>
                    <Card
                        variant="borderless"
                        cover={
                            <img
                                alt={productName}
                                src={product.imageUrl}
                                style={{ width: '100%', borderRadius: 8, maxHeight: 400, objectFit: 'contain' }}
                            />
                        }
                        bodyStyle={{ padding: 0 }}
                    />
                </Col>

                {/* 右侧：商品信息和操作区 (占 14 份) */}
                <Col xs={24} lg={14}>
                    {/* 价格区域 */}
                    <Card style={{ marginBottom: 24, backgroundColor: '#fffbe6', borderColor: '#ffe58f' }} variant="outlined">
                        <Text strong style={{ fontSize: 16 }}>价格</Text>
                        <Title level={1} type="danger" style={{ margin: '8px 0 0' }}>
                            ¥{product.price.toFixed(2)}
                        </Title>
                    </Card>

                    {/* 详细属性描述 */}
                    <Descriptions column={2} bordered size="middle" style={{ marginBottom: 24 }}>
                        <Descriptions.Item label="评分">
                            <Space>
                                <StarFilled style={{ color: '#ffc107' }} />
                                <Text strong>{product.rating.toFixed(1)} / 5.0</Text>
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="销量">
                            <Space>
                                <FireOutlined style={{ color: '#ff4d4f' }} />
                                <Text strong>{product.sales}</Text>
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="分类">
                            <Tag color="blue">{product.category}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="品牌">
                            <Text strong>{product.brand}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="库存状态">
                            <Tag color={product.inStock ? 'green' : 'red'}>
                                {product.inStock ? '有货' : '缺货'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="上架时间">
                            <Text type="secondary">{formatDate(product.createdAt.toString())}</Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>

            <Divider orientation="left">商品详细描述</Divider>
            <div style={{ lineHeight: 1.8, color: '#555' }}>
                <p>{product.description || '暂无详细描述信息。'}</p>
            </div>
        </div>
    );
};


export default ProductDetailPage;
