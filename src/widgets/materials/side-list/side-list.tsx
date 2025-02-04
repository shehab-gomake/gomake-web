import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useStyle } from "@/components/containers/side-container/side-list/style";
import { styled } from "@mui/material/styles";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { SearchInput } from "@/components/containers/search-input";
import { useCallback, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { usePrintHouseAddMachine } from "@/widgets/machines/hooks/use-print-house-add-machine";
import { DeleteIcon } from "@/components/icons/delete-icon";
import { DuplicateIcon } from "@/components/icons/duplicate-icon";
const ListButton = styled(ListItemButton)(() => {
  const { primaryColor } = useGomakeTheme();
  return {
    "&.Mui-selected": {
      backgroundColor: primaryColor(50),
    },
    "&.Mui-selected:hover": {
      backgroundColor: primaryColor(50),
    },
    "&:hover": {
      backgroundColor: primaryColor(50),
    },
  };
});
const SideList = ({
  list,
  selectedItem,
  onSelect,
  title,
  quickActions = false,
  children,
  isCode = false,
  isTranslated = false,
}: any) => {
  const { primaryColor } = useGomakeTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { classes } = useStyle();
  const [filter, setFilter] = useState<string>();
  const { duplicateMachine, deleteMachine } = usePrintHouseAddMachine();
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleMoreOptionIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const onClickDuplicate = () => {
    duplicateMachine();
    handleCloseMenu();
  };

  const onClickDelete = () => {
    deleteMachine();
    handleCloseMenu();
  };

  const filteredList = useCallback(() => {
    if (filter) {
      return list.filter((item: any) =>
        item?.value.toLowerCase().includes(filter.toLowerCase())
      );
    } else {
      return list;
    }
  }, [filter, list]);
  const filteredListCode = useCallback(() => {
    if (filter) {
      return list.filter((item: any) =>
        item?.name?.toLowerCase().includes(filter.toLowerCase())
      );
    } else {
      return list;
    }
  }, [filter, list]);
  const filteredListTranslate = useCallback(() => {
    if (filter) {
      return list.filter((item: any) =>
        item?.value?.toLowerCase().includes(filter.toLowerCase())
      );
    } else {
      return list;
    }
  }, [filter, list]);
  return (
    <>
      {isCode ? (
        <>
          <Box style={classes.container}>
            <h1 style={classes.header}>{title}</h1>
            <SearchInput
              placeholder={"Search"}
              onChange={handleFilterChange}
              value={filter}
            />
            <List
              style={classes.listContainer}
              component="nav"
              aria-label="main mailbox folders"
            >
              {filteredListCode().map((item: any) => (
                <ListButton
                  selected={item.code === selectedItem.code}
                  onClick={() => onSelect(item)}
                >
                  <ListItemText primary={item.name} />
                  {selectedItem.code === item.code && quickActions && (
                    <IconButton
                      onClick={handleMoreOptionIconClick}
                      sx={{ border: "1px solid", color: primaryColor(500) }}
                      size={"small"}
                    >
                      <MoreVertIcon sx={{ width: 23, height: 23 }}>
                        M
                      </MoreVertIcon>
                    </IconButton>
                  )}
                </ListButton>
              ))}
            </List>
            {!!children && <div style={classes.buttonWrapper}>{children}</div>}
          </Box>
          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleCloseMenu}
            PaperProps={classes.menuStyle}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={onClickDuplicate}>
              <div style={classes.menuItem}>
                <DuplicateIcon
                  height={20}
                  width={20}
                  color={classes.iconColor}
                />{" "}
                <span>Duplicate</span>
              </div>
            </MenuItem>
            <Divider />
            <MenuItem onClick={onClickDelete}>
              <div style={classes.menuItem}>
                <DeleteIcon color={classes.iconColor} width={20} height={20} />{" "}
                <span>Delete</span>
              </div>
            </MenuItem>
          </Menu>
        </>
      ) : isTranslated ? (
        <>
          <Box style={classes.container}>
            <h1 style={classes.header}>{title}</h1>
            <SearchInput
              placeholder={"Search"}
              onChange={handleFilterChange}
              value={filter}
            />
            <List
              style={classes.listContainer}
              component="nav"
              aria-label="main mailbox folders"
            >
              {filteredListTranslate().map((item) => (
                <ListButton
                  selected={item.key === selectedItem.key}
                  onClick={() => onSelect(item)}
                >
                  <ListItemText primary={item.value} />
                  {selectedItem.key === item.key && quickActions && (
                    <IconButton
                      onClick={handleMoreOptionIconClick}
                      sx={{ border: "1px solid", color: primaryColor(500) }}
                      size={"small"}
                    >
                      <MoreVertIcon sx={{ width: 23, height: 23 }}>
                        M
                      </MoreVertIcon>
                    </IconButton>
                  )}
                </ListButton>
              ))}
            </List>
            {!!children && <div style={classes.buttonWrapper}>{children}</div>}
          </Box>
          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleCloseMenu}
            PaperProps={classes.menuStyle}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={onClickDuplicate}>
              <div style={classes.menuItem}>
                <DuplicateIcon
                  height={20}
                  width={20}
                  color={classes.iconColor}
                />{" "}
                <span>Duplicate</span>
              </div>
            </MenuItem>
            <Divider />
            <MenuItem onClick={onClickDelete}>
              <div style={classes.menuItem}>
                <DeleteIcon color={classes.iconColor} width={20} height={20} />{" "}
                <span>Delete</span>
              </div>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <>
          <Box style={classes.container}>
            <h1 style={classes.header}>{title}</h1>
            <SearchInput
              placeholder={"Search"}
              onChange={handleFilterChange}
              value={filter}
            />
            <List
              style={classes.listContainer}
              component="nav"
              aria-label="main mailbox folders"
            >
              {filteredList().map((item) => (
                <ListButton
                  selected={item === selectedItem}
                  onClick={() => onSelect(item)}
                >
                  <ListItemText primary={item} />
                  {selectedItem === item && quickActions && (
                    <IconButton
                      onClick={handleMoreOptionIconClick}
                      sx={{ border: "1px solid", color: primaryColor(500) }}
                      size={"small"}
                    >
                      <MoreVertIcon sx={{ width: 23, height: 23 }}>
                        M
                      </MoreVertIcon>
                    </IconButton>
                  )}
                </ListButton>
              ))}
            </List>
            {!!children && <div style={classes.buttonWrapper}>{children}</div>}
          </Box>
          <Menu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleCloseMenu}
            PaperProps={classes.menuStyle}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={onClickDuplicate}>
              <div style={classes.menuItem}>
                <DuplicateIcon
                  height={20}
                  width={20}
                  color={classes.iconColor}
                />{" "}
                <span>Duplicate</span>
              </div>
            </MenuItem>
            <Divider />
            <MenuItem onClick={onClickDelete}>
              <div style={classes.menuItem}>
                <DeleteIcon color={classes.iconColor} width={20} height={20} />{" "}
                <span>Delete</span>
              </div>
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
};

export { SideList };
