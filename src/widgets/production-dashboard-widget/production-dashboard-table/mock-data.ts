import { MainProductionReportResponseDTO } from "./interfaces";

export const mockProductionReportData: MainProductionReportResponseDTO = {
  reportGeneratedAt: "2024-01-15T10:30:00Z",
  departments: [
    {
      departmentId: "dept-1",
      departmentName: "Printing Department",
      summary: {
        totalEstimated: { time: 1200, jobs: 45 },
        done: { time: 800, jobs: 30 },
        inProcess: { time: 300, jobs: 12 },
        reported: { time: 750, jobs: 28 },
        capacity: {
          totalEstimated: 1200,
          totalWorkingHours: 1600,
          growth: 5.2,
        },
        performance: {
          productivity: 85.5,
          growth: 3.1,
        },
        dueDatePerformance: {
          percentage: 92.3,
          growth: 2.8,
        },
        jobAnalytics: {
          estimatedCost: 15000,
          estimatedPrice: 25000,
        },
        sla: 95.8,
        averageProductionTime: 26.7,
      },
      stations: [
        {
          stationId: "station-1",
          stationName: "Digital Press Station",
          supplierName: "Lama 1",
          totalEstimated: { time: 600, jobs: 20 },
          done: { time: 400, jobs: 15 },
          inProcess: { time: 150, jobs: 4 },
          reported: { time: 380, jobs: 14 },
          capacity: {
            totalEstimated: 600,
            totalWorkingHours: 800,
            growth: 4.5,
          },
          performance: {
            productivity: 87.2,
            growth: 2.9,
          },
          dueDatePerformance: {
            percentage: 93.5,
            growth: 3.2,
          },
          jobAnalytics: {
            estimatedCost: 8000,
            estimatedPrice: 13000,
          },
          sla: 96.5,
          averageProductionTime: 30.0,
        },
        {
          stationId: "station-2",
          stationName: "Offset Press Station",
          supplierName: "Lama 2",
          totalEstimated: { time: 600, jobs: 25 },
          done: { time: 400, jobs: 15 },
          inProcess: { time: 150, jobs: 8 },
          reported: { time: 370, jobs: 14 },
          capacity: {
            totalEstimated: 600,
            totalWorkingHours: 800,
            growth: 5.8,
          },
          performance: {
            productivity: 83.8,
            growth: 3.3,
          },
          dueDatePerformance: {
            percentage: 91.1,
            growth: 2.4,
          },
          jobAnalytics: {
            estimatedCost: 7000,
            estimatedPrice: 12000,
          },
          sla: 95.1,
          averageProductionTime: 24.0,
        },
      ],
    },
    {
      departmentId: "dept-2",
      departmentName: "Finishing Department",
      summary: {
        totalEstimated: { time: 800, jobs: 35 },
        done: { time: 600, jobs: 28 },
        inProcess: { time: 150, jobs: 6 },
        reported: { time: 580, jobs: 27 },
        capacity: {
          totalEstimated: 800,
          totalWorkingHours: 1000,
          growth: 4.1,
        },
        performance: {
          productivity: 88.9,
          growth: 2.7,
        },
        dueDatePerformance: {
          percentage: 94.7,
          growth: 3.5,
        },
        jobAnalytics: {
          estimatedCost: 12000,
          estimatedPrice: 20000,
        },
        sla: 97.2,
        averageProductionTime: 22.9,
      },
      stations: [
        {
          stationId: "station-3",
          stationName: "Cutting Station",
          supplierName: "Lama 3",
          totalEstimated: { time: 400, jobs: 18 },
          done: { time: 300, jobs: 14 },
          inProcess: { time: 80, jobs: 3 },
          reported: { time: 290, jobs: 13 },
          capacity: {
            totalEstimated: 400,
            totalWorkingHours: 500,
            growth: 3.8,
          },
          performance: {
            productivity: 90.1,
            growth: 2.5,
          },
          dueDatePerformance: {
            percentage: 95.8,
            growth: 3.8,
          },
          jobAnalytics: {
            estimatedCost: 6000,
            estimatedPrice: 10000,
          },
          sla: 98.0,
          averageProductionTime: 22.2,
        },
        {
          stationId: "station-4",
          stationName: "Binding Station",
          supplierName: "Lama 4",
          totalEstimated: { time: 400, jobs: 17 },
          done: { time: 300, jobs: 14 },
          inProcess: { time: 70, jobs: 3 },
          reported: { time: 290, jobs: 14 },
          capacity: {
            totalEstimated: 400,
            totalWorkingHours: 500,
            growth: 4.4,
          },
          performance: {
            productivity: 87.7,
            growth: 2.9,
          },
          dueDatePerformance: {
            percentage: 93.6,
            growth: 3.2,
          },
          jobAnalytics: {
            estimatedCost: 6000,
            estimatedPrice: 10000,
          },
          sla: 96.4,
          averageProductionTime: 23.5,
        },
      ],
    },
    {
      departmentId: "dept-3",
      departmentName: "Quality Control",
      summary: {
        totalEstimated: { time: 300, jobs: 20 },
        done: { time: 250, jobs: 18 },
        inProcess: { time: 40, jobs: 2 },
        reported: { time: 240, jobs: 17 },
        capacity: {
          totalEstimated: 300,
          totalWorkingHours: 400,
          growth: 6.2,
        },
        performance: {
          productivity: 91.3,
          growth: 4.1,
        },
        dueDatePerformance: {
          percentage: 96.8,
          growth: 4.3,
        },
        jobAnalytics: {
          estimatedCost: 5000,
          estimatedPrice: 8000,
        },
        sla: 98.5,
        averageProductionTime: 16.7,
      },
      stations: [
        {
          stationId: "station-5",
          stationName: "Inspection Station",
          supplierName: "Lama 5",
          totalEstimated: { time: 200, jobs: 12 },
          done: { time: 170, jobs: 11 },
          inProcess: { time: 25, jobs: 1 },
          reported: { time: 165, jobs: 10 },
          capacity: {
            totalEstimated: 200,
            totalWorkingHours: 250,
            growth: 5.5,
          },
          performance: {
            productivity: 92.8,
            growth: 3.8,
          },
          dueDatePerformance: {
            percentage: 97.5,
            growth: 4.5,
          },
          jobAnalytics: {
            estimatedCost: 3000,
            estimatedPrice: 5000,
          },
          sla: 99.0,
          averageProductionTime: 16.7,
        },
        {
          stationId: "station-6",
          stationName: "Testing Station",
          supplierName: "Lama 6",
          totalEstimated: { time: 100, jobs: 8 },
          done: { time: 80, jobs: 7 },
          inProcess: { time: 15, jobs: 1 },
          reported: { time: 75, jobs: 7 },
          capacity: {
            totalEstimated: 100,
            totalWorkingHours: 150,
            growth: 6.9,
          },
          performance: {
            productivity: 89.8,
            growth: 4.4,
          },
          dueDatePerformance: {
            percentage: 96.1,
            growth: 4.1,
          },
          jobAnalytics: {
            estimatedCost: 2000,
            estimatedPrice: 3000,
          },
          sla: 98.0,
          averageProductionTime: 16.7,
        },
      ],
    },
  ],
};
