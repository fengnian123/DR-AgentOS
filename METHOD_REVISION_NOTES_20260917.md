# Section 3 + Section 4 联合精简（2026-09-17）

范围以作者最新澄清为准：第 3 节 Predictive 4D Belief Navigation 与第 4 节 P4D-Bench 合起来构成 Method，编译后两节整体在第 6 页中部结束，随后进入第 5 节 Experiments。前次将该页码范围理解为仅第 3 节，并在恢复旧稿时误把两张 benchmark 协议表放回正文，本次一并纠正。

本次从最新远端 `b1b9f75` 开始，保留 Overleaf 的自然分页、近期缩短后的表题，以及完整实验表格和实验文本。

## 正文与附录分工

- 第 3 节保留问题定义、因果记忆、连续时间历史编码、persistence–relocation 信念、成本感知检查、可见性负证据更新，以及动态到达时间预测。
- 主文展示结构化先验、检查策略、似然与后验更新；完整任务目标、记忆形式化、事件编码、Transformer、persistence/pointer 公式及动态接口保留在附录 A。
- 第 4 节保留数据规模、来源和合成边界、配对世界控制、因果与物理约束、任务和 N1–N5 协议及防泄漏原则。详细生成统计、元数据和审计说明保留在附录 B。
- 原正文 Table 1、2（Mobility Regimes / Prediction and Navigation Protocols）移回附录 B，通过原有 label 引用。实验对比表继续保留在正文。
- Figure 3、4 保持各自独立的左文右图环绕布局，未并排拼接，也未改动图中内容。

## 技术保留检查

核对压缩前后的公式标签、训练目标、输入字段、因果时间边界和协议限制。明确保留最近 K 条因果事件、unknown 支持集、冻结控制器、无特权成功标志、逐步后验递推与到达时间预测。没有新增算法机制或实验结论。

## 原稿待核实事项

Figure 3 的任务比例与正文比例仍不一致；在线动态场景中重新启用已检查候选的规则仍需明确。本次未擅自修改这些数字或补写未经实现核实的机制。

## 编译与版面验证

`latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex` 通过。无未定义引用、未定义文献、overfull box 或 wrapfigure 碰撞；已检查第 4–6 页渲染。两张 benchmark 表位于附录 B 的第 16 页，自动编号为 Table 5、6。原有 Method 标签在正文或附录各保留一次，表格本体和最新短表题逐字保留。
