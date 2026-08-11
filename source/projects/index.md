---
title: Projects
date: 2026-07-07 09:45:22
comments: false
toc:
  enable: false
---

<section class="project-list">
<hr class="project-divider">
<!-- ******************** -->
<section class="project-item">
<div class="project-title-wrap">
<a class="project-title" href="">Cinematic Rendering</a>
</div>
<div class="project-row project-row-reverse">
<div class="project-desc">
<p>Cinematic Rendering，也就是Volumetric Path Tracer，最开始是西门子提出来的词汇，用来实现医疗Dicom数据的体渲染。类似的商业软件还有<a href="https://www.mevislab.de">MeVis</a>，使用CUDA实现的节点式渲染，效果很好。我这里展示的是在片元着色器中实现的progressive体渲染，用来代替ray-marching实现更真实感的表现，是架构在VTK上的定制化渲染，在RTX4080上2560x1440, 1/2屏占比可以30+fps，完整屏占比可以15fps左右，都在正常的交互帧率之上。
</p>
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
<a class="project-title" href="">Mesh Lightmap</a>
</div>
<div class="project-row">
<div class="project-desc">
<p>预计算网格光照图。医疗领域的场景很多是静态的，lightmap就很有用武之地。网格的烘焙有两个过程：（1）参数化，不同于texture的uv，lightmap的uv要满足不重叠，使用大名鼎鼎的<a href="https://github.com/jpcy/xatlas">xatlas</a>；（2）预计算,半球光线diffuse多次弹射的蒙特卡洛积分。
</p>
</div>
<div class="project-media-wrap">
<a class="project-media" href="/images/projects/L_stitched.png" data-fancybox="projects"><img class="project-image" src="/images/projects/L_stitched.png" alt="Mesh Lightmap"></a>
</div>
</div>
</section>
<hr class="project-divider">

<!-- ******************** -->
<section class="project-item">
<div class="project-title-wrap">
<a class="project-title" href="">Volumetric Lightmap</a>
</div>
<div class="project-row  project-row-reverse">
<div class="project-desc">
<p>预计算体数据体光照结果,每一个体素保存该处的Radiance分布。跟网格给光照图稍有异同，除去维度的差别，网格的光照图存储的是irradiance标量数据，Volume的光照图存储的是方向依赖的radiance数据，用SH来表达。
</p>
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
<div class="project-row">
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
<div class="project-row project-row-reverse">
<div class="project-desc">
<p>基础的毛发渲染功能：（1）Kajiya-Kay光照模型；（2）GPAA毛发边缘的过渡实现抗锯齿；（3）PPLL解决半透明问题。</p>
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
<span class="project-title">渲染原型（WIP）</span>
</div>
<div class="project-row">
<div class="project-desc">
<p>应用尽用开源库，攒一套快速验证和实验的渲染原型库。</p>
<ul>
    <li>RHI：DirectX 12/Vulkan</li>
    <li>资源依赖：<a href="https://github.com/skaarj1989/FrameGraph">framegraph</a></li>
    <li>Rendering：全光栅化/Hybrid/全RTRT</li>
    <li>其它：材质/介质/渲染算法/...</li>
</ul>
</div>
<div class="project-media-wrap">
<a class="project-media" href="/images/projects/protype_pbr.png" data-fancybox="projects"><img class="project-image" src="/images/projects/protype_pbr.png" alt="Vincent Van Gogh"></a>
</div>
</div>
</section>
<hr class="project-divider">

<!-- ******************** -->
<section class="project-item">
<div class="project-title-wrap">
<span class="project-title">星空</span>
</div>
<div class="project-row project-row-reverse">
<div class="project-desc">
<p>“A good picture is equivalent to a good deed.”  —Vincent Van Gogh</p>
</div>
<div class="project-media-wrap">
<a class="project-media" href="/images/projects/vango.jpg" data-fancybox="projects"><img class="project-image" src="/images/projects/vango.jpg" alt="Vincent Van Gogh"></a>
</div>
</div>
</section>
<hr class="project-divider">

<!-- ******************** -->
<!-- <section class="project-item">
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
<hr class="project-divider"> -->


</section>

<!-- 添加项目：奇数项 project-row（文左图右），偶数项 project-row project-row-reverse（图左文右）
无图用 <div class="project-image-placeholder" aria-hidden="true"></div>
项目之间插入 <hr class="project-divider">，不要放在最后一个项目后面 -->
