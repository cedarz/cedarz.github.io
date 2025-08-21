# Enhanced Image Plugin for Hexo

一个功能强大的 Hexo 图片增强插件，提供美观的图片展示效果、点击放大功能和多种样式选项。

## 功能特性

- 🎨 **多种预设样式**: 8种精美的图片样式可选
- 📏 **灵活尺寸控制**: 6个预设尺寸 + 自定义尺寸支持
- 🎯 **对齐方式**: 支持左、中、右三种对齐方式
- 📝 **图片标题**: 可选的图片标题功能
- 🔍 **点击放大**: 内置模态框放大查看功能
- 📱 **响应式设计**: 移动设备自动适配
- ⚡ **懒加载**: 自动优化页面加载性能
- ♿ **无障碍支持**: 完整的 alt 属性支持

## 安装使用

1. 将 `enhanced-image.js` 文件放入 Hexo 项目的 `scripts/` 目录
2. 重新生成网站: `hexo clean && hexo generate`
3. 在 Markdown 文件中使用标签

## 语法说明

### 基本语法

```markdown
{% enhanced_img 图片路径 尺寸 样式 对齐方式 "标题" %}
```

### 参数详解

#### 1. 图片路径 (必需)
图片的相对路径或绝对路径

```markdown
{% enhanced_img /images/example.jpg %}
{% enhanced_img /images/folder/image.png %}
{% enhanced_img https://example.com/image.jpg %}
```

#### 2. 尺寸 (可选，默认: `medium`)

| 值 | 宽度 | 说明 |
|---|---|---|
| `xs` | 200px | 超小尺寸 |
| `small` | 300px | 小尺寸 |
| `medium` | 500px | 中等尺寸 (默认) |
| `large` | 700px | 大尺寸 |
| `xl` | 900px | 超大尺寸 |
| `full` | 100% | 全宽 |
| 自定义 | 如 `400px`, `80%` | 自定义CSS值 |

#### 3. 样式 (可选，默认: `bordered`)

| 样式 | 效果 |
|---|---|
| `bordered` | 边框 + 圆角 + 内边距 + 阴影 |
| `shadow` | 阴影 + 圆角 |
| `rounded` | 圆角 |
| `clean` | 简洁边框 + 小圆角 |
| `card` | 卡片样式 (白色背景 + 边框 + 阴影) |
| `minimal` | 无边框 |
| `modern` | 现代风格 (大圆角 + 淡边框 + 阴影) |
| `vintage` | 复古风格 (棕色边框 + 米色背景) |

#### 4. 对齐方式 (可选，默认: `center`)

| 值 | 效果 |
|---|---|
| `left` | 左对齐 |
| `center` | 居中对齐 (默认) |
| `right` | 右对齐 |

#### 5. 标题 (可选)

用双引号包围的图片标题，会显示在图片下方

```markdown
{% enhanced_img /images/example.jpg medium card center "这是图片标题" %}
```

## 使用示例

### 基础用法

```markdown
<!-- 最简单的用法 -->
{% enhanced_img /images/example.jpg %}

<!-- 指定尺寸 -->
{% enhanced_img /images/example.jpg large %}

<!-- 指定样式 -->
{% enhanced_img /images/example.jpg medium shadow %}
```

### 完整参数示例

```markdown
<!-- 大尺寸卡片样式，居中对齐，带标题 -->
{% enhanced_img /images/screenshot.jpg large card center "网站截图" %}

<!-- 小尺寸现代样式，左对齐 -->
{% enhanced_img /images/icon.png small modern left %}

<!-- 全宽最简样式，无标题 -->
{% enhanced_img /images/banner.jpg full minimal %}
```

### 不同样式效果展示

```markdown
<!-- 边框样式 -->
{% enhanced_img /images/demo.jpg medium bordered center "边框样式" %}

<!-- 阴影样式 -->
{% enhanced_img /images/demo.jpg medium shadow center "阴影样式" %}

<!-- 卡片样式 -->
{% enhanced_img /images/demo.jpg medium card center "卡片样式" %}

<!-- 现代样式 -->
{% enhanced_img /images/demo.jpg medium modern center "现代样式" %}

<!-- 复古样式 -->
{% enhanced_img /images/demo.jpg medium vintage center "复古样式" %}
```

## 支持的标签

### enhanced_img (推荐)

单行语法，支持所有参数包括标题：

```markdown
{% enhanced_img /path/to/image.jpg size style align "caption" %}
```

### image (传统语法)

块级语法，标题作为内容：

```markdown
{% image /path/to/image.jpg size style align %}
图片标题内容
{% endimage %}
```

## 生成的HTML结构

### 无标题时

```html
<div style="text-align: center; margin: 20px 0;">
  <img src="/images/example.jpg" 
       alt="" 
       style="max-width: 100%; height: auto; width: 500px; border: 1px solid #e1e8ed; border-radius: 8px; padding: 4px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); cursor: zoom-in;" 
       loading="lazy" 
       onclick="openImageModal(this)">
</div>
```

### 有标题时

```html
<figure style="text-align: center; margin: 20px 0;">
  <img src="/images/example.jpg" 
       alt="图片标题" 
       style="max-width: 100%; height: auto; width: 500px; border: 1px solid #e1e8ed; border-radius: 8px; padding: 4px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08); cursor: zoom-in;" 
       loading="lazy" 
       onclick="openImageModal(this)">
  <figcaption style="margin-top: 12px; font-size: 0.9em; color: #666; line-height: 1.6;">
    图片标题
  </figcaption>
</figure>
```

## 模态框功能

插件自动为所有图片添加点击放大功能：

- **点击图片**: 在模态框中查看大图
- **点击背景**: 关闭模态框
- **点击×按钮**: 关闭模态框
- **按ESC键**: 关闭模态框

## CSS样式

插件会自动注入以下CSS样式：

- 图片悬停效果
- 模态框样式
- 响应式适配
- 移动端优化

## 注意事项

1. **参数顺序**: 必须按照 `路径 尺寸 样式 对齐 标题` 的顺序
2. **标题格式**: 标题必须用双引号包围
3. **可选参数**: 除图片路径外，所有参数都是可选的
4. **跳过参数**: 如果要跳过某个参数，保持位置但传空值

## 兼容性

- ✅ Hexo 3.x+
- ✅ 所有现代浏览器
- ✅ 移动设备
- ✅ 无障碍阅读器

## 许可证

本插件基于 MIT 许可证发布。

## 更新历史

- **v1.0**: 初始版本，支持基础图片展示
- **v1.1**: 添加多种样式选项
- **v1.2**: 添加点击放大功能
- **v1.3**: 添加标题支持和响应式设计
- **v1.4**: 优化代码结构，移除测试标签

---

如有问题或建议，欢迎提交 Issue 或 Pull Request。 