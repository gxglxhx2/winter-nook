# 冬日小窝 · Winter Nook

一款离线运行的 macOS 像素宠物游戏。雪夜里的小鹿叫小栗。

![小栗和圣诞树林的桌面挂件](preview.png)

[下载 Mac 版](https://github.com/gxglxhx2/winter-nook/releases/latest) · 发布者：Science Live

## 开始玩

- 解压游戏包，双击「冬日小窝.app」。支持 macOS 12 或更新版本，包含 Apple 芯片和 Intel 版本。
- 点小栗可以摸摸它，也可以按「喂饼干」或「打个盹」。每天完成三种互动就能收齐三枚雪花。
- 在下方选一棵圣诞树，再搭配礼物、雪人、灯笼、糖果手杖和雪橇。再次点击可收起。
- 点右上角「桌面挂件」，小栗和圣诞树林会显示在屏幕底部、Dock 上方。点挂件里的小栗可以摸摸它；鼠标移到挂件右侧可使用照顾按钮。点右上角的返回图标或按 ⌥⌘M 回到布置界面。
- 右上角音符可以播放或暂停音乐。装饰、今日陪伴和显示模式会保存在这台 Mac 上。

## 源码

- `web/art.js`：原始像素画、雪景、桌面挂件和动画。
- `web/game.js`：互动、装饰、存档和本地合成的音乐。
- `main.m`：macOS 窗口、底部置顶和本地进度存储。
- `make-icon.py`：小鹿与圣诞树的应用图标绘制。图标已生成，无需重新绘制即可构建。

安装好 Apple Command Line Tools 后，在此目录执行 `bash build.sh`。生成的 App 位于 `build/冬日小窝.app`。也可执行 `bash build.sh "/其他目录/冬日小窝.app"` 指定一个新路径。浏览器打开 `web/index.html` 可预览游戏；桌面置顶由 macOS App 提供。
