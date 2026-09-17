# Section 3 内容恢复与联合篇幅校正（2026-09-17）

范围以作者最新要求为准：暂停 Introduction 和 Related Work 修改，恢复第 3 节 Predictive 4D Belief Navigation 的小节结构和必要技术内容。第 3 节与第 4 节 P4D-Bench 合起来构成 Method，两节整体在第 6 页中部结束，随后进入第 5 节 Experiments。

本次从最新远端 `5b6041f` 开始。Introduction、Related Work、摘要、第 4 节、实验正文和图表布局均保持该版本内容；保留 Overleaf 的自然分页。

## 第 3 节内容恢复

恢复为四个编号小节：3.1 Problem Formulation；3.2 Causal 4D Memory and History Encoding；3.3 Persistence–Relocation Belief；3.4 Predictive Embodied Agent。

正文补回 RGB-D 共同坐标系配准、跨视角关联依据、语义空间关系与实体历史版本、显式经过时间和周期时间编码，以及查询 token 的输入。完整候选评分与归一化公式从附录移回 3.3，附录改为引用正文，避免重复公式标签。保留结构化先验、训练目标、成本感知检查、可见性负证据、后验递推和在线到达时间预测。

## 正文与附录分工

- 第 3 节保留问题定义、因果记忆、连续时间历史编码、persistence–relocation 信念、成本感知检查、可见性负证据更新，以及动态到达时间预测。
- 主文展示候选评分与归一化、结构化先验、检查策略、似然与后验更新；完整任务目标、记忆形式化、事件编码、Transformer 和动态接口保留在附录 A。
- 第 4 节保留数据规模、来源和合成边界、配对世界控制、因果与物理约束、任务和 N1–N5 协议及防泄漏原则。详细生成统计、元数据和审计说明保留在附录 B。
- 原正文 Table 1、2（Mobility Regimes / Prediction and Navigation Protocols）移回附录 B，通过原有 label 引用。实验对比表继续保留在正文。
- Figure 3、4 保持各自独立的左文右图环绕布局，未并排拼接，也未改动图中内容。

## 技术保留检查

核对压缩前后的公式标签、训练目标、输入字段、因果时间边界和协议限制。明确保留最近 K 条因果事件、unknown 支持集、冻结控制器、无特权成功标志、逐步后验递推与到达时间预测。没有新增算法机制或实验结论。

## 原稿待核实事项

Figure 3 的任务比例与正文比例仍不一致；在线动态场景中重新启用已检查候选的规则仍需明确。本次未擅自修改这些数字或补写未经实现核实的机制。

## 编译与版面验证

`latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex` 通过。无未定义引用、未定义文献、overfull box 或 wrapfigure 碰撞；已逐页检查第 4–6 页渲染。第 4 节结束后，第 5 节 Experiments 标题位于第 6 页中部（PDF 坐标 y ≈ 431 pt）。Figure 3、4 分别位于第 5、6 页，各自保持左文右图。两张 benchmark 表位于附录 B 的第 16 页，自动编号为 Table 5、6。原有 Method 标签在正文或附录各保留一次，表格本体和最新短表题逐字保留。
