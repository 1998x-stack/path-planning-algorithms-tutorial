# 路径规划算法 · Path Planning Algorithms Tutorial

28 篇中文路径规划课程。从状态 / 构型空间、图搜索、采样法、约束与动态规划，到工程验证。

**[阅读网页版](https://1998x-stack.github.io/path-planning-algorithms-tutorial/)** · [从第一章开始](https://1998x-stack.github.io/path-planning-algorithms-tutorial/chapters/01.html)

> 2026-11 第四批精修：01–20 已深度重构，21–28 为可读原版、仍待逐章技术审校。已改造章节的 CI 状态以 GitHub Actions 最新实际运行记录为准。

## 内容结构

| 部分 | 章节 | 主要问题 |
| --- | --- | --- |
| 基础建模 | 01–05 | 地图如何变成规划问题？启发式怎样帮助搜索？ |
| 图搜索算法 | 06–10 | 如何在离散状态图上寻找低代价路径？ |
| 采样与路径质量 | 11–15 | 高维空间如何探索、连接与后处理？ |
| 约束与在线规划 | 16–22 | 如何将运动约束、动态障碍和优化结合？ |
| 工程与实验 | 23–28 | 如何调试、评估、部署和复现算法？ |

## 仓库结构

```text
.
├── docs/                     # 唯一的 Web 站点源码，同时是 Pages 发布源
│   ├── index.html            # 课程主页
│   ├── chapters/01.html…28.html
│   ├── assets/css/site.css   # 新设计系统
│   ├── assets/js/site.js     # 轻量无依赖交互
│   ├── assets/figures/       # 可单独查看的原创 SVG
│   ├── evidence/             # 01–20 的主要事实来源登记
│   └── data/chapters.json    # 章节状态与导航元数据
├── archive/2026-before-redesign/ # 01–20 原始篇章存档
├── tools/build_site.py      # 离线复制构建
├── tools/validate_site.py   # 静态结构、链接、SVG 检查
├── .github/workflows/pages.yml
├── AGENTS.md                # 写作/插图/验证/发布约定
├── 01.html…28.html          # 旧链接跳转存根
└── index.html               # 旧站入口跳转存根
```

## 开发与发布

Python 3.10+，不需要 Node、第三方字体、在线数学脚本。

```bash
python3 tools/validate_site.py
python3 tools/validate_examples.py  # 验证前二十篇微型算法示例
python3 tools/build_site.py
# 可选：实际 Chromium 多视口截图测试
python3 -m pip install playwright==1.56.0
python3 -m playwright install chromium
python3 tools/browser_check.py
python3 -m http.server 8000 -d docs
```

在浏览器访问 http://localhost:8000。 `build_site.py` 会把 `docs/` 复制到 `_site/`，不会修改源文件。GitHub Actions 会先静态校验，再从 `_site/` 上传部署。**仓库 Settings → Pages → Source 必须选择 GitHub Actions**；仅提交工作流不代表 Pages 已完成启用或部署。

## 编辑规范

先读 [AGENTS.md](AGENTS.md)。文章要独立解释问题，不写“上一章介绍了”，每个关键结论应可由图、推导、代码或参考文献追溯；所有教学示例标注假设及适用范围。新 SVG 使用可访问标题和说明，复杂 MathML 离线可读。严禁捏造基准数值和部署验收结果。

## 第二批（06–10）专项审校

- **06 Dijkstra：** 非负边权、松弛、堆中过期条目、真实最小成本。
- **07 A*：** 可纳与一致、最小 f 目标弹出、允许更优 g 重开。
- **08 A* 变体：** Weighted A* 的 ε 次优界；ARA* 与反复重跑 WA* 的区别；双向和分层算法独立假设。
- **09 D* Lite：** g/rhs 局部一致性、二元 key、km 更新与局部修复；对改变边权的代码断言。
- **10 JPS：** 直线/对角、forced neighbor、禁止切角版本差异；原型代码仅是直线跳点检测器，不等于完整 JPS。

## 第三批（11–15）专题审校

- **11 RRT**：Sample、Nearest、Steer、MotionValid、Voronoi 探索偏置；有限预算失败不等于不可达。
- **12 RRT***：选择父节点、重连、子树成本传播与理论近邻半径；明确示例参数未证实理论阈值。
- **13 PRM**：预处理路网、两个独立查询、合法局部边、PRM 与 PRM* 的边界。
- **14 方法比较**：成功率、预算、解成本和预处理分开报告；五组配对种子测试仅比较 RRT 目标偏置。
- **15 后处理**：Shortcut、Douglas–Peucker 几何偏差与碰撞反例、B-spline/Bézier、曲率约束及解析线段碰撞测试。

## 第四批（16–20）专题审校

- **16 DWA：** 静态速度限制、动态可达窗口、安全制动集合、轨迹评分；教学实现明确使用圆盘近似和保守净空代理。
- **17 APF：** 吸引/斥力势、负梯度、非目标平衡点反例；明确局部极小、窄通道与振荡边界。
- **18 运动学约束：** Dubins 前进曲线、Reeds–Shepp 倒车 cusp、曲率界与状态格；代码只积分一条 LSR 基元，不冒充最短路径求解器。
- **19 动态重规划：** 时空碰撞、Velocity Obstacles、相对速度最近接近、滚动时域；区分 D* Lite 增量搜索与未来障碍预测。
- **20 多目标：** 区分多站点访问和多目标函数；Pareto 支配、归一化加权和、非凸前沿的边界与偏好交互。

## 主要参考

- S. M. LaValle, *Planning Algorithms*：https://msl.cs.uiuc.edu/~lavalle/planning/
- P. E. Hart, N. J. Nilsson, B. Raphael, *A Formal Basis for the Heuristic Determination of Minimum Cost Paths* (1968)：https://ieeexplore.ieee.org/document/4082128
- A. Elfes, *Using Occupancy Grids for Mobile Robot Perception and Navigation* (1989)：https://ieeexplore.ieee.org/document/30720/
- Nav2 Costmap 文档：https://docs.nav2.org/

教学编排受 [Olah-style-posts](https://github.com/1998x-stack/Olah-style-posts) 的叙事与可视化工作流启发，图形和文字均需独立创作。
