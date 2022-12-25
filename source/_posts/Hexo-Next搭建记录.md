---
title: Hexo-Next搭建记录
date: 2022-12-24 22:53:34
tags: 
- Hexo
- Next
---


看到很多人的主页做的好看丝滑又专业，不免得想拥有一个自己的。最开始使用[Github Pages](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll)的默认静态网页生成器[jekyll](https://jekyllrb.com/)搭建了一个，但是奈何觉得有些复杂和浮夸。搜索一番，发现[Hexo](https://hexo.io/zh-cn/)和[NexT Theme](https://theme-next.js.org/)使用广泛，而且找到了我想要的比较简洁的风格示例，比如[木鸟杂记](https://www.qtmuniao.com/)、[IIssNan's Notes](https://notes.iissnan.com/)、[NightTeam](https://nightteam.github.io/)，在阅读官方文档和热情网友分享的文章（比如[如何在 GitHub 上写博客？](https://www.zhihu.com/question/20962496)）中，在不懂得各种前端知识情况下，一步步搭建了一个机遇GitHub Pages + Hexo + NexT的个人主页。刚刚开始，对于Hexo一点儿也不熟悉，还有很多需要配置的地方，但是趁着热乎劲，把搭建的历程记录下来，为后来者以参考，为自己以作备忘。

> Note: 完工之后回头看，由于对相关背景知识不了解，胡乱查了很多，其实Hexo的官方文档才是最好的教学和参考，详尽而工整，是很好的技术文档范例，而且有中文版哟～

1. 个人主页的文件是以repo的形式托管在GitHub上的，所以第一步要创建一个名为 {username}.github.io的项目，按照[creating a github pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)一步步操作即可。

2. 安装Nodejs和Hexo, [Hexo Overview](https://hexo.io/docs/)
- Install Node.js from [official installer](https://nodejs.org/en/download/)
- Install Hexo, 通过一下命令可以安装bash中`全局可见`的命令
``` bash
npm install -g hexo-cli
```

3. 在本地初始化个人主页项目，按照[Hexo Setup](https://hexo.io/docs/setup)操作，一路无险
``` bash
hexo init <folder>
cd <folder>
npm install
```

4. Hexo的基础操作，[Hexo Command](https://hexo.io/docs/commands)
- 新建一个主页项目
``` bash
hexo init <folder>
```
- 生成网页，在public文件夹里
``` bash
hexo generate
```
- 本地运行，启动一个本地服务器，在浏览器通过http://localhost:4000/就可以查看生成的个人主页了。
``` bash
hexo server
```
- clean
``` bash
hexo clean
```

5. Hexo的部署，即把个人主页托管到GitHub上，[Hexo Deplyment]()
- 一种方式是通过Hexo的一键部署，可以参考[One-comman deployment](https://hexo.io/docs/github-pages#One-command-deployment)，目的是将本地生产的个人主页文件push到步骤1中创建的远程项目的gh-pages分支上。这种方式的好处是，不需要在github上托管个人主页的源文件。
- 由于对gitlab的CI/CD比较熟悉，我选择了第二种方式，利用Github Action，按照[Deployment/GitHub Pages](https://hexo.io/docs/github-pages)配置GitHub的CD配置文件，在检测到源文件分支的push操作时候，就能GitHub的Runner机器上自动化生产个人主页并推送到gp-pages分支，是不是很方便。
``` yml
name: Pages

on:
  push:
    branches:
      - master # default branch

jobs:
  pages:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true 
      - name: Use Node.js 16.x
        uses: actions/setup-node@v2
        with:
          node-version: "16"
      - name: Cache NPM dependencies
        uses: actions/cache@v2
        with:
          path: node_modules
          key: ${{ runner.OS }}-npm-cache
          restore-keys: |
            ${{ runner.OS }}-npm-cache
      - name: Install Dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

6. 应用主题，[NexT]()
- Install NexT, 将hexo-theme-next项目放在themes/next目录下，把next的文件作为个人主页工程源码的一部分，修改项目配置文件`_config.yml`中`theme`项为`theme: next`，继续按照以上操作即可
``` bash
git clone https://github.com/next-theme/hexo-theme-next themes/next
```
但是，我将hexo-theme-next作为submodule使用，则需要在GitHub Action配置文件中需要额外添加submoudle的配置，否则GitHub CD中不能正确下载主题，也就无法正确主页文件了。我在这一块花费了一些时间。
``` yml
        with:
          submodules: true 
```

7. 配置
- [Using an Alternate Config](https://hexo.io/docs/configuration#Using-an-Alternate-Config)
- [Hexo Next 主题进阶设置](https://www.qtmuniao.com/2019/10/16/hexo-theme-landscaping/)

8. 结语
> Hexo、NexT文档详尽，按照以上操作，恭喜你，你已经拥有一个属于自己的个人主页了。但是，要配置出一个更有逼格更符合个人审美要求的主页，就要多了解NexT的配置了。
> 开启写作之旅吧～～
