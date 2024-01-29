import * as React from "react";
import { FormControl, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent } from "@mui/material";
import { useStyle } from "./style";
import { ChangeEvent, ReactNode } from "react";

interface IProps {
    onChangePageNumber: (event: ChangeEvent<unknown>, page: number) => void;
    onChangePageSize: (event: SelectChangeEvent<number>, child: ReactNode) => void;
    style?: React.CSSProperties;
    page: number;
    pageSize: number;
    pagesCount: number;
}

const GoMakePagination = ({ onChangePageSize, onChangePageNumber, page, pageSize, pagesCount }: IProps) => {
    const { classes } = useStyle();

    return (
        <div style={classes.paginationStyle}>
            <Pagination
                count={pagesCount}
                variant="outlined"
                color="primary"
                page={page}
                onChange={onChangePageNumber}
            />
            <div>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-standard-label">Page size</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={pageSize}
                        onChange={onChangePageSize}
                        label="Page size" >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
    );
};

export { GoMakePagination };