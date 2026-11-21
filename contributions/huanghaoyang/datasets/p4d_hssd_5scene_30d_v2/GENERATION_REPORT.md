# P4D-HSSD 五场景 30/5/5 天生成报告

本数据包修正了此前只统计后续四个场景的问题。当前统一包含：

1. `102344280`：最早使用并调好的 articulated 家庭场景；
2. `102344094`；
3. `102816852`；
4. `103997403_171030405`；
5. `104348511_171513654`。

## 规模

| 内容 | 数量 |
| --- | ---: |
| HSSD 场景 | 5 |
| 每场景训练天数 | 30（day 0–29） |
| 每场景 Validation 天数 | 5（day 30–34） |
| 每场景 Test 天数 | 5（day 35–39） |
| 每场景总天数 | 40 |
| 每场景目标实例 | 30 |
| 总目标实例 | 150 |
| Queries | 7,300 |
| Agent 可见 Observations | 5,717 |
| 隐藏 World Events | 8,742 |
| Activities | 1,841 |

每个场景均包含 4 个 Stable、11 个 Activity-Routine Mobile、8 个 Personal-Habit Mobile 和 7 个 Irregular Mobile 实例。数据遵循 `p4d_benchmark_v1.0`：测试 Query Schema 与训练集一致，但当前状态标签为空；测试期 Activity、World Event 和完整标签只保存在 `private/`。

## `102344280` 的处理

原目录 `reports/4d_dynnav/monthly_hssd/102344280/person_001` 仍保留，不做覆盖。它是早期内部 Record 格式，包含 29 个可移动实例和更详细的关节辅助记录。

本五场景包不是把旧 JSONL 逐行原样复制，而是在同一个已调好的 `102344280` articulated 物理场景上，按统一 P4D Schema 生成 Query/Observation/World Event，并补齐 Stable 控制组。生活逻辑仍沿用 CASAS 作息、UCAmI 交互链和原 `102344280` 的家庭行为设计。

本次扩展保留原 day 0–29 的随机序列和潜在事件，将其统一划入训练集；随后按相同的日常作息、个人热点、机器人巡检与稀疏非规律移动机制续写 day 30–39。新增十天不是旧数据的复制或时间平移。

## 验证

统一数据校验通过：30/5/5 日切分覆盖完整、Query ID 唯一、5 个场景均只有一个 Unknown 状态、未来观测泄漏为 0、测试标签泄漏为 0、事件连续性冲突为 0、餐后餐具清理逻辑错误为 0。

五个物理场景均通过 Habitat-Sim 冒烟测试。`102344280` 成功加载 128 个 rigid、14 个 articulated 实例及 NavMesh；其余四场景也全部加载成功。
