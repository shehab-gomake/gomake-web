import { IStationFilterGroup } from "@/widgets/production-floor/interfaces/borad-missions-filter-groups";
import { stationFilterGroupState } from "@/widgets/production-floor/state/filter-group";
import { useState } from "react";
import { useRecoilState } from "recoil";

const useDepartmentModal = () => {
  const [color, setColor] = useState("#8485C0");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [stationFilterGroup, setStationFilterGroup] =
    useRecoilState<IStationFilterGroup>(stationFilterGroupState);
  const [anchorElPopover, setAnchorElPopover] = useState<HTMLElement | null>(
    null
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStationFilterGroup({
      ...stationFilterGroup,
      name: e.target.value,
    });
  };

  const handleColorChange = (newColor: any) => {
    setColor(newColor.hex);
    setStationFilterGroup({
      ...stationFilterGroup,
      color: newColor.hex,
    });
  };

  const handleOpenColorPicker = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElPopover(event.currentTarget);
    setShowColorPicker(true);
  };

  const handleColorPickerClose = () => {
    setShowColorPicker(false);
    setAnchorElPopover(null);
  };

  return {
    color,
    setColor,
    stationFilterGroup,
    setStationFilterGroup,
    handleNameChange,
    anchorElPopover,
    showColorPicker,
    handleColorChange,
    handleOpenColorPicker,
    handleColorPickerClose,
  };
};
export { useDepartmentModal };
