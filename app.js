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
  activePage: "overview",
  selectedAlarm: null,
  riskTrendRange: 7,
  riskBarHitboxes: [],
  riskTrendHitboxes: [],
  activeFilter: "all",
  selectedStationIds: new Set(),
  selectedStation: null,
  trendRange: 7,
  sortSubsystemDesc: false,
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  state.stations = createStations();
  state.allAlarms = createAlarms(state.stations);
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
    "detailCrumb",
    "detailComm",
    "detailRisk",
    "detailSos",
    "detailRated",
    "detailActive",
    "detailEnergy",
    "detailSoc",
    "detailAlarm",
    "gauge",
    "gaugeValue",
    "gaugeLabel",
    "rangeButtons",
    "subsystemSortBtn",
    "alertTable",
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
    "riskAvgSos",
    "riskWatchCount",
    "riskTopList",
    "riskTrendButtons",
    "riskBarsViewport",
    "riskBarsTooltip",
    "riskTrendChart",
    "riskTrendTooltip",
    "riskPieLegend",
    "riskAlarmPieLegend",
    "alarmDetailKeyword",
    "alarmDetailLevel",
    "alarmDetailModule",
    "alarmDetailSource",
    "alarmDetailStart",
    "alarmDetailEnd",
    "alarmDetailReset",
    "alarmDetailCount",
    "alarmDetailTable",
    "alarmInspectorBody",
    "clock",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
  els.trendCanvas = document.getElementById("trendCanvas");
  els.donutCanvas = document.getElementById("donutCanvas");
  els.barCanvas = document.getElementById("barCanvas");
  els.boxCanvas = document.getElementById("boxCanvas");
  els.riskBarsCanvas = document.getElementById("riskBarsCanvas");
  els.riskPieCanvas = document.getElementById("riskPieCanvas");
  els.riskTrendCanvas = document.getElementById("riskTrendCanvas");
  els.riskAlarmPieCanvas = document.getElementById("riskAlarmPieCanvas");
  els.riskModuleCanvas = document.getElementById("riskModuleCanvas");
  els.riskBandCanvas = document.getElementById("riskBandCanvas");
}

