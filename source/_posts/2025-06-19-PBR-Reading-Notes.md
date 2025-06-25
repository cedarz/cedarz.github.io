---
title: PBR Reading Notes
date: 2025-06-19 10:27:45
mathjax: true
categories:
- Reading Notes
tags: 
- Reading Notes
---

# 7. Sampling and Reconstruction

Radiance在胶平面上是连续函数，但是渲染的输出是离散的像素。

 But what happens when we need the value of s signal at a location that we didn’t sample at?  In such cases, we can use a process known as reconstruction to derive an approximation of the original continuous function. With this approximation we can then discretely sample its values at a new set of sample points, which is referred to as resampling.
[signal processing primer](https://therealmjp.github.io/posts/signal-processing-primer/)


## 7.1 Sampling Theory

the Fourier transform of a shah function with period $T$ is another shah function with period $1/T$. This reciprocal relationship between periods is important to keep in mind: it means that if the samples are farther apart in the spatial domain, they are closer together in the frequency domain.

- 7.1.4 Antialiasing Techniques

**NonUniform Sampling**
以前是在整数倍周期位置采样，现在在整数倍附近$\frac{1}{2}$周期的位置随机选择一个采样点。
  $$\sum_{i=-\infty}^{\infty}\delta(x-(i+\frac{1}{2}-\xi)T)$$

- 7.1.6 Sources of Aliasing in Rendering
1. 几何（Geometry aliasing）：模型边界（step function）、完美重建滤波器（sinc filter）应用到混叠采样（aliased samples，or 走样采样？，会产生振铃走样，ring artifacts，也叫Gibbs phenomenon）、特别小的物体（在两个采样之间，就会在动画的不同帧间出现消失的反复闪烁）
2. 着色（Shading aliasing）：贴图、材质、锐利的阴影（step function）
   
   {% img PBR-Reading-Notes/gibbs-phenomenon /images/PBR-Reading-Notes/gibbs-phenomenon.png %}

- 7.1.7 Understanding Pixels

1. Pixel是图像函数上的采样点，并不关联面积的概念。
2. 图像定义再离散坐标$(x,y)$上，采样函数定义在连续浮点型坐标$(x,y)$位置上，（这里的离散值应该是离散的序号，连续值是物理意义的位置，可以映射，但是不能等同）。可以使用不同的映射，1）取整到最近的整数，即离散点正好落在整数位置上，2）向下取整，即离散点落在整数点距离0.5的位置。