# 像素俄罗斯方块 · Morandi Tetris

浏览器可玩的像素风俄罗斯方块，外层莫兰迪色系面板，内层 8-bit 像素游戏区。

在线玩：https://challenwang.com/projects/morandi-tetris/

## 技术栈

React + TypeScript + Vite + Tailwind CSS

## 本地运行

```bash
npm install
npm run dev    # http://localhost:5173
npm run build  # 产物在 dist/
```

## 玩法

标准俄罗斯方块规则：7 种方块、SRS 简化墙踢旋转、7-bag 随机生成、软降/硬降、随等级提速、ghost 落点预览。

| 按键 | 动作 |
|------|------|
| ← → | 左右移动 |
| ↑ | 旋转 |
| ↓ | 软降 |
| Space | 硬降 |
| P | 暂停 |

按键可在 Settings 里自定义。

## 7 个彩蛋

1. **Tetris 爆屏**：一次消 4 行，大字爆屏 + 屏幕震动
2. **Combo 连击**：连续消除，分数指数加成
3. **隐藏异形方块**：每过 10000 分，下一个方块有概率变成 + 字形彩蛋方块
4. **速通成就**：60 秒内消 10 行触发 SPEEDSTER
5. **完美着陆**：方块落地恰好填平最低行，金光闪
6. **Konami 上帝模式**：↑↑↓↓←→←→BA，慢速 + 透视预测
7. **笑脸方块**：O 方块 1% 概率变笑脸，消除双倍分

## 战局历史

localStorage 存最近 20 局记录：分数、等级、行数、时长、Tetris 次数、最大 Combo、日期。最高分标星，可清空。

## 设计

游戏区像素风：Press Start 2P 字体、内嵌高光阴影方块、CRT 扫描线滤镜、暗底。
外壳莫兰迪色系：低饱和灰调（sand/paper/stone/fog/taupe/moss/clay/ink），VT323 终端字。
