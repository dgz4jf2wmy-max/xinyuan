# 开发规范与系统设定

## 页面布局与样式统一规范 (Page Layout Guidelines)
每次新建页面或组件时，必须严格遵守以下标准的页面整体布局和样式一致性规范：

### 1. 结构与容器规范
所有的主页面或带有独立详情的展示页，必须采用以下自适应弹性布局（Flex），确保避免双滚动条和全局布局变形：
```tsx
<div className="flex flex-col h-full w-full bg-white relative">
  <div className="flex flex-1 min-h-0 overflow-hidden">
    <div className="flex-1 p-4 lg:p-6 flex flex-col overflow-hidden">
      
      {/* 1. 操作区 */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div className="flex items-center gap-2 text-[#303133]">
          {/* 如有返回上一页的需求 */}
          <button onClick={() => navigate(-1)} className="hover:text-[#409eff] mr-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          {/* 根据最新规范，不需要在页面内放置大标题（h2）。面包屑路径足以说明页面层级 */}
          {/* 其他状态标签或副标题可以在此放置 */}
        </div>
        <div className="flex items-center gap-2">
          {/* 操作按钮区，通常如：新增、保存、取消等 */}
          <Button variant="outline" size="sm">取消</Button>
          <Button variant="primary" size="sm">保存</Button>
        </div>
      </div>

      {/* 2. 页面主内容区 */}
      <div className="flex-1 overflow-auto">
        {/* 这里放置具体的业务主体，例如列表页的内容、卡片、表单区块 */}
        {/* 主体区背景为白，如有需要可以使用 rounded-lg shadow-sm border border-[#e4e7ed] 等进行板块划分 */}
      </div>

    </div>
  </div>
</div>
```

### 2. UI 组件与色彩规范
- 如果只是卡片标题，请使用：`text-sm font-medium text-[#303133]` 配合浅灰色背景头 `bg-[#fafafa]` 及下边框 `border-b border-[#e4e7ed]`。
- 主行动按钮（Primary Button）原则上使用系统内预设的颜色/Tailwind风格，避免凭空创造全新按钮颜色。
- 不太重要或需要弱化的次要状态标签，请用 `bg-[#fafafa] text-[#c0c4cc] border border-[#e4e7ed]`，将鲜艳颜色（如大红、大绿）留给最重要的状态（如：生效中、严重异常等）。

### 3. 数据层规范
无论处于原型阶段还是后续阶段，所有的“枚举”、“实体类字段”严格遵循设定。不要未经允许私造字段和合并列表列字段。
遇到没有指示的情况，请主动阅读过往类似页面、查看相关数据列表进行对齐。
