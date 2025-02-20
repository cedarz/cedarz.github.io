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

[glspec46.core#678](https://registry.khronos.org/OpenGL/specs/gl/glspec46.core.pdf)把glLineWidth设为Deprecated。
> Widelines- LineWidthvalues greater than 1.0 will generate an INVALID_VALUE error.

Vulkan设置线宽度，如果VkPipelineDynamicStateCreateInfo::pDynamicStates设置了VK_DYNAMIC_STATE_LINE_WIDTH，则使用[vkCmdSetLineWidth](https://registry.khronos.org/vulkan/specs/latest/man/html/vkCmdSetLineWidth.html)设置后续的线渲染宽度；否则通过VkPipelineRasterizationStateCreateInfo::lineWidth创建pipeline时设置。如果设置非1.0的宽度，依赖硬件的支持，需要查询硬件是否支持VkphysicalDeviceFeatures::wideLines特性，可以通过[GPUinfo](https://vulkan.gpuinfo.org/listdevices.php)查询。
> If the wideLines feature is not enabled, lineWidth must be 1.0

DX11/12都没有明确的API和数据结构支持wide line的渲染。只发现[Line Drawing Support in D3DX (Direct3D 9)](https://learn.microsoft.com/en-us/windows/win32/direct3d9/line-drawing-support-in-d3dx)中描述了基于上古D3D9封装的ID3DXLine通过textured polygons来模拟线宽模式设置。

基于我在本地平台测试，在Nvidia GeForce RTX 4080 Super显卡上，~~glLineWidth无效~~，后来发现其实在我的平台上glLineWidth是有效的，主要是因为设置了`glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GLFW_TRUE)`，GLFW_OPENGL_FORWARD_COMPAT导致OpenGL上下文是向前兼容模式，效果就是移除Deprecated的API，glLineWidth就是其中一个(4.6 Deprecated); Vulkan通过VkPipelineRasterizationStateCreateInfo::lineWidth设置宽度有效，且有相应的上限值。在网络上线宽设置无效的技术贴早已有之，比如[glLineWidth and glLineStipple sustainability](https://forums.developer.nvidia.com/t/gllinewidth-and-gllinestipple-sustainability/71654), [glLineWidth - doesn’t work !](https://community.khronos.org/t/gllinewidth-doesnt-work/14052), [Line_width not working in Vulkan](https://stackoverflow.com/questions/44665007/line-width-not-working-in-vulkan)都有涉及。
> On my hardware, lines are always 1 pixel large, whatever the parameters are, for many years now. Create polygons for larger lines is the solution that will always work.

可见，虽然各家API各异，但是在线渲染宽度上基本一致，完全取决于驱动的实现和硬件的能力。在一般情况下，即便API给出了设置的接口，却并不能十足相信其能够work，最稳妥的方法，还是通过对线段顶点进行四边形扩展来实现宽线段的渲染。

# 如何渲染线


# 抗锯齿


# 参考

- [glDrawArrays](https://registry.khronos.org/OpenGL-Refpages/gl4/html/glDrawArrays.xhtml)
- [Line_width not working in Vulkan](https://stackoverflow.com/questions/44665007/line-width-not-working-in-vulkan)




