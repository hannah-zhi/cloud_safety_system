const riskMeta = {
  high: { label: "高风险", className: "high", tone: "tone-danger", color: "#ff3d59", order: 0 },
  mid: { label: "中风险", className: "mid", tone: "tone-warn", color: "#f4a51c", order: 1 },
  low: { label: "低风险", className: "low", tone: "tone-ok", color: "#13c781", order: 2 },
  healthy: { label: "健康", className: "healthy", tone: "tone-blue", color: "#1689ff", order: 3 },
};

const commMeta = {
  ok: { label: "通讯正常", tone: "tone-ok", color: "#13c781" },
  partial: { label: "部分通讯中断", tone: "tone-warn", color: "#f4a51c" },
  down: { label: "通讯中断", tone: "tone-danger", color: "#ff3d59" },
};

const stationNames = [
  "远景乌兰察布关键节点电站",
  "枣庄市峄城石膏矿沉陷区",
  "华润电力罗山",
  "新干县盐化",
  "华润电力蒲川",
  "龙泉甘肃张掖",
  "淮阳县聚能50MW风电项目",
  "渝水区江口",
  "青海共和塔拉滩",
  "怀仁金沙滩",
  "准格尔旗纳日松",
  "嘉峪关镜铁山",
  "鄂尔多斯达拉特",
  "张北柔直配储",
  "酒泉肃北马鬃山",
  "盐城大丰沿海",
  "乌兰察布后旗",
  "榆林靖边风光储",
  "通辽霍林郭勒",
  "阿拉善腾格里",
];

const stationTypeLabels = ["配套储能", "独立储能", "工商业储能"];

const state = {
  stations: [],
  filtered: [],
  alarms: [],
  allAlarms: [],
  activeAlarmType: "all",
  activeAlarmDays: "all",
  alarmStartDate: "",
  alarmEndDate: "",
  sosMin: 0,
  sosMax: 100,
  detailAlarmType: "all",
  detailAlarmDays: "all",
  detailAlarmStartDate: "",
  detailAlarmEndDate: "",
  activePage: "overview",
  selectedAlarm: null,
  selectedAlarmGroup: null,
  activeModalAlarmId: null,
  alarmProcessMode: null,
  detailAlarmSelectedIds: new Set(),
  detailAlarmSelectionMode: false,
  detailAlarmContextId: null,
  riskTrendRange: 7,
  riskBarHitboxes: [],
  riskTrendHitboxes: [],
  riskBarHoverId: null,
  riskTrendHover: null,
  riskBarSort: "sosAsc",
  alarmTrendHitboxes: [],
  detailBoxHitboxes: [],
  detailTrendHitboxes: [],
  detailTrendHover: null,
  detailBarHitboxes: [],
  detailBarHoverName: null,
  detailSubsystems: [],
  detailTableSort: { key: "score", direction: "asc" },
  alarmDetailSelections: {
    level: new Set(),
    module: new Set(),
    name: new Set(),
    station: new Set(),
    location: new Set(),
    source: new Set(),
  },
  activeFilter: "all",
  selectedStationIds: new Set(),
  selectedStation: null,
  trendRange: 7,
  sortSubsystemMode: "idAsc",
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  state.stations = createStations();
  state.allAlarms = createAlarms(state.stations);
  renderAlarmDetailFilters();
  renderFilters();
  applyFilters();
  bindEvents();
  openPageFromUrl();
  openStationFromUrl();
  tickClock();
  setInterval(tickClock, 1000);
});

function bindElements() {
  [
    "stationGrid",
    "searchInput",
    "stationPickerMenu",
    "stationPickerList",
    "stationSelector",
    "sortSelect",
    "sosMinInput",
    "sosMaxInput",
    "sosMinRange",
    "sosMaxRange",
    "sosRangeFill",
    "statusFilters",
    "selectedCount",
    "resultText",
    "clearFilterBtn",
    "pageTabs",
    "listView",
    "riskView",
    "alarmDetailView",
    "detailView",
    "backBtn",
    "detailTitle",
    "detailComm",
    "detailRisk",
    "detailSos",
    "detailAlarmSubtitle",
    "detailAlarmTabs",
    "detailAlarmTimeButtons",
    "detailAlarmStartDate",
    "detailAlarmEndDate",
    "detailAlarmList",
    "detailAlarmCountAll",
    "detailAlarmCountLevel1",
    "detailAlarmCountLevel2",
    "detailAlarmCountLevel3",
    "detailAlarmCloudCount",
    "detailAlarmStationCount",
    "gauge",
    "gaugeValue",
    "gaugeLabel",
    "rangeButtons",
    "subsystemSortBtn",
    "alertTable",
    "detailTrendChart",
    "detailTrendTooltip",
    "detailBarsViewport",
    "detailBarsTooltip",
    "donutLegend",
    "alarmTabs",
    "alarmList",
    "alarmTimeButtons",
    "alarmStartDate",
    "alarmEndDate",
    "alarmCountAll",
    "alarmCountLevel1",
    "alarmCountLevel2",
    "alarmCountLevel3",
    "alarmCloudCount",
    "alarmStationCount",
    "alarmDetailJump",
    "riskAvgSos",
    "riskAvgGauge",
    "riskTopList",
    "riskTrendButtons",
    "riskBarSort",
    "riskBarsViewport",
    "riskBarsTooltip",
    "riskTrendChart",
    "riskTrendTooltip",
    "riskPieLegend",
    "riskAlarmPieLegend",
    "riskModuleLegend",
    "riskAlarmNameTopList",
    "alarmDetailName",
    "alarmDetailStation",
    "alarmDetailLocation",
    "alarmDetailLevel",
    "alarmDetailModule",
    "alarmDetailSource",
    "alarmDetailStart",
    "alarmDetailEnd",
    "alarmDetailReset",
    "alarmDetailCount",
    "alarmDetailTable",
    "alarmRowContextMenu",
    "alarmMultiSelectBtn",
    "alarmBatchBar",
    "alarmBatchCount",
    "alarmBatchAction",
    "alarmBatchCancel",
    "alarmSelectionToast",
    "alarmInspectorBody",
    "alarmDetailModal",
    "alarmModalMask",
    "alarmModalClose",
    "alarmTrendChart",
    "alarmTrendTooltip",
    "alarmProcessBtn",
    "alarmAnalysisBtn",
    "alarmProcessModal",
    "alarmProcessModalMask",
    "alarmProcessModalClose",
    "alarmProcessPanel",
    "boxChartWrap",
    "boxTooltip",
    "clock",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
  els.trendCanvas = document.getElementById("trendCanvas");
  els.donutCanvas = document.getElementById("donutCanvas");
  els.barCanvas = document.getElementById("barCanvas");
  els.boxCanvas = document.getElementById("boxCanvas");
  els.gaugeCanvas = document.getElementById("gaugeCanvas");
  els.riskBarsCanvas = document.getElementById("riskBarsCanvas");
  els.riskAvgGaugeCanvas = document.getElementById("riskAvgGaugeCanvas");
  els.riskPieCanvas = document.getElementById("riskPieCanvas");
  els.riskTrendCanvas = document.getElementById("riskTrendCanvas");
  els.riskAlarmPieCanvas = document.getElementById("riskAlarmPieCanvas");
  els.riskModuleCanvas = document.getElementById("riskModuleCanvas");
  els.alarmTrendCanvas = document.getElementById("alarmTrendCanvas");
}

function bindEvents() {
  els.pageTabs?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-page]");
    if (!button) return;
    showPage(button.dataset.page);
  });
  document.querySelectorAll(".nav-toggle, .nav-subtoggle").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.toggleTarget;
      if (!targetId) return;
      const group = button.closest(".nav-group, .nav-subgroup");
      if (!group) return;
      group.classList.toggle("is-open");
      button.setAttribute("aria-expanded", group.classList.contains("is-open") ? "true" : "false");
    });
  });
  els.searchInput.addEventListener("input", applyFilters);
  els.searchInput.addEventListener("focus", () => {
    openStationPicker();
    renderStationPicker();
  });
  document.addEventListener("click", (event) => {
    if (!els.stationSelector.contains(event.target) && !els.stationPickerMenu.contains(event.target)) {
      closeStationPicker();
    }
    hideAlarmRowContextMenu();
  });
  window.addEventListener("resize", positionStationPicker);
  window.addEventListener("scroll", positionStationPicker, true);
  els.sortSelect.addEventListener("change", applyFilters);
  bindSosRangeEvents();
  els.clearFilterBtn.addEventListener("click", () => {
    state.activeFilter = "all";
    state.selectedStationIds.clear();
    setSosRange(0, 100, false);
    els.searchInput.value = "";
    applyFilters();
    renderFilters();
    renderStationPicker();
  });
  els.alarmTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-type]");
    if (!button) return;
    state.activeAlarmType = button.dataset.type;
    els.alarmTabs.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    renderAlarms();
  });
  els.alarmDetailJump.addEventListener("click", () => showPage("alarm"));
  els.alarmTimeButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-days]");
    if (!button) return;
    state.activeAlarmDays = button.dataset.days;
    state.alarmStartDate = "";
    state.alarmEndDate = "";
    els.alarmStartDate.value = "";
    els.alarmEndDate.value = "";
    els.alarmTimeButtons.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    renderAlarms();
  });
  [els.alarmStartDate, els.alarmEndDate].forEach((input) => {
    input.addEventListener("change", () => {
      state.activeAlarmDays = "custom";
      state.alarmStartDate = els.alarmStartDate.value;
      state.alarmEndDate = els.alarmEndDate.value;
      els.alarmTimeButtons.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      renderAlarms();
    });
  });
  els.detailAlarmTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-type]");
    if (!button) return;
    state.detailAlarmType = button.dataset.type;
    els.detailAlarmTabs.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    if (state.selectedStation) renderDetailAlarms(state.selectedStation);
  });
  els.detailAlarmTimeButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-days]");
    if (!button) return;
    state.detailAlarmDays = button.dataset.days;
    state.detailAlarmStartDate = "";
    state.detailAlarmEndDate = "";
    els.detailAlarmStartDate.value = "";
    els.detailAlarmEndDate.value = "";
    els.detailAlarmTimeButtons.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    if (state.selectedStation) renderDetailAlarms(state.selectedStation);
  });
  [els.detailAlarmStartDate, els.detailAlarmEndDate].forEach((input) => {
    input.addEventListener("change", () => {
      state.detailAlarmDays = "custom";
      state.detailAlarmStartDate = els.detailAlarmStartDate.value;
      state.detailAlarmEndDate = els.detailAlarmEndDate.value;
      els.detailAlarmTimeButtons.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      if (state.selectedStation) renderDetailAlarms(state.selectedStation);
    });
  });
  [els.alarmDetailStart, els.alarmDetailEnd].forEach((input) => {
    input.addEventListener("input", renderAlarmDetailPage);
    input.addEventListener("change", renderAlarmDetailPage);
  });
  els.alarmDetailReset.addEventListener("click", () => {
    Object.values(state.alarmDetailSelections).forEach((set) => set.clear());
    els.alarmDetailStart.value = "";
    els.alarmDetailEnd.value = "";
    state.selectedAlarm = null;
    state.detailAlarmSelectedIds.clear();
    state.detailAlarmSelectionMode = false;
    renderAlarmDetailFilters();
    renderAlarmDetailPage();
  });
  els.alarmMultiSelectBtn?.addEventListener("click", enableAlarmSelectionMode);
  els.alarmBatchAction?.addEventListener("click", handleBatchAlarmProcess);
  els.alarmBatchCancel?.addEventListener("click", cancelAlarmSelectionMode);
  els.alarmModalClose.addEventListener("click", closeAlarmModal);
  els.alarmModalMask.addEventListener("click", closeAlarmModal);
  els.alarmProcessModalClose?.addEventListener("click", closeAlarmProcessModal);
  els.alarmProcessModalMask?.addEventListener("click", closeAlarmProcessModal);
  els.alarmProcessBtn?.addEventListener("click", () => {
    state.alarmProcessMode = state.selectedAlarmGroup?.srCompleted ? "srClose" : "choose";
    renderAlarmProcessPanel();
  });
  els.alarmAnalysisBtn?.addEventListener("click", () => {
    state.alarmProcessMode = "analysis";
    renderAlarmProcessPanel();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (els.alarmProcessModal?.classList.contains("show")) closeAlarmProcessModal();
      else closeAlarmModal();
    }
  });
  els.alarmTrendCanvas.addEventListener("mousemove", handleAlarmTrendHover);
  els.alarmTrendCanvas.addEventListener("mouseleave", () => {
    els.alarmTrendTooltip.classList.remove("show");
  });
  els.boxCanvas.addEventListener("mousemove", handleBoxHover);
  els.boxCanvas.addEventListener("mouseleave", () => {
    els.boxTooltip.classList.remove("show");
  });
  els.trendCanvas.addEventListener("mousemove", handleDetailTrendHover);
  els.trendCanvas.addEventListener("mouseleave", () => {
    state.detailTrendHover = null;
    if (state.selectedStation) renderTrend(state.selectedStation, state.trendRange);
    els.detailTrendTooltip.classList.remove("show");
  });
  els.barCanvas.addEventListener("mousemove", handleDetailBarHover);
  els.barCanvas.addEventListener("mouseleave", () => {
    state.detailBarHoverName = null;
    if (state.selectedStation) renderBars(state.detailSubsystems);
    els.detailBarsTooltip.classList.remove("show");
  });
  document.querySelectorAll(".table-sort-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.sortKey;
      state.detailTableSort = {
        key,
        direction: state.detailTableSort.key === key && state.detailTableSort.direction === "asc" ? "desc" : "asc",
      };
      if (state.selectedStation) renderTable();
    });
  });
  els.riskTrendButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-range]");
    if (!button) return;
    state.riskTrendRange = Number(button.dataset.range);
    els.riskTrendButtons.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    renderRiskView();
  });
  els.riskBarsCanvas.addEventListener("mousemove", handleRiskBarHover);
  els.riskBarsCanvas.addEventListener("mouseleave", () => {
    state.riskBarHoverId = null;
    renderSafely(() => renderRiskBars(state.stations));
    els.riskBarsTooltip.classList.remove("show");
  });
  els.riskTrendCanvas.addEventListener("mousemove", handleRiskTrendHover);
  els.riskTrendCanvas.addEventListener("mouseleave", () => {
    state.riskTrendHover = null;
    renderSafely(() => renderRiskTrend(state.stations, state.riskTrendRange));
    els.riskTrendTooltip.classList.remove("show");
  });
  els.riskBarSort.addEventListener("change", () => {
    state.riskBarSort = els.riskBarSort.value;
    state.riskBarHoverId = null;
    renderRiskBars(state.stations);
  });
  els.backBtn.addEventListener("click", showList);
  els.rangeButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-range]");
    if (!button || !state.selectedStation) return;
    state.trendRange = Number(button.dataset.range);
    els.rangeButtons.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    renderTrend(state.selectedStation, state.trendRange);
  });
  els.subsystemSortBtn.addEventListener("change", () => {
    if (!state.selectedStation) return;
    state.sortSubsystemMode = els.subsystemSortBtn.value;
    state.detailBarHoverName = null;
    renderBars(state.detailSubsystems);
  });
  window.addEventListener("resize", () => {
    if (state.selectedStation) renderDetailCharts(state.selectedStation);
    if (state.activePage === "risk") renderRiskView();
  });
}

