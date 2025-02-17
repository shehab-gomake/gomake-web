import { EPreferences } from "@/enums/prefernces";
import { ISetState } from "@/services/hooks/call-api.interface";
import get from "lodash.get";
import convert from "convert-units";

const returnResult = (
  result: any,
  setState: ISetState | undefined,
  key: string = "data.data.data"
) => {
  const _data = get(result, key);
  if (_data) {
    if (setState) {
      setState(_data);
    }
    return _data;
  }
  return [];
};

export { returnResult };

export const findParameterByCode = (template, targetCode) => {
  // Function to recursively search for a parameter by id
  const findParameter = (sections) => {
    for (const section of sections) {
      if (section.subSections && section.subSections.length > 0) {
        // If subSections exist, recursively search within them
        const nestedParameter = findParameter(section.subSections);
        if (nestedParameter) {
          return nestedParameter;
        }
      }

      for (const subSection of section.subSections || []) {
        const parameter = subSection.parameters.find(
          (param) => param.code === targetCode
        );
        if (parameter) {
          return parameter;
        }
      }
    }
    return null;
  };

  // Call the findParameter function with the top-level sections
  return findParameter(template?.sections || []);
};

export function detectLanguage(text) {
  const englishRegex = /^[a-zA-Z\s]+$/;
  const arabicRegex = /^[\u0600-\u06FF\s]+$/;

  if (englishRegex.test(text)) {
    return "English";
  } else if (arabicRegex.test(text)) {
    return "Arabic";
  }
}

export const isValidPhoneNumber = (phoneNumber) => {
  // Regular expression for a valid phone number (example: +1234567890)
  const phoneRegex = /^\+\d{10,}$/;
  return phoneRegex.test(phoneNumber);
};

export const isValidEmail = (email) => {
  // Regular expression for a valid email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const hasValues = (obj) => {
  if (obj) {
    return Object?.keys(obj?.values)?.length !== 0;
  }
};

export const isValidCustomer = (
  customer,
  filteredContacts,
  filteredAddresses,
  filteredUsers,
  CheckPreferenceValue
) => {
  debugger;

  const isMissingRequiredCustomerInfo = !(
    customer &&
    customer.name &&
    customer.clientTypeId &&
    (!CheckPreferenceValue(
      EPreferences.IS_BUSINESS_NUMBER_REQUIRED_IN_CUSTOMERS
    ) ||
      customer.buisnessNumber)
  );

  if (isMissingRequiredCustomerInfo) return false;

  // Helper function to validate an array of objects with a required property
  const isValidArray = (array, property) => {
    return array.every((item) => item[property]);
  };

  // Validate contacts
  if (filteredContacts && !isValidArray(filteredContacts, "firstName"))
    return false;

  // Validate addresses
  if (filteredAddresses && !isValidArray(filteredAddresses, "address1"))
    return false;

  // Validate users' email addresses
  if (filteredUsers && !isValidArray(filteredUsers, "email")) return false;

  // Validate users without IDs for password presence
  const usersWithoutIds = filteredUsers?.filter((user) => !user.id);
  if (usersWithoutIds && !isValidArray(usersWithoutIds, "password"))
    return false;

  return true;
};

export const downloadPdf = (url) => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.addEventListener("click", () => {
    setTimeout(() => {
      anchor.remove();
    }, 100);
  });
  anchor.click();
};

export const isAtLeastOneSelected = (items) => {
  if (items && items?.length > 0) {
    return items.some((item) => item.isSelected === true);
  }
};

export function removeTags(str) {
  if (str === null || str === "") return false;
  else str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, "");
}

export function getCurrencySymbol(currencyCode) {
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    ILS: "₪",
  };

  return currencySymbols[currencyCode] || null;
}

export const toRgba = (color: string, opacity: number) => {
  // Assuming primaryColor returns a hex color like '#ffcc00' or any color string
  let rgbaColor = color;

  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    rgbaColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return rgbaColor;
};

