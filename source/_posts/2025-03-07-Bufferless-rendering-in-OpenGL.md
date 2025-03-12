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

# Quad with Bufferless rendering
如果没记错的话，最初应该是在`OpenGL SuperBibile`里面看到的无Buffer的渲染方式，把三角形顶点数据写在`vertex shader`代码里，在shader里通过index取相应的数据，当时感觉平平无奇。后来在SaschaWillems的[Vulkan example](https://github.com/SaschaWillems/Vulkan)里看到更精简的写法，当时表示惊呆了，使用`gl_VertexIndex`来构造顶点数据，画一个覆盖屏幕的quad。下面就是`Vulkan example`的实现。其中`vkCmdDrawIndexed`对应`gl_VertexIndex`, `vkCmdDraw`对应`gl_VertexID`；我是在GL环境下，则是`glDrawElements`对应`gl_VertexIndex`, `glDrawArrays`对应`gl_VertexID`。


``` glsl
#version 450

layout (location = 0) out vec2 outUV;

void main() 
{
	outUV = vec2((gl_VertexIndex << 1) & 2, gl_VertexIndex & 2);
	gl_Position = vec4(outUV * 2.0f - 1.0f, 0.0f, 1.0f);
}
```

就是构造这么一个三角形：
{% img fullscreentriangle /images/2025-03-07-Bufferless-rendering-in-OpenGL/fullscreentriangle.png 400 400 fullscreentriangle fullscreentriangle %}

# with or without VAO?

具体实现的时候，遇到了这个问题，在GL4.6 core profile下，没有vao无法将结果渲染到屏幕上，有趣的是，使用renderdoc截帧的时候，却能够截取到渲染的结果。具体的细节不知道，但是总结使用，在`core profile`下，必须要有vao绑定；在`compatibility profile`下，不需要vao直接glDraw即可。


搜索了一下，正好法线[Bufferless rendering in OpenGL](https://trass3r.github.io/coding/2019/09/11/bufferless-rendering.html)涉及了这个问题，摘抄一下。

> A non-zero Vertex Array Object must be bound (though no arrays have to be enabled, so it can be a freshly-created vertex array object).[<sup>Vertex_Rendering</sup>](https://www.khronos.org/opengl/wiki/Vertex_Rendering#Prerequisites)

> The compatibility OpenGL profile makes VAO object 0 a default object. The core OpenGL profile makes VAO object 0 not an object at all. So if VAO 0 is bound in the core profile, you should not call any function that modifies VAO state. This includes binding the GL_ELEMENT_ARRAY_BUFFER with glBindBuffer.[<sup>Vertex_Specification</sup>](https://www.khronos.org/opengl/wiki/Vertex_Specification#Vertex_Array_Object)

所以，使用GL的`core profile`做`bufferless rendering`时，使用一个空的(dummy)vao绑定一下，才能让`glDraw*`命令生效。

# 参考
- [Bufferless rendering in OpenGL](https://trass3r.github.io/coding/2019/09/11/bufferless-rendering.html)
- [Quad rendering vertex shader](https://github.com/SaschaWillems/Vulkan/blob/master/shaders/glsl/deferred/deferred.vert)
- [Vertex_Rendering](https://www.khronos.org/opengl/wiki/Vertex_Rendering#Prerequisites)
- [Vertex_Specification VAO](https://www.khronos.org/opengl/wiki/Vertex_Specification#Vertex_Array_Object)