function bindEvents() {
  els.pageTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-page]");
    if (!button) return;
    showPage(button.dataset.page);
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
  });
  window.addEventListener("resize", positionStationPicker);
  window.addEventListener("scroll", positionStationPicker, true);
  els.sortSelect.addEventListener("change", applyFilters);
  els.clearFilterBtn.addEventListener("click", () => {
    state.activeFilter = "all";
    state.selectedStationIds.clear();
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
  [els.alarmDetailKeyword, els.alarmDetailLevel, els.alarmDetailModule, els.alarmDetailSource, els.alarmDetailStart, els.alarmDetailEnd].forEach((input) => {
    input.addEventListener("input", renderAlarmDetailPage);
    input.addEventListener("change", renderAlarmDetailPage);
  });
  els.alarmDetailReset.addEventListener("click", () => {
    els.alarmDetailKeyword.value = "";
    els.alarmDetailLevel.value = "all";
    els.alarmDetailModule.value = "all";
    els.alarmDetailSource.value = "all";
    els.alarmDetailStart.value = "";
    els.alarmDetailEnd.value = "";
    state.selectedAlarm = null;
    renderAlarmDetailPage();
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
    els.riskBarsTooltip.classList.remove("show");
  });
  els.riskTrendCanvas.addEventListener("mousemove", handleRiskTrendHover);
  els.riskTrendCanvas.addEventListener("mouseleave", () => {
    els.riskTrendTooltip.classList.remove("show");
  });
  els.backBtn.addEventListener("click", showList);
  els.rangeButtons.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-range]");
    if (!button || !state.selectedStation) return;
    state.trendRange = Number(button.dataset.range);
    els.rangeButtons.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    renderTrend(state.selectedStation, state.trendRange);
  });
  els.subsystemSortBtn.addEventListener("click", () => {
    if (!state.selectedStation) return;
    state.sortSubsystemDesc = !state.sortSubsystemDesc;
    els.subsystemSortBtn.textContent = state.sortSubsystemDesc ? "SOS指数-降序" : "子系统编号-顺序";
    renderBars(createSubsystems(state.selectedStation), state.sortSubsystemDesc);
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
  return Array.from({ length: alarmTotal }, (_, index) => {
      const station = stations[(index * 37) % stations.length];
      const template = pickRiskTemplate(templates, index);
      const type = levelToType(template.level);
      const date = new Date(2026, 3, 15 - (index % 45), 11 - (index % 3), 21 + (index % 36));
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
        time: `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
      };
    })
    .sort((a, b) => alarmOrder(a.type) - alarmOrder(b.type));
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
    const matchSelected = !state.selectedStationIds.size || state.selectedStationIds.has(station.id);
    const matchKeyword = state.selectedStationIds.size || !keyword || `${station.id}${station.name}`.toLowerCase().includes(keyword);
    const matchFilter =
      state.activeFilter === "all" ||
      (filterType === "comm" && station.comm === filterValue) ||
      (filterType === "risk" && station.risk === filterValue);
    return matchSelected && matchKeyword && matchFilter;
  });

  const sortBy = els.sortSelect.value;
  filtered = filtered.sort((a, b) => {
    if (sortBy === "sos") return a.sos - b.sos;
    if (sortBy === "risk") return riskMeta[a.risk].order - riskMeta[b.risk].order || a.sos - b.sos;
    if (sortBy === "soc") return b.soc - a.soc;
    return a.id.localeCompare(b.id, "zh-CN");
  });

  state.filtered = filtered;
  renderStations(filtered);
  state.alarms = filterAlarmsByStations(filtered);
  renderAlarms();
  if (state.activePage === "risk") renderRiskView();
  if (state.activePage === "alarm") renderAlarmDetailPage();
  renderStationPicker();
}

function showPage(page) {
  state.activePage = page;
  state.selectedStation = null;
  els.detailView.classList.remove("active-view");
  els.listView.classList.toggle("active-view", page === "overview");
  els.riskView.classList.toggle("active-view", page === "risk");
  els.alarmDetailView.classList.toggle("active-view", page === "alarm");
  els.pageTabs.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === page);
  });
  if (page === "risk") renderRiskView();
  if (page === "alarm") renderAlarmDetailPage();
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
        <div class="metric"><span>额定容量</span><strong>${station.rated} MW</strong></div>
        <div class="metric"><span>额定能量</span><strong>${station.ratedEnergy} MWh</strong></div>
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
      <button class="alarm-item alarm-${alarm.type}" type="button" data-station="${alarm.stationId}">
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
    item.addEventListener("click", () => showDetail(item.dataset.station));
  });
}

function filterAlarmsByTime(alarms) {
  if (state.activeAlarmDays !== "custom") {
    if (state.activeAlarmDays === "all") return alarms;
    const days = Number(state.activeAlarmDays);
    const boundary = new Date(2026, 3, 15);
    boundary.setDate(boundary.getDate() - days + 1);
    return alarms.filter((alarm) => new Date(`${alarm.dateISO}T00:00:00`) >= boundary);
  }
  const start = state.alarmStartDate ? new Date(`${state.alarmStartDate}T00:00:00`) : null;
  const end = state.alarmEndDate ? new Date(`${state.alarmEndDate}T23:59:59`) : null;
  return alarms.filter((alarm) => {
    const date = new Date(`${alarm.dateISO}T12:00:00`);
    return (!start || date >= start) && (!end || date <= end);
  });
}

function renderRiskView() {
  const stations = state.filtered;
  const alarms = state.alarms;
  const avg = stations.reduce((sum, station) => sum + station.sos, 0) / Math.max(1, stations.length);
  els.riskAvgSos.textContent = formatSosValue(round(avg, 2));
  els.riskWatchCount.textContent = stations.filter((station) => station.risk === "high" || station.risk === "mid").length;
  renderSafely(() => renderRiskTopList(stations));
  renderSafely(() => renderRiskBars(stations));
  renderSafely(() => renderRiskPie(stations));
  renderSafely(() => renderRiskTrend(stations, state.riskTrendRange));
  renderSafely(() => renderRiskAlarmPie(alarms));
  renderSafely(() => renderRiskModules(alarms));
  renderSafely(() => renderRiskBands(stations));
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

function renderRiskBars(stations) {
  const data = [...stations].sort((a, b) => a.id.localeCompare(b.id, "zh-CN"));
  const desiredWidth = Math.max(1120, data.length * 13 + 110);
  els.riskBarsCanvas.style.width = `${desiredWidth}px`;
  const canvas = setupCanvas(els.riskBarsCanvas);
  const ctx = canvas.getContext("2d");
  const pad = { left: 46, right: 20, top: 40, bottom: 54 };
  clear(ctx, canvas.width, canvas.height);
  drawGrid(ctx, pad, canvas.width, canvas.height);
  drawThreshold(ctx, pad, canvas.width, canvas.height, 60, "#ff3d59");
  drawThreshold(ctx, pad, canvas.width, canvas.height, 80, "#f4a51c");
  const gap = 7;
  const barWidth = 5;
  state.riskBarHitboxes = [];
  data.forEach((station, index) => {
    const x = pad.left + index * (barWidth + gap);
    const y = valueY(station.sos, pad, canvas.height);
    const h = canvas.height - pad.bottom - y;
    const gradient = ctx.createLinearGradient(0, y, 0, canvas.height - pad.bottom);
    gradient.addColorStop(0, riskMeta[station.risk].color);
    gradient.addColorStop(1, "rgba(255,255,255,0.05)");
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth, h);
    ctx.shadowColor = riskMeta[station.risk].color;
    ctx.shadowBlur = 5;
    ctx.fillRect(x, y, barWidth, Math.min(3, h));
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
  drawMiniBrush(ctx, pad, canvas.width, canvas.height, data);
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
  const pad = { left: 46, right: 28, top: 30, bottom: 38 };
  const series = createRiskTrendSeries(stations, range);
  clear(ctx, canvas.width, canvas.height);
  drawGrid(ctx, pad, canvas.width, canvas.height);
  state.riskTrendHitboxes = [];
  drawTrendLine(ctx, series.avg, pad, canvas, "#1689ff", "全量场站均值", series.labels);
  drawTrendLine(ctx, series.max, pad, canvas, "#13c781", "最大值", series.labels);
  drawTrendLine(ctx, series.min, pad, canvas, "#ff3d59", "最小值", series.labels);
  ctx.fillStyle = "#8f97a8";
  ctx.font = "12px Microsoft YaHei";
  ctx.textAlign = "center";
  series.labels.forEach((label, index) => {
    if (range <= 15 || index % 3 === 0) {
      const x = pad.left + (index / Math.max(1, range - 1)) * (canvas.width - pad.left - pad.right);
      ctx.fillText(label, x, canvas.height - 12);
    }
  });
}

function createRiskTrendSeries(stations, range) {
  const labels = [];
  const avg = [];
  const max = [];
  const min = [];
  Array.from({ length: range }, (_, index) => {
    const day = 16 - range + index;
    const values = stations.map((station, stationIndex) => {
      const drift = Math.sin((index + 1) * 0.8 + stationIndex * 0.31) * 2.2 - (index % 9 === 0 ? 1.2 : 0);
      return Math.max(35, Math.min(100, station.sos + drift));
    });
    labels.push(`04-${String(day).padStart(2, "0")}`);
    avg.push(round(values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length), 2));
    max.push(round(Math.max(...values, 0), 2));
    min.push(round(Math.min(...values, 100), 2));
  });
  return { labels, avg, max, min };
}

function drawTrendLine(ctx, values, pad, canvas, color, label, labels = []) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = pad.left + (index / Math.max(1, values.length - 1)) * (canvas.width - pad.left - pad.right);
    const y = valueY(value, pad, canvas.height);
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  values.forEach((value, index) => {
    if (index % Math.ceil(values.length / 8) === 0 || index === values.length - 1) {
      const x = pad.left + (index / Math.max(1, values.length - 1)) * (canvas.width - pad.left - pad.right);
      const y = valueY(value, pad, canvas.height);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    state.riskTrendHitboxes.push({ x, y, value, label, date: labels[index] || "", color });
  });
}

function renderRiskModules(alarms) {
  const canvas = setupCanvas(els.riskModuleCanvas);
  const ctx = canvas.getContext("2d");
  const modules = ["电池系统", "电气系统", "环控系统", "消防系统"];
  const counts = modules.map((module) => alarms.filter((alarm) => alarm.module === module).length);
  const max = Math.max(1, ...counts);
  const pad = { left: 62, right: 54, top: 28, bottom: 36 };
  clear(ctx, canvas.width, canvas.height);
  modules.forEach((module, index) => {
    const y = pad.top + index * 52;
    const width = (counts[index] / max) * (canvas.width - pad.left - pad.right - 20);
    ctx.fillStyle = "rgba(18, 152, 255, 0.16)";
    ctx.fillRect(pad.left, y, canvas.width - pad.left - pad.right, 22);
    ctx.fillStyle = index === 0 ? "#1689ff" : index === 1 ? "#13c781" : index === 2 ? "#f4a51c" : "#ff3d59";
    ctx.fillRect(pad.left, y, width, 22);
    ctx.fillStyle = "#aeb8ca";
    ctx.font = "12px Microsoft YaHei";
    ctx.textAlign = "right";
    ctx.fillText(module, pad.left - 10, y + 15);
    ctx.textAlign = "left";
    ctx.fillStyle = "#eef3fb";
    const textX = Math.min(canvas.width - 32, pad.left + width + 8);
    ctx.fillText(String(counts[index]), textX, y + 15);
  });
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
    els.riskBarsTooltip.classList.remove("show");
    return;
  }
  els.riskBarsTooltip.innerHTML = `
    <strong>${hit.station.id}${hit.station.name}</strong>
    <span>SOS ${formatSosValue(hit.station.sos)}</span>
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
  const hit = state.riskTrendHitboxes.find((point) => Math.abs(point.x - x) <= 8 && Math.abs(point.y - y) <= 8);
  if (!hit) {
    els.riskTrendTooltip.classList.remove("show");
    return;
  }
  els.riskTrendTooltip.innerHTML = `
    <strong>${hit.date} ${hit.label}</strong>
    <span>SOS ${formatSosValue(hit.value)}</span>
  `;
  const box = els.riskTrendChart.getBoundingClientRect();
  const tooltipWidth = 210;
  const rawLeft = event.clientX - box.left + 14;
  const maxLeft = els.riskTrendChart.clientWidth - tooltipWidth - 8;
  els.riskTrendTooltip.style.left = `${Math.max(8, Math.min(maxLeft, rawLeft))}px`;
  els.riskTrendTooltip.style.top = `${event.clientY - box.top + 12}px`;
  els.riskTrendTooltip.classList.add("show");
}

function renderAlarmDetailPage() {
  const alarms = filterAlarmDetailItems();
  els.alarmDetailCount.textContent = alarms.length;
  els.alarmDetailTable.innerHTML = alarms
    .map(
      (alarm) => `
      <tr data-alarm-id="${alarm.id}">
        <td><span class="alarm-level-table alarm-${alarm.type}">${alarm.level}</span></td>
        <td>${alarm.title}</td>
        <td>${alarm.module}</td>
        <td>${alarm.stationId}${alarm.stationName}</td>
        <td><span class="alarm-source alarm-source-${alarm.source === "云端" ? "cloud" : "station"}">${alarm.source}</span></td>
        <td>${alarm.time}</td>
        <td>${alarm.location}</td>
      </tr>`
    )
    .join("");
  els.alarmDetailTable.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => {
      const alarm = alarms.find((item) => item.id === row.dataset.alarmId);
      state.selectedAlarm = alarm;
      renderAlarmInspector(alarm);
      els.alarmDetailTable.querySelectorAll("tr").forEach((item) => item.classList.remove("selected"));
      row.classList.add("selected");
    });
  });
  if (!alarms.length) {
    els.alarmDetailTable.innerHTML = `<tr><td colspan="7">未找到匹配预警</td></tr>`;
  }
  if (!state.selectedAlarm || !alarms.some((alarm) => alarm.id === state.selectedAlarm.id)) {
    state.selectedAlarm = alarms[0] || null;
  }
  renderAlarmInspector(state.selectedAlarm);
}

