---
title: Reflective Shadow Maps
date: 2026-03-12 09:30:52
mathjax: true
categories:
- Reading Notes
- RTR
tags: 
- Reading Notes
- RTR
---

- 方法
    - A reflective shadow map is an extension to a standard shadow map, where every pixel is considered as an indirect light source.
    - 一次bounce间接光照的粗糙近似
- survey
    - soft shadow方法
        - RSM都可以结合
    - Instant Radiosity
        - pass太多
    - ray tracing
        - 难做到高分辨率的交互/实时
- 算法
    - 公式 \
        $E_p(x,n) = \Phi_p \frac{\max\{0, \langle n_p | x - x_p \rangle\} \max\{0, \langle n | x_p - x \rangle\}}{\|x - x_p\|^4}$
    - reflective shadow map，from light view
        - depth
        - world-space position
        - normal
        - reflected flux
    - 光照计算
        - 采样shading位置周围的rsm像素，作为间接光照光源 \
            $\left(s + r_{\max} \xi_1 \sin(2\pi\xi_2),\ t + r_{\max} \xi_1 \cos(2\pi\xi_2)\right)$
        - screen space interpolation
            - 先渲染低分辨率的间接光照，然后在渲染完整分辨率的间接光照，如果着色点周围的低分辨率位置可用（世界坐标足够近），就使用低分辨率结果插值得到，否则，就通过完整的采样计算
- 局限
    - 只考虑diffuse 
    - 不考虑间接光照光源的遮挡关系
    - 着色点只考虑距离范围内的像素影响

- 细节
    - 次级光源的可视性，是通过发现和光线方向的cos判断的($\max\{0, \langle n | x_p - x \rangle\}$)，也就是文章里的`their normal points away from x`
 