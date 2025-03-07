---
title: Bufferless rendering in OpenGL
date: 2025-03-07 11:24:05
categories:
- Computer Graphics
- OpenGL
tags: 
- Computer Graphics
- OpenGL
---

如果没记错的话，最初应该是在`OpenGL SuperBibile`里面看到的无Buffer的渲染方式，把三角形顶点数据写在`vertex shader`代码里，在shader里通过index取相应的数据，当时感觉平平无奇。后来在SaschaWillems的[Vulkan example](https://github.com/SaschaWillems/Vulkan)里看到更精简的写法，当时表示惊呆了，使用`gl_VertexIndex`来构造顶点数据，画一个覆盖屏幕的quad。

[Bufferless rendering in OpenGL](https://trass3r.github.io/coding/2019/09/11/bufferless-rendering.html)

``` glsl
#version 450

layout (location = 0) out vec2 outUV;

void main() 
{
	outUV = vec2((gl_VertexIndex << 1) & 2, gl_VertexIndex & 2);
	gl_Position = vec4(outUV * 2.0f - 1.0f, 0.0f, 1.0f);
}
```

# 参考
- [Bufferless rendering in OpenGL](https://trass3r.github.io/coding/2019/09/11/bufferless-rendering.html)
- [Quad rendering vertex shader](https://github.com/SaschaWillems/Vulkan/blob/master/shaders/glsl/deferred/deferred.vert)