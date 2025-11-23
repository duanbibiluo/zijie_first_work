// src/pages/ProductListPage.tsx

import React, { useEffect,  useCallback } from 'react';
import {Row, Col, Typography, Card, Pagination, Select, Space, Divider, Button} from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    initializeProducts,
    setCurrentPage,
    setSort,
} from '../features/productList/productListSlice';
import type { ProductListState } from '../features/productList/types';
import ProductFilters from "../components/ProductFilters";
import { useNavigate } from 'react-router-dom';

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

const ProductListPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate(); //

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
        // 找到选中的排序字段的默认排序方向
        const selectedOption = SORT_OPTIONS.find(opt => opt.value === value);
        const newSortOrder = selectedOption ? selectedOption.defaultOrder : 'desc';

        // 只有当选择的字段与当前字段不同时才应用新的排序方向，否则重置为默认方向
        dispatch(setSort({
            sortBy: value,
            sortOrder: newSortOrder // 切换排序字段时，使用默认方向
        }));
    }, [dispatch]);


    // 5. 处理排序方向切换 (升序/降序)
    const handleOrderToggle = useCallback(() => {
        // 只有当当前排序字段不是 'default' 时才允许切换方向
        if (sortBy === 'default') return;

        const newSortOrder: ProductListState['sortOrder'] = sortOrder === 'desc' ? 'asc' : 'desc';

        dispatch(setSort({
            sortBy: sortBy, // 保持当前排序字段
            sortOrder: newSortOrder // 切换方向
        }));
    }, [dispatch, sortBy, sortOrder]);


    // --- 提前返回 (Early Returns) ---
    if (loading) return <Title level={4} style={{ textAlign: 'center', padding: 50 }}>商品加载中...</Title>;
    if (error) return <Title level={4} type="danger" style={{ textAlign: 'center', padding: 50 }}>加载错误: {error}</Title>;


    // 6. 渲染逻辑 (JSX)
    return (
        <Row gutter={[24, 24]} style={{ width: '1600px', padding: '24px 0' }}>
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
                                    <Option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </Option>
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
                                <Card
                                    hoverable
                                    // 🚀 修正 1: 将 onClick、cover 和 style 放在属性列表中
                                    onClick={() => {
                                        console.log("🚀 跳转指令已发送:", `/product/${product.id}`); // 👈 增加日志
                                        navigate(`/product/${product.id}`);
                                    }}

                                    cover={
                                        <div style={{ height: 200, overflow: 'hidden' }}>
                                            <img
                                                alt={product.name}
                                                src={product.imageUrl}
                                                style={{ width: '100%', display: 'block' }}
                                            />
                                        </div>
                                    }
                                    style={{ height: '100%' }} // 🚀 修正 2: 确保 style 也是属性
                                >
                                    <Card.Meta
                                        title={<Text ellipsis={{ tooltip: product.name }}>{product.name}</Text>}
                                        description={
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                <Text type="danger" style={{ fontSize: '1.2em' }}>
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
                                </Card>
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
                        showSizeChanger={false} // 可以开启以支持每页条数选择
                    />
                </Row>
            </Col>
        </Row>
    );
};

export default ProductListPage;