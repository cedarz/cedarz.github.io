---
title: Projects
date: 2026-07-07 09:45:22
comments: false
toc:
  enable: false
---

<div class="project-list">

<!-- ******************** -->
<section class="project-item">
<div class="project-title-wrap">
<a class="project-title" href="">Volumetric Path Tracer</a>
</div>
<div class="project-row project-row-reverse">
<div class="project-desc">
<p>Volumetric Path Tracer实现医疗Dicom数据的体渲染。</p>
</div>
<div class="project-media-wrap">
<a class="project-media" href="/images/projects/teaser-pt.png" data-fancybox="projects"><img class="project-image" src="/images/projects/teaser-pt.png" alt="Volumetric Path Tracer"></a>
</div>
</div>
</section>
<hr class="project-divider">


<!-- ******************** -->
<section class="project-item">
<div class="project-title-wrap">
<a class="project-title" href="">Volumetric Lightmap</a>
</div>
<div class="project-row">
<div class="project-desc">
<p>预计算医疗Dicom数据Path Tracer体渲染光照结果。</p>
</div>
<div class="project-media-wrap">
<a class="project-media" href="/images/projects/P_stitched.png" data-fancybox="projects"><img class="project-image" src="/images/projects/P_stitched.png" alt="Volumetric Lightmap"></a>
</div>
</div>
</section>
<hr class="project-divider">

<!-- ******************** -->
<section class="project-item">
<div class="project-title-wrap">
<a class="project-title" href="">人脸重建网格处理</a>
</div>
<div class="project-row project-row-reverse">
<div class="project-desc">
<!-- 粗模模型是关键点映射到重建脸坐标的人脸模型，由于重建质量查，导致坐标映射质量查且缺失 -->
<p>该算法流程主要为了解决人脸重建网格质量差的问题，并较大程度的改善了网格质量，实现了自动化的修复流程。流程：粗模模型和标准脸的配准、问题网格的检测和移除、网格投影及边界提取和排序、边界的缝合和Z坐标的校正、问题区域的重网格化、关键点拼接附加模型。</p>
<p>存在的问题：粗模和标准脸的偏差过大，配准后差异依然存在，导致拼接处网格法线过渡生硬。</p>
</div>
<div class="project-media-wrap">
<a class="project-media" href="/images/projects/face_mesh.png" data-fancybox="projects"><img class="project-image" src="/images/projects/face_mesh.png" alt="face mesh processing"></a>
</div>
</div>
</section>
<hr class="project-divider">


<!-- ******************** -->
<section class="project-item">
<div class="project-title-wrap">
<a class="project-title" href="">毛发渲染</a>
</div>
<div class="project-row">
<div class="project-desc">
<p>毛发渲染。</p>
</div>
<div class="project-media-wrap">
<a class="project-media" href="/images/projects/hair.png" data-fancybox="projects"><img class="project-image" src="/images/projects/hair.png" alt="hair rendering"></a>
</div>
</div>
</section>
<hr class="project-divider">

<!-- ******************** -->
<section class="project-item">
<div class="project-title-wrap">
<a class="project-title" href="">Project Title PlaceHolder</a>
</div>
<div class="project-row project-row-reverse">
<div class="project-desc">
<p>“A good picture is equivalent to a good deed.”  —Vincent Van Gogh</p>
</div>
<div class="project-media-wrap">
<div class="project-image-placeholder" aria-hidden="true"></div>
</div>
</div>
</section>
<hr class="project-divider">


</div>

<!-- 添加项目：奇数项 project-row（文左图右），偶数项 project-row project-row-reverse（图左文右）
无图用 <div class="project-image-placeholder" aria-hidden="true"></div>
项目之间插入 <hr class="project-divider">，不要放在最后一个项目后面 -->