function filterAlarmDetailItems() {
  const keyword = els.alarmDetailKeyword.value.trim().toLowerCase();
  const level = els.alarmDetailLevel.value;
  const module = els.alarmDetailModule.value;
  const source = els.alarmDetailSource.value;
  const start = els.alarmDetailStart.value ? new Date(`${els.alarmDetailStart.value}T00:00:00`) : null;
  const end = els.alarmDetailEnd.value ? new Date(`${els.alarmDetailEnd.value}T23:59:59`) : null;
  return state.alarms.filter((alarm) => {
    const haystack = `${alarm.title}${alarm.module}${alarm.stationId}${alarm.stationName}${alarm.location}`.toLowerCase();
    const date = new Date(`${alarm.dateISO}T12:00:00`);
    return (
      (!keyword || haystack.includes(keyword)) &&
      (level === "all" || alarm.type === level) &&
      (module === "all" || alarm.module === module) &&
      (source === "all" || alarm.source === source) &&
      (!start || date >= start) &&
      (!end || date <= end)
    );
  });
}

function renderAlarmInspector(alarm) {
  if (!alarm) {
    els.alarmInspectorBody.textContent = "点击任意预警查看完整内容";
    return;
  }
  els.alarmInspectorBody.innerHTML = `
    <div><span>预警名称</span><strong>${alarm.title}</strong></div>
    <div><span>风险等级</span><strong>${alarm.level}</strong></div>
    <div><span>系统模块</span><strong>${alarm.module}</strong></div>
    <div><span>所属场站</span><strong>${alarm.stationId}${alarm.stationName}</strong></div>
    <div><span>预警来源</span><strong>${alarm.source}</strong></div>
    <div><span>发生时间</span><strong>${alarm.time}</strong></div>
    <div><span>预警位置</span><strong>${alarm.location}</strong></div>
    <div><span>处置建议</span><strong>${alarm.level === "一级" ? "立即复核云端诊断结果并安排现场排查。" : alarm.level === "二级" ? "持续观察趋势，纳入当班巡检计划。" : "记录风险变化，按计划跟踪闭环。"}</strong></div>
  `;
}

