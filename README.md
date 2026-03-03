# 中草药百科与识别后台

基于 uni-app + uniCloud 开发的中草药百科与识别后台管理系统。

## 项目功能

### 核心功能
- ✅ 药材管理（新增、编辑、删除、导入、导出）
- ✅ 分类管理（支持药材分类的增删改查）
- ✅ 数据导入（支持 Excel 文件批量导入）
- ✅ 图片管理（支持药材封面图上传）
- ✅ 数据导出（支持导出 Excel 文件）
- ✅ 浏览量统计

### 技术特点
- 基于 uni-app 跨平台框架
- 使用 uniCloud 云服务
- 响应式布局，支持 PC 和移动端
- 支持 Excel 数据导入导出
- 完善的权限管理

## 项目结构

```
├── pages/             # 页面目录
│   ├── yaocai/        # 药材管理
│   └── fenlei/        # 分类管理
├── herbs/             # 药材图片文件夹
├── uniCloud-aliyun/   # 云函数和数据库
│   ├── cloudfunctions/ # 云函数
│   └── database/      # 数据库schema
├── components/        # 组件
└── js_sdk/            # 工具库
```

## 快速开始

### 环境要求
- HBuilderX 3.6.0+
- uni-app 4.36+
- Node.js 14+

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <仓库地址>
   cd 中草药百科与识别后台
   ```

2. **配置 uniCloud**
   - 在 HBuilderX 中打开项目
   - 右键点击 `uniCloud-aliyun` 文件夹
   - 选择 "关联云服务空间"
   - 创建或选择已有的云服务空间

3. **部署云函数**
   - 右键点击 `uniCloud-aliyun/cloudfunctions` 文件夹
   - 选择 "上传所有云函数"

4. **导入数据库**
   - 进入 uniCloud 控制台
   - 导入 `uniCloud-aliyun/database` 目录下的 schema 文件

5. **运行项目**
   - 在 HBuilderX 中点击 "运行"
   - 选择 "运行到浏览器"

## 数据导入

### Excel 导入
1. 准备符合格式的 Excel 文件（参考 `药材数据_2026-2-23.xlsx`）
2. 进入药材管理页面
3. 点击 "导入Excel" 按钮
4. 选择 Excel 文件进行导入

### 图片导入
1. 将药材图片放入 `herbs` 文件夹
2. 图片文件名应与药材名称一致（如：黄芪.jpg）
3. 在编辑药材时上传对应图片

## 数据库结构

### 药材表 (yaocai)
- `_id`: 唯一标识
- `name`: 药材名称
- `latin_name`: 拉丁学名
- `medicinal_part`: 药用部位
- `taste`: 性味
- `meridian`: 归经
- `efficacy`: 功效
- `indication`: 主治
- `category`: 分类
- `views`: 浏览量
- `images`: 图片数组
- `create_date`: 创建时间

### 分类表 (fenlei)
- `_id`: 唯一标识
- `name`: 分类名称
- `description`: 分类描述
- `sort`: 排序权重

## 开发指南

### 添加新功能
1. 在 `pages` 目录下创建新页面
2. 在 `pages.json` 中配置路由
3. 在 `uniCloud-aliyun/cloudfunctions` 中添加云函数
4. 在 `uniCloud-aliyun/database` 中更新数据库 schema

### 部署流程
1. 本地开发测试
2. 上传云函数
3. 发布到生产环境

## 注意事项

- 图片文件建议控制在 1MB 以内
- Excel 导入单次建议不超过 200 条数据
- 定期备份数据库数据

## 许可证

MIT License

## 更新日志

- 2026-03-03: 增加 Excel 导入功能
- 2026-02-23: 完成基础功能开发
- 2026-02-15: 项目初始化
