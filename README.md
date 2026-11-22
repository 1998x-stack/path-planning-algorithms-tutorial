# 路径规划算法 · Path Planning Algorithms Tutorial

28 篇中文路径规划课程，从构型空间、图搜索、采样与局部控制，到学习型规划、前沿研究和可验证的导航系统。

**[阅读网页版](https://1998x-stack.github.io/path-planning-algorithms-tutorial/)** · [从第一章开始](https://1998x-stack.github.io/path-planning-algorithms-tutorial/chapters/01.html)

> 2026-11 收官精修：01–28 全部完成独立教学重构。课程分为六个学习模块；每篇都具有独立上下文、原创 SVG、可追溯来源与可执行教学示例。CI 状态以 GitHub Actions 最新实际运行记录为准。

## 内容结构

| 模块 | 章节 | 主要问题 |
| --- | --- | --- |
| 基础建模 | 01–05 | 地图如何变成规划问题？ |
| 图搜索算法 | 06–10 | 如何在离散状态图上寻找低代价路径？ |
| 采样与路径质量 | 11–15 | 高维空间如何探索、连接与后处理？ |
| 约束与在线规划 | 16–22 | 如何处理运动约束、动态障碍、多机器人与优化？ |
| 工程与实验 | 23–25 | 如何调试、评估、部署和验证规划系统？ |
| 学习与综合实践 | 26–28 | 如何让学习模型参与规划，并构建完整导航闭环？ |

## 仓库结构

```text
.
├── docs/                         # 唯一的 Web 站点源码，也是 Pages 发布源
│   ├── index.html                # 六模块课程主页
│   ├── chapters/01.html…28.html  # 28 篇独立教学页面
│   ├── assets/css/site.css       # 统一阅读与图表设计系统
│   ├── assets/js/site.js         # 原生、无依赖交互
│   ├── assets/figures/           # 独立原创 SVG
│   ├── evidence/                 # 01–28 事实来源与图示清单
│   └── data/chapters.json        # 章节状态与模块元数据
├── archive/2026-before-redesign/ # 01–28 原始页面归档
├── tools/build_site.py           # 离线复制构建
├── tools/validate_site.py        # 结构、链接、SVG、证据清单检查
├── tools/validate_examples.py    # 执行 28 篇 Python 教学示例
├── tools/browser_check.py        # Chromium 四视口交互与打印检查
├── .github/workflows/            # 质量门禁与 Pages 发布
├── AGENTS.md                     # 写作、技术审校、SVG 和发布契约
├── 01.html…28.html               # 稳定旧链接跳转存根
└── index.html                    # 旧站入口跳转存根
```

## 开发与发布

Python 3.10+。站点本身不依赖在线字体、CDN 数学脚本或第三方运行时 JS。

```bash
python3 tools/validate_site.py
python3 tools/validate_examples.py
python3 tools/build_site.py

# 可选：实际 Chromium 多视口截图、交互和打印测试
python3 -m pip install playwright==1.56.0
python3 -m playwright install chromium
python3 tools/browser_check.py

python3 -m http.server 8000 -d docs
```

在浏览器访问 http://localhost:8000。构建脚本把 `docs/` 复制到 `_site/`，不会修改源文件。GitHub Actions 负责静态验证、代码示例和浏览器 QA，再上传 Pages 构建产物。仓库 Settings → Pages → Source 应选择 GitHub Actions；只有实际部署工作流成功后，才能称为已发布。

## 编辑与验证原则

先读 [AGENTS.md](AGENTS.md)。每篇文章都应当让第一次接触该主题的读者独立理解问题、变量、假设、推导、示例和边界；不以“上一章介绍了”代替解释。所有定量结论必须对应原始来源、实验设置和适用范围。SVG 使用独立 XML、可访问标题和说明；复杂公式使用原生 MathML。小型教学示例不得冒充完整机器人系统或跨算法基准。

## 主要专题审校

### 06–10：图搜索
- Dijkstra：非负边权、松弛、堆中过期条目与最小成本。
- A*：启发式可纳性/一致性、最小 f 目标弹出、重新打开节点。
- A* 变体：Weighted A* 次优界、ARA* 与双向/分层方法的假设。
- D* Lite：g/rhs 一致性、key、km 更新与局部修复。
- JPS：邻居剪枝、强制邻居、切角规则；教学代码不冒充完整 JPS。

### 11–15：采样与路径质量
- RRT / RRT*：Sample、Nearest、Steer、MotionValid、rewire 与子树代价传播。
- PRM：路网预处理、局部边验证、PRM 与 PRM* 的区别。
- 比较实验：种子、预算、成功/失败、路径代价与预处理时间分开记录。
- 后处理：Shortcut、Douglas–Peucker、样条与碰撞/曲率验证不能混为一谈。

### 16–22：约束、在线、多机器人与优化
- DWA：静态速度集、动态可达窗口和安全制动集合分开定义。
- APF：势能负梯度、局部极小、窄通道与振荡边界。
- Dubins / Reeds–Shepp：前进、倒车 cusp、曲率和时间参数化。
- 动态重规划：时空碰撞、相对速度、预测不确定性与滚动时域。
- 多目标：多站点访问与多目标函数区分，Pareto 支配和归一化权重。
- MAPF / CBS：顶点冲突、反向边交换、SOC 与 makespan；有限时域示例不宣称通用完备性。
- MPC：动力学、硬约束、目标代价、打靶法和只执行首个控制输入。

### 23–25：工程与实验
- 调试可观测性：地图、搜索、路径和执行分层；结构化日志与 A* 不变量。
- 基准测试：配对任务、失败样本、首次可行解、路径质量和资源开销分开报告。
- 仿真到实车：REP-105、TF、时间戳、footprint、限速、安全层和逐级准入。

### 26–28：学习、前沿与综合项目
- **26 学习型路径规划：** BC、DAgger、MDP / Q-learning、VIN、Neural A*；明确策略分布偏移、启发式保证与经典回退边界。标准库 Q-learning 示例展示新障碍导致策略失效及 BFS 回退。
- **27 前沿趋势与未来：** VLA / VLN、NoMaD 扩散导航、Neural A*、cuRobo GPU 并行规划与运行时安全。区分移动导航、机械臂操作、预印本综述和厂商公告；删除未经证实的行业渗透率与 V2X 效益数字。
- **28 综合项目：** 静态 A* 全局路径 + 时间扩展局部 A* + 动态障碍预测 + 等待/重规划；示例明确为离散点机器人，不冒充连续 DWA 或实车安全认证。

## 主要参考

- LaValle, *Planning Algorithms*：https://msl.cs.uiuc.edu/~lavalle/planning/
- Hart, Nilsson & Raphael, *A Formal Basis for the Heuristic Determination of Minimum Cost Paths* (1968)：https://ieeexplore.ieee.org/document/4082128
- Ross, Gordon & Bagnell, DAgger (AISTATS 2011)：https://proceedings.mlr.press/v15/ross11a.html
- Tamar et al., Value Iteration Networks (NeurIPS 2016)：https://proceedings.neurips.cc/paper/2016/hash/c21002f464c5fc5bee3b98ced83963b8-Abstract.html
- Yonetani et al., Neural A* (ICML 2021)：https://proceedings.mlr.press/v139/yonetani21a.html
- Sridhar et al., NoMaD (ICRA 2024)：https://general-navigation-models.github.io/nomad/
- RT-2 (CoRL 2023)：https://proceedings.mlr.press/v229/zitkovich23a.html
- π0.5 (CoRL 2025)：https://proceedings.mlr.press/v305/black25a.html
- ROS REP-105：https://reps.openrobotics.org/rep-0105/
- Nav2 Documentation：https://docs.nav2.org/

教学叙事与可视化方法受 [Olah-style-posts](https://github.com/1998x-stack/Olah-style-posts) 启发；本仓库的文章、示意图与代码均独立编写。
