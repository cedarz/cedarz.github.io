---
title: Hexo-Next支持Latex公式
date: 2025-06-23 15:45:48
categories:
- Hexo-Next
tags: 
- Hexo-Next
---

书接{% post_link Hexo-Next样式美化 %}，本篇记录hexo-next组合对于$LaTeX$公式的支持。

## Latex渲染插件配置

具体的在[theme-next Math docs](https://github.com/theme-next/hexo-theme-next/blob/master/docs/MATH.md)中写的很清楚，有MathJax和Katex两种公式渲染方式。这里经过实际操作，选择MathJax。

1. 安装hexo-renderer-pandoc，也尝试过hexo-renderer-kramed，但是没效果，具体愿意没有细察
```sh
npm uninstall hexo-renderer-marked
npm install hexo-renderer-pandoc # or hexo-renderer-kramed
npm install hexo-filter-mathjax
```

2. 配置`next/_config.yml`, 打开`mathjax`
```yml
math:
  per_page: false
  mathjax:
    enable: true
```

3. 配置'hexo/_config.yml'
pandoc参数
```yml
# config of hexo-renderer-pandoc
pandoc:
  args:
    - --mathjax # a must arg
    # - --webtex # with it, each equation be in one line
    # - --standalone  # $...$ become \(\), but affect html style
```
mathjax参数
``` yml
mathjax:
  tags: none # or 'ams' or 'all'
  single_dollars: true # enable single dollar signs as in-line math delimiters
  cjk_width: 0.9 # relative CJK char width
  normal_width: 0.6 # relative normal (monospace) width
  append_css: true # add CSS to pages rendered by MathJax
  every_page: false # if true, every page will be rendered by MathJax regardless the `mathjax` setting in Front-matter
  packages: # extra packages to load
  extension_options: {}
```

4. CDN
``` yml
vendors:
  # MathJax
  mathjax: //cdn.jsdelivr.net/npm/mathjs@14.5.2/lib/browser/math.min.js
```
   
5. 生成，需要clean
```sh
hexo clean && hexo g
# or hexo clean && hexo s
```

6. 示例

    $$\begin{equation}\label{eq1}
    e=mc^2
    \end{equation}$$


## Github CI
hexo-renderer-pandoc依赖pandoc工具，在ci的环境中，需要系统安装了pandoc。在{% post_link Hexo-Next搭建记录 %}中ci脚本的基础上，修改相应的步骤。要是我自己写，可能要费点劲，还好有大佬做了相关的工作，[Github Actions部署安装pandoc](https://cateaf.com/2022/04/12/switching-to-github-actions/)，拿来主义了，感谢分享。

1. 添加安装pandoc的步骤
``` yml
- name: Install pandoc
  run: curl -s -L https://github.com/jgm/pandoc/releases/download/2.18/pandoc-2.18-linux-amd64.tar.gz | tar xvzf - -C $RUNNER_TOOL_CACHE/
```

2. 生成步骤中，把pandoc的路径加入到环境变量
``` yml
- name: Build
  run: |
    # add pandoc to PATH
    export PATH="$PATH:$RUNNER_TOOL_CACHE/pandoc-2.18/bin"
    npm run build
```


## 参考
1. [Hexo显示latex公式](https://zhuanlan.zhihu.com/p/381508379)
2. [彻底解决-Hexo-的数学公式渲染问题](https://blog.barku.re/2024/04/20/彻底解决-Hexo-的数学公式渲染问题/) 
3. [hexo-filter-mathjax options](https://github.com/next-theme/hexo-filter-mathjax?tab=readme-ov-file#options)
4. [Math Equations配置](https://theme-next.js.org/docs/third-party-services/math-equations)
5. [MD with Latex to HTML with MathJax with Pandoc](https://stackoverflow.com/questions/37533412/md-with-latex-to-html-with-mathjax-with-pandoc)
6. [Could not convert TeX math \frac](https://github.com/jgm/pandoc/issues/7771)
7. [Github Actions部署安装pandoc](https://cateaf.com/2022/04/12/switching-to-github-actions/)