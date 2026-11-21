# Huang Haoyang contribution

Uploader: `@aisavetheworld`

Workspace owner: `huanghaoyang`

## Included dataset

[`datasets/p4d_hssd_5scene_30d_v2/`](datasets/p4d_hssd_5scene_30d_v2/)
contains `p4d_hssd_5scene_30d_v2.1.0`, the five-scene P4D-HSSD benchmark data
used for object-location prediction.

The folder name retains `30d` because the unified training horizon is 30 days.
Each scene contains an additional 5 validation days and 5 test days, for a
40-day timeline in total.

| Split | Day indices | Days per scene | Queries | Observations |
| --- | --- | ---: | ---: | ---: |
| Train | 0-29 | 30 | 5,475 | 4,309 |
| Validation | 30-34 | 5 | 910 | 705 |
| Test | 35-39 | 5 | 915 | 703 |
| Total | 0-39 | 40 | 7,300 | 5,717 |

Additional totals are 8,742 latent world events, 1,841 activities, 150 target
instances, and 140 candidate states across five scenes.

## Data-use boundary

- Public test queries and observations are under `data/` and contain no answer
  labels.
- Test labels, activities, and world events are under `private/`. They are for
  final evaluation only and must not be exposed to training, tuning, feature
  engineering, or candidate selection.
- Training and validation labels are included in their query Parquet files.
- The split is chronological within each scene; do not randomly reshuffle days
  across train, validation, and test.

## What changed in v2.1.0

The former 30-day sequence is preserved and now forms the complete training
split. Days 30-39 extend the same household-routine, personal-habit, patrol, and
sparse irregular-movement rules. The added days are newly generated rather
than copies or time-shifted duplicates.

## Verification

The checked-in reports record a successful validation run:

- unique query IDs;
- complete 30/5/5 day coverage in every scene;
- identical query schemas across splits;
- zero future-observation leakage;
- zero public test-label leakage;
- zero world-event continuity errors;
- zero meal-cleanup logic errors;
- all five physical-scene smoke tests passed in the source environment.

See the dataset's [`GENERATION_REPORT.md`](datasets/p4d_hssd_5scene_30d_v2/GENERATION_REPORT.md),
[`metadata/validation_report.json`](datasets/p4d_hssd_5scene_30d_v2/metadata/validation_report.json),
and [`metadata/checksums.json`](datasets/p4d_hssd_5scene_30d_v2/metadata/checksums.json).

## Important notes

- The HSSD physical scene assets are not bundled in this contribution. The
  project-relative paths in `metadata/dataset_manifest.json` document the
  expected source layout; the Parquet benchmark tables can be used without
  those assets.
- Source redistribution terms are still pending review; consult `LICENSE` and
  `metadata/source_attribution.json` before republishing the data outside this
  private project repository.
- Existing model-comparison results produced with the previous 20/5/5 split
  are not comparable as final v2.1.0 results and should be retrained.

## Minimal loading example

```python
from pathlib import Path
import pyarrow.parquet as pq

root = Path("contributions/huanghaoyang/datasets/p4d_hssd_5scene_30d_v2")
train = pq.read_table(
    root / "data/queries/train-00000-of-00001.parquet"
)
validation = pq.read_table(
    root / "data/queries/validation-00000-of-00001.parquet"
)
test = pq.read_table(
    root / "data/queries/test-00000-of-00001.parquet"
)
```
