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
|  OpenGL  | glPolygonMode(GL_FRONT_AND_BACK, GL_LINE) | GL_LINES[^1] | glLineWidth |
| Vulkan   | VkPipelineRasterizationStateCreateInfo/VK_POLYGON_MODE_LINE |  VkPipelineInputAssemblyStateCreateInfo[^2] | [vkCmdSetLineWidth](https://registry.khronos.org/vulkan/specs/latest/man/html/vkCmdSetLineWidth.html), VkPipelineRasterizationStateCreateInfo::lineWidth  |
|DirectX 11| D3D11_RASTERIZER_DESC/D3D11_FILL_WIREFRAME |  IASetPrimitiveTopology(D3D11_PRIMITIVE_TOPOLOGY_LINELIST)|   | 
|DirectX 12| D3D12_GRAPHICS_PIPELINE_STATE_DESC/D3D12_FILL_WIREFRAME |  D3D12_GRAPHICS_PIPELINE_STATE_DESC/D3D12_PRIMITIVE_TOPOLOGY_TYPE_LINE, IASetPrimitiveTopology(D3D12_PRIMITIVE_TOPOLOGY_LINELIST) |   |





glLineWidth的[文档](https://registry.khronos.org/OpenGL-Refpages/gl4/html/glLineWidth.xhtml)中说只保证宽度1的设置，其他宽度依赖硬件实现。
> Only width 1 is guaranteed to be supported; others depend on the implementation.
[glspec46.core#678](https://registry.khronos.org/OpenGL/specs/gl/glspec46.core.pdf)把glLineWidth设为Deprecated。
> Widelines- LineWidthvalues greater than 1.0 will generate an INVALID_VALUE error.


# 如何渲染线


# 抗锯齿


# 参考

- [glDrawArrays](https://registry.khronos.org/OpenGL-Refpages/gl4/html/glDrawArrays.xhtml)




[^1]: glDrawArrays(GL_LINES/GL_LINE_STRIP/GL_LINE_LOOP)
[^2]: VkPipelineInputAssemblyStateCreateInfo: VK_PRIMITIVE_TOPOLOGY_LINE_LIST/VK_PRIMITIVE_TOPOLOGY_LINE_STRIP
