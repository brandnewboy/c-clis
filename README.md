# 🌟 Node.js 脚手架案例 🚀

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black)

## 🌌 项目概述
本项目是 Node.js 能力的探索与实践，练习构建命令行工具的案例：

- **cli - ls**：💻 借鉴 Linux 系统 `ls` 命令的功能，一个基于 Node.js 的命令行工具，列出目录文件信息。
- **c - build**：🛠️ 基于 Webpack 二次封装的脚手架，模仿 `vue - cli`，支持监听服务重启和插件化和`webpack-chain`的方式配置 Webpack。

## 📁 项目结构
```plaintext
cli-tests/
├── cli-ls/
│   ├── bin/                # 可执行文件以及源代码
│   ├── test/               # 测试文件
│   └── package.json
├── c-build/
│   ├── bin/                # 可执行文件
│   ├── config/             # xxx 配置
│   ├── plugins/            # 插件目录
│   ├── lib/                # 源代码
│   ├── plugins/            # 插件
│   ├── samples/            # 示例
│   └── package.json
├── .gitignore
├── README.md
└── package.json
```

## 🪐 子项目介绍
### 1. cli - ls 📂
#### 简介
   cli - ls 是 Node.js 赋予命令行的能力，它模仿 Linux 的 ls 命令，为你带来文件列表查看体验。

#### 特性
- 📃 基础文件列表展示，让你快速浏览目录。
- 📋 详细列表模式（-l），呈现文件的详细信息。
- 👀 显示隐藏文件（-a），不放过任何一个角落。
- 🎨 彩色输出，让命令行也能绚丽多彩。

#### 安装
```bash
# npm
npm install -g @coolforme/c-ls
# pnpm
pnpm add -g @coolforme/c-ls
# yarn
yarn add -g @coolforme/c-ls
```

#### 使用
```bash
# 普通文件列表
c-ls
# 详细列表
c-ls -l
# 显示所有文件
c-ls -la
```

### 2. c - build 🛠️
#### 简介
   c - build 是 Webpack 的魔法增强版，如同 vue - cli 一样强大，为你的项目构建保驾护航。

#### 特性
- 🔄 配置文件修改监听与自动重启，让你专注于代码，无需手动操作。
- 🧩 插件系统扩展 Webpack 配置，使用`webpack-5-chain`的能力，配置更灵活。
- 🛣️ 自定义 Webpack 路径，灵活掌控项目webpack依赖。
- 📝 友好日志系统，使用`winston`清晰展示构建过程。
- 📦 Node.js 版本自动检查，确保环境兼容性。

#### 安装与使用
```bash
# 安装
ppm add -g @coolforme/c-build

# 启动开发服务器
c-build start

# 常用选项
--config <config>       # 指定配置文件路径
--custom-webpack-path   # 自定义 Webpack 目录
--mode <mode>           # 构建模式（默认 development）
-d, --debug [debug]     # 调试模式
--stop-server           # 不启动webpack-dev-server服务
```
#### 配置文件
支持多种格式的配置文件，优先级如下：
1. c - build.config.js
2. c - build.config.cjs
3. c - build.config.mjs
4. c - build.config.json

配置示例：
```javascript
const path = require('node:path')

module.exports = {
    entry: path.resolve('./src/index.js'),
    output: './dist',
    hooks: [
        ['start', () => {
            console.log('构建启动啦！🚀')
        }]
    ],
    plugins: [
        'c - build-plugin-test1',
        'c - build-plugin-vue'
    ]
}
```

#### 插件系统
通过插件系统扩展 Webpack 配置，示例如下：


```javascript
module.exports = {
    plugins: [
            'c - build-plugin-test1',
            ['c - build-plugin-vue', { a: 1, b: 2 }]
        ]
    }
```

# !!!提示!!! 该项目仅作为学习使用，可能存在较多bug，请勿用于生产环境。
