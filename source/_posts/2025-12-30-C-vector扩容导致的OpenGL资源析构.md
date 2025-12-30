---
title: C++ vector扩容导致的OpenGL资源析构
date: 2025-12-30 17:00:37
categories:
- Development
- C++
tags: 
- Development
- C++
---

# 问题

Mesh类，包含vao/vbo/ibo这些OpenGL资源，包含了析构函数，在释放资源时候通过glDeleteBuffers 和 glDeleteVertexArrays销毁了这些资源。Mesh通过std::vector管理，添加Mesh使用了push_back或emplace_back，会导致不同的Mesh持有的vao/vbo/ibo一样。
几个问题：

- 析构后，vao/vbo/ibo应该设置成一个无效值
- std::vector没有分配足够内存，插入元素后，可能导致空间的重新分配，旧元素的拷贝或移动到新位置，旧元素内存析构掉。
- 一个OpenGL资源申请、释放、在申请，可能是同一个id

# 解决

1. 提取分配足够空间
``` c++
meshes.reserve(expectedCount);
```
2. 实现移动构造函数并转移所有权
``` c++
// Mesh(const Mesh&) = delete;
// Mesh& operator=(const Mesh&) = delete;
Mesh(Mesh&& other) noexcept 
    : vao(other.vao), vbo(other.vbo), ibo(other.ibo) {
    other.vao = 0;
    other.vbo = 0;
    other.ibo = 0;
}

~Mesh() {
    if (vao != 0) glDeleteVertexArrays(1, &vao);
    if (vbo != 0) glDeleteBuffers(1, &vbo);
    if (ibo != 0) glDeleteBuffers(1, &ibo);
}
```
3. 智能指针

# 总结

无论是插入方式和构造函数，都有可能导致数据的重新分配，就必然会导致析构函数的调用。仅仅禁用拷贝构造或者赋值构造并不能解决问题，因为不能通过修改拷贝源（const&）的值来规避资源释放。