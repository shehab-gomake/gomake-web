import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const SearchInput = styled(TextField)(() => {
    const { primaryColor } = useGomakeTheme()
    return {
        width: "100%",
        input: {
            backgroundColor: "var(--theme-search-input-bg, #F8F8F8)",
            boxSizing: "border-box",
            borderRadius: 0,
            height: "var(--theme-input-height, 40px)",
            fontFamily: "var(--theme-font-family-base, Lexend)",
            fontStyle: "normal",
            fontWeight: "var(--theme-font-weight-normal, 400)",
            fontSize: "var(--theme-font-size-medium, 12px)",
            lineHeight: "15px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            color: `var(--theme-search-input-text-color, ${primaryColor(500)})`,
            padding: 12,
            "&::placeholder": {
                fontWeight: "var(--theme-font-weight-medium, 500)",
                color: "var(--theme-search-input-placeholder-color, #000)",
                fontStyle: "normal",
                fontFamily: "var(--theme-font-family-base, Lexend)",
                fontSize: "var(--theme-font-size-medium, 12px)",
            },
        },

        "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
                border: 0
            },
            "& fieldset": {
                border: 0,
                boxSizing: "border-box",
                borderRadius: 0,
                width: "100%",
            },
            "&.Mui-focused fieldset": {
                borderColor: 0,
                borderRadius: 0,
                width: "100%",
            },

        },
    }
});

export { SearchInput }