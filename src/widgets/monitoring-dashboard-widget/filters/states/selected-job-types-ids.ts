import { atom } from "recoil";

export enum SourceTypeEnum {
  Internally,
  Fully,
  partially,
}

const selectedJobTypesIdsState = atom<number[]>({
  key: "selectedJobTypesIdsState",
  default: [
    SourceTypeEnum.Internally,
    SourceTypeEnum.partially,
    SourceTypeEnum.Fully,
  ],
});

export { selectedJobTypesIdsState };