function createStations(count = 110) {
  const configuredStations = Array.isArray(window.SITE_CONFIG_STATIONS) ? window.SITE_CONFIG_STATIONS : null;
  if (configuredStations?.length) {
    return configuredStations.map((item, index) => createStationFromConfig(item, index, configuredStations.length));
  }
  return Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    const name = stationNames[index % stationNames.length];
    const sos = scoreFor(n);
    const risk = getRisk(sos);
    const comm = n % 13 === 0 || n % 17 === 0 ? "down" : n % 7 === 0 || n % 11 === 0 ? "partial" : "ok";
    const run = comm === "down" && n % 2 === 0 ? "停机" : n % 5 === 0 ? "运行" : "待机";
    const rated = round(1 + ((n * 7) % 18) * 0.55, 2);
    const ratedEnergy = round(rated * (1.75 + (n % 6) * 0.18), 2);
    const active = run === "运行" ? round(rated * (0.32 + ((n % 9) / 16)), 2) : n % 6 === 0 ? round(rated * 0.08, 2) : 0;
    const energy = round(0.35 + ((n * 19) % 112) / 10, 2);
    const soc = round(Math.min(99.6, Math.max(3.8, (energy / Math.max(rated, 1)) * 18 + ((n * 3) % 34))), 2);
    return {
      id: `K-${String(n).padStart(4, "0")}`,
      name: `${name}${n % 3 === 0 ? "项目" : ""}`,
      sos,
      risk,
      comm,
      run,
      rated,
      ratedEnergy,
      active,
      energy,
      soc,
      subsystemCount: 12 + (n % 9) * 2,
      stationType: stationTypeForIndex(index, count),
      alarms: Math.max(0, riskMeta[risk].order === 3 ? n % 2 : 3 + (n % 9)),
    };
  });
}

function createStationFromConfig(item, index, total) {
  const n = index + 1;
  const sos = scoreFor(n);
  const risk = getRisk(sos);
  const comm = n % 13 === 0 || n % 17 === 0 ? "down" : n % 7 === 0 || n % 11 === 0 ? "partial" : "ok";
  const run = comm === "down" && n % 2 === 0 ? "停机" : n % 5 === 0 ? "运行" : "待机";
  const rated = Number(item.ratedCapacity);
  const ratedEnergy = Number(item.ratedEnergy);
  const subsystemCount = Number(item.subsystemCount);
  return {
    id: item.projectNo,
    name: item.projectName,
    sos,
    risk,
    comm,
    run,
    rated,
    ratedEnergy,
    active: run === "运行" ? round(rated * (0.32 + ((n % 9) / 16)), 2) : n % 6 === 0 ? round(rated * 0.08, 2) : 0,
    energy: round(ratedEnergy * Math.min(0.98, 0.32 + ((n * 7) % 58) / 100), 2),
    soc: round(Math.min(99.6, Math.max(3.8, 18 + ((n * 11) % 78))), 2),
    subsystemCount,
    stationType: stationTypeForIndex(index, total),
    alarms: Math.max(0, riskMeta[risk].order === 3 ? n % 2 : 3 + (n % 9)),
  };
}

function stationTypeForIndex(index, total) {
  const pairedLimit = Math.round(total * 0.85);
  const independentLimit = pairedLimit + Math.round(total * 0.1);
  if (index < pairedLimit) return stationTypeLabels[0];
  if (index < independentLimit) return stationTypeLabels[1];
  return stationTypeLabels[2];
}

