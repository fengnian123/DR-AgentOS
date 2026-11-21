---
license: other
tags: [datasets, tabular, 3d, embodied-ai, dynamic-environments, long-term-memory, 4d-memory, state-prediction]
pretty_name: P4D-HSSD Five-Scene 30/5/5-Day
---

# P4D-HSSD Five-Scene 30/5/5-Day

Unified `p4d_benchmark_v1.0` data for the original HSSD pilot home plus four additional homes. Each scene contains 30 training days followed by 5 validation days and 5 test days, with 30 independent target instances covering Stable, Activity-Routine Mobile, Personal-Habit Mobile, and Irregular Mobile behavior.

- `102344280`: 15 regions, 1460 queries, 1782 latent moves
- `102344094`: 11 regions, 1460 queries, 1761 latent moves
- `102816852`: 11 regions, 1460 queries, 1714 latent moves
- `103997403_171030405`: 8 regions, 1460 queries, 1731 latent moves
- `104348511_171513654`: 18 regions, 1460 queries, 1754 latent moves

Public test queries contain observations but no answer fields. Test activities, world events, and full labels live only in `private/` and must not be used by a model.

Totals: 7300 queries, 5717 target observations, 8742 latent object moves, 1841 activities.

Version 2 expands mobile-object search sets with semantically valid distractor receptacles; the underlying 40-day event timeline is unchanged by this transform.
