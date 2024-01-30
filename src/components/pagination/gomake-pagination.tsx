import * as React from "react";
import { FormControl, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent, ThemeProvider, createTheme } from "@mui/material";
import { useStyle } from "./style";
import { ChangeEvent, ReactNode } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
    onChangePageNumber: (event: ChangeEvent<unknown>, page: number) => void;
    onChangePageSize: (event: SelectChangeEvent<number>, child: ReactNode) => void;
    style?: React.CSSProperties;
    page: number;
    setPage: (page: number) => void;
    pageSize: number;
    pagesCount: number;
}

const GoMakePagination = ({ onChangePageSize, onChangePageNumber, style, page, setPage, pageSize, pagesCount }: IProps) => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");
    const pageOptions = Array.from({ length: pagesCount }, (_, index) => index + 1);
    const themeRTL = createTheme({
        direction: dir,
    });
    return (
        <div style={{ ...classes.paginationStyle, ...style }}>
            <ThemeProvider theme={themeRTL}>
                <Pagination
                    count={pagesCount}
                    variant="outlined"
                    color="primary"
                    page={page}
                    onChange={onChangePageNumber}
                />
            </ThemeProvider>
            <div>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 80 }}>
                    <InputLabel id="demo-simple-select-standard-label">{t("general.lines")}</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={pageSize}
                        onChange={onChangePageSize}
                        label={t("general.lines")} >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 80 }}>
                    <InputLabel id="demo-simple-select-standard-label">{t("general.pageNumber")}</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={page}
                        onChange={(event) => setPage(event.target.value as number)}
                        label={t("general.pageNumber")} >
                        {pageOptions.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
        </div>
    );
};

export { GoMakePagination };