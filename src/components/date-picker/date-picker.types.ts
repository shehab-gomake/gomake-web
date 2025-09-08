import { CSSProperties } from "react";

export interface GoMakeDatepickerProps {
  onChange: (fromDate: Date, toDate: Date) => void;
  placeholder?: string;
  reset?: boolean;
  style?: CSSProperties;
  value?: any;
}

export interface DateSelectionState {
  selection: {
    startDate: Date | null;
    endDate: Date | null;
    key: string;
  };
}
