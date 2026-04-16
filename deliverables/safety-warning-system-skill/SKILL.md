# Safety Warning System Skill

## Purpose

Use this skill to recreate or extend the储能云端安全预警系统的“安全预警”页面，包括首页场站矩阵、右侧预警清单、单站安全诊断详情、数据清洗规则和 UI 风格规范。

## Visual Style

- Use a dark operations-console style inspired by the安全诊断 reference.
- Base background: near-black navy/charcoal.
- Panels: dark translucent surfaces, subtle borders, light blue left accent lines, restrained gradients.
- Primary accent: bright technology blue.
- Risk colors:
  - 高风险 / 一级: red.
  - 中风险 / 二级: amber.
  - 低风险 / 三级: green.
  - 健康: blue.
- Source colors:
  - 云端: blue.
  - 站端: green.
- Keep typography compact and stable. Numeric badges should not dominate labels.

## Layout

- Sidebar system name: 远景数智运营系统.
- Sidebar menu: 全景概览、安全预警、风险运营、健康管理、运营评估、交易协同、数据分析、数据运营.
- Safety warning section has three horizontal page tabs:
  - 场站总览.
  - 风险透视.
  - 预警详情.
- 场站总览:
  - Left: station filters and fixed-size station cards.
  - Right: 预警清单 panel.
- Station cards must not stretch to fill leftover space after filtering.
- Prewarning list must stay visually consistent with station cards and panel style.
- 风险透视:
  - Place 风险场站 TOP5 at the top as a vertical list, one station per row, with SOS and a risk-colored progress bar.
  - Place 场站风险等级占比 in the first row beside TOP5.
  - Rename the average metric to 全量场站平均 SOS.
  - Put 全量场站平均 SOS inside the SOS 趋势 panel; do not use a standalone 高/中风险场站 KPI card.
  - Do not use standalone KPI cards for 预警总量 and 一级预警; represent alarm severity totals with a pie/donut chart.
  - Group SOS-related charts together and alarm-related charts together.
  - Include SOS ranking bars, risk distribution donut, SOS trend point-lines, alarm severity donut, and module distribution chart.
  - Do not include an SOS band statistics chart unless explicitly requested.
  - SOS bar chart should use slim vertical bars, risk-colored thresholds, fixed visible horizontal scrolling for many stations, station-number x labels, and hover tooltip with full station name plus SOS value. Hovering a bar should highlight that bar.
  - SOS trend chart is a point-line chart showing full-station average, maximum, and minimum with 7/15/30 day quick range buttons, date x-axis labels, and point hover values.
  - Charts should update from the current station filter.
- 预警详情:
  - Provide advanced filters for keyword, level, module, source, and date range.
  - Show a table and an inspector/detail area for the selected alarm.

## Station Data Rules

- Source file: `site_config.xlsx`.
- Required fields: project number, project name, rated capacity, rated energy, total set count.
- Drop any station missing required fields.
- Group multi-row station records by project number and sum total set count.
- Normalize station names by replacing English parentheses `()` with Chinese parentheses `（）`.
- Drop known incomplete entries:
  - `待定`
  - `K-北方片区`
- Station name display format: project number immediately followed by project name, e.g. `K-0005远景乌兰察布电网侧储能`.

## SOS Rules

- `< 60`: 高风险.
- `>= 60 && < 80`: 中风险.
- `>= 80 && < 100`: 低风险.
- `= 100`: 健康.
- Display rule: `100` remains `100`; all other SOS values use two decimal places.
- Homepage target distribution currently keeps 健康 at 21 stations and shifts the remaining population to 中风险/低风险.

## Alarm Data Rules

- Source file: `risk_list_demo.xlsx`.
- Required fields: 预警名称, 模块, 风险等级, 位置格式.
- The global alarm list contains 273 generated alarms:
  - 一级: 35.
  - 二级: 70.
  - 三级: 168.
- Generate the 273 alarms once from the full station set. Do not regenerate alarms after filtering.
- When station filters change, filter the fixed global alarm list by `stationId`.
- Alarm counts in the right panel must reflect the current station filter, alarm level filter, and time filter.
- Cloud/site source split should favor 云端 over 站端, roughly 3:1.

## Alarm Location Rules

- Location format comes from `risk_list_demo.xlsx`.
- Replace subsystem number dynamically:
  - `#N子系统`, where N is within `1 - station.totalSets`.
- Rack format:
  - Starts with 1 or 2.
  - Last two digits are 01-12.
  - Examples: `Rack101`, `Rack212`.
- Pack range: 1-8.
- Cell range: 1-28.
- Preserve non-battery suffixes such as `LCC01`, `BankA-TCQ01`, `AC101`.

## Interaction Rules

- Station search/dropdown multi-select filters station cards and prewarning list together.
- Risk buttons filter station cards and prewarning list together.
- Risk perspective charts also follow the current station filters.
- The alarm detail page uses the currently scoped alarm set, then applies its own advanced filters.
- Alarm level tabs filter alarm list and source counts together.
- Alarm time controls:
  - Default: 全部.
  - Shortcuts: 最近30天, 最近7天, 最近3天.
  - Manual date range supported.
- Alarm card hover/focus reveals 预警位置.
- Clicking a station card or alarm card opens the single-station detail page.

## Deliverables To Maintain

- Static HTML/CSS/JS implementation.
- `deliverables/PRD_safety_warning_system.md`.
- This reusable skill document.
- Keep all three synchronized whenever behavior, data rules, or UI conventions change.