function createAlarms(stations) {
  if (!stations.length) return [];
  const templates = Array.isArray(window.RISK_LIST_TEMPLATES) ? window.RISK_LIST_TEMPLATES : [];
  const alarmTotal = 273;
  const alarms = Array.from({ length: alarmTotal }, (_, index) => {
      const station = stations[(index * 37) % stations.length];
      const template = pickRiskTemplate(templates, index);
      const type = levelToType(template.level);
      const date = new Date(2026, 3, 15 - (index % 45), 11 - (index % 3), 21 + (index % 36));
      const eventDate = new Date(date.getTime() - (8 + (index % 22)) * 60 * 1000);
      return {
        id: `${station.id}-${index}`,
        stationId: station.id,
        stationName: station.name,
        title: template.name,
        module: template.module,
        type,
        level: template.level,
        location: createAlarmLocation(template.locationFormat, station, index),
        source: index % 4 === 0 ? "站端" : "云端",
        dateISO: formatDateInput(date),
        eventTime: formatFullDateTime(eventDate),
        warningTime: formatFullDateTime(date),
        time: `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
        status: "待处理",
        srIssued: false,
        srCompleted: false,
        srNo: "",
        workOrderNo: "",
        closeReason: "",
        closeRemark: "",
      };
    });

  const pairGroups = Math.min(20, Math.floor(alarms.length / 2));
  for (let i = 0; i < pairGroups; i += 1) {
    const firstIndex = i * 2;
    const secondIndex = firstIndex + 1;
    const first = alarms[firstIndex];
    const second = alarms[secondIndex];
    const pairId = `pair-${i + 1}`;
    const cloudWarningDate = new Date(2026, 3, 15 - ((i * 3) % 28), 9 + (i % 7), 8 + ((i * 11) % 40), 0);
    const cloudEventDate = new Date(cloudWarningDate.getTime() - (22 + (i % 6) * 7) * 60 * 1000);
    const stationWarningDate = new Date(cloudWarningDate.getTime() + (85 + (i % 5) * 17) * 60 * 1000);
    const stationEventDate = new Date(stationWarningDate.getTime() - (14 + (i % 4) * 9) * 60 * 1000);
    const shared = {
      stationId: first.stationId,
      stationName: first.stationName,
      title: first.title,
      module: first.module,
      type: first.type,
      level: first.level,
      location: first.location,
    };
    alarms[firstIndex] = {
      ...first,
      ...shared,
      source: "云端",
      dateISO: formatDateInput(cloudWarningDate),
      eventTime: formatFullDateTime(cloudEventDate),
      warningTime: formatFullDateTime(cloudWarningDate),
      time: `${String(cloudWarningDate.getMonth() + 1).padStart(2, "0")}-${String(cloudWarningDate.getDate()).padStart(2, "0")} ${String(cloudWarningDate.getHours()).padStart(2, "0")}:${String(cloudWarningDate.getMinutes()).padStart(2, "0")}`,
      linkGroupId: pairId,
      linkedAlarmId: second.id,
    };
    alarms[secondIndex] = {
      ...second,
      ...shared,
      source: "站端",
      dateISO: formatDateInput(stationWarningDate),
      eventTime: formatFullDateTime(stationEventDate),
      warningTime: formatFullDateTime(stationWarningDate),
      time: `${String(stationWarningDate.getMonth() + 1).padStart(2, "0")}-${String(stationWarningDate.getDate()).padStart(2, "0")} ${String(stationWarningDate.getHours()).padStart(2, "0")}:${String(stationWarningDate.getMinutes()).padStart(2, "0")}`,
      linkGroupId: pairId,
      linkedAlarmId: first.id,
    };
  }

  return alarms.sort((a, b) => alarmOrder(a.type) - alarmOrder(b.type));
}

function formatFullDateTime(date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
}

function scoreFor(n) {
  const wobble = Math.sin(n * 1.17) * 2.2;
  if (n % 17 === 0) return round(50 + (n % 6) + wobble, 2);
  if ((n % 7 === 0 && n !== 154) || n === 1) return 100;
  if (n % 5 === 0 || n % 11 === 0) return round(66 + (n % 10) + wobble, 2);
  return round(Math.min(99.2, 82 + (n % 7) + wobble), 2);
}

function getRisk(score) {
  if (score < 60) return "high";
  if (score < 80) return "mid";
  if (score === 100) return "healthy";
  return "low";
}

function renderFilters() {
  const counts = summarize(state.stations);
  const filters = [
    { key: "risk:high", label: "高风险", count: counts.risk.high, tone: riskMeta.high.tone },
    { key: "risk:mid", label: "中风险", count: counts.risk.mid, tone: riskMeta.mid.tone },
    { key: "risk:low", label: "低风险", count: counts.risk.low, tone: riskMeta.low.tone },
    { key: "risk:healthy", label: "健康", count: counts.risk.healthy, tone: riskMeta.healthy.tone },
  ];
  els.statusFilters.innerHTML = filters
    .map(
      (item) => `
      <button class="filter-chip ${item.tone} ${state.activeFilter === item.key ? "active" : ""}" data-filter="${item.key}" type="button">
        <span>${item.label}</span><strong>${item.count}</strong>
      </button>`
    )
    .join("");
  els.statusFilters.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeFilter = state.activeFilter === button.dataset.filter ? "all" : button.dataset.filter;
      renderFilters();
      applyFilters();
    });
  });
}

function summarize(stations) {
  const counts = {
    comm: { ok: 0, partial: 0, down: 0 },
    risk: { high: 0, mid: 0, low: 0, healthy: 0 },
  };
  stations.forEach((station) => {
    counts.comm[station.comm] += 1;
    counts.risk[station.risk] += 1;
  });
  return counts;
}

function applyFilters() {
  const keyword = els.searchInput.value.trim().toLowerCase();
  const [filterType, filterValue] = state.activeFilter.split(":");
  let filtered = state.stations.filter((station) => {
    const matchSosRange = station.sos >= state.sosMin && station.sos <= state.sosMax;
    const matchSelected = !state.selectedStationIds.size || state.selectedStationIds.has(station.id);
    const matchKeyword = state.selectedStationIds.size || !keyword || `${station.id}${station.name}`.toLowerCase().includes(keyword);
    const matchFilter =
      state.activeFilter === "all" ||
      (filterType === "comm" && station.comm === filterValue) ||
      (filterType === "risk" && station.risk === filterValue);
    return matchSosRange && matchSelected && matchKeyword && matchFilter;
  });

  const sortBy = els.sortSelect.value;
  filtered = filtered.sort((a, b) => {
    if (sortBy === "sosAsc") return a.sos - b.sos || a.id.localeCompare(b.id, "zh-CN");
    if (sortBy === "sosDesc") return b.sos - a.sos || a.id.localeCompare(b.id, "zh-CN");
    if (sortBy === "idDesc") return b.id.localeCompare(a.id, "zh-CN");
    return a.id.localeCompare(b.id, "zh-CN");
  });

  state.filtered = filtered;
  renderStations(filtered);
  state.alarms = filterAlarmsByStations(filtered);
  renderAlarms();
  if (state.activePage === "risk") renderRiskView();
  if (state.activePage === "alarm") {
    renderAlarmOverview();
    renderAlarmDetailPage();
  }
  renderStationPicker();
}

function showPage(page) {
  state.activePage = page;
  state.selectedStation = null;
  els.detailView.classList.remove("active-view");
  els.listView.classList.toggle("active-view", page === "overview");
  els.riskView.classList.toggle("active-view", page === "risk");
  els.alarmDetailView.classList.toggle("active-view", page === "alarm");
  els.pageTabs?.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === page);
  });
  if (page === "risk") renderRiskView();
  if (page === "alarm") {
    renderAlarmOverview();
    renderAlarmDetailPage();
  }
  const url = new URL(window.location.href);
  url.searchParams.delete("station");
  url.searchParams.set("page", page);
  window.history.replaceState({}, "", url);
}

function filterAlarmsByStations(stations) {
  if (!stations.length) return [];
  const stationIds = new Set(stations.map((station) => station.id));
  return state.allAlarms.filter((alarm) => stationIds.has(alarm.stationId));
}

function renderStations(stations) {
  els.selectedCount.textContent = state.selectedStationIds.size || stations.length;
  els.resultText.textContent = `共 ${stations.length} 个场站`;
  if (!stations.length) {
    els.stationGrid.innerHTML = `<div class="empty">未找到匹配场站</div>`;
    return;
  }
  els.stationGrid.innerHTML = stations.map(createStationCard).join("");
  els.stationGrid.querySelectorAll(".station-card").forEach((card) => {
    card.addEventListener("click", () => showDetail(card.dataset.id));
  });
}

function createStationCard(station) {
  const risk = riskMeta[station.risk];
  const fillColor = risk.color;
  return `
    <button class="station-card risk-${station.risk}" data-id="${station.id}" type="button">
      <div class="card-head">
        <span class="station-name" title="${station.id}${station.name}">${station.id}${station.name}</span>
        <span class="risk-dot ${risk.className}" title="${risk.label}"></span>
      </div>
      <div class="metrics">
        <div class="metric"><span>通讯状态</span><strong>${commMeta[station.comm].label}</strong></div>
        <div class="metric"><span>额定容量/能量</span><strong>${station.rated}MW/${station.ratedEnergy}MWh</strong></div>
        <div class="metric"><span>子系统数量</span><strong>${station.subsystemCount}</strong></div>
        <div class="metric"><span>场站类型</span><strong>${station.stationType}</strong></div>
      </div>
      <div class="sos-line">
        <span class="sos-label">SOS</span><span class="${scoreClass(station.sos)}">${formatSosValue(station.sos)}</span>
        <div class="sos-track"><div class="sos-fill" style="width:${station.sos}%;background:${fillColor}"></div></div>
      </div>
    </button>`;
}

function renderStationPicker() {
  if (!els.stationPickerList) return;
  const keyword = els.searchInput.value.trim().toLowerCase();
  const stations = state.stations
    .filter((station) => !keyword || `${station.id}${station.name}`.toLowerCase().includes(keyword))
    .slice(0, 40);
  const allItem = `
    <button class="selector-option" type="button" data-id="all">
      <span class="selector-check ${state.selectedStationIds.size ? "" : "checked"}"></span>
      <span>全部场站</span><strong>${state.stations.length}</strong>
    </button>`;
  els.stationPickerList.innerHTML =
    allItem +
    stations
      .map(
        (station) => `
        <button class="selector-option ${state.selectedStationIds.has(station.id) ? "selected" : ""}" type="button" data-id="${station.id}">
          <span class="selector-check ${state.selectedStationIds.has(station.id) ? "checked" : ""}"></span>
          <span>${station.id}${station.name}</span><strong>${riskMeta[station.risk].label}</strong>
        </button>`
      )
      .join("");
  els.stationPickerList.querySelectorAll(".selector-option").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      if (id === "all") {
        state.selectedStationIds.clear();
        els.searchInput.value = "";
      } else if (state.selectedStationIds.has(id)) {
        state.selectedStationIds.delete(id);
      } else {
        state.selectedStationIds.add(id);
      }
      applyFilters();
    });
  });
}

function openStationPicker() {
  els.stationSelector.classList.add("open");
  els.stationPickerMenu.classList.add("open");
  positionStationPicker();
}

function closeStationPicker() {
  els.stationSelector.classList.remove("open");
  els.stationPickerMenu.classList.remove("open");
}

function positionStationPicker() {
  if (!els.stationPickerMenu.classList.contains("open")) return;
  const rect = els.stationSelector.getBoundingClientRect();
  els.stationPickerMenu.style.left = `${Math.round(rect.left)}px`;
  els.stationPickerMenu.style.top = `${Math.round(rect.bottom + 6)}px`;
  els.stationPickerMenu.style.width = `${Math.round(rect.width)}px`;
}

function renderAlarms() {
  if (!els.alarmList) return;
  const rangeAlarms = filterAlarmsByTime(state.alarms);
  const alarms = rangeAlarms.filter((alarm) => state.activeAlarmType === "all" || alarm.type === state.activeAlarmType);
  els.alarmCountAll.textContent = rangeAlarms.length;
  els.alarmCountLevel1.textContent = rangeAlarms.filter((alarm) => alarm.type === "level1").length;
  els.alarmCountLevel2.textContent = rangeAlarms.filter((alarm) => alarm.type === "level2").length;
  els.alarmCountLevel3.textContent = rangeAlarms.filter((alarm) => alarm.type === "level3").length;
  els.alarmCloudCount.textContent = alarms.filter((alarm) => alarm.source === "云端").length;
  els.alarmStationCount.textContent = alarms.filter((alarm) => alarm.source === "站端").length;
  els.alarmList.innerHTML = alarms
    .map(
      (alarm) => `
      <button class="alarm-item alarm-${alarm.type}" type="button" data-station="${alarm.stationId}" data-alarm-id="${alarm.id}">
        <div class="alarm-body">
          <div class="alarm-row">
            <div class="alarm-tags">
              <span class="alarm-level">${alarm.level}</span><span>${alarm.module}</span>
            </div>
            <span class="alarm-source alarm-source-${alarm.source === "云端" ? "cloud" : "station"}">${alarm.source}</span>
          </div>
          <strong>${alarm.title}</strong>
          <div class="alarm-meta">
            <span class="alarm-station-name">${alarm.stationId}${alarm.stationName}</span>
            <time>${alarm.time}</time>
          </div>
          <div class="alarm-location">预警位置：${alarm.location}</div>
        </div>
      </button>`
    )
    .join("");
  els.alarmList.querySelectorAll(".alarm-item").forEach((item) => {
    item.addEventListener("click", () => {
      const alarm = alarms.find((entry) => entry.id === item.dataset.alarmId);
      openAlarmModal(alarm);
    });
  });
}

function filterAlarmsByTime(alarms) {
  return filterAlarmsByWindow(alarms, state.activeAlarmDays, state.alarmStartDate, state.alarmEndDate);
}

function filterAlarmsByWindow(alarms, activeDays, startDate, endDate) {
  if (activeDays !== "custom") {
    if (activeDays === "all") return alarms;
    const days = Number(activeDays);
    const boundary = new Date(2026, 3, 15);
    boundary.setDate(boundary.getDate() - days + 1);
    return alarms.filter((alarm) => new Date(`${alarm.dateISO}T00:00:00`) >= boundary);
  }
  const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
  const end = endDate ? new Date(`${endDate}T23:59:59`) : null;
  return alarms.filter((alarm) => {
    const date = new Date(`${alarm.dateISO}T12:00:00`);
    return (!start || date >= start) && (!end || date <= end);
  });
}

function renderRiskView() {
  const stations = state.stations;
  const avg = state.stations.reduce((sum, station) => sum + station.sos, 0) / Math.max(1, state.stations.length);
  els.riskAvgSos.textContent = formatSosValue(round(avg, 2));
  renderRiskAvgGauge(avg);
  renderSafely(() => renderRiskTopList(stations));
  renderSafely(() => renderRiskPie(stations));
  renderSafely(() => renderRiskTrend(stations, state.riskTrendRange));
  renderSafely(() => renderRiskBars(stations));
}

function renderSafely(renderFn) {
  try {
    renderFn();
  } catch (error) {
    console.error(error);
  }
}

function renderRiskTopList(stations) {
  const top = [...stations].sort((a, b) => a.sos - b.sos).slice(0, 5);
  els.riskTopList.innerHTML = top
    .map(
      (station, index) => `
      <button type="button" data-station="${station.id}">
        <span>${index + 1}</span>
        <div class="risk-top-main">
          <strong title="${station.id}${station.name}">${station.id}${station.name}</strong>
          <div class="risk-top-track"><i style="width:${station.sos}%;background:${riskMeta[station.risk].color}"></i></div>
        </div>
        <em class="${scoreClass(station.sos)}">${formatSosValue(station.sos)}</em>
      </button>`
    )
    .join("");
  els.riskTopList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => showDetail(button.dataset.station));
  });
}

function renderRiskAvgGauge(avg) {
  drawSosGauge(els.riskAvgGaugeCanvas, avg);
}

function drawSosGauge(canvasElement, value) {
  const canvas = setupCanvas(canvasElement);
  const ctx = canvas.getContext("2d");
  clear(ctx, canvas.width, canvas.height);
  const centerX = canvas.width / 2;
  const centerY = canvas.height - 18;
  const radius = Math.min(canvas.width * 0.45, 130);
  const start = Math.PI;
  const clampedValue = Math.max(0, Math.min(100, value));
  const activeEnd = start + (clampedValue / 100) * Math.PI;
  const totalTicks = 36;
  for (let i = 0; i < totalTicks; i += 1) {
    const tickStart = start + (i / (totalTicks - 1)) * Math.PI;
    const tickEnd = Math.min(start + Math.PI, start + ((i + 0.5) / (totalTicks - 1)) * Math.PI);
    const mid = (tickStart + tickEnd) / 2;
    const inner = radius - 23;
    const outer = radius;
    ctx.beginPath();
    ctx.lineWidth = 4.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = clampedValue >= 99.999 || mid <= activeEnd ? gaugeColor(i / (totalTicks - 1)) : "rgba(48, 52, 64, 0.8)";
    ctx.moveTo(centerX + Math.cos(tickStart) * inner, centerY + Math.sin(tickStart) * inner);
    ctx.lineTo(centerX + Math.cos(tickStart) * outer, centerY + Math.sin(tickStart) * outer);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(238, 247, 255, 0.42)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 6; i += 1) {
    const angle = start + (i / 6) * Math.PI;
    const inner = radius - 48;
    const outer = radius - 40;
    ctx.beginPath();
    ctx.moveTo(centerX + Math.cos(angle) * inner, centerY + Math.sin(angle) * inner);
    ctx.lineTo(centerX + Math.cos(angle) * outer, centerY + Math.sin(angle) * outer);
    ctx.stroke();
  }
}

function gaugeColor(t) {
  const stops = [
    { t: 0, c: [255, 61, 89] },
    { t: 0.35, c: [244, 165, 28] },
    { t: 0.62, c: [216, 216, 15] },
    { t: 1, c: [19, 199, 129] },
  ];
  const next = stops.find((stop) => stop.t >= t) || stops[stops.length - 1];
  const prev = [...stops].reverse().find((stop) => stop.t <= t) || stops[0];
  const p = next.t === prev.t ? 0 : (t - prev.t) / (next.t - prev.t);
  const rgb = prev.c.map((value, index) => Math.round(value + (next.c[index] - value) * p));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function renderRiskBars(stations) {
  const data = sortRiskBarStations(stations);
  const pad = { left: 46, right: 20, top: 40, bottom: 54 };
  const gap = 7;
  const barWidth = 5;
  const desiredWidth = Math.max(1280, pad.left + pad.right + data.length * (barWidth + gap) + 18);
  els.riskBarsCanvas.style.width = `${desiredWidth}px`;
  const canvas = setupCanvas(els.riskBarsCanvas);
  const ctx = canvas.getContext("2d");
  clear(ctx, canvas.width, canvas.height);
  drawGrid(ctx, pad, canvas.width, canvas.height);
  drawThreshold(ctx, pad, canvas.width, canvas.height, 60, "#ff3d59");
  drawThreshold(ctx, pad, canvas.width, canvas.height, 80, "#f4a51c");
  state.riskBarHitboxes = [];
  data.forEach((station, index) => {
    const x = pad.left + index * (barWidth + gap);
    const y = valueY(station.sos, pad, canvas.height);
    const h = canvas.height - pad.bottom - y;
    const isHover = state.riskBarHoverId === station.id;
    if (isHover) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(x - 2, pad.top, barWidth + 4, canvas.height - pad.top - pad.bottom);
    }
    const gradient = ctx.createLinearGradient(0, y, 0, canvas.height - pad.bottom);
    gradient.addColorStop(0, riskMeta[station.risk].color);
    gradient.addColorStop(1, "rgba(255,255,255,0.05)");
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, isHover ? barWidth + 2 : barWidth, h);
    ctx.shadowColor = riskMeta[station.risk].color;
    ctx.shadowBlur = isHover ? 16 : 5;
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, isHover ? barWidth + 2 : barWidth, Math.min(3, h));
    ctx.shadowBlur = 0;
    state.riskBarHitboxes.push({ x: x - 4, y, width: barWidth + 8, height: h, station });
    if (index % 10 === 0 || index === data.length - 1) {
      ctx.save();
      ctx.translate(x + barWidth / 2, canvas.height - 16);
      ctx.fillStyle = "#8f97a8";
      ctx.font = "11px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.fillText(station.id, 0, 0);
      ctx.restore();
    }
  });
}

function sortRiskBarStations(stations) {
  return [...stations].sort((a, b) => {
    if (state.riskBarSort === "idDesc") return b.id.localeCompare(a.id, "zh-CN");
    if (state.riskBarSort === "sosAsc") return a.sos - b.sos || a.id.localeCompare(b.id, "zh-CN");
    if (state.riskBarSort === "sosDesc") return b.sos - a.sos || a.id.localeCompare(b.id, "zh-CN");
    return a.id.localeCompare(b.id, "zh-CN");
  });
}

function renderRiskPie(stations) {
  const canvas = setupCanvas(els.riskPieCanvas);
  const ctx = canvas.getContext("2d");
  const counts = summarize(stations).risk;
  const entries = ["high", "mid", "low", "healthy"].map((key) => [key, counts[key]]);
  drawDonutChart(ctx, canvas, entries, (key) => riskMeta[key].color);
  els.riskPieLegend.innerHTML = entries
    .map(
      ([key, count]) => `
      <div class="legend-item" style="--legend-color:${riskMeta[key].color}">
        <span>${riskMeta[key].label}</span><strong>${count}</strong>
      </div>`
    )
    .join("");
}

function renderRiskAlarmPie(alarms) {
  const canvas = setupCanvas(els.riskAlarmPieCanvas);
  const ctx = canvas.getContext("2d");
  const entries = [
    ["level1", alarms.filter((alarm) => alarm.type === "level1").length],
    ["level2", alarms.filter((alarm) => alarm.type === "level2").length],
    ["level3", alarms.filter((alarm) => alarm.type === "level3").length],
  ];
  const colors = { level1: "#ff3d59", level2: "#f4a51c", level3: "#13c781" };
  const labels = { level1: "一级", level2: "二级", level3: "三级" };
  drawDonutChart(ctx, canvas, entries, (key) => colors[key]);
  els.riskAlarmPieLegend.innerHTML = entries
    .map(
      ([key, count]) => `
      <div class="legend-item" style="--legend-color:${colors[key]}">
        <span>${labels[key]}</span><strong>${count}</strong>
      </div>`
    )
    .join("");
}

function renderRiskTrend(stations, range) {
  const canvas = setupCanvas(els.riskTrendCanvas);
  const ctx = canvas.getContext("2d");
  const pad = { left: 46, right: 28, top: 42, bottom: 42 };
  const series = createRiskTrendSeries(stations, range);
  clear(ctx, canvas.width, canvas.height);
  drawGrid(ctx, pad, canvas.width, canvas.height);
  drawThreshold(ctx, pad, canvas.width, canvas.height, 60, "#ff3d59");
  drawThreshold(ctx, pad, canvas.width, canvas.height, 80, "#f4a51c");
  state.riskTrendHitboxes = [];
  drawTrendGuide(ctx, pad, canvas, series);
  drawTrendLine(ctx, series.max, pad, canvas, "#13c781", "最大值", series.labels, "max");
  drawTrendLine(ctx, series.avg, pad, canvas, "#1689ff", "平均值", series.labels, "avg");
  drawTrendLine(ctx, series.min, pad, canvas, "#a66bff", "最小值", series.labels, "min");
  ctx.fillStyle = "#8f97a8";
  ctx.font = "12px Microsoft YaHei";
  ctx.textAlign = "center";
  const labelIndexes = getXAxisLabelIndexes(series.labels.length, range <= 7 ? 7 : range <= 15 ? 6 : 7);
  labelIndexes.forEach((index) => {
    const label = series.labels[index];
    const x = pad.left + (index / Math.max(1, range - 1)) * (canvas.width - pad.left - pad.right);
    ctx.textAlign = index === 0 ? "left" : index === series.labels.length - 1 ? "right" : "center";
    ctx.fillText(label, x, canvas.height - 12);
  });
  ctx.textAlign = "center";
}

function getXAxisLabelIndexes(length, maxLabels) {
  if (length <= 0) return [];
  if (length <= maxLabels) return Array.from({ length }, (_, index) => index);
  const indexes = new Set([0, length - 1]);
  const step = (length - 1) / Math.max(1, maxLabels - 1);
  for (let i = 1; i < maxLabels - 1; i += 1) {
    indexes.add(Math.round(i * step));
  }
  return [...indexes].sort((a, b) => a - b);
}

function drawTrendGuide(ctx, pad, canvas, series) {
  if (!state.riskTrendHover) return;
  const index = state.riskTrendHover.index;
  if (index < 0 || index >= series.labels.length) return;
  const x = pad.left + (index / Math.max(1, series.labels.length - 1)) * (canvas.width - pad.left - pad.right);
  ctx.save();
  ctx.strokeStyle = "rgba(238, 247, 255, 0.36)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(x, pad.top);
  ctx.lineTo(x, canvas.height - pad.bottom);
  ctx.stroke();
  ctx.restore();
}

function createRiskTrendSeries(stations, range) {
  const labels = [];
  const avg = [];
  const max = [];
  const min = [];
  const endDate = new Date(2026, 3, 15);
  Array.from({ length: range }, (_, index) => {
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - range + 1 + index);
    const values = stations.map((station, stationIndex) => {
      const drift = Math.sin((index + 1) * 0.82 + stationIndex * 0.31) * 2.6 + Math.cos(index * 0.45 + stationIndex * 0.13) * 0.9;
      return Math.max(35, Math.min(100, station.sos + drift));
    });
    labels.push(`${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`);
    avg.push(round(values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length), 2));
    max.push(round(Math.max(...values, 0), 2));
    min.push(round(Math.min(...values, 100), 2));
  });
  return { labels, avg, max, min };
}

function drawTrendLine(ctx, values, pad, canvas, color, label, labels = [], key = "") {
  const points = values.map((value, index) => ({
    x: pad.left + (index / Math.max(1, values.length - 1)) * (canvas.width - pad.left - pad.right),
    y: valueY(value, pad, canvas.height),
    value,
    index,
  }));
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = key === "avg" ? 2.4 : 2;
  ctx.shadowColor = color;
  ctx.shadowBlur = key === "avg" ? 8 : 5;
  ctx.beginPath();
  points.forEach(({ x, y }, index) => {
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;
  points.forEach(({ x, y, value, index }) => {
    const isHover = state.riskTrendHover && state.riskTrendHover.index === index;
    ctx.fillStyle = "#111622";
    ctx.beginPath();
    ctx.arc(x, y, isHover ? 6.2 : 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = isHover ? 3 : 2;
    ctx.beginPath();
    ctx.arc(x, y, isHover ? 6.2 : 4.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, isHover ? 3.3 : 2.1, 0, Math.PI * 2);
    ctx.fill();
    state.riskTrendHitboxes.push({ x, y, value, label, date: labels[index] || "", color, key, index });
  });
  ctx.restore();
}

function renderRiskModules(alarms) {
  const canvas = setupCanvas(els.riskModuleCanvas);
  const ctx = canvas.getContext("2d");
  const modules = ["电池系统", "电气系统", "环控系统", "消防系统"];
  const colors = ["#1689ff", "#13c781", "#f4a51c", "#ff3d59"];
  const entries = modules.map((module) => [module, alarms.filter((alarm) => alarm.module === module).length]);
  drawDonutChart(ctx, canvas, entries, (key) => colors[modules.indexOf(key)] || "#1689ff");
  els.riskModuleLegend.innerHTML = entries
    .map(
      ([module, count], index) => `
      <div class="legend-item" style="--legend-color:${colors[index]}">
        <span>${module}</span><strong>${count}</strong>
      </div>`
    )
    .join("");
}

function renderRiskAlarmNameTop(alarms) {
  const colorSet = ["#ff3d59", "#f4a51c", "#13c781", "#00d7ff", "#a66bff"];
  const counts = new Map();
  alarms.forEach((alarm) => counts.set(alarm.title, (counts.get(alarm.title) || 0) + 1));
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = Math.max(1, ...top.map(([, count]) => count));
  els.riskAlarmNameTopList.innerHTML = top
    .map(([name, count], index) => {
      const color = colorSet[index % colorSet.length];
      return `
        <div class="alarm-name-top-row" style="--top-color:${color}">
          <span>${index + 1}</span>
          <div class="alarm-name-top-main">
            <strong title="${name}">${name}</strong>
            <div class="alarm-name-top-track"><i style="width:${(count / max) * 100}%"></i></div>
          </div>
          <em>${count}</em>
        </div>`;
    })
    .join("");
}

function renderRiskBands(stations) {
  const canvas = setupCanvas(els.riskBandCanvas);
  const ctx = canvas.getContext("2d");
  const bands = [
    { label: "<60", count: stations.filter((station) => station.sos < 60).length, color: "#ff3d59" },
    { label: "60-79", count: stations.filter((station) => station.sos >= 60 && station.sos < 80).length, color: "#f4a51c" },
    { label: "80-89", count: stations.filter((station) => station.sos >= 80 && station.sos < 90).length, color: "#13c781" },
    { label: "90-99", count: stations.filter((station) => station.sos >= 90 && station.sos < 100).length, color: "#23b0ff" },
    { label: "100", count: stations.filter((station) => station.sos === 100).length, color: "#1689ff" },
  ];
  const max = Math.max(1, ...bands.map((band) => band.count));
  const pad = { left: 42, right: 24, top: 26, bottom: 42 };
  clear(ctx, canvas.width, canvas.height);
  bands.forEach((band, index) => {
    const slot = (canvas.width - pad.left - pad.right) / bands.length;
    const barWidth = Math.min(86, slot * 0.52);
    const x = pad.left + index * slot + (slot - barWidth) / 2;
    const h = (band.count / max) * (canvas.height - pad.top - pad.bottom);
    const y = canvas.height - pad.bottom - h;
    ctx.fillStyle = band.color;
    ctx.fillRect(x, y, barWidth, h);
    ctx.fillStyle = "#eef3fb";
    ctx.font = "18px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText(String(band.count), x + barWidth / 2, y - 8);
    ctx.fillStyle = "#8f97a8";
    ctx.font = "12px Microsoft YaHei";
    ctx.fillText(band.label, x + barWidth / 2, canvas.height - 14);
  });
}

function drawMiniBrush(ctx, pad, width, height, data) {
  const y = height - 18;
  ctx.strokeStyle = "rgba(143, 151, 168, 0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  data.forEach((station, index) => {
    const x = pad.left + index * 12;
    const wave = y - 8 + Math.sin(index * 0.5) * 2 + (100 - station.sos) / 40;
    index === 0 ? ctx.moveTo(x, wave) : ctx.lineTo(x, wave);
  });
  ctx.stroke();
}

function handleRiskBarHover(event) {
  const rect = els.riskBarsCanvas.getBoundingClientRect();
  const scaleX = els.riskBarsCanvas.width / rect.width;
  const scaleY = els.riskBarsCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const hit = state.riskBarHitboxes.find((box) => x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height);
  if (!hit) {
    if (state.riskBarHoverId) {
      state.riskBarHoverId = null;
      renderSafely(() => renderRiskBars(state.stations));
    }
    els.riskBarsTooltip.classList.remove("show");
    return;
  }
  if (state.riskBarHoverId !== hit.station.id) {
    state.riskBarHoverId = hit.station.id;
    renderSafely(() => renderRiskBars(state.stations));
  }
  els.riskBarsTooltip.innerHTML = `
    <strong>${hit.station.id}${hit.station.name}</strong>
    <span style="color:${riskMeta[hit.station.risk].color}">SOS ${formatSosValue(hit.station.sos)}</span>
  `;
  const viewportRect = els.riskBarsViewport.getBoundingClientRect();
  const tooltipWidth = 230;
  const rawLeft = event.clientX - viewportRect.left + els.riskBarsViewport.scrollLeft + 14;
  const minLeft = els.riskBarsViewport.scrollLeft + 8;
  const maxLeft = els.riskBarsViewport.scrollLeft + els.riskBarsViewport.clientWidth - tooltipWidth - 8;
  els.riskBarsTooltip.style.left = `${Math.max(minLeft, Math.min(maxLeft, rawLeft))}px`;
  els.riskBarsTooltip.style.top = `${event.clientY - viewportRect.top + 12}px`;
  els.riskBarsTooltip.classList.add("show");
}

function handleRiskTrendHover(event) {
  const rect = els.riskTrendCanvas.getBoundingClientRect();
  const scaleX = els.riskTrendCanvas.width / rect.width;
  const scaleY = els.riskTrendCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const hit = state.riskTrendHitboxes
    .map((point) => ({ ...point, distance: Math.abs(point.x - x) }))
    .sort((a, b) => a.distance - b.distance)[0];
  if (!hit || hit.distance > 12 || y < 20 || y > els.riskTrendCanvas.height - 12) {
    if (state.riskTrendHover) {
      state.riskTrendHover = null;
      renderSafely(() => renderRiskTrend(state.stations, state.riskTrendRange));
    }
    els.riskTrendTooltip.classList.remove("show");
    return;
  }
  if (!state.riskTrendHover || state.riskTrendHover.index !== hit.index) {
    state.riskTrendHover = { index: hit.index };
    renderSafely(() => renderRiskTrend(state.stations, state.riskTrendRange));
  }
  const rows = ["max", "avg", "min"]
    .map((key) => state.riskTrendHitboxes.find((point) => point.index === hit.index && point.key === key))
    .filter(Boolean);
  els.riskTrendTooltip.innerHTML = `
    <strong>${hit.date}</strong>
    ${rows
      .map(
        (row) => `
        <span style="color:${row.color}">${row.label} ${formatSosValue(row.value)}</span>`
      )
      .join("")}
  `;
  const box = els.riskTrendChart.getBoundingClientRect();
  const tooltipWidth = 210;
  const rawLeft = event.clientX - box.left + 14;
  const maxLeft = els.riskTrendChart.clientWidth - tooltipWidth - 8;
  els.riskTrendTooltip.style.left = `${Math.max(8, Math.min(maxLeft, rawLeft))}px`;
  els.riskTrendTooltip.style.top = `${event.clientY - box.top + 12}px`;
  els.riskTrendTooltip.classList.add("show");
}

function renderAlarmDetailFilters() {
  const alarms = state.allAlarms || [];
  const optionMap = {
    level: { el: els.alarmDetailLevel, label: "全部等级", searchable: false, options: ["一级", "二级", "三级"] },
    module: { el: els.alarmDetailModule, label: "全部设备模块", searchable: false, options: ["电池系统", "电气系统", "环控系统", "消防系统"] },
    name: { el: els.alarmDetailName, label: "全部预警名称", searchable: true, options: uniqueSorted(alarms.map((alarm) => alarm.title)) },
    station: { el: els.alarmDetailStation, label: "全部场站", searchable: true, options: uniqueSorted(alarms.map((alarm) => `${alarm.stationId}${alarm.stationName}`)) },
    location: { el: els.alarmDetailLocation, label: "全部位置", searchable: true, options: uniqueSorted(alarms.map((alarm) => alarm.location)) },
    source: { el: els.alarmDetailSource, label: "全部来源", searchable: false, options: ["云端", "站端"] },
  };
  Object.entries(optionMap).forEach(([key, config]) => renderAlarmMultiSelect(key, config));
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "zh-CN"));
}

function renderAlarmMultiSelect(key, config) {
  if (!config.el) return;
  const selected = state.alarmDetailSelections[key];
  const title = selected.size ? `已选 ${selected.size}` : config.label;
  config.el.innerHTML = `
    <button class="alarm-multi-trigger combo-input" type="button"><span>${title}</span></button>
    <div class="alarm-multi-menu">
      ${config.searchable ? `<input class="alarm-multi-search" type="search" placeholder="搜索${config.label.replace("全部", "")}" />` : ""}
      <div class="alarm-multi-options">
        ${config.options.map((option) => `
          <label class="selector-option ${selected.has(option) ? "selected" : ""}" title="${option}">
            <input type="checkbox" value="${option}" ${selected.has(option) ? "checked" : ""} />
            <i class="selector-check ${selected.has(option) ? "checked" : ""}"></i>
            <span>${option}</span>
          </label>`).join("")}
      </div>
    </div>
  `;
  config.el.querySelector(".alarm-multi-trigger").addEventListener("click", (event) => {
    event.stopPropagation();
    document.querySelectorAll(".alarm-multi-select.open").forEach((item) => {
      if (item !== config.el) item.classList.remove("open");
    });
    config.el.classList.toggle("open");
  });
  config.el.querySelector(".alarm-multi-menu").addEventListener("click", (event) => event.stopPropagation());
  config.el.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      checkbox.checked ? selected.add(checkbox.value) : selected.delete(checkbox.value);
      renderAlarmMultiSelect(key, config);
      config.el.classList.add("open");
      renderAlarmDetailPage();
    });
  });
  const search = config.el.querySelector(".alarm-multi-search");
  if (search) {
    search.addEventListener("click", (event) => event.stopPropagation());
    search.addEventListener("input", () => {
      const keyword = search.value.trim().toLowerCase();
      config.el.querySelectorAll(".alarm-multi-options label").forEach((label) => {
        label.style.display = label.textContent.toLowerCase().includes(keyword) ? "" : "none";
      });
    });
  }
}

document.addEventListener("click", () => {
  document.querySelectorAll(".alarm-multi-select.open").forEach((item) => item.classList.remove("open"));
});

function renderAlarmDetailPage() {
  const alarms = filterAlarmDetailItems();
  const groups = groupAlarmsForTable(alarms);
  if (state.activePage === "alarm") {
    renderAlarmOverview(alarms);
  }
  const visibleIds = new Set(groups.map((group) => group.id));
  state.detailAlarmSelectedIds.forEach((id) => {
    if (!visibleIds.has(id)) state.detailAlarmSelectedIds.delete(id);
  });
  if (!groups.length) {
    state.detailAlarmSelectionMode = false;
  }
  els.alarmDetailCount.textContent = groups.length;
  els.alarmDetailTable.innerHTML = alarms
    .length
    ? groups
      .map((group) => {
        const alarm = group.latest;
        const sources = uniqueSorted(group.alarms.map((item) => item.source)).join("/");
        return `
      <tr data-alarm-id="${group.id}" class="${state.detailAlarmSelectedIds.has(group.id) ? "selected" : ""}">
        <td class="alarm-mail-cell">${group.srCompleted ? '<span class="alarm-mail-badge" title="SR已返回">✉</span>' : ""}</td>
        <td class="alarm-level-cell">
          <div class="alarm-level-cell-inner ${state.detailAlarmSelectionMode ? "selection-mode" : ""}">
            ${
              state.detailAlarmSelectionMode
                ? `<label class="alarm-row-check"><input type="checkbox" data-check-id="${group.id}" ${state.detailAlarmSelectedIds.has(group.id) ? "checked" : ""} /><i></i></label>`
                : '<span class="alarm-row-check-placeholder"></span>'
            }
            <span class="alarm-level-table alarm-${alarm.type}">${alarm.level}</span>
          </div>
        </td>
        <td>${alarm.title}</td>
        <td>${alarm.module}</td>
        <td>${alarm.stationId}${alarm.stationName}</td>
        <td>${alarm.location}</td>
        <td>${alarm.eventTime}</td>
        <td>${alarm.warningTime}</td>
        <td><span class="alarm-status-pill ${statusClass(alarm.status)}">${alarm.status}</span></td>
        <td><span class="alarm-source alarm-source-${sources.includes("站端") && !sources.includes("云端") ? "station" : "cloud"}">${sources}</span></td>
      </tr>`;
      })
      .join("")
    : `<tr><td colspan="10">暂无匹配预警</td></tr>`;
  els.alarmDetailTable.querySelectorAll('input[data-check-id]').forEach((input) => {
    input.addEventListener('click', (event) => event.stopPropagation());
    input.addEventListener('change', () => {
      const groupId = input.dataset.checkId;
      if (input.checked) state.detailAlarmSelectedIds.add(groupId);
      else state.detailAlarmSelectedIds.delete(groupId);
      updateAlarmBatchBar();
      renderAlarmDetailPage();
    });
  });
  els.alarmDetailTable.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => {
      const group = groups.find((item) => item.id === row.dataset.alarmId);
      if (!group) return;
      state.selectedAlarm = group.latest;
      if (state.detailAlarmSelectionMode) {
        if (state.detailAlarmSelectedIds.has(group.id)) state.detailAlarmSelectedIds.delete(group.id);
        else state.detailAlarmSelectedIds.add(group.id);
        updateAlarmBatchBar();
        renderAlarmDetailPage();
        return;
      }
      state.detailAlarmSelectedIds.clear();
      renderAlarmDetailPage();
      openAlarmModal(group);
    });
    row.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      const group = groups.find((item) => item.id === row.dataset.alarmId);
      if (!group) return;
      state.detailAlarmContextId = group.id;
      state.selectedAlarm = group.latest;
      showAlarmRowContextMenu(event.clientX, event.clientY);
    });
  });
  if (!groups.length) {
    state.detailAlarmSelectedIds.clear();
    hideAlarmRowContextMenu();
  }
  if (!state.selectedAlarm || !alarms.some((alarm) => alarm.id === state.selectedAlarm.id)) {
    state.selectedAlarm = groups[0]?.latest || null;
  }
  updateAlarmBatchBar();
}

function updateAlarmBatchBar() {
  if (!els.alarmBatchBar || !els.alarmBatchCount || !els.alarmBatchAction) return;
  const count = state.detailAlarmSelectedIds.size;
  els.alarmBatchBar.classList.toggle('show', state.detailAlarmSelectionMode);
  els.alarmBatchCount.textContent = String(count);
  els.alarmBatchAction.disabled = count === 0;
}

function enableAlarmSelectionMode(event) {
  event.stopPropagation();
  hideAlarmRowContextMenu();
  state.detailAlarmSelectionMode = true;
  if (state.detailAlarmContextId) state.detailAlarmSelectedIds.add(state.detailAlarmContextId);
  updateAlarmBatchBar();
  renderAlarmDetailPage();
}

function cancelAlarmSelectionMode(event) {
  event?.stopPropagation();
  state.detailAlarmSelectionMode = false;
  state.detailAlarmSelectedIds.clear();
  hideAlarmRowContextMenu();
  updateAlarmBatchBar();
  renderAlarmDetailPage();
}

function showAlarmRowContextMenu(clientX, clientY) {
  if (!els.alarmRowContextMenu) return;
  els.alarmRowContextMenu.classList.add("show");
  const menuWidth = 100;
  const menuHeight = 44;
  const left = Math.min(clientX, window.innerWidth - menuWidth - 12);
  const top = Math.min(clientY, window.innerHeight - menuHeight - 12);
  els.alarmRowContextMenu.style.left = `${Math.max(12, left)}px`;
  els.alarmRowContextMenu.style.top = `${Math.max(12, top)}px`;
}

function hideAlarmRowContextMenu() {
  if (!els.alarmRowContextMenu) return;
  els.alarmRowContextMenu.classList.remove("show");
}

function handleBatchAlarmProcess(event) {
  event.stopPropagation();
  hideAlarmRowContextMenu();
}

function filterAlarmDetailItems() {
  const start = els.alarmDetailStart.value ? new Date(`${els.alarmDetailStart.value}T00:00:00`) : null;
  const end = els.alarmDetailEnd.value ? new Date(`${els.alarmDetailEnd.value}T23:59:59`) : null;
  const { level, module, name, station, location, source } = state.alarmDetailSelections;
  return state.allAlarms.filter((alarm) => {
    const date = new Date(`${alarm.dateISO}T12:00:00`);
    const stationLabel = `${alarm.stationId}${alarm.stationName}`;
    return (
      (!module.size || module.has(alarm.module)) &&
      (!level.size || level.has(alarm.level)) &&
      (!name.size || name.has(alarm.title)) &&
      (!station.size || station.has(stationLabel)) &&
      (!location.size || location.has(alarm.location)) &&
      (!source.size || source.has(alarm.source)) &&
      (!start || date >= start) &&
      (!end || date <= end)
    );
  });
}

function alarmGroupKey(alarm) {
  return [alarm.title, alarm.module, alarm.stationId, alarm.location, alarm.source].join("||");
}

function alarmTimestamp(alarm, key = "warningTime") {
  return new Date(String(alarm[key] || "").replace(/\//g, "-")).getTime() || 0;
}

function alarmDurationHours(alarm) {
  return Math.max(1, ((alarm.id.length * 7) % 24) + (alarm.type === "level1" ? 6 : alarm.type === "level2" ? 3 : 1));
}

function beijingDateTimeLocal(date = new Date()) {
  const beijing = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  return beijing.toISOString().slice(0, 16);
}

function groupAlarmsForTable(alarms) {
  const map = new Map();
  alarms.forEach((alarm) => {
    const id = alarmGroupKey(alarm);
    if (!map.has(id)) map.set(id, { id, alarms: [] });
    map.get(id).alarms.push(alarm);
  });
  return [...map.values()]
    .map((group) => {
      group.alarms.sort((a, b) => alarmTimestamp(b) - alarmTimestamp(a));
      group.latest = group.alarms[0];
      group.srIssued = group.alarms.some((alarm) => alarm.srIssued);
      group.srCompleted = group.alarms.some((alarm) => alarm.srCompleted);
      return group;
    })
    .sort((a, b) => alarmOrder(a.latest.type) - alarmOrder(b.latest.type) || alarmTimestamp(b.latest) - alarmTimestamp(a.latest));
}

function getAlarmGroupFromAlarm(alarm) {
  if (!alarm) return null;
  return groupAlarmsForTable(state.allAlarms.filter((item) => alarmGroupKey(item) === alarmGroupKey(alarm)))[0] || null;
}

function getAlarmGroup(groupOrAlarm) {
  if (!groupOrAlarm) return null;
  if (Array.isArray(groupOrAlarm.alarms)) return groupOrAlarm;
  return getAlarmGroupFromAlarm(groupOrAlarm);
}

function statusClass(status) {
  if (String(status).includes("排查中")) return "status-investigating";
  if (String(status).includes("关闭")) return "status-closed";
  return "status-pending";
}

function updateAlarmGroup(group, patch) {
  if (!group) return;
  const ids = new Set(group.alarms.map((alarm) => alarm.id));
  state.allAlarms.forEach((alarm) => {
    if (ids.has(alarm.id)) Object.assign(alarm, patch);
  });
  state.alarms.forEach((alarm) => {
    if (ids.has(alarm.id)) Object.assign(alarm, patch);
  });
  state.selectedAlarmGroup = getAlarmGroupFromAlarm(group.latest);
  state.selectedAlarm = state.selectedAlarmGroup?.alarms.find((alarm) => alarm.id === state.activeModalAlarmId) || state.selectedAlarmGroup?.latest || null;
  renderAlarms();
  if (state.activePage === "alarm") renderAlarmDetailPage();
}

function renderAlarmInspector(alarmOrGroup) {
  const group = getAlarmGroup(alarmOrGroup);
  const alarm = group?.alarms.find((item) => item.id === state.activeModalAlarmId) || group?.latest || null;
  if (!group || !alarm) {
    els.alarmInspectorBody.textContent = "点击任意预警查看完整内容";
    return;
  }
  const linked = alarm.linkedAlarmId ? state.allAlarms.find((item) => item.id === alarm.linkedAlarmId) : null;
  els.alarmInspectorBody.innerHTML = `
    <div class="alarm-detail-hero alarm-hero-${alarm.type}">
      <span class="alarm-source-corner alarm-source-corner-${alarm.source === "云端" ? "cloud" : "station"}">${alarm.source}</span>
      <strong>${alarm.title}</strong>
      <p>${alarm.level === "一级" ? "立即复核云端诊断结果并安排现场排查。" : alarm.level === "二级" ? "持续观察趋势，纳入当班巡检计划。" : "记录风险变化，按计划跟踪闭环。"}</p>
      ${
        linked
          ? `<button class="alarm-linked-jump alarm-linked-jump-${linked.source === "云端" ? "cloud" : "station"}" type="button" data-linked-id="${linked.id}">${alarm.source === "云端" ? "查看关联站端预警" : "查看关联云端预警"}</button>`
          : ""
      }
    </div>
    <div class="alarm-group-context">
      <div><span>模块</span><strong>${alarm.module}</strong></div>
      <div><span>场站</span><strong>${alarm.stationId}${alarm.stationName}</strong></div>
      <div><span>位置</span><strong>${alarm.location}</strong></div>
    </div>
    <div class="alarm-group-table-wrap">
      <table class="alarm-group-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>等级</th>
            <th>事件时间</th>
            <th>预警时间</th>
            <th>持续时长</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          ${group.alarms
            .map(
              (item, index) => `
            <tr class="${item.id === alarm.id ? "active" : ""}" data-alarm-id="${item.id}">
              <td>${index + 1}</td>
              <td><span class="alarm-level-table alarm-${item.type}">${item.level}</span></td>
              <td>${item.eventTime}</td>
              <td>${item.warningTime}</td>
              <td>${alarmDurationHours(item)} 小时</td>
              <td><span class="alarm-status-pill ${statusClass(item.status)}">${item.status}</span></td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
  els.alarmInspectorBody.querySelectorAll(".alarm-group-table tbody tr").forEach((row) => {
    row.addEventListener("click", () => {
      state.activeModalAlarmId = row.dataset.alarmId;
      state.selectedAlarm = group.alarms.find((item) => item.id === state.activeModalAlarmId) || group.latest;
      renderAlarmInspector(group);
      renderAlarmTrend(state.selectedAlarm);
      state.alarmProcessMode = null;
      closeAlarmProcessModal();
    });
  });
  const jumpButton = els.alarmInspectorBody.querySelector(".alarm-linked-jump");
  if (jumpButton) {
    jumpButton.addEventListener("click", () => {
      const target = state.allAlarms.find((item) => item.id === jumpButton.dataset.linkedId);
      if (target) openAlarmModal(target);
    });
  }
}

function renderAlarmOverview(alarms = filterAlarmDetailItems()) {
  renderSafely(() => renderRiskAlarmPie(alarms));
  renderSafely(() => renderRiskModules(alarms));
  renderSafely(() => renderRiskAlarmNameTop(alarms));
}

function openAlarmModal(alarm) {
  const group = getAlarmGroup(alarm);
  if (!group) return;
  state.selectedAlarmGroup = group;
  state.selectedAlarm = group.latest;
  state.activeModalAlarmId = group.latest.id;
  state.alarmProcessMode = null;
  renderAlarmInspector(group);
  els.alarmDetailModal.classList.add("show");
  els.alarmDetailModal.setAttribute("aria-hidden", "false");
  renderAlarmTrend(group.latest);
  closeAlarmProcessModal();
}

function closeAlarmModal() {
  if (!els.alarmDetailModal) return;
  els.alarmDetailModal.classList.remove("show");
  els.alarmDetailModal.setAttribute("aria-hidden", "true");
  els.alarmTrendTooltip.classList.remove("show");
  state.alarmProcessMode = null;
  closeAlarmProcessModal();
}

function closeAlarmProcessModal() {
  if (!els.alarmProcessModal) return;
  els.alarmProcessModal.classList.remove("show");
  els.alarmProcessModal.setAttribute("aria-hidden", "true");
  state.alarmProcessMode = null;
  if (els.alarmProcessPanel) {
    els.alarmProcessPanel.classList.remove("show");
    els.alarmProcessPanel.innerHTML = "";
  }
}

function renderAlarmProcessPanel() {
  if (!els.alarmProcessPanel) return;
  const group = state.selectedAlarmGroup;
  if (!group || !state.alarmProcessMode) {
    els.alarmProcessModal?.classList.remove("show");
    els.alarmProcessModal?.setAttribute("aria-hidden", "true");
    els.alarmProcessPanel.classList.remove("show");
    els.alarmProcessPanel.innerHTML = "";
    return;
  }
  els.alarmProcessModal?.classList.add("show");
  els.alarmProcessModal?.setAttribute("aria-hidden", "false");
  els.alarmProcessPanel.classList.add("show");
  if (state.alarmProcessMode === "analysis") {
    els.alarmProcessPanel.innerHTML = `
      <div class="process-head"><strong>分析结论</strong><span>基于当前选中预警趋势</span></div>
      <div class="process-note">建议结合 ${state.selectedAlarm?.module || "--"} 数据曲线、同位置历史预警和现场巡检记录确认根因。</div>
    `;
    return;
  }
  if (state.alarmProcessMode === "choose") {
    els.alarmProcessPanel.innerHTML = `
      <div class="process-head"><strong>处理方式</strong><span>请选择本组预警闭环路径</span></div>
      <div class="process-choice-grid">
        <button type="button" data-process-action="close-now">关闭预警</button>
        <button type="button" data-process-action="open-sr">下发 SR</button>
      </div>
    `;
  } else if (state.alarmProcessMode === "close") {
    els.alarmProcessPanel.innerHTML = `
      <div class="process-head"><strong>关闭预警</strong><span>关闭后列表状态立即更新</span></div>
      <div class="process-options">
        ${["误报", "数据异常", "其他"].map((reason) => `<label><input name="closeReason" type="radio" value="${reason}" />${reason}</label>`).join("")}
      </div>
      <textarea id="alarmCloseRemark" placeholder="选择“其他”时必须填写具体原因"></textarea>
      <div class="process-actions">
        <button type="button" data-process-action="confirm-close">确认关闭</button>
      </div>
    `;
  } else if (state.alarmProcessMode === "sr") {
    const srNo = group.latest.srNo || `S${263 + (group.latest.id.length % 70)}`;
    const srSendTime = group.latest.srSendDate || beijingDateTimeLocal();
    els.alarmProcessPanel.innerHTML = `
      <div class="process-head"><strong>下发 SR</strong></div>
      <div class="sr-form-grid">
        <label><span>SR编号</span><input id="srNoInput" value="${srNo}" /></label>
        <label><span>SR发出时间</span><input id="srSendDateInput" type="datetime-local" value="${srSendTime}" /></label>
        <label><span>期望完成时间</span><input id="srDueDateInput" type="date" value="2026-03-31" /></label>
        <label class="sr-guide-field"><span>操作指导</span><textarea id="srGuideInput"></textarea><span class="sr-attachment-label">附件</span><input id="srAttachmentInput" type="file" multiple /></label>
      </div>
      <div class="process-actions">
        <button type="button" data-process-action="submit-sr">确认下发</button>
      </div>
    `;
  } else if (state.alarmProcessMode === "srSubmitted") {
    els.alarmProcessPanel.innerHTML = `
      <div class="process-head"><strong>SR 已下发</strong><span>列表状态已变更为“排查中”</span></div>
      <div class="sr-return-card">
        <span>等待 SR 完成返回。演示态可点击下方按钮模拟返回，返回后列表等级列前会出现信封标记。</span>
        <button type="button" data-process-action="complete-sr">模拟 SR 完成返回</button>
      </div>
    `;
  } else if (state.alarmProcessMode === "srClose") {
    els.alarmProcessPanel.innerHTML = `
      <div class="process-head"><strong>SR 返回确认</strong><span>请选择预警类型判断结果</span></div>
      <div class="process-options">
        <label><input name="srCloseReason" type="radio" value="类型准确" />类型准确</label>
        <label><input name="srCloseReason" type="radio" value="类型不准确" />类型不准确</label>
      </div>
      <div class="process-actions">
        <button type="button" data-process-action="confirm-sr-close">确认关闭</button>
      </div>
    `;
  }
  bindAlarmProcessPanel();
}

function bindAlarmProcessPanel() {
  els.alarmProcessPanel.querySelectorAll("[data-process-action]").forEach((button) => {
    button.addEventListener("click", () => handleAlarmProcessAction(button.dataset.processAction));
  });
}

function handleAlarmProcessAction(action) {
  const group = state.selectedAlarmGroup;
  if (!group) return;
  if (action === "close-now") {
    state.alarmProcessMode = "close";
    renderAlarmProcessPanel();
    return;
  }
  if (action === "open-sr") {
    state.alarmProcessMode = "sr";
    renderAlarmProcessPanel();
    return;
  }
  if (action === "confirm-close") {
    const reason = els.alarmProcessPanel.querySelector("input[name='closeReason']:checked")?.value;
    const remark = els.alarmProcessPanel.querySelector("#alarmCloseRemark")?.value.trim() || "";
    if (!reason || (reason === "其他" && !remark)) {
      showAlarmProcessError(reason === "其他" ? "请补充其他原因" : "请选择关闭原因");
      return;
    }
    updateAlarmGroup(group, {
      status: `关闭-${reason}`,
      closeReason: reason,
      closeRemark: remark,
    });
    state.alarmProcessMode = null;
    renderAlarmInspector(state.selectedAlarmGroup);
    renderAlarmProcessPanel();
    return;
  }
  if (action === "submit-sr") {
    updateAlarmGroup(group, {
      status: "排查中",
      srIssued: true,
      srCompleted: false,
      srNo: els.alarmProcessPanel.querySelector("#srNoInput")?.value.trim() || "",
      srGuide: els.alarmProcessPanel.querySelector("#srGuideInput")?.value.trim() || "",
      srSendDate: els.alarmProcessPanel.querySelector("#srSendDateInput")?.value || "",
      srDueDate: els.alarmProcessPanel.querySelector("#srDueDateInput")?.value || "",
      srAttachmentCount: els.alarmProcessPanel.querySelector("#srAttachmentInput")?.files.length || 0,
    });
    state.alarmProcessMode = "srSubmitted";
    renderAlarmInspector(state.selectedAlarmGroup);
    renderAlarmProcessPanel();
    return;
  }
  if (action === "complete-sr") {
    updateAlarmGroup(group, { srCompleted: true });
    state.alarmProcessMode = "srClose";
    renderAlarmInspector(state.selectedAlarmGroup);
    renderAlarmProcessPanel();
    return;
  }
  if (action === "confirm-sr-close") {
    const reason = els.alarmProcessPanel.querySelector("input[name='srCloseReason']:checked")?.value;
    if (!reason) {
      showAlarmProcessError("请选择类型判断结果");
      return;
    }
    updateAlarmGroup(group, {
      status: reason === "类型准确" ? "关闭-准确" : "关闭-类型不准确",
      srCloseReason: reason,
    });
    state.alarmProcessMode = null;
    renderAlarmInspector(state.selectedAlarmGroup);
    renderAlarmProcessPanel();
  }
}

function showAlarmProcessError(message) {
  const old = els.alarmProcessPanel.querySelector(".process-error");
  old?.remove();
  const error = document.createElement("div");
  error.className = "process-error";
  error.textContent = message;
  els.alarmProcessPanel.appendChild(error);
}

function alarmTrendData(alarm) {
  const levelOffset = alarm.type === "level1" ? 18 : alarm.type === "level2" ? 10 : 4;
  const linkSeed = (alarm.linkGroupId || alarm.id).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const sourceOffset = alarm.source === "云端" ? 6 : -4;
  const amplitude = alarm.source === "云端" ? 7.6 : 11.2;
  const phase = (linkSeed % 9) * 0.18 + (alarm.source === "云端" ? 0.25 : 0.88);
  const tailBoost = alarm.source === "云端" ? levelOffset / 4 : levelOffset / 6;
  const base = 46 + levelOffset + (linkSeed % 8) + sourceOffset;
  return Array.from({ length: 18 }, (_, index) => {
    const swing = Math.sin(index * 0.68 + phase) * amplitude;
    const ripple = Math.cos(index * 0.31 + (linkSeed % 5)) * (alarm.source === "云端" ? 3.2 : 4.6);
    const tail = index > 11 ? tailBoost + (alarm.source === "站端" ? (index - 11) * 0.55 : (17 - index) * 0.18) : 0;
    const value = round(Math.max(20, Math.min(100, base + swing + ripple + tail)), 2);
    return {
      label: `${String(8 + Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`,
      value,
    };
  });
}

function renderAlarmTrend(alarm) {
  const canvas = setupCanvas(els.alarmTrendCanvas);
  const ctx = canvas.getContext("2d");
  const data = alarmTrendData(alarm);
  const pad = { left: 44, right: 22, top: 28, bottom: 34 };
  clear(ctx, canvas.width, canvas.height);
  drawGrid(ctx, pad, canvas.width, canvas.height);
  const color = alarm.type === "level1" ? "#ff3d59" : alarm.type === "level2" ? "#f4a51c" : "#13c781";
  const gradient = ctx.createLinearGradient(0, pad.top, 0, canvas.height - pad.bottom);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "rgba(18, 152, 255, 0.02)");
  ctx.beginPath();
  data.forEach((point, index) => {
    const x = pad.left + (index / (data.length - 1)) * (canvas.width - pad.left - pad.right);
    const y = valueY(point.value, pad, canvas.height);
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(canvas.width - pad.right, canvas.height - pad.bottom);
  ctx.lineTo(pad.left, canvas.height - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.globalAlpha = 0.2;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  state.alarmTrendHitboxes = [];
  data.forEach((point, index) => {
    const x = pad.left + (index / (data.length - 1)) * (canvas.width - pad.left - pad.right);
    const y = valueY(point.value, pad, canvas.height);
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    state.alarmTrendHitboxes.push({ x, y, ...point, color });
  });
  ctx.stroke();
  state.alarmTrendHitboxes.forEach((point, index) => {
    if (index % 3 === 0 || index === state.alarmTrendHitboxes.length - 1) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#8f97a8";
      ctx.font = "11px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.fillText(point.label, point.x, canvas.height - 10);
    }
  });
}

function handleAlarmTrendHover(event) {
  const rect = els.alarmTrendCanvas.getBoundingClientRect();
  const scaleX = els.alarmTrendCanvas.width / rect.width;
  const scaleY = els.alarmTrendCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const hit = state.alarmTrendHitboxes
    .map((point) => ({ ...point, distance: Math.hypot(point.x - x, point.y - y) }))
    .sort((a, b) => a.distance - b.distance)[0];
  if (!hit || hit.distance > 14) {
    els.alarmTrendTooltip.classList.remove("show");
    return;
  }
  els.alarmTrendTooltip.innerHTML = `<strong>${hit.label}</strong><span style="color:${hit.color}">相关值 ${formatSosValue(hit.value)}</span>`;
  const box = els.alarmTrendChart.getBoundingClientRect();
  els.alarmTrendTooltip.style.left = `${Math.min(els.alarmTrendChart.clientWidth - 220, Math.max(8, event.clientX - box.left + 12))}px`;
  els.alarmTrendTooltip.style.top = `${Math.max(8, event.clientY - box.top + 12)}px`;
  els.alarmTrendTooltip.classList.add("show");
}

function showDetail(id) {
  const station = state.stations.find((item) => item.id === id);
  if (!station) return;
  state.selectedStation = station;
  state.trendRange = 7;
  state.sortSubsystemMode = "idAsc";
  state.detailTableSort = { key: "score", direction: "asc" };
  state.detailTrendHover = null;
  state.detailBarHoverName = null;
  state.detailAlarmType = "all";
  state.detailAlarmDays = "all";
  state.detailAlarmStartDate = "";
  state.detailAlarmEndDate = "";
  els.detailAlarmTabs.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.type === "all"));
  els.detailAlarmTimeButtons.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.days === "all"));
  els.detailAlarmStartDate.value = "";
  els.detailAlarmEndDate.value = "";
  els.listView.classList.remove("active-view");
  els.riskView.classList.remove("active-view");
  els.alarmDetailView.classList.remove("active-view");
  els.detailView.classList.add("active-view");
  document.getElementById("pageTitle").textContent = "";
  renderDetail(station);
  window.scrollTo({ top: 0, behavior: "smooth" });
  const url = new URL(window.location.href);
  url.searchParams.set("station", station.id);
  window.history.replaceState({}, "", url);
}

function showList() {
  els.detailView.classList.remove("active-view");
  showPage(state.activePage || "overview");
  state.selectedStation = null;
  const url = new URL(window.location.href);
  url.searchParams.delete("station");
  window.history.replaceState({}, "", url);
}

function renderDetail(station) {
  const risk = riskMeta[station.risk];
  els.detailTitle.textContent = `${station.id}${station.name}`;
  els.detailComm.textContent = commMeta[station.comm].label;
  els.detailComm.style.borderColor = commMeta[station.comm].color;
  els.detailComm.style.color = commMeta[station.comm].color;
  els.detailRisk.textContent = risk.label;
  els.detailRisk.style.borderColor = risk.color;
  els.detailRisk.style.color = risk.color;
  els.detailSos.textContent = `SOS ${formatSosValue(station.sos)}`;
  els.detailSos.style.borderColor = risk.color;
  els.detailSos.style.color = risk.color;
  els.gaugeValue.textContent = formatSosValue(station.sos);
  els.gaugeValue.style.color = "#f4f8ff";
  els.gaugeLabel.textContent = `当前风险等级：${risk.label}`;
  els.gaugeLabel.style.color = risk.color;
  els.gaugeLabel.style.borderColor = `${risk.color}66`;
  els.gaugeLabel.style.background = `${risk.color}1f`;
  drawSosGauge(els.gaugeCanvas, station.sos);
  els.rangeButtons.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.range === "7"));
  els.subsystemSortBtn.value = "idAsc";
  state.detailSubsystems = createSubsystems(station);
  renderDetailCharts(station);
  renderTable();
  renderDetailAlarms(station);
}

function renderDetailCharts(station) {
  renderTrend(station, state.trendRange);
  renderDonut(state.detailSubsystems);
  renderBars(state.detailSubsystems);
  renderBoxPlot(station);
}

function createSubsystems(station) {
  return Array.from({ length: 30 }, (_, index) => {
    const n = index + 1;
    const drift = Math.sin((n + station.sos) * 0.55) * 14 - (n % 8 === 0 ? 22 : 0) + (n % 6 === 0 ? 9 : 0);
    const score = round(Math.min(100, Math.max(35, station.sos + drift)), 2);
    return {
      name: `子系统#${String(n).padStart(2, "0")}`,
      score,
      risk: getRisk(score),
    };
  });
}

function trendData(station, range) {
  const endDate = new Date(2026, 3, 15);
  return Array.from({ length: range }, (_, index) => {
    const dayOffset = range - index;
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - range + 1 + index);
    const value = round(Math.min(100, Math.max(38, station.sos + Math.sin((index + 1) * 0.9) * 6 - (dayOffset % 10 === 0 ? 8 : 0))), 2);
    return {
      label: `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      value,
    };
  });
}

function renderTrend(station, range) {
  const canvas = setupCanvas(els.trendCanvas);
  const ctx = canvas.getContext("2d");
  const data = trendData(station, range);
  const pad = { left: 46, right: 20, top: 28, bottom: 34 };
  const w = canvas.width;
  const h = canvas.height;
  clear(ctx, w, h);
  drawGrid(ctx, pad, w, h);
  drawThreshold(ctx, pad, w, h, 60, "#ff3d59");
  drawThreshold(ctx, pad, w, h, 80, "#f4a51c");
  state.detailTrendHitboxes = [];
  if (state.detailTrendHover) {
    const x = pad.left + (state.detailTrendHover.index / Math.max(1, data.length - 1)) * (w - pad.left - pad.right);
    ctx.save();
    ctx.strokeStyle = "rgba(238, 247, 255, 0.36)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x, pad.top);
    ctx.lineTo(x, h - pad.bottom);
    ctx.stroke();
    ctx.restore();
  }
  const color = riskMeta[station.risk].color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.4;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.beginPath();
  data.forEach((point, index) => {
    const x = pad.left + (index / Math.max(1, data.length - 1)) * (w - pad.left - pad.right);
    const y = valueY(point.value, pad, h);
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;
  data.forEach((point, index) => {
    const x = pad.left + (index / Math.max(1, data.length - 1)) * (w - pad.left - pad.right);
    const y = valueY(point.value, pad, h);
    const isHover = state.detailTrendHover && state.detailTrendHover.index === index;
    ctx.fillStyle = "#111622";
    ctx.beginPath();
    ctx.arc(x, y, isHover ? 6 : 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = isHover ? 3 : 2;
    ctx.beginPath();
    ctx.arc(x, y, isHover ? 6 : 4.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, isHover ? 3 : 2, 0, Math.PI * 2);
    ctx.fill();
    state.detailTrendHitboxes.push({ x, y, index, ...point, color });
    const labelEvery = range <= 7 ? 1 : range <= 15 ? 3 : 5;
    if (index % labelEvery === 0 || index === data.length - 1) {
      ctx.fillStyle = "#8f97a8";
      ctx.font = "12px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.fillText(point.label, x, h - 10);
    }
  });
}

function handleDetailTrendHover(event) {
  const rect = els.trendCanvas.getBoundingClientRect();
  const scaleX = els.trendCanvas.width / rect.width;
  const x = (event.clientX - rect.left) * scaleX;
  const hit = state.detailTrendHitboxes
    .map((point) => ({ ...point, distance: Math.abs(point.x - x) }))
    .sort((a, b) => a.distance - b.distance)[0];
  if (!hit || hit.distance > 14) {
    if (state.detailTrendHover) {
      state.detailTrendHover = null;
      renderTrend(state.selectedStation, state.trendRange);
    }
    els.detailTrendTooltip.classList.remove("show");
    return;
  }
  if (!state.detailTrendHover || state.detailTrendHover.index !== hit.index) {
    state.detailTrendHover = { index: hit.index };
    renderTrend(state.selectedStation, state.trendRange);
  }
  els.detailTrendTooltip.innerHTML = `
    <strong>${hit.label}</strong>
    <span style="color:${hit.color}">SOS ${formatSosValue(hit.value)}</span>
  `;
  const box = els.detailTrendChart.getBoundingClientRect();
  els.detailTrendTooltip.style.left = `${Math.min(els.detailTrendChart.clientWidth - 230, Math.max(8, event.clientX - box.left + 12))}px`;
  els.detailTrendTooltip.style.top = `${Math.max(8, event.clientY - box.top + 12)}px`;
  els.detailTrendTooltip.classList.add("show");
}

function renderDonut(subsystems) {
  const canvas = setupCanvas(els.donutCanvas);
  const ctx = canvas.getContext("2d");
  const counts = summarizeSubsystems(subsystems);
  const entries = [
    ["high", counts.high],
    ["mid", counts.mid],
    ["low", counts.low],
    ["healthy", counts.healthy],
  ];
  const total = subsystems.length;
  clear(ctx, canvas.width, canvas.height);
  drawDonutChart(ctx, canvas, entries, (key) => riskMeta[key].color);
  ctx.fillStyle = "#f1f3f7";
  ctx.font = "24px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText(String(total), canvas.width / 2, canvas.height / 2 + 8);
  els.donutLegend.innerHTML = entries
    .map(
      ([key, count]) => `
      <div class="legend-item" style="--legend-color:${riskMeta[key].color}">
        <span>${riskMeta[key].label}</span><strong>${count}</strong>
      </div>`
    )
    .join("");
}

function drawDonutChart(ctx, canvas, entries, colorForKey) {
  const total = entries.reduce((sum, [, count]) => sum + count, 0) || 1;
  clear(ctx, canvas.width, canvas.height);
  let start = -Math.PI / 2;
  entries.forEach(([key, count]) => {
    const angle = (count / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.strokeStyle = colorForKey(key);
    ctx.lineWidth = 42;
    ctx.arc(canvas.width / 2, canvas.height / 2, 82, start, start + angle);
    ctx.stroke();
    start += angle;
  });
  ctx.fillStyle = "#f1f3f7";
  ctx.font = "24px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText(String(total), canvas.width / 2, canvas.height / 2 + 8);
}

function renderBars(subsystems) {
  const canvas = setupCanvas(els.barCanvas);
  const ctx = canvas.getContext("2d");
  const data = sortSubsystemBars(subsystems);
  const pad = { left: 42, right: 18, top: 28, bottom: 52 };
  const w = canvas.width;
  const h = canvas.height;
  clear(ctx, w, h);
  drawGrid(ctx, pad, w, h);
  drawThreshold(ctx, pad, w, h, 60, "#ff3d59");
  drawThreshold(ctx, pad, w, h, 80, "#f4a51c");
  const slot = (w - pad.left - pad.right) / data.length;
  const barWidth = Math.max(4, Math.min(8, slot * 0.34));
  state.detailBarHitboxes = [];
  data.forEach((item, index) => {
    const x = pad.left + index * slot + (slot - barWidth) / 2;
    const y = valueY(item.score, pad, h);
    const barHeight = h - pad.bottom - y;
    const isHover = state.detailBarHoverName === item.name;
    if (isHover) {
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(x - 2, pad.top, barWidth + 4, h - pad.top - pad.bottom);
    }
    const gradient = ctx.createLinearGradient(0, y, 0, h - pad.bottom);
    gradient.addColorStop(0, riskMeta[item.risk].color);
    gradient.addColorStop(1, "rgba(255,255,255,0.05)");
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.shadowColor = riskMeta[item.risk].color;
    ctx.shadowBlur = isHover ? 16 : 5;
    ctx.fillRect(x, y, barWidth, Math.min(3, barHeight));
    ctx.shadowBlur = 0;
    state.detailBarHitboxes.push({ x: x - 4, y, width: barWidth + 8, height: barHeight, item });
    if (index % 5 === 0) {
      ctx.fillStyle = "#8f97a8";
      ctx.font = "11px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.fillText(item.name.replace("子系统", ""), x + barWidth / 2, h - 18);
    }
  });
}

function sortSubsystemBars(subsystems) {
  return [...subsystems].sort((a, b) => {
    if (state.sortSubsystemMode === "idDesc") return b.name.localeCompare(a.name, "zh-CN");
    if (state.sortSubsystemMode === "sosAsc") return a.score - b.score || a.name.localeCompare(b.name, "zh-CN");
    if (state.sortSubsystemMode === "sosDesc") return b.score - a.score || a.name.localeCompare(b.name, "zh-CN");
    return a.name.localeCompare(b.name, "zh-CN");
  });
}

function handleDetailBarHover(event) {
  const rect = els.barCanvas.getBoundingClientRect();
  const scaleX = els.barCanvas.width / rect.width;
  const scaleY = els.barCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const hit = state.detailBarHitboxes.find((box) => x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height);
  if (!hit) {
    if (state.detailBarHoverName) {
      state.detailBarHoverName = null;
      renderBars(state.detailSubsystems);
    }
    els.detailBarsTooltip.classList.remove("show");
    return;
  }
  if (state.detailBarHoverName !== hit.item.name) {
    state.detailBarHoverName = hit.item.name;
    renderBars(state.detailSubsystems);
  }
  els.detailBarsTooltip.innerHTML = `
    <strong>${hit.item.name}</strong>
    <span style="color:${riskMeta[hit.item.risk].color}">SOS ${formatSosValue(hit.item.score)}</span>
  `;
  const box = els.detailBarsViewport.getBoundingClientRect();
  els.detailBarsTooltip.style.left = `${Math.min(els.detailBarsViewport.clientWidth - 230, Math.max(8, event.clientX - box.left + 12))}px`;
  els.detailBarsTooltip.style.top = `${Math.max(8, event.clientY - box.top + 12)}px`;
  els.detailBarsTooltip.classList.add("show");
}

function boxPlotParts(station) {
  const names = ["电池系统", "电气系统", "环控系统", "消防系统"];
  return names.map((name, index) => {
    const base = station.sos - index * 4 + Math.sin(index + station.sos) * 8;
    const low = round(Math.max(14, base - 30), 2);
    const q1 = round(Math.max(24, base - 13), 2);
    const mid = round(Math.max(30, base + (index === 0 ? 2 : 0)), 2);
    const q3 = round(Math.min(94, base + 16), 2);
    const high = round(Math.min(100, base + 28), 2);
    const mean = round((low + q1 + mid + q3 + high) / 5, 2);
    const outliers = [];
    if (index !== 1) {
      outliers.push({
        value: round(Math.max(8, low - 7 - index * 2), 2),
        subsystem: `#${1 + ((index * 3 + Math.round(station.sos)) % Math.max(1, station.subsystemCount))}子系统`,
      });
    }
    if (index === 2 || station.risk === "high") {
      outliers.push({
        value: round(Math.min(100, high + 6), 2),
        subsystem: `#${2 + ((index * 5 + Math.round(station.sos)) % Math.max(2, station.subsystemCount))}子系统`,
      });
    }
    return { name, low, q1, mid, q3, high, mean, outliers };
  });
}

function renderBoxPlot(station) {
  const canvas = setupCanvas(els.boxCanvas);
  const ctx = canvas.getContext("2d");
  const parts = boxPlotParts(station);
  const pad = { left: 48, right: 28, top: 32, bottom: 46 };
  const w = canvas.width;
  const h = canvas.height;
  clear(ctx, canvas.width, canvas.height);
  drawGrid(ctx, pad, canvas.width, canvas.height);
  state.detailBoxHitboxes = [];
  parts.forEach((part, index) => {
    const plotWidth = w - pad.left - pad.right;
    const x = pad.left + (index + 0.5) * (plotWidth / parts.length);
    const boxWidth = Math.min(44, Math.max(28, plotWidth / 15));
    const yLow = valueY(part.low, pad, h);
    const yHigh = valueY(part.high, pad, h);
    const yQ1 = valueY(part.q1, pad, h);
    const yQ3 = valueY(part.q3, pad, h);
    const yMid = valueY(part.mid, pad, h);
    const yMean = valueY(part.mean, pad, h);
    ctx.strokeStyle = "#1689ff";
    ctx.fillStyle = "rgba(22, 137, 255, 0.24)";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x, yHigh);
    ctx.lineTo(x, yLow);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - boxWidth * 0.28, yHigh);
    ctx.lineTo(x + boxWidth * 0.28, yHigh);
    ctx.moveTo(x - boxWidth * 0.28, yLow);
    ctx.lineTo(x + boxWidth * 0.28, yLow);
    ctx.stroke();
    ctx.fillRect(x - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3);
    ctx.strokeRect(x - boxWidth / 2, yQ3, boxWidth, yQ1 - yQ3);
    ctx.beginPath();
    ctx.moveTo(x - boxWidth / 2, yMid);
    ctx.lineTo(x + boxWidth / 2, yMid);
    ctx.stroke();
    ctx.fillStyle = "#1689ff";
    ctx.beginPath();
    ctx.moveTo(x, yMean - 7);
    ctx.lineTo(x + 6, yMean + 5);
    ctx.lineTo(x - 6, yMean + 5);
    ctx.closePath();
    ctx.fill();
    part.outliers.forEach((outlier) => {
      const oy = valueY(outlier.value, pad, h);
      ctx.fillStyle = "#ff526a";
      ctx.beginPath();
      ctx.moveTo(x, oy - 7);
      ctx.lineTo(x + 6, oy);
      ctx.lineTo(x, oy + 7);
      ctx.lineTo(x - 6, oy);
      ctx.closePath();
      ctx.fill();
      state.detailBoxHitboxes.push({ type: "outlier", x, y: oy, part, outlier });
    });
    ctx.fillStyle = "#8f97a8";
    ctx.font = "12px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText(part.name.replace("系统", ""), x, h - 14);
    state.detailBoxHitboxes.push({ type: "box", x, y: (yQ1 + yQ3) / 2, boxWidth, yQ1, yQ3, part });
  });
}

