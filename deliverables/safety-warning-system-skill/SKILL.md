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
- Sidebar menu uses a two-level structure for this module:
  - 一级：全景概览、安全预警、健康管理、运营评估、交易协同、数据分析、数据运营。
  - 二级（安全预警下）：安全监测、安全评估、预警管理、风险运营。
- Page mapping:
  - 安全监测 -> 原“场站总览”页面。
  - 安全评估 -> 原“风险透视”页面。
  - 预警管理 -> 原“预警详情”页面。
- Only the active second-level page should use the strong blue selected state. The first-level “安全预警” stays in expanded state without competing highlight.
- 场站总览:
  - Left: station filters and fixed-size station cards.
  - Right: 预警清单 panel.
  - Keep a clear left gutter between the station search toolbar and the sidebar divider; the search field must not visually collide with the sidebar.
  - Add a 查看详情 action in the top-right of the 预警清单 panel that jumps to the standalone 预警详情 page.
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
  - Place 场站SOS分布 and 全量场站SOS趋势 on the same row, with 场站SOS分布 on the left and 全量场站SOS趋势 on the right.
  - Do not include an SOS band statistics chart unless explicitly requested.
  - Donut legends should sit closer to the chart center instead of hugging the right edge.
  - SOS bar chart is titled 场站SOS分布. It should use slim vertical bars, risk-colored thresholds, fixed visible horizontal scrolling for many stations, station-number x labels, and hover tooltip with full station name plus SOS value. Add sort options: 场站编号-顺序, 场站编号-倒序, SOS数值-从低到高, SOS数值-从高到低. The SOS value color should match the bar color. Hovering a bar should use a narrow translucent vertical highlight around one bar, not a white stroke box. Do not draw a miniature curve behind the x-axis labels.
  - Trend chart is titled 全量场站SOS趋势 and is a point-line chart showing full-station average, maximum, and minimum with 7/15/30 day quick range buttons and `MM-DD` x-axis labels such as `04-01`. The legend label for the average is 全量场站平均值, while tooltip rows use 平均值. Hovering a date column should show a vertical guide line, highlight all three points for that date, and display maximum, average, and minimum values together. The minimum line is purple; the 80 line is yellow dashed and the 60 line is red dashed.
  - 预警模块分布 should be a donut/pie chart for 电池系统、电气系统、环控系统、消防系统.
  - 告警类型 TOP5 should use a progress-list layout similar to 风险场站 TOP5. Counts should vary, and colors should be red, yellow, green, cyan, purple in order.
  - Charts should update from the current station filter.
