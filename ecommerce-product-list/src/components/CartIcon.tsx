// src/components/CartIcon.tsx (最终修正版 - 包含数量增减)

import React, { useState } from 'react';
// 🚀 引入 InputNumber
import { Badge, Typography, Drawer, Space, Button, Empty, Card, message, Popconfirm, InputNumber } from 'antd';
import { ShoppingCartOutlined, DollarCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../app/hooks';
// 🚀 确认导入 updateQuantity
import { selectCartItemCount, clearCart, removeItem, updateQuantity } from '../features/cart/cartSlice';
import { selectAllProducts } from '../features/productList/productListSlice';

const { Text, Title } = Typography;

const CartIcon: React.FC = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const count = useAppSelector(selectCartItemCount);
    const cartItems = useAppSelector(state => state.cart.items);
    const allProducts = useAppSelector(selectAllProducts);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };


    const handleQuantityChange = (productId: number, value: number | null) => {
        const newQuantity = value === null ? 1 : value; // 如果为空，默认为 1
        if (newQuantity >= 1) {
            dispatch(updateQuantity({ productId, quantity: newQuantity }));
        } else {
            // 如果用户尝试输入 0 或负数，则触发移除确认
            message.warning('请使用移除按钮来删除商品');
        }
    };

    // 处理移除单个商品
    const handleRemoveItem = (productId: number, productName: string) => {
        dispatch(removeItem(productId));
        message.warning(`已将 "${productName}" 从购物车中移除。`);
    };

    // 处理结算和清空购物车
    const handleCheckout = () => {
        if (count === 0) return;

        dispatch(clearCart());
        setOpen(false);
        message.success('结算成功！购物车已清空，感谢您的购买。');
    };

    // 计算总价
    const calculateTotal = () => {
        return cartItems.reduce((total, cartItem) => {
            const product = allProducts.find(p => p.id === cartItem.productId);
            if (product) {
                return total + product.price * cartItem.quantity;
            }
            return total;
        }, 0).toFixed(2);
    };

    return (
        <div style={{ lineHeight: '64px', cursor: 'pointer', marginRight: 20 }}>
            <div onClick={showDrawer}>
                <Badge count={count} showZero color="#1890ff" offset={[-2, 0]}>
                    <ShoppingCartOutlined style={{ fontSize: '24px', color: 'white' }} />
                </Badge>
                <Text style={{ color: 'white', marginLeft: 8 }}>
                    购物车
                </Text>
            </div>

            <Drawer
                title={<Title level={4} style={{ margin: 0 }}>🛒 我的购物车 ({count} 件商品)</Title>}
                placement="right"
                onClose={onClose}
                open={open}
                width={400}
                footer={
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Title level={4} style={{ margin: 0, textAlign: 'right', color: '#ff4d4f' }}>
                            总计：¥{calculateTotal()}
                        </Title>
                        <Button
                            type="primary"
                            size="large"
                            block
                            disabled={count === 0}
                            icon={<DollarCircleOutlined />}
                            onClick={handleCheckout}
                        >
                            立即结算
                        </Button>
                    </Space>
                }
            >
                {cartItems.length === 0 ? (
                    <Empty description="购物车空空如也" />
                ) : (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        {cartItems.map(cartItem => {
                            const product = allProducts.find(p => p.id === cartItem.productId);
                            if (!product) return null;

                            return (
                                <Card
                                    key={cartItem.productId}
                                    size="small"
                                    style={{ background: '#f8f8f8', position: 'relative' }}
                                >
                                    <Space align="start" style={{ width: '100%', paddingRight: 30 }}>
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                                        />
                                        <div style={{ flexGrow: 1 }}>
                                            <Text strong ellipsis={{ tooltip: product.name }}>{product.name}</Text>
                                            <br/>
                                            <Space size="small" direction="vertical" style={{ marginTop: 8 }}>
                                                {/* 🚀 替换为 InputNumber 数量控件 */}
                                                <InputNumber
                                                    min={1}
                                                    value={cartItem.quantity}
                                                    onChange={(value) => handleQuantityChange(product.id, value)}
                                                    style={{ width: 80 }}
                                                    size="small"
                                                />
                                                <Text type="danger">小计: ¥{(product.price * cartItem.quantity).toFixed(2)}</Text>
                                            </Space>
                                        </div>
                                    </Space>

                                    <Popconfirm
                                        title={`确认移除 ${product.name} 吗?`}
                                        onConfirm={() => handleRemoveItem(product.id, product.name)}
                                        okText="移除"
                                        cancelText="取消"
                                    >
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            size="small"
                                            style={{ position: 'absolute', top: 10, right: 10 }}
                                        />
                                    </Popconfirm>
                                </Card>
                            );
                        })}
                    </Space>
                )}
            </Drawer>
        </div>
    );
};

export default CartIcon;