---
title: PBR Reading Notes
date: 2025-06-19 10:27:45
categories:
- Reading Notes
tags: 
- Reading Notes
---

# 7. Sampling and Reconstruction

Radiance在胶平面上是连续函数，但是渲染的输出是离散的像素。

 But what happens when we need the value of s signal at a location that we didn’t sample at?  In such cases, we can use a process known as reconstruction to derive an approximation of the original continuous function. With this approximation we can then discretely sample its values at a new set of sample points, which is referred to as resampling
[signal processing primer](https://therealmjp.github.io/posts/signal-processing-primer/)