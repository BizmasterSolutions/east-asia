"use client";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AttendanceChart({ months, monthData }) {
  if (!months.length) {
    return <p style={{ color: "#9ca3af", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>No attendance records available yet.</p>;
  }

  const data = {
    labels: months,
    datasets: [
      { label: "Present", data: months.map((m) => monthData[m]?.present ?? 0), backgroundColor: "#16a34acc", borderRadius: 5, borderSkipped: false },
      { label: "Absent",  data: months.map((m) => monthData[m]?.absent  ?? 0), backgroundColor: "#ef4444cc", borderRadius: 5, borderSkipped: false },
      { label: "Late",    data: months.map((m) => monthData[m]?.late    ?? 0), backgroundColor: "#f59e0bcc", borderRadius: 5, borderSkipped: false },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 12 }, padding: 16 } },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 5, font: { size: 11 } }, grid: { color: "#f3f4f6" } },
      x: { ticks: { font: { size: 11 } }, grid: { display: false } },
    },
  };

  return (
    <div style={{ height: "280px", position: "relative" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
