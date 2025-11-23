# 🛒 React + Redux Toolkit 高性能电商商品列表实践

本项目是一个基于 React, TypeScript, Redux Toolkit 和 Ant Design 构建的高性能电商商品列表应用。专注于实现复杂的客户端筛选、排序、分页逻辑，并作为 Redux Toolkit (RTK) 和现代前端实践的参考案例。

---

## ⚙️ 技术栈与规范

| 领域 | 技术/库 | 作用 |
| :--- | :--- | :--- |
| **框架/语言** | React, TypeScript, ES6+ | 核心 UI 框架，提供强类型支持和现代 JS 语法。 |
| **状态管理** | Redux Toolkit (RTK) | 集中管理应用状态、筛选条件和商品数据。 |
| **UI 库** | Ant Design (AntD) | 提供专业、响应式的 UI 组件，用于快速构建界面。 |
| **路由** | React Router DOM | 管理列表页 (`/`) 和详情页 (`/product/:id`) 的页面切换。 |
| **代码规范** | ES6+ / TypeScript | 代码遵循现代 JavaScript 规范，命名统一，注释清晰。 |

---

## 📂 项目目录结构

项目的核心逻辑围绕 `app`、`features` 和 `pages` 划分，实现清晰的分层架构。

---

## 📊 核心数据内容与结构

应用的核心数据是 `Product` 类型，为了遵循 Redux 的可序列化原则，日期字段存储为 ISO 字符串。

### Product (商品) 类型

```typescript
export interface Product {
    id: number;
    name: string;
    category: 'Electronics' | 'Apparel' | 'Books' | 'Home'; 
    brand: string;
    price: number;
    rating: number;      // 评分 (0.0 - 5.0)
    sales: number;       // 销量
    inStock: boolean;
    imageUrl: string;
    createdAt: string;   // 存储为 ISO 字符串，以确保 Redux 状态可序列化
}

核心功能点及实现细节
1. 客户端高性能数据处理
集中计算： 所有筛选、排序和分页逻辑集中在 productListSlice.ts 内部，确保状态更新的一致性和高效性。

核心 Selector： 使用自定义 Selector (selectProductById) 和 Redux 内部的计算逻辑，根据 filters 和 sort 状态实时计算出要展示的商品列表 (displayProducts)。

2. 用户体验与优化
筛选防抖 (Debounce)： 对关键词输入和价格滑块拖动使用了自定义 useDebounce Hook。这极大地减少了用户快速操作时触发的 Redux Action 和高耗时计算，保证了列表渲染的流畅性。

多维度排序： 支持按 价格、销量、评分、上架时间 等多个字段进行升序/降序切换排序。


✨ 如何运行
克隆仓库：
Bash

git clone [你的仓库地址]

安装依赖：
Bash

npm install
# 或 yarn install
启动项目：
Bash

npm run dev
# 或 yarn dev
