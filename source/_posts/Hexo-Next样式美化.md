---
title: Hexo-Next样式美化
date: 2025-02-18 16:02:14
categories:
- Hexo-Next
tags: 
- Hexo-Next
---

收录经过整合和验证的Hexo-Next配置方案，主要内容来自于网络技术文章，并给出出处，感谢网络大佬们的分享~

1. 修改超链接颜色
- [Hexo Next 修改超链接颜色](https://blackchy.com/2019/09/30/2019-09-30-Hexo-Next-Link-Color/)
- [Hexo Next博客优化](https://maoao530.github.io/2017/01/25/hexo-blog-seo/)
在./themes/next/source/css/_custom/custom.styl里添加如下代码
``` css
.post-body a:not(.btn){
  color: #0593d3;
  border-bottom: none;
  &:hover {
    color: #0477ab;
    text-decoration: underline;
  }
}
```
a:not(.btn)避免修改首页的”阅读全文”按钮的样式