function handleBoxHover(event) {
  const rect = els.boxCanvas.getBoundingClientRect();
  const scaleX = els.boxCanvas.width / rect.width;
  const scaleY = els.boxCanvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  const hit = state.detailBoxHitboxes
    .map((item) => {
      if (item.type === "box") {
        const inBox = Math.abs(item.x - x) <= item.boxWidth / 2 + 12 && y >= item.yQ3 - 12 && y <= item.yQ1 + 12;
        return { ...item, distance: inBox ? 0 : Math.hypot(item.x - x, item.y - y) };
      }
      return { ...item, distance: Math.hypot(item.x - x, item.y - y) };
    })
    .sort((a, b) => a.distance - b.distance)[0];
  if (!hit || hit.distance > 22) {
    els.boxTooltip.classList.remove("show");
    return;
  }
  if (hit.type === "outlier") {
    els.boxTooltip.innerHTML = `
      <strong>${hit.part.name}</strong>
      <span style="color:#ff526a">${hit.outlier.subsystem} ${formatSosValue(hit.outlier.value)}</span>`;
  } else {
    els.boxTooltip.innerHTML = `
      <strong>${hit.part.name}</strong>
      <span style="color:#1689ff">上边缘 ${formatSosValue(hit.part.high)}</span>
      <span style="color:#1689ff">上四分位 ${formatSosValue(hit.part.q3)}</span>
      <span style="color:#1689ff">中位数 ${formatSosValue(hit.part.mid)}</span>
      <span style="color:#1689ff">均值 ${formatSosValue(hit.part.mean)}</span>
      <span style="color:#1689ff">下四分位 ${formatSosValue(hit.part.q1)}</span>
      <span style="color:#1689ff">下边缘 ${formatSosValue(hit.part.low)}</span>`;
  }
  const box = els.boxChartWrap.getBoundingClientRect();
  els.boxTooltip.style.left = `${Math.min(els.boxChartWrap.clientWidth - 230, Math.max(8, event.clientX - box.left + 12))}px`;
  els.boxTooltip.style.top = `${Math.max(8, event.clientY - box.top + 12)}px`;
  els.boxTooltip.classList.add("show");
}

