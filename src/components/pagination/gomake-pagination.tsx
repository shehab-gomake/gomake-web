import * as React from "react";
import { FormControl, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent } from "@mui/material";
import { useStyle } from "./style";
import { ChangeEvent, ReactNode } from "react";

interface IProps {
    onChangePageNumber: (event: ChangeEvent<unknown>, page: number) => void;
    onChangePageSize: (event: SelectChangeEvent<number>, child: ReactNode) => void;
    style?: React.CSSProperties;
    label?: string;
    page: number;
    pagesCount: number;
    pageSize: number;
}

const GoMakePagination = ({ onChangePageSize, onChangePageNumber, page, pageSize, pagesCount, label }: IProps) => {
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
                    <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={pageSize}
                        onChange={onChangePageSize}
                        label={label} >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={15}>Fifty</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </div>
        </div>
    );
};

export { GoMakePagination };