import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export function BarChart() {
  const colorCode = "#F89AD1";
  const state = {
    data: {
      labels: [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
      ], datasets: [
        {
          fill: true,
          label: null,
          backgroundColor: colorCode,
          borderColor: colorCode,
          borderWidth: 0,
          borderRadius: 8,
          gap: 20,
          data: [150, 300, 180, 200, 120, 50, 150, 300, 180, 200, 120, 50],
          barThickness: 40,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Months',
            color: '#979699',
            font: {
              size: 14,
              weight: '400',
              family: 'Lexend',
            },
          },
          grid: {
            display: false,
          },
          beginAtZero: true,
          ticks: {
            color: "#979699",
          },
        },
        y: {
          title: {
            display: true,
            text: 'Total Orders',
            color: '#B5B7C0',
            font: {
              size: 14,
              weight: '400',
              family: 'Lexend',
            },
          },
          beginAtZero: true,
          ticks: {
            color: "#979699",
          },
        },
      },
    },
  };
  return (
    <Bar
      data={state.data}
      options={state.options}
      style={{
        width: 600,
        height: 300,
      }}
    />
  );
}