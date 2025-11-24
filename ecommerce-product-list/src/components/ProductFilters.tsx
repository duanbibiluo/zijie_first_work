// src/components/ProductFilters.tsx

import React, { useCallback, useMemo, useState, useEffect} from 'react';
import { Input, Select, Slider, Checkbox, Space, Button, Typography, Divider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setFilters } from '../features/productList/productListSlice';
import type {ProductFilters as FiltersType} from '../features/productList/types';
import { useDebounce } from '../app/hooks'; // ✅ 导入 useDebounce Hook

const { Title } = Typography;

// --- 辅助函数：提取所有不重复的品牌和分类 (保持不变) ---
const useFilterOptions = () => {
    const allProducts = useAppSelector(state => state.productList.allProducts);

    const categories = useMemo(() => {
        const set = new Set(allProducts.map(p => p.category));
        return [{ label: '所有分类', value: null }, ...Array.from(set).map(cat => ({
            label: cat,
            value: cat,
        }))];
    }, [allProducts]);

    const brands = useMemo(() => {
        const set = new Set(allProducts.map(p => p.brand));
        return Array.from(set).sort();
    }, [allProducts]);

    return { categories, brands };
};


const ProductFilters: React.FC = () => {
    const dispatch = useAppDispatch();
    const currentFilters = useAppSelector(state => state.productList.filters);
    const { priceRange, rating, brand: selectedBrands, searchTerm, category: selectedCategory } = currentFilters;


    // 1. 搜索词的本地状态 (实时更新 Input)
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
    // 2. 价格滑块的本地状态 (实时更新 Slider)
    const [localPriceRange, setLocalPriceRange] = useState(priceRange);
    // 3. 评分滑块的本地状态 (实时更新 Slider)
    const [localRating, setLocalRating] = useState(rating);

    // ✅ 4. 对搜索词应用防抖处理
    const debouncedSearchTerm = useDebounce(localSearchTerm, 400); // 400ms 防抖

    // ✅ 5. 监听防抖后的搜索词，并派发 Redux Action (防抖核心逻辑)
    useEffect(() => {
        // 只有当防抖后的值与 Redux 中当前的值不同时，才派发 Action
        if (debouncedSearchTerm !== searchTerm) {
            // 这里派发 Action，会触发 Redux state.productList.filters.searchTerm 更新
            dispatch(setFilters({ ...currentFilters, searchTerm: debouncedSearchTerm }));
        }
    }, [debouncedSearchTerm, dispatch, currentFilters, searchTerm]);

    // 获取可供选择的品牌和分类
    const { categories, brands } = useFilterOptions();

    // --- 核心逻辑：创建统一的派发函数 (保持不变) ---
    const updateFilters = useCallback((newPartialFilters: Partial<FiltersType>) => {
        const newFilters = {
            ...currentFilters,
            ...newPartialFilters
        };
        dispatch(setFilters(newFilters));
    }, [dispatch, currentFilters]);

    // --- 处理器函数 ---

    // 搜索词处理：只更新本地状态 (实时)
    const handleSearchLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchTerm(e.target.value);
    };


    // Redux 派发逻辑由上面的 useEffect 负责

    // 分类选择处理：直接派发 Redux Action (不需要防抖)
    const handleCategoryChange = (value: string | null) => {
        updateFilters({ category: value });
    };

    // --- 价格滑块 Handlers (保持不变，因为 onAfterChange 已自带 '拖动结束' 的防抖效果) ---

    // 1. 实时更新本地状态 (拖动中，不触发 Redux)
    const handlePriceLocalChange = (value: number | number[]) => {
        setLocalPriceRange(value as [number, number]);
    };

    // 2. 拖动结束，派发 Redux Action
    const handlePriceAfterChange = (value: number | number[]) => {
        updateFilters({ priceRange: value as [number, number] });
    };

    // --- 评分滑块 Handlers (保持不变，利用 onAfterChange) ---
    const handleRatingLocalChange = (value: number) => {
        setLocalRating(value);
    };
    const handleRatingAfterChange = (value: number) => {
        updateFilters({ rating: value });
    };

    // 品牌多选处理：直接派发 Redux Action (不需要防抖)
    const handleBrandChange = (checkedValues: string[]) => {
        updateFilters({ brand: checkedValues });
    };

    // 重置按钮 (重置时同步更新本地状态，触发 useEffect 同步 Redux)
    const handleResetFilters = () => {
        const defaultFilters: FiltersType = {
            searchTerm: '',
            category: null,
            priceRange: [0, 1000],
            brand: [],
            rating: 0,
        };

        // 同步更新本地状态
        setLocalSearchTerm('');
        setLocalPriceRange([0, 1000]);
        setLocalRating(0);

        // 派发 Redux action
        dispatch(setFilters(defaultFilters));
    };


    // --- 渲染 UI ---
    return (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">

            {/* 1. 搜索框 (绑定到 localSearchTerm) */}
            <Title level={5}>搜索商品</Title>
            <Input
                placeholder="输入关键词..."
                prefix={<SearchOutlined />}
                // ✅ 绑定到 localSearchTerm
                value={localSearchTerm}
                // ✅ 实时更新 localSearchTerm
                onChange={handleSearchLocalChange}
                allowClear
            />

            <Divider style={{ margin: '16px 0' }} />

            {/* 2. 分类选择 (保持不变) */}
            <Title level={5}>分类</Title>
            <Select
                style={{ width: '100%' }}
                placeholder="选择分类"
                value={selectedCategory}
                onChange={handleCategoryChange}
                options={categories}
                allowClear
            />

            <Divider style={{ margin: '16px 0' }} />

            {/* 3. 价格范围 (利用 onAfterChange) */}
            <Title level={5}>
                价格范围: ¥{localPriceRange[0]} - ¥{localPriceRange[1]}
            </Title>
            <Slider
                range
                min={0}
                max={1000}
                step={10}
                value={localPriceRange}
                onChange={handlePriceLocalChange}
                onAfterChange={handlePriceAfterChange} // 拖动结束才派发
            />

            <Divider style={{ margin: '16px 0' }} />

            {/* 4. 品牌选择 (保持不变) */}
            <Title level={5}>品牌</Title>
            <Checkbox.Group
                options={brands}
                value={selectedBrands}
                onChange={handleBrandChange as (checkedValue: string[]) => void}
            />

            <Divider style={{ margin: '16px 0' }} />

            {/* 5. 评分过滤 (利用 onAfterChange) */}
            <Title level={5}>
                最低评分: {localRating.toFixed(1)} 星
            </Title>
            <Slider
                min={0}
                max={5}
                step={0.5}
                value={localRating}
                onChange={handleRatingLocalChange as (value: number | number[]) => void}
                onAfterChange={handleRatingAfterChange as (value: number | number[]) => void} // 拖动结束才派发
                marks={{ 0: '0', 5: '5' }}
            />

            <Divider style={{ margin: '16px 0' }} />

            {/* 6. 重置按钮 (保持不变) */}
            <Button type="default" onClick={handleResetFilters} block>
                重置所有筛选
            </Button>
        </Space>
    );
};

export default ProductFilters;