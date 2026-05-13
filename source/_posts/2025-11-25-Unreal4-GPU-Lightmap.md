---
title: 'Unreal4: GPU Lightmap'
date: 2025-11-25 09:18:21
mathjax: true
categories:
- Computer Graphics
- Unreal4
tags: 
- Computer Graphics
- Unreal4
---

UE4通过ightmapPathTracing.usf实现静态物体的lightmap烘焙。lightmap是把模型表面的光照情况预计算并缓存起来的一张贴图，首先讲模型表面展开到uv空间且不能uv覆盖，因为平常的uv贴图可以复用，但是模型上每一个点的光照情况可能都不一样；然后，对lightmap texel对应的模型表面点，做光照的半球积分。

## lightmap的材质限定

Lightmap本质上存储的是表面的入射辐照度（irradiance），它隐含的假设是最终着色时该表面以 Lambertian 漫反射来使用这份光照数据，运行时乘以 diffuse albedo 得到出射颜色。UE4 lightmass在烘焙lightmap时，在计算间接光弹射时，所有中间弹射表面也被作为diffuse reflector处理，在中间弹射点做cosine-weighted半球采样，忽略材质的specular、roughness、metallic等属性，忽略特殊的光效，比如焦散（caustics，即 LSDE光照路径）。Lightmass 烘焙的整个光照传输链路中，每一次弹射都是diffuse的，Lightmass取Base Color作为弹射albedo，理论上金属化的表面（metallic = 1）在PBR中几乎没有diffuse分量，这样的处理可能会有不一致的问题。

Lightmap是view-independent的，因为它只记录一个光照数值（也可能是Directional lightmaps，记录一个direction map，用来使用normal map）。但是间接光路的计算只考虑diffuse，可能更多源自于对工程和收益的权衡。

- specular BRDF或glossy BRDF采样效率：按照brdf采样可能对不上实际光源，cosine半球采样可能效率差
- 焦散路径本质上不适合路径追踪的 gathering 方式：业界公认的高效做法是从光源出发的 photon mapping 或双向路径追踪（BDPT）
- Lightmap分辨率低：焦散、高光这种高频信息的存储
- 工程复杂度与收益不成正比

因此UE4中Lightmass的烘培是全diffuse处理，而specular部分则由运行时其他系统（Reflection Capture、SSR、Lumen 等）来实现。


## UE4 Lightmass光路和公式推导

- *直接光照* 对应bounce == 0, lightmaptexel的材质返回basecolor为1

``` c++
float3 LightContrib = PathThroughput * LightSample.RadianceOverPdf * MaterialEval.Weight * MaterialEval.Pdf;
```

``` c++
float OutPdf = NoL / PI * PdfAdjust;
float OutWeight = (OutPdf > 0.0f) ? (1.0f / OutPdf) : 0;
```

MaterialEval.Weight: $\frac{\pi}{\cos\theta}$ \
MaterialEval.Pdf: $\frac{\cos\theta}{\pi}$

$$\begin{align*}
LightContrib &= \frac{L_i}{pdf_L} \cdot \frac{\pi}{\cos\theta} \cdot \frac{\cos\theta}{\pi} \\
&= \frac{L_i}{pdf_L}
\end{align*}$$

直接光保存单独保存，然后输出的时候：
``` cpp
IrradianceAndSampleCount[TexelIndexInPool].rgb += float3(DirectLightingNEERadianceValue * TangentZ / PI);
```

*最终处理*：$LightContrib \cdot \frac{\cos\theta}{\pi} = \frac{L_i}{pdf_L} \cdot \frac{\cos\theta}{\pi}$


- *间接光照* 对应bounce != 0, 使用光路中间弹射点材质的basecolor，记作$R$

MaterialEval.Weight: $R$ \
MaterialEval.Pdf: $\frac{\cos\theta}{\pi}$

*NEE 采样光照*

