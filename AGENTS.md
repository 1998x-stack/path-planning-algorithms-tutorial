# AGENTS.md — 路径规划教程的编辑与发布契约

## 范围、边界与不可变性
- `docs/` 是唯一站点源码；`_site/` 仅构建产物，禁止直接编辑和提交。保持路径 `docs/chapters/NN.html` 稳定。
- 01–05 是第一批深度精修，06–28 是可读存量，**不等于通过审校**。保留根目录旧地址跳转；不要静默删内容或重排编号。
- `archive/2026-before-redesign/` 保留初版 01–05；任何迁移需先确认目标可访问、相对链接没断。
- 新内容为自成体系的独立网页：不用“本文将介绍/在上一章”代替核心解释，也不用虚构作者亲历和未经验证的提速倍数。

## 核心写作架构（源自 Olah-style-posts 的教学方法，非图文复制）
问题与反例 → 直觉模型 → 分阶段 SVG → 术语/变量 → 严格方程 → 可执行微型例子 → 复杂度/约束 → 边界条件 → 原始来源。
- 每篇只有一个 h1、多个有 id 的 h2；对零基础读者说明坐标、障碍、运动和代价的定义。
- 优先权威第一手材料：LaValle Planning Algorithms、Hart et al. 1968、Elfes 1989、ROS 2 Nav2 官方文档；写明版本。文内参考链接与 `docs/evidence/NN.json` 对齐。
- 数学给出量纲、离散/连续约定及假设；距离度量需要匹配四/八邻域和边代价。区分 heuristic admissible 和 consistent，图搜索停机条件以及 reopen 策略。
- 概率占据 `p∈[0,1]` ≠ ROS `nav_msgs/OccupancyGrid` `{-1,0..100}` ≠ Nav2 `costmap_2d` `uint8 0..255`。不能同一张表混写。
- 每个可复现代码单元写明 Python 版本、输入样例、命令、预期断言；小样例不等于机器人级规划器。

## SVG 与 CSS 设计体系
- 使用 `docs/assets/css/site.css`，暖白底 + 深灰正文 + 青绿(可行路线) + 陶红(代价/风险) + 紫色(状态/目标)。颜色永远要有文字/线型冗余标记。
- SVG 独立存入 `docs/assets/figures/`，必须有 `xmlns`, `viewBox`, `title`, `desc`, 清晰的 14px 左右标签；图题要说清楚图中什么被保持、什么改变。
- 每幅图回答一个问题，每个复杂过程 2–5 个有语义阶段；先列出节点和边及几何关系，后绘图。严禁装饰性、计算语义错误的箭头。
- 语义 HTML: main/article/nav/section/figure/figcaption，正文栏不超过 820px；无网络字体和脚本，优先原生 MathML。手机端、键盘、打印、降低动态效果都要可用。

## 提交前质量门槛
1. `python3 tools/validate_site.py`：静态相对链接、章节完整性、图文、SVG 结构、MathML、禁用占位词。
2. `python3 tools/build_site.py`：输出 `_site/` 且构建不篡改源目录。
3. 运行 `python tools/browser_check.py`（需先安装 Playwright Chromium）；Chromium 1440/900、768/1024、390/844、360/800：无横向溢出，SVG 图签/节点可读、无 JS 异常、锚点和图片均可打开，真实点击文章交互。
4. 离线加载、键盘 focus、减弱动画、打印检查。若未实际跑浏览器不得写“已通过浏览器 QA”。
5. 使用分支/PR 审核变更及存量页面迁移；部署后检查 GitHub Pages 实际 URL 和 Actions 状态。Pages 未启用时明确说明设置前置条件。

## 每批交付
- 章节路径与知识事实变化、对应 SVG 名单、来源登记、测试通过项及未执行项、发布 commit/PR/Pages 链接。
- 不要为了显得丰富而堆砌 KPI、虚假的场景测试，或把样例路径长度当成算法 benchmark。
