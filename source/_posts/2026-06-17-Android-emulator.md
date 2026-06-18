---
title: Android emulator
date: 2026-06-17 15:25:50
categories:
- android
tags:
- android
---

## 步骤一：下载并放置 Command Line Tools

1. 打开 `https://developer.android.com/studio?hl=zh-cn#command-line-tools-only`，下载 Windows 版的 command line tools 压缩包（名字类似 `commandlinetools-win-xxxxxxx_latest.zip`）。

2. 在某个目录创建 SDK 根文件夹，比如 `C:\android-sdk`。

3. 解压压缩包，你会得到一个 `cmdline-tools` 文件夹，里面有 `bin`、`lib` 等。**注意：需要再套一层 `latest`**，最终目录结构必须是这样：

```
C:\android-sdk\
└── cmdline-tools\
    └── latest\
        ├── bin\
        ├── lib\
        └── ...
```

如果结构不对，`sdkmanager` 会报错。简单做法：在 `cmdline-tools` 下新建一个 `latest` 文件夹，把解压出来的 `bin`、`lib` 等都移进去。

## 步骤二：设置环境变量


**ANDROID_HOME系统变量：**
```
变量名：ANDROID_HOME
变量值：D:\android-sdk
```

**Path**
```
%ANDROID_HOME%\cmdline-tools\latest\bin
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
```

验证一下：

```cmd
sdkmanager --version
```

能输出版本号就说明配置成功。

我的机器上还需要设置`SKIP_JDK_VERSION_CHECK`

```cmd
setx SKIP_JDK_VERSION_CHECK true
```

## 步骤三：安装模拟器和系统镜像

```cmd
sdkmanager --licenses
```

它会逐条让你输入 `y` 接受许可，一路 `y` 即可。

然后安装组件：

```cmd
sdkmanager "emulator" "platform-tools" "system-images;android-34;google_apis_playstore;x86_64"
```

这里用了 `google_apis_playstore`，这样模拟器里**自带 Google Play 商店**，方便你直接装应用。如果你不需要商店，可以换成 `google_apis`。

## 步骤四：创建虚拟设备

```cmd
avdmanager create avd -n myDevice -k "system-images;android-34;google_apis_playstore;x86_64"
```

执行时会问 `Do you wish to create a custom hardware profile?`，直接回车（选 no）即可。

## 步骤五：开启硬件加速

开启「Windows 虚拟机监控程序平台」（Windows Hypervisor Platform）:

1. Win + R，输入 optionalfeatures 回车，直接打开这个窗口。
2. 勾选
- Windows 虚拟机监控程序平台（Windows Hypervisor Platform）
- 虚拟机平台（Virtual Machine Platform）

## 步骤六：启动模拟器

```cmd
emulator -list-avds
emulator -avd myDevice
```

第一次启动会慢一些（要初始化系统），之后就快了。

## 日常使用
启动：

```cmd
emulator -avd myDevice
```

adb 安装 APK、调试：

```cmd
adb devices
adb install C:\path\to\app.apk
```

adb端口占用，先检查是否设置了其他路径的adb（PATH环境变量中）：

```cmd
adb kill-server
adb start-server
```

emulator[命令行参数](https://developer.android.com/studio/run/emulator-commandline?hl=zh-cn)：

``` cmd
emulator -avd myDevice -verbose -show-kernel # 日志
emulator -avd myDevice -gpu swiftshader_indirect # 软件渲染
emulator -avd myDevice -gpu off
emulator -avd myDevice -no-snapshot-load # 冷启动
emulator -avd myDevice -wipe-data # 擦掉数据
```

## 其他
Android Studio中的emulator使用的qemu实现；也试用了网易的mumu模拟器，功能挺完善的也更好用，是virtualbox实现。
