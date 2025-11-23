// src/app/hooks.ts
//作为连接器 可以将各组件串联起来 使用

import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// 使用自定义类型代替标准的 Redux Hooks
// 它们会预先绑定 RootState 和 AppDispatch 类型，确保类型安全
// src/app/useDebounce.ts

import { useState, useEffect } from 'react';

/**
 * 一个自定义 Hook，用于对传入的值进行防抖处理。
 *
 * @param value 需要防抖的值
 * @param delay 防抖延迟时间（毫秒）
 * @returns 经过防抖处理后的值
 */
export function useDebounce<T>(value: T, delay: number): T {
    // 存储防抖后的值
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // 设置一个定时器
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // 清理函数：在下一次 useEffect 运行或组件卸载时清除上一个定时器
        // 这就是防抖的核心：每次值变化都会重置计时器。
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // 只有当 value 或 delay 变化时才重新运行 effect

    return debouncedValue;
}

// 用于派发 Actions 的 Hook (带有 AppDispatch 类型 用于向 Store 发送指令的函数类型)  他是控制函数
export const useAppDispatch: () => AppDispatch = useDispatch;

// 用于读取状态的 Hook (带有 RootState 类型  整个应用状态的结构)  他是控制状态
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;