# 路径规划算法 · Path Planning Algorithms Tutorial

28 篇中文路径规划课程。从状态 / 构型空间、图搜索、采样法、约束与动态规划，到工程验证。

**[阅读网页版](https://1998x-stack.github.io/path-planning-algorithms-tutorial/)** · [从第一章开始](https://1998x-stack.github.io/path-planning-algorithms-tutorial/chapters/01.html)

> 2026-11 首批精修：01–05 已重新设计，其余 06–28 保留原版内容待逐章审校。页面内标示状态，不能将保留旧版等同于完成质量复审。

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
│   ├── evidence/             # 01–05 的主要事实来源登记
│   └── data/chapters.json    # 章节状态与导航元数据
├── archive/2026-before-redesign/ # 第一批原始篇章存档
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
python3 tools/build_site.py
python3 -m http.server 8000 -d docs
```

在浏览器访问 http://localhost:8000。 `build_site.py` 会把 `docs/` 复制到 `_site/`，不会修改源文件。GitHub Actions 会先静态校验，再从 `_site/` 上传部署。**仓库 Settings → Pages → Source 必须选择 GitHub Actions**；仅提交工作流不代表 Pages 已完成启用或部署。

## 编辑规范

先读 [AGENTS.md](AGENTS.md)。文章要独立解释问题，不写“上一章介绍了”，每个关键结论应可由图、推导、代码或参考文献追溯；所有教学示例标注假设及适用范围。新 SVG 使用可访问标题和说明，复杂 MathML 离线可读。严禁捏造基准数值和部署验收结果。

## 主要参考

- S. M. LaValle, *Planning Algorithms*：https://msl.cs.uiuc.edu/~lavalle/planning/
- P. E. Hart, N. J. Nilsson, B. Raphael, *A Formal Basis for the Heuristic Determination of Minimum Cost Paths* (1968)：https://ieeexplore.ieee.org/document/4082128
- A. Elfes, *Using Occupancy Grids for Mobile Robot Perception and Navigation* (1989)：https://ieeexplore.ieee.org/document/30720/
- Nav2 Costmap 文档：https://docs.nav2.org/

教学编排受 [Olah-style-posts](https://github.com/1998x-stack/Olah-style-posts) 的叙事与可视化工作流启发，图形和文字均需独立创作。
