---
title: RTR4 Reading Notes
date: 2025-10-29 10:34:14
mathjax: true
toc:
  number: false
categories:
- Reading Notes
- PBR
tags: 
- Reading Notes
- PBR
---

# 11. Global Illumination

## 11.1 The Rendering Equation
Reflectance Equation（反射方程）
$$L_o(\mathbf{p}, \mathbf{v}) = \int_{\mathbf{l} \in \Omega} f(\mathbf{l}, \mathbf{v}) \, L_i(\mathbf{p}, \mathbf{l}) \, (\mathbf{n} \cdot \mathbf{l})^+ \, d\mathbf{l}$$
Rendering Equation（渲染方程）
$$L_o(\mathbf{p}, \mathbf{v}) = L_e(\mathbf{p}, \mathbf{v}) + \int_{\mathbf{l} \in \Omega} f(\mathbf{l}, \mathbf{v}) \, L_o(r(\mathbf{p}, \mathbf{l}), -\mathbf{l}) \, (\mathbf{n} \cdot \mathbf{l})^+ \, d\mathbf{l}$$
Incoming Radiance, ray casting function $r(\mathbf{p}, \mathbf{l})$
$$L_i(\mathbf{p}, \mathbf{l}) = L_o(r(\mathbf{p}, \mathbf{l}), -\mathbf{l})$$


> The z-buffer computes it for rays cast from the eye into the scene
> 
> An important property of the rendering equation is that it is linear with respect to the emitted lighting.
> 
> Primitives are processed and rasterized independently, after which they are discarded. Results of the lighting calculations at point a cannot be accessed when performing calculations at point b.
> 
> Transparency, reflections, and shadows are examples of global illumination algorithms. They use information from other objects than the one being illuminated. These effects contribute greatly to increasing the realism in a rendered image, and provide cues that help the viewer to understand spatial relationships. At the same time, they are also complex to simulate and might require precomputations or rendering multiple passes that compute some intermediate information.
> 
> “glossy,” meaning shiny but not mirror-like
> 
> A basic z-buffer is L(D|S)E, or equivalently, LDE|LSE.
> 
> a (distant) specular or diffuse surface that was rendered into the environment map. So, there is an additional potential path: ((S|D)?S|D)E.
> 
> to simplify and to precompute

渲染方程里的使用到了raycasting表示，光栅化的z-buffer就是计算从相机出发的光线投射。渲染方程是线性的，入射加倍，着色也会加倍；材质对光线的响应是彼此独立的。光栅化中图元之间的处理和光栅化都是独立的，a点的光照计算结果，无法被b点的光照计算过程访问到，这也是全局光照在光栅化实现中的困境。

glossy，表示shiny但并不镜面的材质表面。

渲染方程可以表达为光路路径的正则表达式形式，$L(D|S)^{*} E$可以直接概况渲染方程的过程。一次z-buffer的光栅化过程，可以表示为$L(D|S)E$。`environment map`是（远处）的表面被渲染的结果，结合渲染引擎里envmap的生成方式，就是周围6个面的景色（直接光照），记录了光线路径的第二次弹射，所以看来envmap是廉价且高效的全局光照方式。考虑envmap的光路表达是，$L((S|D)?S|D)?E$。

全局光照的实现和研究，主要有两个策略，简化和预计算。举个例子，简化：除开光线最后进入相机的那次弹射，其余的弹射都是diffuse的；预计算：使用离线方法把inter-object直接的信息预计算下来；lightmap是bake过程，同时使用了这两个策略。

## 11.5 Diffuse Global Illumination

### 11.5.4 Storage Methods



# 20. Efficient Shading

## 20.2 Decal Rendering