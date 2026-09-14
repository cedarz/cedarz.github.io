---
title: mipmap level
date: 2026-09-10 14:11:37
categories:
- Computer Graphics
- Rasterization
tags: 
- Computer Graphics
- Rasterization
---

GPU 决定 Mipmap 层级（Level of Detail, 简称 LOD）的核心逻辑是：计算纹理坐标在屏幕空间中的最大变化率，然后通过对数运算将其映射到对应的 Mipmap 层级。

## OpenGL Mipmap

![](/images/mipmap-level/mip_uvw.png)

**Note** rectangle texture是指TEXTURE_RECTANGLE，使用的是texel的坐标。
![](/images/mipmap-level/mipmap.png)

下面是anisotropic filter的技术细节：
![](/images/mipmap-level/mipmap_aniso.png)

anisotropic filtering会采样多次求平均值：
![](/images/mipmap-level/mipmap_aniso_sample.png)

## Mipmap Level 的计算

现在只考虑2D纹理的情形，使用$x$和$y$两个坐标方向，对应的纹理坐标为 $(u, v)$。

### 计算偏导数（变化率）
GPU会在$2 \times 2$的像素块（Pixel Quad）中，通过硬件差分计算出四个偏导数：

* $\frac{\partial u}{\partial x}$ (ddx(u)) 和 $\frac{\partial v}{\partial x}$ (ddx(v))：沿屏幕 $x$ 轴每移动一个像素，纹理坐标 $u, v$ 的变化量。
* $\frac{\partial u}{\partial y}$ (ddy(u)) 和 $\frac{\partial v}{\partial y}$ (ddy(v))：沿屏幕 $y$ 轴每移动一个像素，纹理坐标 $u, v$ 的变化量。

### 屏幕像素映射到纹理空间
屏幕像素在纹理空间中对应的两个向量的长度：
$$L_x = \sqrt{\left(\frac{\partial u}{\partial x} \cdot W\right)^2 + \left(\frac{\partial v}{\partial x} \cdot H\right)^2}$$ 
$$L_y = \sqrt{\left(\frac{\partial u}{\partial y} \cdot W\right)^2 + \left(\frac{\partial v}{\partial y} \cdot H\right)^2}$$ 
$W$和$H$分别是纹理贴图的宽度和高度。将UV坐标（0到1）转换到纹理像素（Texel）单位。
以上计算在硬件实现中并不现实，GPU实际会采用如下近似：
$$L_x \approx \max\left(\left\vert{}\frac{\partial u}{\partial x} \cdot W\right\vert{}, \left\vert{}\frac{\partial v}{\partial x} \cdot H\right\vert{}\right)$$

### 计算最大变化率 $\rho$
在各向同性（Isotropic）Mipmap 中，GPU 会选择这两个方向中变化最剧烈（最粗糙）的方向来决定层级，以防止走样：
$$\rho = \max(L_x, L_y)$$ 

对应层级：
$$d = \log_2(\rho)$$ 

* 如果 $d \le 0$：说明屏幕像素比纹理像素还要小（即超高动态细节/特写），直接使用 Mipmap Level 0（原图）。
* 如果 $d > 0$：$d$ 的浮点数值就是理想的层级。
* 点滤波（Nearest）：直接对 $d$ 进行四舍五入 round(d)，取最接近的整数层级。
* 线性滤波（Linear）：下取整 $\lfloor d \rfloor$ 和上取整 $\lceil d \rceil$ 得到相邻的两层，根据 $d$ 的小数部分在这两层之间进行线性插值。

## 各向异性

### 各向同性Mipmap 的局限性
假设屏幕像素在纹理空间中映射的区域是一个正方形（缩放一致），当表面相对于摄像机发生严重倾斜（例如远处的地面、墙面）时，屏幕像素在纹理空间中映射的实际是一个长条状的椭圆形（矩形）。

* 此时，假设 $L_x$ 很大（纵深方向变化剧烈），$L_y$ 很小（横向变化平缓）。
* 一般公式取 $\rho = \max(L_x, L_y)$，导致 GPU 选了一个非常模糊的高层 Mipmap。
* 结果导致纵深方向不走样了，但横向过度模糊（ Over-blurring）。

### 各向异性的处理方式
各向异性过滤允许屏幕像素在纹理空间中映射一个非正方形的区域。

   1. 计算各向异性比例（Anisotropy Ratio）：
   GPU 依然计算 $L_x$ 和 $L_y$，并找出最大和最小值：
   $$\rho_{max} = \max(L_x, L_y), \quad \rho_{min} = \min(L_x, L_y)$$ 
   各向异性比例定义为：
   $$\eta = \frac{\rho_{max}}{\rho_{min}}$$ 
   2. 最大各向异性度（Max Anisotropy）， OpenGL的GL_TEXTURE_MAX_ANISOTROPY：
   比如游戏设置中的2x, 4x, 8x, 16x 就是限制这个比例的上限 $N$：
   $$\eta' = \min(\eta, N)$$ 
   3. 计算 Mipmap Level：
   各向异性过滤不再依据最大步长 $\rho_{max}$ 决定层级，而是根据压缩后的长轴或短轴来选择一个更清晰（更低层）的 Mipmap：
   $$\rho_{new} = \frac{\rho_{max}}{\eta'}$$ 
   $$d_{aniso} = \log_2(\rho_{new})$$ 
   注：当 $\eta \le N$ 时，$\rho_{new} = \rho_{min}$。这意味着 GPU 会选择最清晰的那层 Mipmap（短轴方向），从而保留了更清晰的纹理。
   <!-- 4. 多点采样（椭圆加权平均 EWA）：
   因为选取的 Mipmap 层级对于长轴方向来说太清晰了，如果只采一个点就会发生走样。
   因此，GPU 会沿着长轴的方向（即导数较大的方向），在更清晰的 Mipmap 层级上连续采集 $\eta'$ 个样本，并进行平均混合。 -->
   4. 多点采样，在mipmap level中采样$N$个位置求平均值

## 导数和分支

ddx和ddy依赖于2x2像素块之间的协同计算，本质是线程之间的寄存器数据跨线程交换。纹理采样操作Sample()时，背后的硬件会自动计算了uv的ddx和ddy并传入了采样器。如果把普通的 Sample() 放在if条件分支或loop循环中，偏导数计算会失败，进而影响mipmap level的计算导致采样问题。

UV的ddx和ddy依赖相邻像素的UV坐标，如果相邻线程走不同分支，会导致导数计算出问题。
- 硬件的执行掩码（Execution Mask）控制线程执行，如果满足分支，掩码为1，为激活状态；否则掩码为0，为挂起/待激活状态。如果相邻线程可能处于非激活状态，其寄存器接口可能会被硬件锁死/屏蔽
- if分支内部可能对uv进行了任意的二次修改（比如uv += offset;），如果相邻线程执行不同的分支，就没有执行这些修改指令。如果读相邻线程的寄存器数据，读到的要么是过时的旧数据，要么是硬件为了安全直接返回的0

解决方案：在分支、循环或顶点着色器中采样纹理时，必须使用显式指定导数的SampleGrad/textureGrad，或者直接指定LOD层级的 SampleLevel/textureLod。 

<!-- 如果你对这个过程在 Shader 中的具体表现感兴趣，我们可以进一步聊聊 tex2Dgrad (手动传入自定义偏导数) 的应用场景，比如如何解决不连续的 UV（如外包围盒、纹理图集 Atlas）导致的 Mipmap 闪烁黑边问题。 -->

## 参考
- [glspec46.core 8.14 Texture Minification](https://registry.khronos.org/OpenGL/specs/gl/glspec46.core.pdf)