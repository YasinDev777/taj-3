export const darkMode = {
  layout: {
    background: { type: "solid", color: "#fff" },
    textColor: "#000",
  },
  grid: {
    vertLines: { visible: true, color: "rgba(0, 0, 0, 0.1)", style: 0 },
    horzLines: { visible: true, color: "rgba(0, 0, 0, 0.1)", style: 0 },
    style: 1,
  },
  timeScale: {
    borderColor: "rgba(255, 255, 255, 0.2)",
    rightOffset: 12,
    barSpacing: 8,
  },
  rightPriceScale: {
    borderColor: "rgba(255, 255, 255, 0.2)",
    scaleMargins: { top: 0.1, bottom: 0.1 },
  },
  crosshair: {
    mode: 0,
    vertLine: {
      labelVisible: false,
      color: "rgba(44, 43, 43, 0.589)",
      width: 1,
      style: 3,
      visible: true,
    },
    horzLine: {
      color: "rgba(44, 43, 43, 0.589)",
      width: 1,
      style: 3,
      timeVisible: false,
    },
  },
};

export const lightMode = {
  layout: {
    background: { type: "solid", color: "#ffffff" },
    textColor: "#000000",
  },
  grid: {
    vertLines: { visible: false, color: "rgba(0, 0, 0, 0.1)", style: 0 },
    horzLines: {
      visible: true,
      style: 3,
      color: "rgba(0, 0, 0, 0.1)",
      style: 0,
    },
  },
  timeScale: {
    borderColor: "rgba(0, 0, 0, 0.2)",
    rightOffset: 12,
    barSpacing: 8,
  },
  rightPriceScale: {
    borderColor: "rgba(0, 0, 0, 0.2)",
    scaleMargins: { top: 0.1, bottom: 0.1 },
  },
  crosshair: {
    mode: 0,
    vertLine: { color: "#2ecc71", width: 1, style: 3, visible: true },
    horzLine: { color: "#2ecc71", width: 1, style: 3, visible: true },
  },
};
// bular LineChartda light va dark mode bo'lsa ishlatiladi 