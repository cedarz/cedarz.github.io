---
title: Reservoir sampling
date: 2025-11-25 09:54:08
mathjax: true
categories:
- Computer Graphics
- BRDF
tags: 
- Computer Graphics
- BRDF
---


蓄水池抽样作为一类随机采样方法，是为了解决从$N$的样本流中随机选取$k$个样本的问题。通常$N$未知或很大，无法一次性将样本装载到内存，而是以stream的方式读取。

# Reservoir sampling

证明
$$\begin{align*}
&P_n \prod_{k=n+1}^{N} (1-P_k)  \\
= &\frac{1}{n} \prod_{k=n+1}^{N} (1-\frac{1}{k}) \\
= &\frac{1}{n} \prod_{k=n+1}^{N} \frac{k-1}{k} \\
= &\frac{1}{n} \frac{n}{n+1} \frac{n+1}{n+2} \cdots \frac{N-1}{N} \\
= &\frac{1}{N}
\end{align*}$$

$$\begin{align*}
&P_n \prod_{j=n+1}^{N} (1-\frac{P_j}{k}) \\
= &\frac{k}{n} \prod_{j=n+1}^{N} (1-\frac{k}{kj}) \\
= &\frac{k}{n} \prod_{j=n+1}^{N} \frac{j-1}{j} \\
= &\frac{k}{n} \frac{n}{n+1} \frac{n+1}{n+2} \cdots \frac{N-1}{N} \\
= &\frac{k}{N}
\end{align*}$$

# Weighted Reservoir sampling

# 参考
- [reservoir sampling](https://xlinux.nist.gov/dads/HTML/reservoirSampling.html)
- [蓄水池抽样](https://zh.wikipedia.org/wiki/水塘抽樣)