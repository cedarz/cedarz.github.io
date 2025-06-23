---
title: Notes on Data Formats of Graphics APIs(2)
date: 2025-04-17 17:55:45
categories:
- Computer Graphics
- OpenGL
tags: 
- Computer Graphics
- OpenGL
---

# Pixel Data Internal Format
看一下`glTexImage2D`的函数签名，有三个参数比较费解，分别是`internalformat`、`format`和`type`。这三个参数相互配合，共同决定了OpenGL Texture数据的在GPU上的格式以及内存数据从CPU-〉GPU上传过程中如何被‘解析’。
``` c++
void glTexImage2D(GLenum target,
 	GLint level,
 	GLint internalformat,
 	GLsizei width,
 	GLsizei height,
 	GLint border,
 	GLenum format,
 	GLenum type,
 	const void * data);
```
[Difference between format and internalformat](https://stackoverflow.com/questions/34497195/difference-between-format-and-internalformat)中说的很直截了当，`internalFormat`决定GPU，`format/type`决定CPU数据。
> The `format` (7th argument), together with the `type` argument, describes the data you pass in as the last argument. So the `format/type` combination defines the memory layout of the data you pass in.
> `internalFormat` (2nd argument) defines the format that OpenGL should use to store the data internally.


这个描述是否让你觉得，如果`data`参数为null，`format/type`就不需要设置，或者随意设置了，答案是否定的。 对于`glTexImage2D`来说，不管`data`参数是否为null，`internalFormat`和`format/type`一定要是兼容的组合。

> **Note** Even if data is NULL, the format and type fields must be legal fields, or the entire call will fail with a GL_INVALID_ENUM error.[<sup>Texture_Storage</sup>](https://www.khronos.org/opengl/wiki/Texture_Storage)


`glTexImage2D`做了两件事情，分配显存，并上传数据，所以需要格式的兼容，这个显存分配过程也被称作`Mutable Storage`。 还有一组`Immutable Storage`的分配方式，把`glTexImage2D`的分配显存和上传数据的两个过程分开，如此，在某些情况下（比如Texture as RT），可以不关心`format/type`的设置了。
``` c++
void glTexStorage2D( GLenum target​, GLint levels​, GLint internalformat​, GLsizei width​, GLsizei height​ );
void glTexSubImage2D(GLenum target​, GLint level​, GLint xoffset​, GLint yoffset​, GLsizei width​, GLsizei height​, GLenum format​, GLenum type​, const GLvoid * data​);
```

# Pixel Data格式的兼容

`internalFormat`和`format/type`，首先确定`internalFormat`，然后根据实际情况确定与其兼容的`format/type`，类型的兼容只是最低要求，如果没有正确设置这三个参数，数据在上传的时候，会有类型转换，那你精心组织的数据，可能就要以其他面目呈现给GL了。

举个例子：参考下面的格式语法，如果你想要4通道每个通道都是浮点型的格式，设置`internalFormat`为`GL_RGBA`，`format/type`为`GL_RGBA/GL_FLOAT`。`GL_RGBA`表示`unsigned normalized integer format`，且每格通道8位，也就是8位无符号归一化整型，如此，`GL_FLOAT`则会类型转换到`8 bit unsigned normalized integer`。

再举个例子：`internalFormat`为`GL_R32UI`、`type`就是`GL_UNSIGNED_INT`了，那么`format`就决定了数据初始化了，如果是`GL_RED`,会把输入作为定点数归一化到[0, 1], 正确的格式应该是`GL_RED_INTEGER`。
> GL_RED
>     Each element is a single red component. For fixed point normalized components, the GL converts it to floating point, clamps to the range [0,1], and assembles it into an RGBA element by attaching 0.0 for green and blue, and 1.0 for alpha.[<sup>es3.0 glTexImage2D</sup>](https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage2D.xhtml)

另外，整型类型的Texture，不能设置为`linear filtering`即`GL_LINEAR`，只能设置为`GL_NEAREST`或者`GL_NEAREST_MIPMAP_NEAREST`。

<!-- ![Notes-on-Data-Formats-of-Graphics-APIs/color_format_syntax](../images/Notes-on-Data-Formats-of-Graphics-APIs/color_format_syntax.jpeg) -->
{% img Notes-on-Data-Formats-of-Graphics-APIs/color_format_syntax /images/Notes-on-Data-Formats-of-Graphics-APIs/color_format_syntax.jpeg %}


# Pixel Formats Cheatsheets
[es3.0 glTexImage2D Table 2. Sized Internal Formats](https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage2D.xhtml)
[gl_texture_format_util.hpp](https://gist.github.com/alexsr/034bb802ae43a1adb0863b735fda0ab9)
[OpenGL image formats](https://gist.github.com/Kos/4739337)


# 参考
- [Color Formats](https://www.khronos.org/opengl/wiki/Image_Format#Color_formats)
- [Normalized_Integer](https://www.khronos.org/opengl/wiki/Normalized_Integer)
- [gl_texture_format_util.hpp](https://gist.github.com/alexsr/034bb802ae43a1adb0863b735fda0ab9)
- [OpenGL image formats](https://gist.github.com/Kos/4739337)
- [Difference between format and internalformat](https://stackoverflow.com/questions/34497195/difference-between-format-and-internalformat)
- OpenGL formats Equivalent in Vulkan [<u>1</u>](https://chromium.googlesource.com/external/github.com/KhronosGroup/OpenXR-SDK/+/9d9ae386adf791576a839ceb733cc577224b7985/external/include/vulkan/vk_format.h) [<u>2</u>](https://github.com/KhronosGroup/Vulkan-Samples-Deprecated/blob/master/external/include/vulkan/vk_format.h)
- [gl_format.h](https://github.com/KhronosGroup/Vulkan-Samples-Deprecated/blob/master/external/include/GL/gl_format.h)，可以参考一下，有错误，比如`GL_R32UI`对应`GL_RED`
