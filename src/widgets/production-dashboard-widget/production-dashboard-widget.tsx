import { useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import { PrimaryTable } from "@/components/tables/primary-table";
import SouthRoundedIcon from "@mui/icons-material/SouthRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useStyle } from "../monitoring-dashboard-widget/style";
import { ProductionDashboardFilters } from "./filters/production-filters";

const ProductionDashboardWidget = () => {
    const { classes } = useStyle();
    const [visibleStations, setVisibleStations] = useState(10);
    const [visibleProfits, setVisibleProfits] = useState(10);
    const [visiblePerformance, setVisiblePerformance] = useState(10);
    const [visibleMaterials, setVisibleMaterials] = useState(10);
    const [expandedStations, setExpandedStations] = useState<Set<string>>(new Set());
    const [expandedProfitStations, setExpandedProfitStations] = useState<Set<string>>(new Set());
    const [expandedPerformanceStations, setExpandedPerformanceStations] = useState<Set<string>>(new Set());
    
    // Filter states
    const [selectedStations, setSelectedStations] = useState<string[]>([]);
    const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

    // Demo data organized by stations with machines
    const stationsStructure = {
        "Printing": {
            emoji: "🖨️",
            machines: [
                ["Xerox iPress", "8h 45m", 24, "92%", "Job #1234", "Job #1235"],
                ["HP Indigo", "7h 30m", 18, "88%", "Job #1236", "Job #1237"],
                ["Canon ProStream", "6h 15m", 16, "85%", "Job #1238", "Job #1239"]
            ]
        },
        "Cutting": {
            emoji: "✂️",
            machines: [
                ["Heidelberg Cutting", "9h 15m", 31, "95%", "Job #1240", "Job #1241"],
                ["Polar Cutter", "5h 45m", 12, "78%", "Job #1242", "Job #1243"]
            ]
        },
        "Binding": {
            emoji: "📚",
            machines: [
                ["Perfect Binder", "8h 10m", 22, "90%", "Job #1244", "Job #1245"],
                ["Saddle Stitcher", "7h 55m", 20, "87%", "Job #1246", "Job #1247"],
                ["Spiral Binding", "4h 30m", 8, "75%", "Job #1248", "Job #1249"]
            ]
        },
        "Finishing": {
            emoji: "✨",
            machines: [
                ["Lamination Machine", "6h 20m", 15, "82%", "Job #1250", "Job #1251"],
                ["Embossing Press", "5h 10m", 11, "80%", "Job #1252", "Job #1253"]
            ]
        }
    };

    // Machine profits data structure with financial metrics
    const machinesProfitsStructure = {
        "Printing": {
            emoji: "🖨️",
            machines: [
                ["Xerox iPress", "$2,450", "$4,800", "$4,650", "$800", "$1,200", "$2,100", "78%", "$3,750", "$2,200"],
                ["HP Indigo", "$1,850", "$3,600", "$3,500", "$600", "$950", "$1,650", "82%", "$2,950", "$1,800"],
                ["Canon ProStream", "$1,650", "$3,200", "$3,100", "$500", "$850", "$1,450", "85%", "$2,650", "$1,550"]
            ]
        },
        "Cutting": {
            emoji: "✂️",
            machines: [
                ["Heidelberg Cutting", "$3,100", "$5,800", "$5,650", "$950", "$1,400", "$2,750", "88%", "$4,700", "$2,850"],
                ["Polar Cutter", "$1,200", "$2,400", "$2,350", "$400", "$650", "$1,050", "75%", "$1,800", "$1,150"]
            ]
        },
        "Binding": {
            emoji: "📚",
            machines: [
                ["Perfect Binder", "$2,200", "$4,200", "$4,100", "$700", "$1,100", "$1,900", "$80%", "$3,300", "$2,000"],
                ["Saddle Stitcher", "$1,950", "$3,800", "$3,700", "$650", "$1,000", "$1,750", "83%", "$3,050", "$1,850"],
                ["Spiral Binding", "$800", "$1,600", "$1,550", "$250", "$400", "$700", "72%", "$1,200", "$750"]
            ]
        },
        "Finishing": {
            emoji: "✨",
            machines: [
                ["Lamination Machine", "$1,500", "$2,900", "$2,850", "$450", "$750", "$1,300", "79%", "$2,300", "$1,450"],
                ["Embossing Press", "$1,100", "$2,200", "$2,150", "$350", "$550", "$950", "$76%", "$1,700", "$1,050"]
            ]
        }
    };

    // Machine performance data structure with running time metrics
    const machinesPerformanceStructure = {
        "Printing": {
            emoji: "🖨️",
            machines: [
                ["Xerox iPress", "8h 45m", "8h 30m", "9h 00m"],
                ["HP Indigo", "7h 30m", "7h 15m", "8h 00m"],
                ["Canon ProStream", "6h 15m", "6h 10m", "6h 30m"]
            ]
        },
        "Cutting": {
            emoji: "✂️",
            machines: [
                ["Heidelberg Cutting", "9h 15m", "9h 00m", "9h 30m"],
                ["Polar Cutter", "5h 45m", "5h 30m", "6h 00m"]
            ]
        },
        "Binding": {
            emoji: "📚",
            machines: [
                ["Perfect Binder", "8h 10m", "7h 55m", "8h 30m"],
                ["Saddle Stitcher", "7h 55m", "7h 40m", "8h 15m"],
                ["Spiral Binding", "4h 30m", "4h 20m", "4h 45m"]
            ]
        },
        "Finishing": {
            emoji: "✨",
            machines: [
                ["Lamination Machine", "6h 20m", "6h 10m", "6h 45m"],
                ["Embossing Press", "5h 10m", "5h 00m", "5h 30m"]
            ]
        }
    };

    // Materials data structure with cost, price, quantity, stock, purchase info and product usage
    const materialsData = [
        ["Sheets", "$0.50", "$2.00", "100", "2000", "No", "80%", "90%", "70%", "10%"],
        ["Ink Cartridges", "$45.00", "$65.00", "25", "150", "Yes", "95%", "95%", "90%", "85%"],
        ["Cutting Blades", "$12.50", "$25.00", "10", "50", "No", "70%", "60%", "80%", "40%"],
        ["Binding Wire", "$8.00", "$15.00", "200", "800", "No", "0%", "100%", "90%", "85%"],
        ["Lamination Film", "$25.00", "$40.00", "50", "200", "Yes", "60%", "0%", "0%", "0%"],
        ["Cardboard", "$3.00", "$8.00", "150", "500", "No", "0%", "0%", "0%", "90%"],
        ["Adhesive Labels", "$15.00", "$30.00", "75", "300", "No", "0%", "0%", "0%", "100%"],
        ["Foil Stamping", "$60.00", "$120.00", "20", "80", "Yes", "40%", "0%", "0%", "0%"],
        ["Staples", "$2.50", "$5.00", "500", "2000", "No", "0%", "80%", "0%", "70%"],
        ["Spiral Coils", "$18.00", "$35.00", "100", "250", "No", "0%", "100%", "0%", "0%"]
    ];

    const materialsHeaders = [
        "Material",
        "Cost",
        "Price",
        "Quantity",
        "Current Stock",
        "Need Purchase",
        "Cards Usage",
        "Books Usage",
        "Flyers Usage",
        "Brochures Usage"
    ];

    const toggleStation = (stationName: string) => {
        setExpandedStations(prev => {
            const newSet = new Set(prev);
            if (newSet.has(stationName)) {
                newSet.delete(stationName);
            } else {
                newSet.add(stationName);
            }
            return newSet;
        });
    };

    const toggleProfitStation = (stationName: string) => {
        setExpandedProfitStations(prev => {
            const newSet = new Set(prev);
            if (newSet.has(stationName)) {
                newSet.delete(stationName);
            } else {
                newSet.add(stationName);
            }
            return newSet;
        });
    };

    const togglePerformanceStation = (stationName: string) => {
        setExpandedPerformanceStations(prev => {
            const newSet = new Set(prev);
            if (newSet.has(stationName)) {
                newSet.delete(stationName);
            } else {
                newSet.add(stationName);
            }
            return newSet;
        });
    };

    // Helper function to check if data should be filtered
    const shouldShowStation = (stationName: string) => {
        return selectedStations.length === 0 || selectedStations.includes(stationName);
    };
    
    const shouldShowMachine = (machineName: string) => {
        return selectedMachines.length === 0 || selectedMachines.includes(machineName);
    };
    
    const shouldShowMaterial = (materialName: string) => {
        return selectedMaterials.length === 0 || selectedMaterials.includes(materialName);
    };

    // Generate table data based on expanded state and filters
    const generateTableData = () => {
        const tableData: any[] = [];
        
        Object.entries(stationsStructure).forEach(([stationName, stationData]) => {
            // Skip station if not in filter
            if (!shouldShowStation(stationName)) return;
            const isExpanded = expandedStations.has(stationName);
            const expandIcon = isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />;
            
            // Calculate station totals
            const totalTimeInMinutes = stationData.machines.reduce((acc, machine) => {
                const timeStr = machine[1] as string; // "8h 45m" format
                const hours = parseInt(timeStr.match(/(\d+)h/)?.[1] || '0');
                const minutes = parseInt(timeStr.match(/(\d+)m/)?.[1] || '0');
                return acc + (hours * 60) + minutes;
            }, 0);
            const totalHours = Math.floor(totalTimeInMinutes / 60);
            const remainingMinutes = totalTimeInMinutes % 60;
            const totalTimeFormatted = `${totalHours}h ${remainingMinutes}m`;
            
            const totalJobs = stationData.machines.reduce((acc, machine) => acc + (machine[2] as number), 0);
            const avgPerformance = Math.round(
                stationData.machines.reduce((acc, machine) => {
                    const perf = parseFloat((machine[3] as string).replace('%', ''));
                    return acc + perf;
                }, 0) / stationData.machines.length
            );
            
            // Station header row with expand/collapse button and summary
            tableData.push([
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleStation(stationName)}>
                    <IconButton size="small" sx={{ mr: 1 }}>
                        {expandIcon}
                    </IconButton>
                    <span style={{ fontWeight: 'bold' }}>{stationName} Station</span>
                </Box>,
                <span style={{ fontWeight: 'bold' }}>{totalTimeFormatted}</span>,
                <span style={{ fontWeight: 'bold' }}>{totalJobs}</span>,
                <span style={{ fontWeight: 'bold' }}>{avgPerformance}%</span>,
                <span style={{ fontWeight: 'bold' }}>-</span>,
                <span style={{ fontWeight: 'bold' }}>-</span>
            ]);
            
            // Machine rows (only if expanded and pass filter)
            if (isExpanded) {
                stationData.machines.forEach(machine => {
                    // Skip machine if not in filter
                    if (!shouldShowMachine(machine[0] as string)) return;
                    
                    tableData.push([
                        <Box sx={{ pl: 4 }}>{machine[0]}</Box>,
                        machine[1],
                        machine[2],
                        machine[3],
                        machine[4],
                        machine[5]
                    ]);
                });
            }
        });
        
        return tableData;
    };

    const stationsData = generateTableData();

    const stationsHeaders = [
        "Machine",
        "Total Time",
        "Total Done Jobs",
        "Performance",
        "Current Job",
        "Next Job"
    ];

    // Generate profits table data based on expanded state and filters
    const generateProfitsTableData = () => {
        const tableData: any[] = [];
        
        Object.entries(machinesProfitsStructure).forEach(([stationName, stationData]) => {
            // Skip station if not in filter
            if (!shouldShowStation(stationName)) return;
            const isExpanded = expandedProfitStations.has(stationName);
            const expandIcon = isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />;
            
            // Calculate station totals for profits
            const totalCost = stationData.machines.reduce((acc, machine) => {
                return acc + parseFloat((machine[1] as string).replace('$', '').replace(',', ''));
            }, 0);
            const totalPrice = stationData.machines.reduce((acc, machine) => {
                return acc + parseFloat((machine[2] as string).replace('$', '').replace(',', ''));
            }, 0);
            const totalCalculatedPrice = stationData.machines.reduce((acc, machine) => {
                return acc + parseFloat((machine[3] as string).replace('$', '').replace(',', ''));
            }, 0);
            const totalMaterialCost = stationData.machines.reduce((acc, machine) => {
                return acc + parseFloat((machine[4] as string).replace('$', '').replace(',', ''));
            }, 0);
            const totalMaterialPrice = stationData.machines.reduce((acc, machine) => {
                return acc + parseFloat((machine[5] as string).replace('$', '').replace(',', ''));
            }, 0);
            const totalRunningPrice = stationData.machines.reduce((acc, machine) => {
                return acc + parseFloat((machine[6] as string).replace('$', '').replace(',', ''));
            }, 0);
            const avgProfit = Math.round(
                stationData.machines.reduce((acc, machine) => {
                    const profit = parseFloat((machine[7] as string).replace('%', ''));
                    return acc + profit;
                }, 0) / stationData.machines.length
            );
            const totalProfit = stationData.machines.reduce((acc, machine) => {
                return acc + parseFloat((machine[8] as string).replace('$', '').replace(',', ''));
            }, 0);
            const expectedRunningCost = stationData.machines.reduce((acc, machine) => {
                return acc + parseFloat((machine[9] as string).replace('$', '').replace(',', ''));
            }, 0);
            
            // Station header row with expand/collapse button and summary
            tableData.push([
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleProfitStation(stationName)}>
                    <IconButton size="small" sx={{ mr: 1 }}>
                        {expandIcon}
                    </IconButton>
                    <span style={{ fontWeight: 'bold' }}>{stationName} Station</span>
                </Box>,
                <span style={{ fontWeight: 'bold' }}>${totalCost.toLocaleString()}</span>,
                <span style={{ fontWeight: 'bold' }}>${totalPrice.toLocaleString()}</span>,
                <span style={{ fontWeight: 'bold' }}>${totalCalculatedPrice.toLocaleString()}</span>,
                <span style={{ fontWeight: 'bold' }}>${totalMaterialCost.toLocaleString()}</span>,
                <span style={{ fontWeight: 'bold' }}>${totalMaterialPrice.toLocaleString()}</span>,
                <span style={{ fontWeight: 'bold' }}>${totalRunningPrice.toLocaleString()}</span>,
                <span style={{ fontWeight: 'bold' }}>{avgProfit}%</span>,
                <span style={{ fontWeight: 'bold' }}>${totalProfit.toLocaleString()}</span>,
                <span style={{ fontWeight: 'bold' }}>${expectedRunningCost.toLocaleString()}</span>
            ]);
            
            // Machine rows (only if expanded and pass filter)
            if (isExpanded) {
                stationData.machines.forEach(machine => {
                    // Skip machine if not in filter
                    if (!shouldShowMachine(machine[0] as string)) return;
                    
                    tableData.push([
                        <Box sx={{ pl: 4 }}>{machine[0]}</Box>,
                        machine[1], // total cost
                        machine[2], // total price
                        machine[3], // total calculated price
                        machine[4], // total material cost
                        machine[5], // total material price
                        machine[6], // total running price
                        machine[7], // avg profit
                        machine[8], // total profit
                        machine[9]  // expected running cost
                    ]);
                });
            }
        });
        
        return tableData;
    };

    const profitsData = generateProfitsTableData();

    const profitsHeaders = [
        "Machine",
        "Total Cost",
        "Total Price",
        "Total Calculated Price",
        "Total Material Cost",
        "Total Material Price",
        "Total Running Price",
        "Avg Profit",
        "Total Profit",
        "Expected Running Cost"
    ];

    // Generate performance table data based on expanded state and filters
    const generatePerformanceTableData = () => {
        const tableData: any[] = [];
        
        Object.entries(machinesPerformanceStructure).forEach(([stationName, stationData]) => {
            // Skip station if not in filter
            if (!shouldShowStation(stationName)) return;
            const isExpanded = expandedPerformanceStations.has(stationName);
            const expandIcon = isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />;
            
            // Calculate station totals for performance
            const totalRunningTimeInMinutes = stationData.machines.reduce((acc, machine) => {
                const timeStr = machine[1] as string; // "8h 45m" format
                const hours = parseInt(timeStr.match(/(\d+)h/)?.[1] || '0');
                const minutes = parseInt(timeStr.match(/(\d+)m/)?.[1] || '0');
                return acc + (hours * 60) + minutes;
            }, 0);
            const totalRunningHours = Math.floor(totalRunningTimeInMinutes / 60);
            const totalRunningMinutes = totalRunningTimeInMinutes % 60;
            const totalRunningTimeFormatted = `${totalRunningHours}h ${totalRunningMinutes}m`;
            
            const totalReportedTimeInMinutes = stationData.machines.reduce((acc, machine) => {
                const timeStr = machine[2] as string;
                const hours = parseInt(timeStr.match(/(\d+)h/)?.[1] || '0');
                const minutes = parseInt(timeStr.match(/(\d+)m/)?.[1] || '0');
                return acc + (hours * 60) + minutes;
            }, 0);
            const totalReportedHours = Math.floor(totalReportedTimeInMinutes / 60);
            const totalReportedMinutes = totalReportedTimeInMinutes % 60;
            const totalReportedTimeFormatted = `${totalReportedHours}h ${totalReportedMinutes}m`;
            
            const expectedTotalTimeInMinutes = stationData.machines.reduce((acc, machine) => {
                const timeStr = machine[3] as string;
                const hours = parseInt(timeStr.match(/(\d+)h/)?.[1] || '0');
                const minutes = parseInt(timeStr.match(/(\d+)m/)?.[1] || '0');
                return acc + (hours * 60) + minutes;
            }, 0);
            const expectedTotalHours = Math.floor(expectedTotalTimeInMinutes / 60);
            const expectedTotalMinutes = expectedTotalTimeInMinutes % 60;
            const expectedTotalTimeFormatted = `${expectedTotalHours}h ${expectedTotalMinutes}m`;
            
            // Station header row with expand/collapse button and summary
            tableData.push([
                <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => togglePerformanceStation(stationName)}>
                    <IconButton size="small" sx={{ mr: 1 }}>
                        {expandIcon}
                    </IconButton>
                    <span style={{ fontWeight: 'bold' }}>{stationName} Station</span>
                </Box>,
                <span style={{ fontWeight: 'bold' }}>{totalRunningTimeFormatted}</span>,
                <span style={{ fontWeight: 'bold' }}>{totalReportedTimeFormatted}</span>,
                <span style={{ fontWeight: 'bold' }}>{expectedTotalTimeFormatted}</span>
            ]);
            
            // Machine rows (only if expanded and pass filter)
            if (isExpanded) {
                stationData.machines.forEach(machine => {
                    // Skip machine if not in filter
                    if (!shouldShowMachine(machine[0] as string)) return;
                    
                    tableData.push([
                        <Box sx={{ pl: 4 }}>{machine[0]}</Box>,
                        machine[1], // total running time
                        machine[2], // total running time reported
                        machine[3]  // expected total running time
                    ]);
                });
            }
        });
        
        return tableData;
    };

    const performanceData = generatePerformanceTableData();

    const performanceHeaders = [
        "Machine",
        "Total Running Time",
        "Total Running Time Reported",
        "Expected Total Running Time"
    ];
    
    // Filter materials data
    const filteredMaterialsData = materialsData.filter(material => shouldShowMaterial(material[0]));
 
  const renderTableSection = (
    title: string,
    rows: any[],
    headers: any[],
    visibleCount: number,
    setVisibleCount: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const hasMore = rows.length > visibleCount;

    const handleToggle = () => {
      if (hasMore) {
        setVisibleCount((prev) => prev + 10);
      } else {
        setVisibleCount(10);
      }
    };

    return (
      <div style={classes.subContainer}>
        <h3 style={classes.labelStyle}>{title}</h3>
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={rows.slice(0, visibleCount)}
          headers={headers}
          variant="RoundTable"
        />
        {rows.length > 10 && (
          <Button
            onClick={handleToggle}
            style={classes.showMoreButton}
            endIcon={
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  transition: "transform 0.3s ease",
                  transform: hasMore ? "rotate(0deg)" : "rotate(180deg)",
                }}
              >
                <SouthRoundedIcon fontSize="small" />
              </Box>
            }
          >
            {hasMore ? "Show More" : "Show Less"}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div style={classes.container}>
      <div style={classes.subContainer}>
        <ProductionDashboardFilters 
          selectedStations={selectedStations}
          setSelectedStations={setSelectedStations}
          selectedMachines={selectedMachines}
          setSelectedMachines={setSelectedMachines}
          selectedMaterials={selectedMaterials}
          setSelectedMaterials={setSelectedMaterials}
          stationsStructure={stationsStructure}
          materialsData={materialsData}
        />
      </div>
      {renderTableSection(
        "Stations Overview",
        stationsData,
        stationsHeaders,
        visibleStations,
        setVisibleStations
      )}
      {renderTableSection(
        "Machine Profits",
        profitsData,
        profitsHeaders,
        visibleProfits,
        setVisibleProfits
      )}
      {renderTableSection(
        "Machine Performance",
        performanceData,
        performanceHeaders,
        visiblePerformance,
        setVisiblePerformance
      )}
      {renderTableSection(
        "Materials",
        filteredMaterialsData,
        materialsHeaders,
        visibleMaterials,
        setVisibleMaterials
      )}
    </div>
  );
};
export { ProductionDashboardWidget };
