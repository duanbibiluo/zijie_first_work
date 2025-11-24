// src/pages/ProductListPage.tsx (集成购物车按钮)

import React, { useEffect,  useCallback } from 'react';
import {Row, Col, Typography, Card, Pagination, Select, Space, Divider, Button, Tag} from 'antd'; // 引入 Tag
import { ArrowUpOutlined, ArrowDownOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    initializeProducts,
    setCurrentPage,
    setSort,
} from '../features/productList/productListSlice';
import type { ProductListState, Product } from '../features/productList/types'; // 确保 Product 类型被导入
import ProductFilters from "../components/ProductFilters";
import { useNavigate } from 'react-router-dom';
import AddToCartButton from '../components/AddToCartButton'; // 🚀 导入购物车按钮组件

const { Title, Text } = Typography;
const { Option } = Select;

// 定义排序选项
interface SortOption {
    label: string;
    value: ProductListState['sortBy'];
    defaultOrder: ProductListState['sortOrder']; // 默认排序方向
}

const SORT_OPTIONS: SortOption[] = [
    { label: '默认', value: 'default', defaultOrder: 'desc' },
    { label: '上架时间', value: 'createdAt', defaultOrder: 'desc' }, // '最新' 对应降序
    { label: '价格', value: 'price', defaultOrder: 'desc' },
    { label: '销量', value: 'sales', defaultOrder: 'desc' },
    { label: '评分', value: 'rating', defaultOrder: 'desc' },
];


// ------------------------------------------------------------------------------------------------

const ProductListPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // 1. 从 Redux 一次性读取所有需要的状态
    const {
        displayProducts,
        currentPage,
        pageSize,
        totalCount,
        loading,
        error,
        sortBy,
        sortOrder,
    } = useAppSelector(state => state.productList);

    // 2. 组件挂载时：初始化商品列表
    useEffect(() => {
        dispatch(initializeProducts());
    }, [dispatch]);

    // 3. 处理分页变化
    const handlePageChange = useCallback((page: number) => {
        dispatch(setCurrentPage(page));
    }, [dispatch]);


    // 4. 处理排序变化 (UI 交互)
    const handleSortChange = useCallback((value: ProductListState['sortBy']) => {
        const selectedOption = SORT_OPTIONS.find(opt => opt.value === value);
        const newSortOrder = selectedOption ? selectedOption.defaultOrder : 'desc';

        dispatch(setSort({
            sortBy: value,
            sortOrder: newSortOrder
        }));
    }, [dispatch]);


    // 5. 处理排序方向切换 (升序/降序)
    const handleOrderToggle = useCallback(() => {
        if (sortBy === 'default') return;

        const newSortOrder: ProductListState['sortOrder'] = sortOrder === 'desc' ? 'asc' : 'desc';

        dispatch(setSort({
            sortBy: sortBy,
            sortOrder: newSortOrder
        }));
    }, [dispatch, sortBy, sortOrder]);


    // 6. 渲染逻辑 (JSX)
    if (loading) return <Title level={4} style={{ textAlign: 'center', padding: 50 }}>商品加载中...</Title>;
    if (error) return <Title level={4} type="danger" style={{ textAlign: 'center', padding: 50 }}>加载错误: {error}</Title>;


    const renderProductCard = (product: Product) => {
        // 🚀 注意：阻止点击 Card 跳转到详情页
        const handleCardClick = (e: React.MouseEvent) => {
            // 避免点击购物车按钮时触发跳转
            if ((e.target as HTMLElement).closest('button')) {
                return;
            }
            navigate(`/product/${product.id}`);
        };

        return (
            <Card
                key={product.id}
                hoverable
                // 修正: 确保点击 Card 跳转，但要排除子元素的点击事件（如按钮）
                onClick={handleCardClick}
                cover={
                    <div style={{ height: 200, overflow: 'hidden' }}>
                        <img
                            alt={product.name}
                            src={product.imageUrl}
                            style={{ width: '100%', display: 'block' }}
                        />
                    </div>
                }
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                bodyStyle={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
                <Card.Meta
                    title={<Text ellipsis={{ tooltip: product.name }}>{product.name}</Text>}
                    description={
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {/* 价格和基本信息 */}
                            <Text type="danger" style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                                ¥{product.price.toFixed(2)}
                            </Text>
                            <Row justify="space-between">
                                <Col>
                                    <Space size={4}>
                                        <StarOutlined style={{ color: '#ffc107' }} />
                                        <Text type="secondary">{product.rating.toFixed(1)}</Text>
                                    </Space>
                                </Col>
                                <Col>
                                    <Space size={4}>
                                        <FireOutlined style={{ color: '#ff4d4f' }} />
                                        <Text type="secondary">{product.sales} 销量</Text>
                                    </Space>
                                </Col>
                            </Row>
                        </Space>
                    }
                />

                {/* 🚀 新增：操作区域 (添加到购物车) */}
                <Divider style={{ margin: '12px 0 8px 0' }} />
                <Row justify="space-between" align="middle">
                    <Col>
                        {/* 保持库存显示 */}
                        <Tag color={product.inStock ? 'green' : 'red'}>
                            {product.inStock ? '有货' : '缺货'}
                        </Tag>
                    </Col>
                    <Col>
                        {/* 嵌入购物车按钮 */}
                        <AddToCartButton
                            productId={product.id}
                            productName={product.name}
                        />
                    </Col>
                </Row>
                {/* 🚀 结束新增 */}

            </Card>
        );
    };


    return (
        <Row gutter={[24, 24]} style={{ padding: '24px 0' }}>
            {/* 侧边栏：筛选器 (占 6 份) */}
            <Col xs={24} sm={8} md={6}>
                <Card title="商品筛选" bordered={false}>
                    <ProductFilters />
                </Card>
            </Col>

            {/* 主区域：商品列表和分页 (占 18 份) */}
            <Col xs={24} sm={16} md={18}>
                {/* 排序和展示信息条 */}
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Col>
                        <Title level={4} style={{ margin: 0 }}>
                            共找到 <Text type="success">{totalCount}</Text> 件商品
                        </Title>
                    </Col>

                    <Col>
                        <Space>
                            <Text strong>排序方式:</Text>
                            {/* 排序字段选择器 */}
                            <Select
                                value={sortBy}
                                style={{ width: 140 }}
                                onChange={handleSortChange}
                                size="large"
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                                ))}
                            </Select>

                            {/* 排序方向切换按钮 */}
                            <Button
                                onClick={handleOrderToggle}
                                disabled={sortBy === 'default'}
                                icon={sortOrder === 'desc' ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
                                size="large"
                            >
                                {sortOrder === 'desc' ? '降序' : '升序'}
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Divider style={{ margin: '0 0 16px 0' }} />

                {/* 商品列表区域 */}
                <Row gutter={[16, 16]}>
                    {displayProducts.length > 0 ? (
                        displayProducts.map(product => (
                            <Col key={product.id} xs={24} sm={12} lg={8} xl={6}>
                                {renderProductCard(product)}
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <Title level={4}>暂无符合条件的商品</Title>
                                <p>请尝试调整筛选条件</p>
                            </div>
                        </Col>
                    )}
                </Row>


                {/* 分页组件 */}
                <Row justify="center" style={{ marginTop: 24 }}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalCount}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </Row>
            </Col>
        </Row>
    );
};

export default ProductListPage;