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

项目的核心逻辑围绕 `app`、`features`、`components`和 `pages` 划分，实现清晰的分层架构。
<img width="505" height="330" alt="image" src="https://github.com/user-attachments/assets/7b21dc2d-c491-492d-a4f0-a0cf86127726" />


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
```
### 核心功能点及实现细节
####  1. 客户端高性能数据处理
```
集中计算： 所有筛选、排序和分页逻辑集中在 productListSlice.ts 内部，确保状态更新的一致性和高效性。

核心 Selector： 使用自定义 Selector (selectProductById) 和 Redux 内部的计算逻辑，根据 filters 和 sort 状态实时计算出要展示的商品列表 (displayProducts)。
```
#### 2. 用户体验与优化
```
筛选防抖 (Debounce)： 对关键词输入和价格滑块拖动使用了自定义 useDebounce Hook。这极大地减少了用户快速操作时触发的 Redux Action 和高耗时计算，保证了列表渲染的流畅性。

多维度排序： 支持按 价格、销量、评分、上架时间 等多个字段进行升序/降序切换排序。
```
#### 3. 商品详情页与导航
```
路由集成与数据获取：成功配置 /product/:id 路由，并使用 react-router-dom 的 useParams 获取 URL ID。通过 Redux Selector (selectProductById) 精确获取和展示单个商品的完整详情。

优雅的 UI 展示：详情页 (ProductDetailPage.tsx) 使用 Ant Design 的 Row/Col 和 Descriptions 组件，以专业、美观的布局展示商品的大图、价格、评分、销量和详细属性。
```
---
#### 4. 购物车商品添加与结算
```
状态隔离与集中管理： 新建独立的 cartSlice.ts 模块，专门负责管理购物车状态（items 数组），确保购物车逻辑与商品列表逻辑相互独立。

实时数量与增减控： 购物车图标（CartIcon.tsx）通过 Redux Selector 实时显示商品总数量。在抽屉面板中集成 InputNumber 控件和 removeItem Action，支持用户在不离开页面的情况下增减和移除商品。

结算与清空机制： 实现 handleCheckout 逻辑，点击“立即结算”时，通过 dispatch(clearCart()) 派发 Action 清空购物车状态，并提供即时反馈。
```

# 环境说明与运行指南 
本项目是使用现代前端工具链构建的，确保您的开发环境满足以下要求：

---

## 环境要求
Node.js: 推荐版本 20.x (LTS) 或更高版本。

npm: 推荐版本 8.x 或更高版本。

Git: 用于版本控制和克隆项目代码。

---
## 运行指南
请按照以下步骤启动本地开发环境：

### 步骤 1: 克隆项目仓库
打开你的终端或命令行工具，将项目代码克隆到本地：
```
Bash
git clone [YOUR_REPOSITORY_URL]
cd [project-folder-name]
```
### 步骤 2: 安装依赖包
```
使用 npm 或 yarn 安装项目所需的所有依赖：
Bash
使用 npm
npm install
# 或使用 yarn
 yarn install
```
### 步骤 3: 启动开发服务器
执行以下命令启动开发服务器。项目将自动在你的默认浏览器中打开，通常是 http://localhost:5173/。
Bash

### 启动开发模式 (使用 Vite 或类似的打包工具)
```
npm run dev
或
yarn dev
```
### 步骤 4: 构建生产环境 (可选)
```
如果你需要生成用于生产部署的优化代码，可以运行构建命令：

Bash

npm run build
或
yarn build
```