function renderDetailAlarms(station) {
  const stationAlarms = state.allAlarms
    .filter((alarm) => alarm.stationId === station.id)
    .sort((a, b) => alarmOrder(a.type) - alarmOrder(b.type) || b.dateISO.localeCompare(a.dateISO));
  const rangeAlarms = filterAlarmsByWindow(
    stationAlarms,
    state.detailAlarmDays,
    state.detailAlarmStartDate,
    state.detailAlarmEndDate
  );
  const alarms = rangeAlarms.filter((alarm) => state.detailAlarmType === "all" || alarm.type === state.detailAlarmType);
  els.detailAlarmSubtitle.textContent = `${station.id}${station.name}`;
  els.detailAlarmCountAll.textContent = rangeAlarms.length;
  els.detailAlarmCountLevel1.textContent = rangeAlarms.filter((alarm) => alarm.type === "level1").length;
  els.detailAlarmCountLevel2.textContent = rangeAlarms.filter((alarm) => alarm.type === "level2").length;
  els.detailAlarmCountLevel3.textContent = rangeAlarms.filter((alarm) => alarm.type === "level3").length;
  els.detailAlarmCloudCount.textContent = alarms.filter((alarm) => alarm.source === "云端").length;
  els.detailAlarmStationCount.textContent = alarms.filter((alarm) => alarm.source === "站端").length;
  els.detailAlarmList.innerHTML = alarms.length
    ? alarms
        .map(
          (alarm) => `
        <button class="alarm-item alarm-${alarm.type}" type="button" data-alarm-id="${alarm.id}">
          <div class="alarm-body">
            <div class="alarm-row">
              <div class="alarm-tags">
                <span class="alarm-level">${alarm.level}</span><span>${alarm.module}</span>
              </div>
              <span class="alarm-source alarm-source-${alarm.source === "云端" ? "cloud" : "station"}">${alarm.source}</span>
            </div>
            <strong>${alarm.title}</strong>
            <div class="alarm-meta">
              <span class="alarm-station-name">${alarm.location}</span>
              <time>${alarm.time}</time>
            </div>
          </div>
        </button>`
        )
        .join("")
    : `<div class="empty detail-alarm-empty">当前场站暂无预警</div>`;
  els.detailAlarmList.querySelectorAll(".alarm-item").forEach((item) => {
    item.addEventListener("click", () => {
      const alarm = alarms.find((entry) => entry.id === item.dataset.alarmId);
      openAlarmModal(alarm);
    });
  });
}

