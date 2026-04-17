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
  - The first row contains three panels in this order: 风险场站 TOP5, 全量场站平均 SOS, and 场站风险等级占比.
  - 风险场站 TOP5 is a vertical list, one station per row, with SOS and a risk-colored progress bar.
  - Rename the average metric to 全量场站平均 SOS.
  - Keep 全量场站平均 SOS as a standalone first-row gauge panel, calculated from all valid stations and unaffected by current station filters. The gauge should use a smooth red/yellow/green gradient, sparse readable ticks, and should not show 当前风险等级 text. Do not use a standalone 高/中风险场站 KPI card.
  - Do not use standalone KPI cards for 预警总量 and 一级预警; represent alarm severity totals with a pie/donut chart.
  - Group SOS-related charts together and alarm-related charts together.
  - Include SOS distribution bars, risk distribution donut, full-station SOS trend point-lines, alarm severity donut, module distribution donut, and alarm-type TOP5.
  - Do not include an SOS band statistics chart unless explicitly requested.
  - Donut legends should sit closer to the chart center instead of hugging the right edge.
  - SOS bar chart is titled 场站SOS分布. It should use slim vertical bars, risk-colored thresholds, fixed visible horizontal scrolling for many stations, station-number x labels, and hover tooltip with full station name plus SOS value. Add sort options: 场站编号-顺序, 场站编号-倒序, SOS数值-从低到高, SOS数值-从高到低. The SOS value color should match the bar color. Hovering a bar should use a narrow translucent vertical highlight around one bar, not a white stroke box. Do not draw a miniature curve behind the x-axis labels.
  - Trend chart is titled 全量场站SOS趋势 and is a point-line chart showing full-station average, maximum, and minimum with 7/15/30 day quick range buttons and `MM-DD` x-axis labels such as `04-01`. The legend label for the average is 全量场站平均值, while tooltip rows use 平均值. Hovering a date column should show a vertical guide line, highlight all three points for that date, and display maximum, average, and minimum values together. The minimum line is purple; the 80 line is yellow dashed and the 60 line is red dashed.
  - 预警模块分布 should be a donut/pie chart for 电池系统、电气系统、环控系统、消防系统.
  - 告警类型 TOP5 should use a progress-list layout similar to 风险场站 TOP5. Counts should vary, and colors should be red, yellow, green, cyan, purple in order.
  - Charts should update from the current station filter.
- 预警详情:
  - Use a top horizontal filter bar and full-width alarm table, similar to the provided 风险预警列表 reference.
  - Query bar contains filters for time, module, alarm name, station, location, and source.
  - Module and source are multi-select dropdowns. Alarm name, station, and location are searchable multi-select dropdowns. Time uses a start/end date range.
  - Table columns: 等级, 预警名称, 模块, 场站, 位置, 事件时间, 预警时间, 来源.
  - Do not place details at the page bottom. Open alarm details in a modal when a row is clicked.
  - The modal should emphasize alarm name, risk level, and handling suggestion. Basic fields include module, station, location, source, event time, warning time, and duration in hours.
  - The modal should include an interactive trend curve for alarm-related data, with 处理 and 分析 action buttons below the chart.

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
