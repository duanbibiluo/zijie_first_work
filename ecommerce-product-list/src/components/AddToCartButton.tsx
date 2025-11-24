// src/components/AddToCartButton.tsx

import React from 'react';
import { Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../app/hooks';
import { addItem } from '../features/cart/cartSlice';

interface AddToCartButtonProps {
    productId: number;
    productName: string; // 用于友好的提示
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId, productName }) => {
    const dispatch = useAppDispatch();

    const handleAddToCart = () => {
        // 默认每次点击添加数量 1
        dispatch(addItem({
            productId: productId,
            quantity: 1
        }));

        message.success(`已将 "${productName}" 加入购物车！`);
    };

    return (
        <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
        >
            加入购物车
        </Button>
    );
};

export default AddToCartButton;