- 预警详情:
  - Use a top horizontal filter bar and full-width alarm table, similar to the provided 风险预警列表 reference.
  - The three summary charts above the alarm table must share the same filtered alarm dataset as the table below, and update together when time, level, module, alarm name, station, location, status, or source filters change.
  - Alarm-type TOP5 counts and bar lengths must come from the real filtered aggregation result; do not add demo-only offsets to the numbers.
  - In the unfiltered default state, the alarm-type TOP5 should show a naturally descending distribution rather than five identical counts.
  - Query bar contains filters for time, level, module, alarm name, station, location, status, and source.
  - Level, module, and source are multi-select dropdowns. Alarm name, station, and location are searchable multi-select dropdowns. Time uses a start/end date range.
  - Multi-select dropdowns must reuse the same visual pattern as the station search dropdown on 场站总览: trigger box, arrow behavior, search input, option row, selected checkmark, shadow, and high z-index overlay. Treat this as the shared system component style for future dropdowns.
  - In 预警管理, each filter trigger arrow should sit flush to the right edge in a consistent position across all filter boxes, and should keep the same downward state when the menu opens.
  - Non-searchable dropdown menus in 预警管理 should open at trigger width, while searchable dropdown menus may expand wider for content search.
  - Table columns: optional SR-return envelope marker, 等级, 预警名称, 模块, 场站, 位置, 事件时间, 预警时间, 状态, 来源.
  - In 预警管理, aggregate rows by `预警名称 + 模块 + 场站 + 位置 + 来源`. Cloud-side and station-side alarms must stay in separate rows and separate detail modal groups, while 等级、事件时间、预警时间、状态 use the latest alarm in that group.
  - The 状态 column follows this lifecycle:
    - Initial generated alarm: `待处理`.
    - First-step close: `关闭-误报`, `关闭-数据异常`, or `关闭-其他`.
    - SR issued: `排查中`.
    - SR returned and final close: `关闭-准确` or `关闭-类型不准确`; when the selected failure mode needs more root-cause detail, use `关闭-待补充根因` until root cause is submitted.
  - All `关闭-XXX` status pills must use a gray visual style.
  - After an SR is issued and completed/returned, show an envelope marker before the 等级 column for the corresponding aggregated alarm row.
  - Alarm table column priority: keep 等级, 模块, 来源 relatively compact; give more width to 预警名称, 场站, 位置; keep 事件时间 and 预警时间 visually stable.
  - Do not place details at the page bottom. Open alarm details in a modal when an aggregated row is clicked.
  - The alarm modal should behave like a card for the aggregate group: show multiple time-specific alarms as table rows in the upper section, newest first by 预警时间 descending, and update the lower trend chart when a different row is selected.
  - Above the grouped alarm rows, show three compact context boxes for 模块, 场站, and 位置. The grouped alarm rows themselves use only these columns: 序号, 等级, 事件时间, 预警时间, 关闭时间, 持续时长, 状态. Use plain numeric sequence values such as `1`, `2`, `3`; make 序号 and 等级 slightly wider and center aligned; keep 持续时长 narrower; widen the timestamp columns. Do not include 来源 or 位置 columns in the row table. 关闭时间 is auto-filled when the warning is closed and stays blank while open. The first few risk-warning-list groups should include multiple same-group rows with different times and different levels so selecting different rows switches the trend chart.
  - The modal should emphasize alarm name and handling suggestion. Keep 来源 as an upper-left triangular hero marker with only the triangular background and outline, no extra inner box. Rotate the source text 45 degrees, using blue for 云端 and green for 站端, and keep it large enough to read. Do not show level/module tags such as `一级` or `电池系统` in the hero card. If a linked cloud/station alarm exists, place a jump button in the hero card's bottom-right corner, colored to match the linked alarm source: blue for 云端 and green for 站端. Do not render separate boxed metadata cards for 来源、事件时间、预警时间、持续时长、当前状态.
  - The modal hero gradient should match severity: 一级 uses red-blue, 二级 uses yellow-blue, and 三级 uses green-blue.
  - Full timestamps in the alarm detail page and modal should include seconds, using `YYYY/MM/DD HH:mm:ss`.
  - The modal should include an interactive trend curve for alarm-related data, with 处理 and 分析 action buttons below the chart.
  - Clicking 处理 opens a separate centered processing modal rather than expanding content at the bottom of the detail modal. The processing modal contains a two-path workflow:
    - First choose `关闭预警` or `下发 SR`, without explanatory microcopy such as `请选择本组预警闭环路径`.
    - If closing directly, require one of `误报`, `数据异常`, or `其他`; `其他` requires a manual reason.
    - If issuing SR, show `场站`, `位置`, `模块`, and `预警名称` at the top of the SR modal, then render four form rows: first `SR编号`, second editable blank `操作指导`, third attachment upload, fourth `SR下发时间` and `期望完成时间`. Do not show `工单编号` in the issue form. Both time fields use date+hour-minute controls. Default `SR下发时间` to the current Beijing time when the SR form opens.
    - After SR issue, update the group status to `排查中`. Once the SR is returned/completed, the row gets an envelope marker and the modal close flow shows `SR编号` plus `关联工单编号`, read-only deterministic returned `排查结论` such as `现场已完成排查，确认该Pack存在铜排螺栓松动`, the `类型准确` / `类型不准确` confirmation choice, and a final alarm-related failure-mode dropdown. Include `其他` in that dropdown and require a manual failure-mode entry when `其他` is selected.
    - Some failure modes require root-cause completion. After confirm close, set the group status to `关闭-待补充根因`, render a root-cause input area at the bottom of the alarm card, and only change to `关闭-准确` or `关闭-类型不准确` after the root cause is submitted.
    - After `类型准确/类型不准确` and failure mode are selected, reopening 处理 should show a read-only SR result review instead of the selection form. Only `关闭-待补充根因` shows a root-cause input at the bottom of that result modal.
