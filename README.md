# 六度前端（frontend）

基于React + TypeScript + Ant Design + Cytoscape.js的职场关系网前端项目。

## 主要功能
- 登录/注册（手机号+验证码模拟）
- 个人主页
- 关系网可视化与编辑

## 本地开发

```bash
cd frontend
npm install
npm run dev
```

## API地址配置

在`frontend`目录下创建`.env`文件，内容如下：

```
VITE_API_BASE=https://你的后端API地址
```

## 打包与部署

```bash
npm run build
```

生成的`dist`目录可部署到Vercel、Netlify等平台。

## 依赖
- React
- TypeScript
- Ant Design
- Axios
- Cytoscape.js
- React Router DOM 