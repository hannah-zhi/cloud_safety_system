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

const state = {
  stations: [],
  filtered: [],
  activeFilter: "all",
  selectedStation: null,
  trendRange: 7,
  sortSubsystemDesc: false,
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  state.stations = createStations(110);
  renderFilters();
  applyFilters();
  bindEvents();
  openStationFromUrl();
  tickClock();
  setInterval(tickClock, 1000);
});

function bindElements() {
  [
    "stationGrid",
    "searchInput",
    "sortSelect",
    "statusFilters",
    "selectedCount",
    "resultText",
    "clearFilterBtn",
    "listView",
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
    "clock",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
  els.trendCanvas = document.getElementById("trendCanvas");
  els.donutCanvas = document.getElementById("donutCanvas");
  els.barCanvas = document.getElementById("barCanvas");
  els.boxCanvas = document.getElementById("boxCanvas");
}

function bindEvents() {
  els.searchInput.addEventListener("input", applyFilters);
  els.sortSelect.addEventListener("change", applyFilters);
  els.clearFilterBtn.addEventListener("click", () => {
    state.activeFilter = "all";
    els.searchInput.value = "";
    applyFilters();
    renderFilters();
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
  });
}

function createStations(count) {
  return Array.from({ length: count }, (_, index) => {
    const n = index + 1;
    const name = stationNames[index % stationNames.length];
    const sos = scoreFor(n);
    const risk = getRisk(sos);
    const comm = n % 13 === 0 || n % 17 === 0 ? "down" : n % 7 === 0 || n % 11 === 0 ? "partial" : "ok";
    const run = comm === "down" && n % 2 === 0 ? "停机" : n % 5 === 0 ? "运行" : "待机";
    const rated = round(1 + ((n * 7) % 18) * 0.55, 2);
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
      active,
      energy,
      soc,
      alarms: Math.max(0, riskMeta[risk].order === 3 ? n % 2 : 3 + (n % 9)),
    };
  });
}

function scoreFor(n) {
  const base = 93 - ((n * 17) % 49);
  const wave = Math.sin(n * 0.73) * 9;
  const special = n % 13 === 0 ? -22 : n % 9 === 0 ? -12 : n % 8 === 0 ? 8 : 0;
  return round(Math.min(100, Math.max(42, base + wave + special)), 2);
}

function getRisk(score) {
  if (score < 60) return "high";
  if (score < 80) return "mid";
  if (score < 90) return "low";
  return "healthy";
}

function renderFilters() {
  const counts = summarize(state.stations);
  const filters = [
    { key: "comm:ok", label: "通讯正常", count: counts.comm.ok, tone: commMeta.ok.tone },
    { key: "comm:partial", label: "部分通讯中断", count: counts.comm.partial, tone: commMeta.partial.tone },
    { key: "comm:down", label: "通讯中断", count: counts.comm.down, tone: commMeta.down.tone },
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
    const matchKeyword = !keyword || `${station.id}${station.name}`.toLowerCase().includes(keyword);
    const matchFilter =
      state.activeFilter === "all" ||
      (filterType === "comm" && station.comm === filterValue) ||
      (filterType === "risk" && station.risk === filterValue);
    return matchKeyword && matchFilter;
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
}

function renderStations(stations) {
  els.selectedCount.textContent = state.stations.length;
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
  const runClass = station.run === "停机" ? "stop" : station.run === "运行" ? "run" : "";
  const fillColor = risk.color;
  return `
    <button class="station-card risk-${station.risk}" data-id="${station.id}" type="button">
      <div class="card-head">
        <span class="run-badge ${runClass}">▣ ${station.run}</span>
        <span class="station-name" title="${station.id}${station.name}">${station.id}${station.name}</span>
        <span class="risk-dot ${risk.className}" title="${risk.label}"></span>
      </div>
      <div class="metrics">
        <div class="metric"><span>场站通讯状态</span><strong>${commMeta[station.comm].label}</strong></div>
        <div class="metric"><span>额定功率</span><strong>${station.rated} MW</strong></div>
        <div class="metric"><span>场站有功功率</span><strong>${station.active} MW</strong></div>
        <div class="metric"><span>剩余电量</span><strong>${station.energy} MWh</strong></div>
        <div class="metric"><span>场站SOC</span><strong>${station.soc} %</strong></div>
      </div>
      <div class="sos-line">
        <span class="${scoreClass(station.sos)}">${station.sos}</span>
        <div class="sos-track"><div class="sos-fill" style="width:${station.sos}%;background:${fillColor}"></div></div>
      </div>
    </button>`;
}

function showDetail(id) {
  const station = state.stations.find((item) => item.id === id);
  if (!station) return;
  state.selectedStation = station;
  state.trendRange = 7;
  state.sortSubsystemDesc = false;
  els.listView.classList.remove("active-view");
  els.detailView.classList.add("active-view");
  document.getElementById("pageTitle").textContent = "安全预警";
  renderDetail(station);
  window.scrollTo({ top: 0, behavior: "smooth" });
  const url = new URL(window.location.href);
  url.searchParams.set("station", station.id);
  window.history.replaceState({}, "", url);
}

function showList() {
  els.detailView.classList.remove("active-view");
  els.listView.classList.add("active-view");
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
  let start = -Math.PI / 2;
  entries.forEach(([key, count]) => {
    const angle = (count / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.strokeStyle = riskMeta[key].color;
    ctx.lineWidth = 36;
    ctx.arc(canvas.width / 2, canvas.height / 2, 70, start, start + angle);
    ctx.stroke();
    start += angle;
  });
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

function openStationFromUrl() {
  const stationId = new URLSearchParams(window.location.search).get("station");
  if (stationId) showDetail(stationId);
}
