const riskMeta = {
  high: { label: "高风险", className: "high", tone: "tone-danger", color: "#ff3d59", order: 0 },
  mid: { label: "中风险", className: "mid", tone: "tone-warn", color: "#f4a51c", order: 1 },
  low: { label: "低风险", className: "low", tone: "tone-ok", color: "#13c781", order: 2 },
  healthy: { label: "健康", className: "healthy", tone: "tone-blue", color: "#1689ff", order: 3 },
};
const commMeta = {
  ok: { label: "通讯正常", tone: "tone-ok", color: "#13c781" },
  partial: { label: "部分通讯中斯", tone: "tone-warn", color: "#f4a51c" },
  down: { label: "通讯中断", tone: "tone-danger", color: "#ff3d59" },
};