- Single-station detail:
  - Apply every change through the shared station detail template so all station pages behave consistently.
  - Do not show the breadcrumb line `集团安全中心 / 安全预警 / 场站名称`.
  - Keep the top station title plus communication, risk, and SOS badges. Risk and SOS colors must match the risk palette: red/yellow/green/blue.
  - Remove the top metric strip for rated power, active power, remaining energy, SOC, and current alarms.
  - Use a two-column layout: left side for station charts and SOS detail table, right side for the station-scoped 预警清单.
  - The right-side station alarm list should visually match the 场站总览 alarm panel, list only alarms belonging to the current station, and align its bottom with the bottom of the left-side SOS detail table.
  - Do not show the alarm-location hover overlay in the station-scoped right-side alarm list.
  - The station-scoped right-side alarm list should keep feature parity with 场站总览: level tabs, source counts, quick time windows, manual date range, and filtered alarm cards.
  - Gauges, donut charts, bar charts, trend charts, box plots, and tables should use the same dark technology style and risk color rules as 风险透视 and 预警详情.
  - The station SOS gauge should use the same segmented half-gauge style as 风险透视's 全量场站平均 SOS card, not a solid block arc.
  - The station SOS gauge number should use a fixed light color and sit visually centered inside the half gauge.
  - Trend and bar charts should use the same hover pattern as 风险透视: current point/bar highlight plus tooltip with date/subsystem and SOS value.
  - The subsystem SOS bar chart should use slim bars with spacing larger than bar width.
  - The station trend chart should not show threshold text such as 高风险/中风险 and should not show a y-axis title. X-axis labels always use `MM-DD`; longer ranges may show fewer labels but must keep that format.
  - The subsystem SOS bar chart should have a right-side sort dropdown with 子系统编号-顺序, 子系统编号-倒序, SOS数值-从低到高, and SOS数值-从高到低, plus a risk legend matching 风险透视.
  - Subsystem SOS bar chart x-axis labels use two-digit labels with `#`, such as `#01` and `#02`.
  - 设备部件 SOS 指数分析 must be a box plot. Show upper edge, upper quartile, median, mean, lower quartile, lower edge, and outliers. Hovering the box shows statistical parameters; hovering an outlier shows the specific subsystem.
  - Keep clear spacing between box-plot boxes.
  - SOS 安全指数详情清单 and the subsystem SOS bar chart must read from the same subsystem SOS dataset. Each table row's subsystem id and SOS value must match the corresponding bar in the chart.
  - SOS 安全指数详情清单 defaults to sorting by current SOS ascending. Sortable headers toggle ascending/descending order.
  - SOS 安全指数详情清单 has a sticky translucent header matching the alarm detail table. Only 子系统, 当前 SOS 指数, and 更新日期 are sortable; 风险描述 and 处置建议 are plain text headers. Sort toggles must not cause column width shifts. Do not use placeholder wording such as “超长字段” in risk descriptions.

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
- Clicking a station card opens the single-station detail page.
- Clicking an alarm card on 场站总览 or 单站详情 opens the same modal alarm detail card used by the 预警详情 page, including handling suggestion and interactive trend chart.
- Alarm detail modals must sit above all page controls, including station filters, dropdowns, and floating selector menus.

## Deliverables To Maintain

- Static HTML/CSS/JS implementation.
- `deliverables/PRD_safety_warning_system.md`.
- This reusable skill document.
- Keep all three synchronized whenever behavior, data rules, or UI conventions change.
