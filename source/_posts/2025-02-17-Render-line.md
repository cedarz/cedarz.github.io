---
title: Render line
date: 2025-02-17 13:44:08
categories:
- Computer Graphics
- OpenGL
tags: 
- Computer Graphics
- OpenGL
---

# 渲染API对于线渲染的支持


|          | wireframe | line mode | line width |
|----------|---------|---------|----------------|
|  OpenGL  | glPolygonMode(GL_FRONT_AND_BACK, GL_LINE) | glDrawArrays: GL_LINES/GL_LINE_STRIP/GL_LINE_LOOP| glLineWidth |
| Vulkan   | VkPipelineRasterizationStateCreateInfo/VK_POLYGON_MODE_LINE |  VkPipelineInputAssemblyStateCreateInfo: VK_PRIMITIVE_TOPOLOGY_LINE_LIST/VK_PRIMITIVE_TOPOLOGY_LINE_STRIP | [vkCmdSetLineWidth](https://registry.khronos.org/vulkan/specs/latest/man/html/vkCmdSetLineWidth.html), VkPipelineRasterizationStateCreateInfo::lineWidth  |
|DirectX 11| D3D11_RASTERIZER_DESC/D3D11_FILL_WIREFRAME |  IASetPrimitiveTopology(D3D11_PRIMITIVE_TOPOLOGY_LINELIST)|   | 
|DirectX 12| D3D12_GRAPHICS_PIPELINE_STATE_DESC/D3D12_FILL_WIREFRAME |  D3D12_GRAPHICS_PIPELINE_STATE_DESC/D3D12_PRIMITIVE_TOPOLOGY_TYPE_LINE, IASetPrimitiveTopology(D3D12_PRIMITIVE_TOPOLOGY_LINELIST) |   |




glLineWidth的[文档](https://registry.khronos.org/OpenGL-Refpages/gl4/html/glLineWidth.xhtml)中说只保证宽度1的设置，其他宽度依赖硬件实现。
> Only width 1 is guaranteed to be supported; others depend on the implementation.

[glspec46.core#678 E.2.1 Deprecated But Still Supported Features](https://registry.khronos.org/OpenGL/specs/gl/glspec46.core.pdf)把glLineWidth设为Deprecated。` They may be removed from a future version of OpenGL, and are removed in a forward compatible context implementing the core profile`
> Widelines- LineWidthvalues greater than 1.0 will generate an INVALID_VALUE error.

Vulkan设置线宽度，如果VkPipelineDynamicStateCreateInfo::pDynamicStates设置了VK_DYNAMIC_STATE_LINE_WIDTH，则使用[vkCmdSetLineWidth](https://registry.khronos.org/vulkan/specs/latest/man/html/vkCmdSetLineWidth.html)设置后续的线渲染宽度；否则通过VkPipelineRasterizationStateCreateInfo::lineWidth创建pipeline时设置。如果设置非1.0的宽度，依赖硬件的支持，需要查询硬件是否支持VkphysicalDeviceFeatures::wideLines特性，可以通过[GPUinfo](https://vulkan.gpuinfo.org/listdevices.php)查询。
> If the wideLines feature is not enabled, lineWidth must be 1.0

DX11/12都没有明确的API和数据结构支持wide line的渲染。只发现[Line Drawing Support in D3DX (Direct3D 9)](https://learn.microsoft.com/en-us/windows/win32/direct3d9/line-drawing-support-in-d3dx)中描述了基于上古D3D9封装的ID3DXLine通过textured polygons来模拟线宽模式设置。

基于我在本地平台测试，在Nvidia GeForce RTX 4080 Super显卡上，~~glLineWidth无效~~，后来发现其实在我的平台上glLineWidth是有效的，主要是因为设置了`glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GLFW_TRUE)`，GLFW_OPENGL_FORWARD_COMPAT导致OpenGL上下文是向前兼容模式，效果就是移除Deprecated的API，glLineWidth就是其中一个(4.6 Deprecated); Vulkan通过VkPipelineRasterizationStateCreateInfo::lineWidth设置宽度有效，且有相应的上限值。在网络上线宽设置无效的技术贴早已有之，比如[glLineWidth and glLineStipple sustainability](https://forums.developer.nvidia.com/t/gllinewidth-and-gllinestipple-sustainability/71654), [glLineWidth - doesn’t work !](https://community.khronos.org/t/gllinewidth-doesnt-work/14052), [Line_width not working in Vulkan](https://stackoverflow.com/questions/44665007/line-width-not-working-in-vulkan)都有涉及。
> On my hardware, lines are always 1 pixel large, whatever the parameters are, for many years now. Create polygons for larger lines is the solution that will always work.

可见，虽然各家API各异，但是在线渲染宽度上基本一致，完全取决于驱动的实现和硬件的能力。在一般情况下，即便API给出了设置的接口，却并不能十足相信其能够work，最稳妥的方法，还是通过对线段顶点进行四边形扩展来实现宽线段的渲染。

# 如何渲染线

关于线的渲染，如果显卡具备相应的功能，并且API也支持，那当然万事大吉、探囊取物了；但是，问题就出在这个但是，如果不凑巧，您当前的显卡和开发环境不允许，或者您的代码需要跨平台，可能就需要更稳妥的方案了。其实也没有多少方案，唯`四边形扩展`一种尔，既稳妥又好用。真是越朴实简易的东西，越能穿越时间，历久弥坚，真正是重剑无锋大巧不工，大道至简。

**线的宽度**

关于线的宽度，要以什么单位去计量？很直观的结论就是，在屏幕空间，以像素计。我觉得有两点理由：1）线理论上是没有宽度的，如果在模型空间给线一个宽度，经过透视投影之后，有近大远小，这就很奇怪；2）线的光栅化，首先把两个点变换到屏幕空间，然后再对两个点之间线条进行光栅化，这个光栅化的结果很自然就是一个像素宽度的片元序列（如果线平行于坐标轴），所以某些API和硬件默认只能光栅化1个像素宽度的线也就不足为奇了。

**线宽算法**

知道了线宽的单位是屏幕空间像素计量之后，使用`quad polygon`把线扩展成两个三角形的方法就比较明显了，也即不管以任何方法在屏幕空间把线段的两个顶点扩展成4个顶点，这个过程可以在CPU里计算，也可以在GPU的`VS`、`GS`等多中方法计算。如果在`VS`计算，输出的坐标是`clip space`裁剪空间坐标，而我们扩展顶点坐标是在屏幕空间，所以涉及坐标变换的具体实现了。

`quad`的生成[算法](https://github.com/mhalber/Lines?tab=readme-ov-file#methods)如下：
> 1. Transform line segment end points p and q to normalized device space. At this point we work in 2D space, regardless of whether original line was specified as 2D or 3D line.
2. Calculate direction d, corrected for viewport aspect ratio.
3. Calculate unit normal vector n = {-d.y, d.x}
4. Modulate n by approperiate line widths to get vectors n_a and n_b
5. Create quad points a = p + n_a, b = p - n_a, c = q + n_b, d = q - n_b
6. Move points a, b, c, d back to clip space and pass them down the rasterization pipeline


# 抗锯齿


# 参考

- [glDrawArrays](https://registry.khronos.org/OpenGL-Refpages/gl4/html/glDrawArrays.xhtml)
- [Line_width not working in Vulkan](https://stackoverflow.com/questions/44665007/line-width-not-working-in-vulkan)
- [lines](https://github.com/mhalber/Lines)