function renderTable() {
  const descriptions = {
    high: "Pack 温差偏高，簇级电压离散度异常",
    mid: "监测参数持续波动，建议跟踪运行趋势",
    low: "存在优化项，建议纳入下次巡检",
    healthy: "健康",
  };
  const suggestions = {
    high: "立即复核 BMS 数据并安排现场排查",
    mid: "观察 2 小时趋势，必要时调整运行策略",
    low: "记录优化项，按计划维护",
    healthy: "保持当前运行策略",
  };
  const rows = state.detailSubsystems.map((item, index) => ({
    ...item,
    date: `2026-04-${String(15 - (index % 7)).padStart(2, "0")}`,
    description: descriptions[item.risk],
    suggestion: suggestions[item.risk],
  }));
  const sorted = sortDetailTableRows(rows);
  updateDetailTableSortHeaders();
  els.alertTable.innerHTML = sorted
    .map(
      (item, index) => `
      <tr data-row="${index}">
        <td>${item.name}</td>
        <td class="${scoreClass(item.score)}">${formatSosValue(item.score)}</td>
        <td>${item.date}</td>
        <td>${item.description}</td>
        <td>${item.suggestion}</td>
      </tr>`
    )
    .join("");
  els.alertTable.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => {
      els.alertTable.querySelectorAll("tr").forEach((item) => item.classList.remove("selected"));
      row.classList.add("selected");
    });
  });
}

