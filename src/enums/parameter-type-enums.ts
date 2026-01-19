export enum EParameterTypes {
  DROP_DOWN_LIST = 0,
  INPUT_NUMBER = 1,
  INPUT_TEXT = 2,
  SWITCH = 3,
  BUTTON = 4,
  SELECT_MATERIALS = 5,
  SELECT_CHILDS_PARAMETERS = 6,
  ADVERTISING_PRODUCT_CATEGORY=10,
  ADVERTISING_PRODUCT_NAME=11,
  MACHINES_SELECT = 12,
  SELECT_FIXED_VALUES_WITH_IMAGES = 13
}

export enum EButtonTypes {
  GALLERY_MODAL = "GalleryModel",
}

export enum EGroupByEnum
{
  CLIENT = 1,
  AGENT,
  PRODUCT,
  PRODUCT_SKU,
  CLIENT_TYPE,
  Action,
  Material,
  Machine
}

export enum CpaFileType
{
    ALL = 0,
    Incoming,
    Payments,
    Deposits,
    MoveInPriority,
}

export enum  CurrentStationOrderingEnum
        {
            NONE = 0,
            ASC,
            DESC
        }