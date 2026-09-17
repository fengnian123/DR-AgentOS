# Introduction 扩充与 Related Work 精简（2026-09-17）

本次基于拉取后的远端 `30fa239`。修改范围为 Introduction、Related Work 及重新编译的 PDF；摘要、第 3–4 节、实验、图表源文件和附录均保持不变。

## Introduction

- 按“历史证据为何会失效 → 预测如何指导检查 → 任务边界 → 结构化信念与执行 → 可控评测”的顺序整理论证。
- 补充同等观察时长下不同 routine phase 的作用、候选概率与检查成本/可见性的权衡、首次预测错误后保留替代位置的意义。
- 解释历史版本、unknown 概率质量与到达时间预测，并明确主实验采用 fixed-target 协议，online-dynamic 是扩展。
- 解释随机对照保留哪些因素、移除哪些时间依赖，以及分别衡量预测和导航的目的。
- 保留主要结果和三项贡献；将贡献列表收紧，减少与正文重复。相对 Last Seen 的 paired-world 优势明确限于 routine worlds；未新增实验结论或 SOTA 声明。

## Related Work

保留三段结构及全部 33 个引用键。区分跨任务导航、episodic QA、时空记忆与观测驱动地图更新；明确承认 SGM、PredictiveGraphs、FlowMaps 已有预测与搜索能力。删除对整类方法静态假设的泛化，以及重复的贡献/执行循环总结。

## 篇幅与验证

按统一的近似英文词数口径（剔除标题与引文，模型宏计一词），Introduction 为 774 → 826 词；其中贡献列表之前的主体为 691 → 761 词，增加约 10%。Related Work 为 285 → 232 词，减少约 19%。两节原有引用键均完整保留。

`latexmk -pdf -interaction=nonstopmode -halt-on-error main.tex` 通过，最终编译无未定义引用、未定义文献、重复标签或 overfull box。已检查第 2–6 页渲染。第 3 节四个编号小节及技术内容保持不变；第 3＋4 节合计仍在第 6 页中部结束，Experiments 标题位于 y ≈ 429 pt。Figure 3、4 分别在第 5、6 页独立左文右图；两张 benchmark 协议表仍在附录 B 第 16 页。