function sortDetailTableRows(rows) {
  const { key, direction } = state.detailTableSort;
  const factor = direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    let result = 0;
    if (key === "score") result = a.score - b.score;
    else if (key === "date") result = a.date.localeCompare(b.date, "zh-CN");
    else if (key === "risk") result = riskMeta[a.risk].order - riskMeta[b.risk].order || a.score - b.score;
    else if (key === "suggestion") result = a.suggestion.localeCompare(b.suggestion, "zh-CN");
    else result = a.name.localeCompare(b.name, "zh-CN");
    return result * factor;
  });
}

function updateDetailTableSortHeaders() {
  document.querySelectorAll(".table-sort-btn").forEach((button) => {
    const active = button.dataset.sortKey === state.detailTableSort.key;
    button.classList.toggle("active", active);
    button.classList.toggle("asc", active && state.detailTableSort.direction === "asc");
    button.classList.toggle("desc", active && state.detailTableSort.direction === "desc");
  });
}

function setupCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(320, Math.round(rect.width));
  const cssHeight = Number(canvas.getAttribute("height"));
  canvas.width = width;
  canvas.height = cssHeight;
  return canvas;
}

function clear(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

function drawGrid(ctx, pad, w, h) {
  ctx.strokeStyle = "#303440";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.fillStyle = "#747c8f";
  ctx.font = "12px Microsoft YaHei";
  ctx.textAlign = "right";
  [0, 20, 40, 60, 80, 100].forEach((value) => {
    const y = valueY(value, pad, h);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
    ctx.fillText(String(value), pad.left - 8, y + 4);
  });
  ctx.setLineDash([]);
}

function drawThreshold(ctx, pad, w, h, value, color, label = "") {
  const y = valueY(value, pad, h);
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.55;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(pad.left, y);
  ctx.lineTo(w - pad.right, y);
  ctx.stroke();
  ctx.setLineDash([]);
  if (label) {
    ctx.fillStyle = color;
    ctx.font = "12px Microsoft YaHei";
    ctx.textAlign = "left";
    ctx.fillText(label, pad.left + 6, y - 6);
  }
  ctx.globalAlpha = 1;
}

function valueY(value, pad, h) {
  return pad.top + (100 - value) * ((h - pad.top - pad.bottom) / 100);
}

function summarizeSubsystems(subsystems) {
  return subsystems.reduce(
    (acc, item) => {
      acc[item.risk] += 1;
      return acc;
    },
    { high: 0, mid: 0, low: 0, healthy: 0 }
  );
}

function alarmOrder(type) {
  return { level1: 0, level2: 1, level3: 2 }[type] ?? 3;
}

function levelToType(level) {
  return { 一级: "level1", 二级: "level2", 三级: "level3" }[level] ?? "level3";
}

function alarmTemplateWeight(template) {
  const weightMap = {
    "铜排螺栓松动/绝缘子故障": 7,
    "多电芯容量偏高异常": 6,
    "PCS控制参数调整-进口水温偏低": 5,
    "单电芯温度偏低": 4,
    "多颗电芯温度偏低/电芯温度一致性差": 3,
    "单电芯SOC偏高异常": 3,
    "多电芯SOC偏高异常": 2,
    "直流主控配电柜空调长时间温度异常": 2,
  };
  return weightMap[template.name] ?? 1;
}

function pickRiskTemplate(templates, index) {
  const fallback = { name: "子系统SOC不均衡提示", module: "电池系统", level: "三级", locationFormat: "#1子系统-Rack101-Pack1-Cell2" };
  if (!templates.length) return fallback;
  const level = index < 35 ? "一级" : index < 105 ? "二级" : "三级";
  const pool = templates.filter((item) => item.level === level);
  const source = pool.length ? pool : templates;
  const weightedPool = source.flatMap((item) => Array.from({ length: alarmTemplateWeight(item) }, () => item));
  return weightedPool[index % weightedPool.length];
}

function createAlarmLocation(format, station, index) {
  const subsystemTotal = Math.max(1, Number(station.subsystemCount) || 1);
  const subsystem = 1 + (index % subsystemTotal);
  const rack = `${index % 2 === 0 ? 1 : 2}${String(1 + ((index * 5) % 12)).padStart(2, "0")}`;
  const pack = 1 + ((index * 3) % 8);
  const cells = [0, 1, 2].map((offset) => 1 + ((index * 7 + offset * 9) % 28));
  return format
    .replace(/#\d+子系统/g, `#${subsystem}子系统`)
    .replace(/Rack\d+/g, `Rack${rack}`)
    .replace(/Pack\d+/g, `Pack${pack}`)
    .replace(/Cell\d+(?:,\d+)*/g, (match) => {
      const count = match.replace(/^Cell/, "").split(",").length;
      return `Cell${cells.slice(0, count).join(",")}`;
    });
}

function formatDateInput(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatSosValue(value) {
  return value === 100 ? "100" : Number(value).toFixed(2);
}

function scoreClass(score) {
  const risk = getRisk(score);
  return `score-${risk}`;
}

function round(value, digits) {
  return Number(value.toFixed(digits));
}

function tickClock() {
  const now = new Date();
  els.clock.textContent = now.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function openPageFromUrl() {
  const page = new URLSearchParams(window.location.search).get("page");
  if (["overview", "risk", "alarm"].includes(page)) showPage(page);
}

function openStationFromUrl() {
  const stationId = new URLSearchParams(window.location.search).get("station");
  if (stationId) showDetail(stationId);
}

function bindSosRangeEvents() {
  if (!els.sosMinInput || !els.sosMaxInput || !els.sosMinRange || !els.sosMaxRange) return;
  const applyFromInputs = () => {
    const min = Number(els.sosMinInput.value);
    const max = Number(els.sosMaxInput.value);
    setSosRange(min, max);
  };
  const applyFromRanges = () => {
    const min = Number(els.sosMinRange.value);
    const max = Number(els.sosMaxRange.value);
    setSosRange(min, max);
  };
  ["input", "change"].forEach((eventName) => {
    els.sosMinInput.addEventListener(eventName, applyFromInputs);
    els.sosMaxInput.addEventListener(eventName, applyFromInputs);
    els.sosMinRange.addEventListener(eventName, applyFromRanges);
    els.sosMaxRange.addEventListener(eventName, applyFromRanges);
  });
  setSosRange(state.sosMin, state.sosMax, false);
}

function setSosRange(minValue, maxValue, shouldApply = true) {
  let min = Number.isFinite(minValue) ? minValue : 0;
  let max = Number.isFinite(maxValue) ? maxValue : 100;
  min = Math.max(0, Math.min(100, Math.round(min)));
  max = Math.max(0, Math.min(100, Math.round(max)));
  if (min > max) [min, max] = [max, min];
  state.sosMin = min;
  state.sosMax = max;
  syncSosRangeControls();
  if (shouldApply) applyFilters();
}

function syncSosRangeControls() {
  if (!els.sosMinInput || !els.sosMaxInput || !els.sosMinRange || !els.sosMaxRange || !els.sosRangeFill) return;
  els.sosMinInput.value = String(state.sosMin);
  els.sosMaxInput.value = String(state.sosMax);
  els.sosMinRange.value = String(state.sosMin);
  els.sosMaxRange.value = String(state.sosMax);
  els.sosRangeFill.style.left = `${state.sosMin}%`;
  els.sosRangeFill.style.right = `${100 - state.sosMax}%`;
}
