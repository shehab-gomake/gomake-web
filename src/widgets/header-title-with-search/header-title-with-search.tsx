import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { useStyle } from "./style";
import { HeaderTitle } from "../header-title/header-title";

interface HeaderTitleWithSearchProps {
  title?: string;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const HeaderTitleWithSearch = ({
  title,
  onChange,
  children,
  style
}: HeaderTitleWithSearchProps) => {
  const { classes } = useStyle();
  return (
    <div style={{ ...classes.mainContainer, ...style }}>
      <HeaderTitle title={title} marginTop={1} marginBottom={1} />
      <div style={classes.searchInput}>
        {children}
        <SearchInputComponent onChange={onChange} />
      </div>
    </div>
  );
};
export { HeaderTitleWithSearch };
