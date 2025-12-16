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

## 11.5 Diffuse Global Illumination

### 11.5.4 Storage Methods



# 20. Efficient Shading

## 20.2 Decal Rendering