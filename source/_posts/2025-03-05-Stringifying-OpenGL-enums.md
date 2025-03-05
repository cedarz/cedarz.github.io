---
title: Stringifying OpenGL enums
date: 2025-03-05 15:54:25
categories:
- Computer Graphics
- OpenGL
tags: 
- Computer Graphics
- OpenGL
---

# Vulkan枚举值的字符串化

`Vulkan`中的枚举值都做了很好的枚举类型管理，依然是C类型的枚举，具有全局符号可见；虽然不似`C++ enum class`有严格的命名空间访问机制，但是仍然具备相应的命名空间。这为`Vulkan`枚举值的字符串转换提供了方便，[`VulkanSDK`](https://vulkan.lunarg.com/sdk/home)的`vk_enum_string_helper.h`给出了官方实现。

以`VkImageType`为例，
``` c
// Provided by VK_VERSION_1_0
typedef enum VkImageType {
    VK_IMAGE_TYPE_1D = 0,
    VK_IMAGE_TYPE_2D = 1,
    VK_IMAGE_TYPE_3D = 2,
} VkImageType;
```

其对应的字符串转化实现为，函数签名为`string_` + 具体的枚举类型，
``` c
static inline const char* string_VkImageType(VkImageType input_value) {
    switch (input_value) {
        case VK_IMAGE_TYPE_1D:
            return "VK_IMAGE_TYPE_1D";
        case VK_IMAGE_TYPE_2D:
            return "VK_IMAGE_TYPE_2D";
        case VK_IMAGE_TYPE_3D:
            return "VK_IMAGE_TYPE_3D";
        default:
            return "Unhandled VkImageType";
    }
}
```

# OpenGL枚举值的字符串化

`OpenGL`如果想做同样的工作，则面临大不相同的境遇。

{% blockquote Stringifying OpenGL enums https://stackoverflow.com/questions/4708202/stringifying-opengl-enums %}
 different enum names may have the same hexadecimal values in OpenGL (especially if you consider the extensions) - a switch will refuse to compile because of ambiguities
{% endblockquote %}

以`Khronos`官方给出的[GL/glcorearb.h](https://github.com/KhronosGroup/OpenGL-Registry/blob/main/api/GL/glcorearb.h)观察，对比`Vulkan`的枚举值，`OpenGL`的枚举值有几个问题：
1. 所有枚举值都是`#define`定义的宏
2. 枚举值没有命名空间（枚举类型）
3. 即使不考虑扩展，都存在不同枚举值对应同一个十六进制常量
4. 类型不是统一的
``` c
typedef unsigned int GLenum;
#define GL_TIMEOUT_IGNORED 0xFFFFFFFFFFFFFFFF
#define GL_INVALID_INDEX 0xFFFFFFFF
```

# 脚本生成`gl_enum_string_helper.h`

为了简单的生成OpenGL枚举值的字符串化字符串转换函数，做了一些简化：
1. 不考虑扩展枚举值
2. 合并数值相同的枚举值，在`switch`实现中只保留一个枚举值
3. 对`0xFFFFFFFF`、`0xFFFFFFFFFFFFFFFF`这种，单独处理
   
最终，完成了自动化生成`OpenGL`枚举值字符串化的头文件。
{% include_code glenum.py lang:python glenum.py %}

# 参考
- [vk_enum_string_helper.h](https://github.com/KhronosGroup/Vulkan-Utility-Libraries/blob/main/include/vulkan/vk_enum_string_helper.h)
- [Stringifying OpenGL enums](https://stackoverflow.com/questions/4708202/stringifying-opengl-enums)
- [GL/glcorearb.h](https://github.com/KhronosGroup/OpenGL-Registry/blob/main/api/GL/glcorearb.h)
- [opengl enums](https://android.googlesource.com/platform/frameworks/native/+/refs/heads/main/opengl/libs/enums.in)
- [gl-enums](https://github.com/drbrain/opengl/blob/master/ext/opengl/gl-enums.h)