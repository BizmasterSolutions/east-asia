"use client";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale,
  LineElement, PointElement,
  Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const COLORS = ["#6366f1", "#c8a000", "#16a34a", "#ea580c", "#0891b2"];

export default function TermTrendChart({ subjects, terms, marksBySubject }) {
  if (!subjects.length || terms.length < 2) {
    return (
      <p style={{ color: "#9ca3af", fontSize: "13px", textAlign: "center", padding: "40px 0" }}>
        {terms.length < 2 ? "Need at least 2 terms to show trend." : "No data available."}
      </p>
    );
  }

  const data = {
    labels: terms,
    datasets: subjects.map((subj, i) => ({
      label: subj,
      data: terms.map((t) => marksBySubject[subj]?.[t]?.marks ?? null),
      borderColor: COLORS[i % COLORS.length],
      backgroundColor: COLORS[i % COLORS.length] + "18",
      borderWidth: 2.5,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: COLORS[i % COLORS.length],
      tension: 0.3,
      fill: false,
      spanGaps: true,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 11 }, padding: 14, usePointStyle: true, pointStyleWidth: 8 } },
      tooltip: {
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y ?? "N/A"} marks` },
      },
    },
    scales: {
      y: {
        beginAtZero: false, min: 0, max: 100,
        ticks: { stepSize: 20, font: { size: 11 } },
        grid: { color: "#f3f4f6" },
      },
      x: { ticks: { font: { size: 12, weight: "600" } }, grid: { display: false } },
    },
  };

  return (
    <div style={{ height: "300px", position: "relative" }}>
      <Line data={data} options={options} />
    </div>
  );
}
