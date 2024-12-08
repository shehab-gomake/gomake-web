import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { useStyle } from "./style";
import { HeaderTitle } from "../header-title/header-title";

interface HeaderTitleWithSearchProps {
  title?: string;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
}

const HeaderTitleWithSearch = ({
  title,
  onChange,
  children
}: HeaderTitleWithSearchProps) => {
  const { clasess } = useStyle();
  return (
    <div style={clasess.mainContainer}>
      <HeaderTitle title={title} marginTop={1} marginBottom={1} />
      <div style={clasess.searchInput}>
        {children}
        <SearchInputComponent onChange={onChange} />
      </div>
    </div>
  );
};
export { HeaderTitleWithSearch };
