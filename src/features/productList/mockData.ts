// src/features/productList/mockData.ts

import type {Product} from './types';

const categories = ['Electronics', 'Apparel', 'Home Goods', 'Books', 'Tools', 'Sports'];
const brands = ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E', 'Brand F'];

// 辅助函数：生成过去 90 天内的随机日期
const getRandomDate = (): Date => {
    const today = new Date();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90);

    // 生成一个位于 [ninetyDaysAgo, today] 范围内的随机时间戳
    const randomTimestamp = ninetyDaysAgo.getTime() + Math.random() * (today.getTime() - ninetyDaysAgo.getTime());
    return new Date(randomTimestamp);
};

// 模拟 1000 个商品数据
export const mockProducts: Product[] = Array.from({ length: 1000 }, (_, index) => {
    const price = parseFloat((Math.random() * 900 + 100).toFixed(2)); // $100 - $1000
    const rating = parseFloat((Math.random() * 2 + 3).toFixed(1)); // 3.0 - 5.0
    const sales = Math.floor(Math.random() * 8000) + 100;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];

    return {
        id: index + 1,
        name: `${category} 商品 ${index + 1}`,
        price: price,
        category: category,
        brand: brand,
        rating: rating,
        inStock: Math.random() > 0.05, // 95% 有库存
        sales: sales,
        // 图片 URL
        imageUrl: `https://picsum.photos/seed/${index}/300/200`,
        //  上架时间
        createdAt: getRandomDate(),
    } as Product;
});