function showDetail(id) {
  const station = state.stations.find((item) => item.id === id);
  if (!station) return;
  state.selectedStation = station;
  state.trendRange = 7;
  state.sortSubsystemDesc = false;
  els.listView.classList.remove("active-view");
  els.riskView.classList.remove("active-view");
  els.alarmDetailView.classList.remove("active-view");
  els.detailView.classList.add("active-view");
  els.pageTabs.querySelectorAll("button").forEach((button) => button.classList.remove("active"));
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
  els.detailCrumb.textContent = `集团安全中心 / 安全预警 / ${station.name}`;
  els.detailComm.textContent = commMeta[station.comm].label;
  els.detailComm.style.borderColor = commMeta[station.comm].color;
  els.detailRisk.textContent = risk.label;
  els.detailRisk.style.borderColor = risk.color;
  els.detailSos.textContent = `SOS ${station.sos}`;
  els.detailRated.textContent = `${station.rated} MW`;
  els.detailActive.textContent = `${station.active} MW`;
  els.detailEnergy.textContent = `${station.energy} MWh`;
  els.detailSoc.textContent = `${station.soc} %`;
  els.detailAlarm.textContent = `${station.alarms} 条`;
  els.gaugeValue.textContent = station.sos;
  els.gaugeLabel.textContent = `当前风险等级：${risk.label}`;
  els.gaugeLabel.style.color = risk.color;
  els.gauge.querySelector(".gauge-arc").style.setProperty("--angle", `${Math.max(0, Math.min(180, station.sos * 1.8))}deg`);
  els.rangeButtons.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.range === "7"));
  els.subsystemSortBtn.textContent = "子系统编号-顺序";
  renderDetailCharts(station);
  renderTable(station);
}

