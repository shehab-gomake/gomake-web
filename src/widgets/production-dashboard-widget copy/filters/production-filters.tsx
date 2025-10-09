import { GoMakeDatepicker } from "@/components/datepicker";
import { MultiSelectDropdown } from "@/components/multi-select/multi-select-drop-down";
import { useStyle } from "../../monitoring-dashboard-widget/filters/style";

interface ProductionDashboardFiltersProps {
  selectedStations: string[];
  setSelectedStations: (stations: string[]) => void;
  selectedMachines: string[];
  setSelectedMachines: (machines: string[]) => void;
  selectedMaterials: string[];
  setSelectedMaterials: (materials: string[]) => void;
  stationsStructure: any;
  materialsData: any[];
}

const ProductionDashboardFilters = ({
  selectedStations,
  setSelectedStations,
  selectedMachines,
  setSelectedMachines,
  selectedMaterials,
  setSelectedMaterials,
  stationsStructure,
  materialsData
}: ProductionDashboardFiltersProps) => {
  const { classes } = useStyle();

  // Create station items for filter
  const stationItems = Object.keys(stationsStructure).map(stationName => ({
    id: stationName,
    label: `${stationName} Station`
  }));

  // Create machine items for filter
  const machineItems = Object.entries(stationsStructure).flatMap(([stationName, stationData]: [string, any]) =>
    stationData.machines.map((machine: any[]) => ({
      id: machine[0],
      label: `${machine[0]} (${stationName})`
    }))
  );

  // Create material items for filter
  const materialItems = materialsData.map(material => ({
    id: material[0],
    label: material[0]
  }));

  const toggleStation = (id: string) => {
    setSelectedStations(
      selectedStations.includes(id)
        ? selectedStations.filter(i => i !== id)
        : [...selectedStations, id]
    );
  };

  const toggleAllStations = () => {
    const allIds = stationItems.map(s => s.id);
    const isAllSelected = allIds.every(id => selectedStations.includes(id));
    setSelectedStations(isAllSelected ? [] : allIds);
  };

  const toggleMachine = (id: string) => {
    setSelectedMachines(
      selectedMachines.includes(id)
        ? selectedMachines.filter(i => i !== id)
        : [...selectedMachines, id]
    );
  };

  const toggleAllMachines = () => {
    const allIds = machineItems.map(m => m.id);
    const isAllSelected = allIds.every(id => selectedMachines.includes(id));
    setSelectedMachines(isAllSelected ? [] : allIds);
  };

  const toggleMaterial = (id: string) => {
    setSelectedMaterials(
      selectedMaterials.includes(id)
        ? selectedMaterials.filter(i => i !== id)
        : [...selectedMaterials, id]
    );
  };

  const toggleAllMaterials = () => {
    const allIds = materialItems.map(m => m.id);
    const isAllSelected = allIds.every(id => selectedMaterials.includes(id));
    setSelectedMaterials(isAllSelected ? [] : allIds);
  };

  return (
    <div style={classes.datesContainer}>
      <GoMakeDatepicker />
      <MultiSelectDropdown
        items={stationItems}
        selectedIds={selectedStations}
        onToggle={toggleStation}
        onToggleAll={toggleAllStations}
        buttonLabel="Stations"
      />
      <MultiSelectDropdown
        items={machineItems}
        selectedIds={selectedMachines}
        onToggle={toggleMachine}
        onToggleAll={toggleAllMachines}
        buttonLabel="Machines"
      />
      <MultiSelectDropdown
        items={materialItems}
        selectedIds={selectedMaterials}
        onToggle={toggleMaterial}
        onToggleAll={toggleAllMaterials}
        buttonLabel="Materials"
      />
    </div>
  );
};

export { ProductionDashboardFilters };