export const checkIfDieCutOrDieKissCutExists = (
  subProducts,
  isParameterSettings
) => {
  if (isParameterSettings) {
    return true;
  } else {
    for (const subProduct of subProducts) {
      if (subProduct.parameters) {
        const dieCutParam = subProduct.parameters.find(
          (param) =>
            param.parameterCode === "DieCut" ||
            param.parameterCode === "DieKissCut" ||
            param.parameterCode === "DieStamp"
        );
        if (dieCutParam) {
          return true;
        }
      }
    }
    return false;
  }
};

export const checkArrayNotEmptyOrPhoneNotEmpty = (array) => {
  if (array.length === 0) {
    return false;
  }
  for (let i = 0; i < array.length; i++) {
    if (array[i].contactPhone && array[i].contactPhone.trim() !== "") {
      return true;
    }
  }
  return false;
};

export const checkArrayNotEmptyOrEmailNotEmpty = (array) => {
  if (array.length === 0) {
    return false;
  }
  for (let i = 0; i < array.length; i++) {
    if (array[i].contactMail && array[i].contactMail.trim() !== "") {
      return true;
    }
  }
  return false;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};
export const clearPhoneNumberPrefix = (phoneNumber) =>{
  if (typeof phoneNumber !== "string"){
    return phoneNumber;
  }
  if(!phoneNumber)
    return phoneNumber;
  const pattern = /^(?:\+|00)(1|[2-9]\d{1,2})[-\s]?/;
  const result = phoneNumber.replace(pattern, "");

  return result;
};

export const _renderDeliveryDate = (dateString: string) => {
  const date = new Date(dateString);

  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  // Specify 'en-GB' locale to ensure DD/MM format
  const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });

  return `${formattedDate} | ${time}`;
}

export const convertTitleUnits = (unit: string | null) => {
  if (!unit) return null;

  switch (unit) {
    case "cm":
      return "inch"; // Convert cm to inches
    case "gram":
      return "LB"; // Convert grams to LB
    case "um":
      return "inch"; // Convert microns to microinches
    case "liter":
      return "gallon"; // Convert liters to gallons
    case "mm":
      return "in"; // Convert millimeters to inches
    case "m":
      return "yd"; // Convert meters to yards
    case "Gram/m^2":
      return "lb/yd^2"; // Convert grams per square meter to ounces per square yard
    case "kg":
      return "LB"; // Convert kilograms to pounds
    default:
      return unit; // Return as is if not supported
  }
};

export const convertValueToImperial = (unit: string | null, value: any) => {
  if (!unit) return value; // Return value as-is if no unit

  switch (unit) {
      case "cm":
          return convert(value).from("cm").to("in").toFixed(3);
      case "gram":
          return convert(value).from("g").to("lb").toFixed(3);
          case "um":
            return (value * 0.00003937007874);
          case "m":
            return convert(value).from("m").to("yd").toFixed(3);
        case "kg":
            return convert(value).from("kg").to("lb").toFixed(3);
            case "liter":
              return convert(value).from("l").to("gal").toFixed(3); // Convert liters to gallons
            case "mm":
              return convert(value).from("mm").to("in").toFixed(3); // Convert millimeters to inches
            case "Gram/m^2":
              return convert(value).from("g/m2").to("lb/yd2").toFixed(3); // Convert grams per square meter to ounces per square yard
      default:
          return value;
  }
};

export const convertValueToOriginalUnit = (unit: string | null, value: any) => {
  if (!unit) return value; // Return value as-is if no unit

  switch (unit) {
      case "cm":
          return convert(value).from("in").to("cm").toFixed(3);
      case "gram":
          return convert(value).from("lb").to("g").toFixed(3);
          case "um":
            // Convert inches to micrometers (1 inch = 25,400 micrometers)
            return (value * 25400).toFixed(3);
          case "m":
            return convert(value).from("yd").to("m").toFixed(3);
        case "kg":
            return convert(value).from("lb").to("kg").toFixed(3);
        case "liter":
            return convert(value).from("gal").to("l").toFixed(3); // Convert gallons to liters
        case "mm":
            return convert(value).from("in").to("mm").toFixed(3); // Convert inches to millimeters
        case "Gram/m^2":
            return convert(value).from("lb/yd2").to("g/m2").toFixed(3); // Convert ounces per square yard to grams per square meter
      default:
          return value;
  }
};