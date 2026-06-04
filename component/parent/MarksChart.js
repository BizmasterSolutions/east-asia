"use client";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  LineElement, PointElement,
  Title, Tooltip, Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const TERM_COLORS = ["#6366f1", "#c8a000", "#16a34a", "#ea580c"];

export default function MarksChart({ subjects, terms, marksBySubject }) {
  if (!subjects.length || !terms.length) {
    return <p style={{ color: "#9ca3af", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No marks data available yet.</p>;
  }

  const data = {
    labels: subjects,
    datasets: terms.map((term, i) => ({
      label: term,
      data: subjects.map((s) => marksBySubject[s]?.[term]?.marks ?? null),
      backgroundColor: TERM_COLORS[i % TERM_COLORS.length] + "cc",
      borderColor: TERM_COLORS[i % TERM_COLORS.length],
      borderWidth: 1,
      borderRadius: 5,
      borderSkipped: false,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 12 }, padding: 16 } },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y ?? "N/A"} marks`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 100,
        ticks: { stepSize: 20, font: { size: 11 } },
        grid: { color: "#f3f4f6" },
      },
      x: { ticks: { font: { size: 11 } }, grid: { display: false } },
    },
  };

  return (
    <div style={{ height: "320px", position: "relative" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