function renderDetailCharts(station) {
  renderTrend(station, state.trendRange);
  renderDonut(createSubsystems(station));
  renderBars(createSubsystems(station), state.sortSubsystemDesc);
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
  return Array.from({ length: range }, (_, index) => {
    const dayOffset = range - index;
    const value = round(Math.min(100, Math.max(38, station.sos + Math.sin((index + 1) * 0.9) * 6 - (dayOffset % 10 === 0 ? 8 : 0))), 2);
    return {
      label: range <= 7 ? `04-${String(9 + index).padStart(2, "0")}` : `${index + 1}`,
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
  drawThreshold(ctx, pad, w, h, 60, "#ff3d59", "高风险");
  drawThreshold(ctx, pad, w, h, 80, "#f4a51c", "中风险");
  ctx.strokeStyle = "#1689ff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((point, index) => {
    const x = pad.left + (index / Math.max(1, data.length - 1)) * (w - pad.left - pad.right);
    const y = valueY(point.value, pad, h);
    index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  data.forEach((point, index) => {
    const x = pad.left + (index / Math.max(1, data.length - 1)) * (w - pad.left - pad.right);
    const y = valueY(point.value, pad, h);
    ctx.fillStyle = "#0aa5ff";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    if (range <= 15 || index % 3 === 0) {
      ctx.fillStyle = "#8f97a8";
      ctx.font = "12px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.fillText(point.label, x, h - 10);
    }
  });
  ctx.fillStyle = "#c8d0dc";
  ctx.font = "13px Microsoft YaHei";
  ctx.textAlign = "left";
  ctx.fillText("SOS安全指数", pad.left, 18);
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
    ctx.lineWidth = 36;
    ctx.arc(canvas.width / 2, canvas.height / 2, 70, start, start + angle);
    ctx.stroke();
    start += angle;
  });
  ctx.fillStyle = "#f1f3f7";
  ctx.font = "24px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText(String(total), canvas.width / 2, canvas.height / 2 + 8);
}

function renderBars(subsystems, desc) {
  const canvas = setupCanvas(els.barCanvas);
  const ctx = canvas.getContext("2d");
  const data = [...subsystems].sort((a, b) => (desc ? b.score - a.score : a.name.localeCompare(b.name, "zh-CN")));
  const pad = { left: 42, right: 18, top: 28, bottom: 52 };
  const w = canvas.width;
  const h = canvas.height;
  clear(ctx, w, h);
  drawGrid(ctx, pad, w, h);
  drawThreshold(ctx, pad, w, h, 60, "#ff3d59");
  drawThreshold(ctx, pad, w, h, 80, "#f4a51c");
  const gap = 5;
  const barWidth = Math.max(5, (w - pad.left - pad.right) / data.length - gap);
  data.forEach((item, index) => {
    const x = pad.left + index * (barWidth + gap);
    const y = valueY(item.score, pad, h);
    const barHeight = h - pad.bottom - y;
    ctx.fillStyle = riskMeta[item.risk].color;
    ctx.fillRect(x, y, barWidth, barHeight);
    if (index % 5 === 0) {
      ctx.fillStyle = "#8f97a8";
      ctx.font = "11px Microsoft YaHei";
      ctx.textAlign = "center";
      ctx.fillText(item.name.replace("子系统", "#"), x + barWidth / 2, h - 18);
    }
  });
}

function renderBoxPlot(station) {
  const canvas = setupCanvas(els.boxCanvas);
  const ctx = canvas.getContext("2d");
  const parts = ["电池", "电气", "环控", "消防"].map((name, index) => {
    const base = station.sos - index * 4 + Math.sin(index + station.sos) * 8;
    return {
      name,
      low: round(Math.max(18, base - 28), 2),
      q1: round(Math.max(28, base - 14), 2),
      mid: round(Math.max(35, base), 2),
      q3: round(Math.min(95, base + 16), 2),
      high: round(Math.min(100, base + 27), 2),
    };
  });
  const pad = { left: 42, right: 20, top: 28, bottom: 42 };
  clear(ctx, canvas.width, canvas.height);
  drawGrid(ctx, pad, canvas.width, canvas.height);
  parts.forEach((part, index) => {
    const x = pad.left + 48 + index * ((canvas.width - pad.left - pad.right - 96) / 3);
    const yLow = valueY(part.low, pad, canvas.height);
    const yHigh = valueY(part.high, pad, canvas.height);
    const yQ1 = valueY(part.q1, pad, canvas.height);
    const yQ3 = valueY(part.q3, pad, canvas.height);
    const yMid = valueY(part.mid, pad, canvas.height);
    ctx.strokeStyle = "#1689ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, yHigh);
    ctx.lineTo(x, yLow);
    ctx.stroke();
    ctx.strokeRect(x - 14, yQ3, 28, yQ1 - yQ3);
    ctx.beginPath();
    ctx.moveTo(x - 17, yMid);
    ctx.lineTo(x + 17, yMid);
    ctx.stroke();
    ctx.fillStyle = riskMeta[getRisk(part.mid)].color;
    ctx.beginPath();
    ctx.arc(x, yMid, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8f97a8";
    ctx.font = "12px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText(part.name, x, canvas.height - 12);
  });
}

function renderTable(station) {
  const subsystems = createSubsystems(station).sort((a, b) => a.score - b.score).slice(0, 15);
  const descriptions = {
    high: "Pack 温差偏高，簇级电压离散度异常",
    mid: "预警信息超长字段，存在持续波动",
    low: "存在优化项，建议纳入下次巡检",
    healthy: "健康",
  };
  const suggestions = {
    high: "立即复核 BMS 数据并安排现场排查",
    mid: "观察 2 小时趋势，必要时调整运行策略",
    low: "记录优化项，按计划维护",
    healthy: "保持当前运行策略",
  };
  els.alertTable.innerHTML = subsystems
    .map(
      (item, index) => `
      <tr data-row="${index}">
        <td>${item.name}</td>
        <td class="${scoreClass(item.score)}">${item.score}</td>
        <td>2026-04-${String(15 - (index % 7)).padStart(2, "0")}</td>
        <td>${descriptions[item.risk]}</td>
        <td>${suggestions[item.risk]}</td>
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

function pickRiskTemplate(templates, index) {
  const fallback = { name: "子系统SOC不均衡提示", module: "电池系统", level: "三级", locationFormat: "#1子系统-Rack101-Pack1-Cell2" };
  if (!templates.length) return fallback;
  const level = index < 35 ? "一级" : index < 105 ? "二级" : "三级";
  const pool = templates.filter((item) => item.level === level);
  return (pool.length ? pool : templates)[index % (pool.length ? pool.length : templates.length)];
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