$$\begin{align*}
LightContrib &= \frac{L_i}{pdf_L} \cdot R \cdot \frac{\cos\theta}{\pi} \\
&= \frac{L_i}{pdf_L} \cdot \frac{R}{\pi} \cdot \cos\theta \qquad \text{($\frac{R}{\pi}$为Lambert BRDF)}
\end{align*}$$

*Material 采样材质*

throughput的更新
``` cpp
float3 NextPathThroughput = PathThroughput * MaterialSample.Weight;
float3 LightContrib = PathThroughput * LightResult.Radiance;
```
$NextPathThroughput = PathThroughput \cdot R$ \
$LightContrib = PathThroughput \cdot R \cdot L_i $

推导过程：
$$\begin{align*}
LightContrib &= PathThroughput \cdot R \cdot L_i \\
&= PathThroughput \cdot \frac{R}{\pi} \cdot \frac{1}{pdf_{bsdf}} \cdot \cos\theta \\
&= PathThroughput \cdot \frac{R}{\pi} \cdot \frac{1}{\frac{\cos\theta}{\pi}} \cdot \cos\theta \\
&= PathThroughput \cdot R \cdot L_i
\end{align*}$$
符合渲染方程

``` c++
IrradianceAndSampleCount[TexelIndexInPool].rgb += float3(RadianceValue * TangentZ / PI);
```

*最终处理*：$LightContrib \cdot \frac{\cos\theta}{\pi} = \text{RadianceValue} \cdot \frac{\cos\theta}{\pi}$, 对齐bounce == 0时的处理，乘以$\frac{\cos\theta}{\pi}$

- 其他处理
  - 光照计算中的MIS，分别sample light和sample material的**Power Balance MIS**
  - RR：轮盘赌，是否提前结束光路

- 总结
  - ue4中的写法，把一些计算量给掰开，造成很大的阅读障碍，原因目测是为了NextPathThroughput计算的一致性和便利性，在bounce是否等于0时都使用同样的处理
  - 推导后的公式计算，都符合渲染方程的基本公式，并没有魔改内容。计算中因为材质问题，会引入概率计算，但并不偏离基础公式
  
- lightmass的diffuse interreflection积分算法

    $PathThroughput = 1.0$
    $L_d = \frac{\cos\theta}{\pi} \cdot (\frac{L_i}{pdf_L} + PathThroughput \cdot \frac{L_i}{pdf_L} \cdot \frac{R}{\pi} \cdot \cos\theta \cdot MIS_{NEE} + PathThroughput \cdot R \cdot L_i) \cdot MIS_{Material}$
    $PathThroughput = PathThroughput \cdot R$


<!-- UnrealEngine\Engine\Shaders\Private\RayTracing\RayTracingMaterialHitShaders.usf RAY_TRACING_ENTRY_CLOSEST_HIT(MaterialCHS, FPackedMaterialClosestHitPayload, PackedPayload, FDefaultAttributes, Attributes)-->
> UnrealEngine/Engine/Plugins/Experimental/GPULightmass/Shaders/Private/LightmapPathTracing.usf
> project/Saved/ShaderDebugInfo/PCD3D_SM5/Global/FLightmapPathTracingRGS/0/LightmapPathTracing.usf


## 参考

- [Unity Bakery: baking artifact free lightmaps](https://ndotl.wordpress.com/2018/08/29/baking-artifact-free-lightmaps/)
- [xatlas](https://github.com/jpcy/xatlas)
- [GPU Lightmass全局光照](https://dev.epicgames.com/documentation/unreal-engine/gpu-lightmass-global-illumination?application_version=4.27&lang=zh-CN)
- [Introducing Ray Tracing in Unreal Engine 4](https://developer.nvidia.com/blog/introducing-ray-tracing-in-unreal-engine-4/)
<!-- - [NvRTX unreal-engine](https://developer.nvidia.com/game-engines/unreal-engine/rtx-branch#access-nvrtx) -->