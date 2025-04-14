---
title: Compare Mode in OpenGL Sampler
date: 2025-04-14 10:41:15
- Computer Graphics
- OpenGL
tags: 
- Computer Graphics
- OpenGL
---

OpenGL虽然简单，但是问题也是公认的多，不同驱动实现的表现可能差异很大，导致同样的OpenGL的代码，在一台机器上正常执行，在另外一台机器上表现异常。

我这就遇到一个，采样`GL_DEPTH_COMPONENT`类型的depth texture，全屏显示到窗口。同样是GL4.6 core profile的上下文，在RTX4080上没问题，但是在笔记本ThinkPad P50（显卡NVIDIA Quadro M1000M）上结果全白色（1.0），当然P50确实太老了，10年老机了，妥妥的电子垃圾了。

可是，奈何啊，“同样是生活一起的两口子，做人的差别咋这么大咧？”。

最后查到，还是代码的问题。我用的代码，一部分是从网上各处抄的，有些失察；另外，虽然我对OpenGL比较熟悉，但是还是有很多细节问题没怎么用过。现在的很多系统都在拥抱更现代的渲染API，OpenGL不仅落后于同时代的同侪，更落后于历史的车轮，可是还是有很多古老的系统因为跨平台的考虑在使用OpenGL，吐槽归吐槽，这砖该搬还得搬啊。

书归正传，回到正题。

glTextureParameteri(m_handle, GL_TEXTURE_COMPARE_MODE, GL_COMPARE_REF_TO_TEXTURE);
glTextureParameteri(m_handle, GL_TEXTURE_COMPARE_FUNC, GL_LEQUAL);


- [Sampler Object Comparison Mode](https://www.khronos.org/opengl/wiki/sampler_Object#Comparison_mode)
- [opengl framebuffer depth texture not working](https://stackoverflow.com/questions/22919583/opengl-framebuffer-depth-texture-not-working)
- [glsl sampler2DShadow and shadow2D clarification](https://stackoverflow.com/questions/22419682/glsl-sampler2dshadow-and-shadow2d-clarification/22426507#22426507)
- [Opengl shadow acne when using shadow2D](https://stackoverflow.com/questions/19516538/opengl-shadow-acne-when-using-shadow2d)