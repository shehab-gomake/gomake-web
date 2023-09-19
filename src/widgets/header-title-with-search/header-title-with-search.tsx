import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { useStyle } from "./style";
import { HeaderTitle } from "../header-title/header-title";

interface HeaderTitleWithSearchProps {
  title?: string;
  onChange?: (value: string) => void;
}

const HeaderTitleWithSearch = ({
  title,
  onChange,
}: HeaderTitleWithSearchProps) => {
  const { clasess } = useStyle();
  return (
    <div style={clasess.mainContainer}>
      <HeaderTitle title={title} marginTop={1} marginBottom={1} />
      <SearchInputComponent onChange={onChange} />
    </div>
  );
};
export { HeaderTitleWithSearch };
