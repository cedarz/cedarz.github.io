---
title: mediapipe人脸关键点序列
date: 2025-08-13 15:40:40
categories:
- Development
- Python
tags: 
- Development
- Python
---

# MediaPipe人脸关键点指南

**人脸关键点的数量**

根据Claude-Sonnet-4的介绍，标准版本是468个，优化版本是478个，添加左右眼虹膜关键点。看下面的关键点参考图能看到，虹膜关键点的起始序号正好是468。
> 478个关键点是MediaPipe Face Mesh的最新升级版本的结果（通常称为 Refined Mesh Model）。相比于标准的468个关键点版本，新增的10个关键点主要分布在 虹膜（瞳孔）区域，用于更精确地描述眼睛的几何形状和运动。



MediaPipe人脸关键点都在这张图里，密密麻麻，想不想街边看到的有些门店摆出来的穴位图。大图可看这里[传送门](https://storage.googleapis.com/mediapipe-assets/documentation/mediapipe_face_landmark_fullsize.png)。
{% img PBR-Reading-Notes/7.2.discrepancy /images/mediapipe人脸关键点序列/face_landmarker_keypoints.png %}

有没有发现一个问题，大图上关键点的序号层层叠叠，无法很好分辨具体的序号。

**关键点的序号**

搜索了一圈，也就[keypoints.ts](https://github.com/tensorflow/tfjs-models/blob/838611c02f51159afdd77469ce67f0e26b7bbb23/face-landmarks-detection/src/mediapipe-facemesh/keypoints.ts)是记录的比较准确的，但是还不够完整，比如我想获取完整嘴唇部位的关键点序列，一共有80个4圈，但是这里只给了两圈轮廓。

好在[google-ai-edge/mediapipe](https://github.com/google-ai-edge/mediapipe)给了标准人脸的网格，能够藉以确定所有关键点的序列，再也不用吭哧吭哧到处查找或者盯着关键点图片人肉识别了。

贴一下嘴唇部位的所有关键点：

``` python
LIPS_KEYPOINTS = [
    61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291,      # lipsUpperOuter level 4
    61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,    # lipsLowerOuter level 4

    76, 184, 74, 73, 72, 11, 302, 303, 304, 408, 306,     # lipsUpperOuter level 3
    76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306,     # lipsLowerOuter level 3

    62, 183, 42, 41, 38, 12, 268, 271, 272, 407, 292,     # lipsUpperOuter level 2
    62, 96, 89, 179, 86, 15, 316, 403, 319, 325, 292,     # lipsLowerOuter level 2

    78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308,     # lipsUpperOuter level 1
    78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308,     # lipsLowerOuter level 1
]
```

# 参考

- [人脸特征点检测指南](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker?hl=zh-cn)
- [mediapipe canonical_face_model.obj](https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model.obj)