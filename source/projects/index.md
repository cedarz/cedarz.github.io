---
title: Projects
date: 2026-07-07 09:45:22
comments: false
# sidebar: false
---

<div class="project-list">

<section class="project-item">
<h2 class="project-title">MSAA 与 GPU Ray Marching</h2>
<div class="project-row">
<a class="project-thumb" href="/2026/06/25/MSAA和GPU-Ray-Marching的不兼容问题/">
<img src="/images/MSAA和GPU-Ray-Marching的不兼容问题/msaa.png" alt="MSAA 与 GPU Ray Marching">
</a>
<div class="project-desc">
<p>记录 MSAA 多重采样与 GPU Ray Marching 在同一渲染管线中混用时产生的不兼容问题与排查思路。</p>
<p>详见博文 {% post_link MSAA和GPU-Ray-Marching的不兼容问题 %}。</p>
</div>
</div>
</section>

<hr class="project-divider">

<section class="project-item">
<h2 class="project-title">OpenGL Enum Stringifier</h2>
<div class="project-row">
<div class="project-desc">
<p>受 Vulkan <code>vk_enum_string_helper.h</code> 启发，用 Python 从 <code>glcorearb.h</code> 生成 OpenGL 枚举值到字符串的转换代码。</p>
<p>实现思路与脚本见博文 {% post_link Stringifying-OpenGL-enums %}。</p>
</div>
</div>
</section>

</div>

<!-- 添加更多项目：复制 source/projects/index.md 中上方 section 结构，用 hr.project-divider 分隔 -->
