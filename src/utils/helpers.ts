import { EPreferences } from "@/enums/prefernces";
import { ISetState } from "@/services/hooks/call-api.interface";
import get from "lodash.get";
import convert from "convert-units";
import { startOfYear } from "date-fns";
import { UNIT_TYPE } from "@/enums";

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
  if (!obj?.values) return false;

  // Check if the values object has any keys
  const hasKeys = Object.keys(obj.values).length > 0;

  // Check if at least one value in the values object is not an empty string
  const hasNonEmptyValues = Object.values(obj.values).some(
    (value) => value !== ""
  );

  return hasKeys && hasNonEmptyValues;
};

export const isValidCustomer = (
  customer,
  filteredContacts,
  filteredAddresses,
  filteredUsers,
  CheckPreferenceValue,
  isSupplier = false
): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];

  if (!customer?.name) missingFields.push("customers.modal.name");
  if (!customer?.clientTypeId) {
    if (isSupplier) {
      missingFields.push("suppliers.supplierType");
    } else {
      missingFields.push("customers.modal.clientType");
    }
  }

  if (
    CheckPreferenceValue(
      EPreferences.IS_BUSINESS_NUMBER_REQUIRED_IN_CUSTOMERS
    ) &&
    !customer?.buisnessNumber
  ) {
    missingFields.push("customers.modal.vatNO");
  }

  if (
    CheckPreferenceValue(EPreferences.IS_AGENT_REQUIRED_IN_CUSTOMERS) &&
    !customer?.agentId
  ) {
    missingFields.push("customers.modal.agent");
  }

  if (
    CheckPreferenceValue(EPreferences.IS_PAYMENT_TERMS_REQUIRED_IN_CUSTOMERS) &&
    !customer?.termOfPayment
  ) {
    missingFields.push("accounting.paymentTerms");
  }

  // Validate contacts
  if (filteredContacts?.some((contact) => !contact.firstName)) {
    missingFields.push("customers.modal.firstName");
  }

  // Validate addresses
  // if (filteredAddresses?.some((address) => !address.address1)) {
  //   missingFields.push("customers.modal.addressId");
  // }

  // Validate addresses
  if (filteredAddresses?.some((address) => !address.city)) {
    missingFields.push("customers.modal.city");
  }

  // Validate users' email addresses
  if (filteredUsers?.some((user) => !user.email)) {
    missingFields.push("customers.modal.email");
  }

  // Users without IDs should have passwords
  const usersWithoutIds = filteredUsers?.filter((user) => !user.id);
  if (usersWithoutIds?.some((user) => !user.password)) {
    missingFields.push("customers.modal.password");
  }

  return { isValid: missingFields.length === 0, missingFields };
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
    return items.some((item) => {
      // Check if the item itself is selected
      if (item.isSelected === true) {
        return true;
      }

      // Check if any child items are selected
      if (item.childsDocumentItems && item.childsDocumentItems.length > 0) {
        return item.childsDocumentItems.some(
          (child) => child.isSelected === true
        );
      }

      return false;
    });
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
        const dieCutParam = subProduct?.parameters?.find(
          (param) =>
            param.parameterCode === "DieCut" ||
            param.parameterCode === "DieKissCut" ||
            param.parameterCode === "DieStamp" ||
            param.parameterCode === "DieCutter"
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
export const clearPhoneNumberPrefix = (phoneNumber) => {
  if (typeof phoneNumber !== "string") {
    return phoneNumber;
  }
  if (!phoneNumber) return phoneNumber;
  const pattern = /^(?:\+|00)(1|[2-9]\d{1,2})[-\s]?/;
  const result = phoneNumber.replace(pattern, "");

  return result;
};

export const _renderDeliveryDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Specify 'en-GB' locale to ensure DD/MM format
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });

  return `${formattedDate} | ${time}`;
};

export const convertTitleUnits = (unit: string | null) => {
  if (!unit) return null;

  switch (unit) {
    // LENGTH
    case "cm":
    case "mm":
      return "inch"; // cm/mm -> inch
    case "m":
      return "yd"; // meters -> yards
    case "cm-sec":
    case "mmPerSecond":
      return "inch/sec"; // cm/sec or mm/sec -> inch/sec
    case "meterPerMin":
    case "meterPerHour":
      return "yd/min"; // meter/min or meter/hour -> yards/min (adjust if needed)

    // AREA
    case "squareMeter":
    case "m²":
      return "yd²"; // square meters -> square yards
    case "squareCM":
      return "in²"; // square centimeters -> square inches
    case "squareMeterPerMin":
      return "yd²/min"; 
    case "squareMeterPerHour":
      return "yd²/hour";
    case "squareCMPerHour":
    case "squareCMPerH":
      return "in²/hour";

    // WEIGHT
    case "gram":
    case "g":
    case "gsm":
      return "LB"; // grams -> pounds
    case "kg":
    case "Kg":
      return "LB"; // kilograms -> pounds
    case "Gram/m^2":
      return "lb/yd²"; // grams per m² -> lb per yd²

    // VOLUME
    case "liter":
      return "gallon"; // liters -> gallons

    // TIME
    case "minute":
    case "min":
    case "shortMinute":
      return "min"; // no change, just normalize
    case "second":
    case "sec":
      return "sec"; 
    case "shortHours":
      return "h"; // hours abbreviation

    // PRODUCTION RATES / COUNT
    case "profileHour":
    case "lettersHour":
    case "cupsPerHour":
    case "setsHour":
    case "sph":
    case "bookPh":
    case "pph":
    case "chicksPM":
    case "cutsPH":
    case "staplesPerMin":
    case "mmPerMin":
    case "PiercingPMin":
    case "bendingPH":
    case "bookletsPMin":
    case "booksPerMinute":
    case "setsPerMinute":
    case "coversPH":
    case "packagePH":
    case "cutsPMIN":
    case "paperSetsPerHour":
      return unit; // No imperial conversion needed, just keep as is

    // PRICE / UNIT
    case "price":
    case "price Roll / M^2":
    case "price unit/pack":
    case "Price unit / per meter":
    case "Price Unit/pack":
    case "Price Piercing / pack":
    case "CostPerRollPerSquareMeterPerTon":
    case "price unit / M^2":
    case "price Unit / ton":
    case " Unit price / ton":
      return unit; // Prices usually stay the same

    // FALLBACK
    default:
      return unit; // Return as is if not mapped
  }
};

export const convertValueToImperial = (unit: string | null, value: any) => {
  try {
    return value;
    if (!unit) return value; // Return value as-is if no unit

    switch (unit) {
      case "cm":
        return convert(value).from("cm").to("in").toFixed(3);
      case "gram":
        return convert(value).from("g").to("lb").toFixed(3);
      case "g":
        return convert(value).from("g").to("lb").toFixed(3);
      case "gsm":
        return Math.round(value / 2.708).toString();
      case "um":
        return Math.round(value / 25.4).toString();
      case "m":
        return convert(value).from("m").to("yd").toFixed(3);
      case "kg":
        return convert(value).from("kg").to("lb").toFixed(3);
      case "Kg":
        return convert(value).from("kg").to("lb").toFixed(3);
      case "liter":
        return convert(value).from("l").to("gal").toFixed(3); // Convert liters to gallons
      case "mm":
        return convert(value).from("mm").to("in").toFixed(3); // Convert millimeters to inches
      case "Gram/m^2":
        return convert(value).from("g/m2").to("lb/yd2").toFixed(3); // Convert grams per square meter to ounces per square yard
      case "m²":
        return convert(value).from("m2").to("yd2").toFixed(3); // Convert square meters to square yards
      default:
        return value;
    }
  } catch (e) {
    return value;
  }
};

export const convertValueToOriginalUnit = (unit: string | null, value: any) => {
  if (!unit) return value; // Return value as-is if no unit
  return value;
  switch (unit) {
    case "cm":
      return convert(value).from("in").to("cm").toFixed(3);
    case "gram":
      return convert(value).from("lb").to("g").toFixed(3);
    case "g":
      return convert(value).from("lb").to("g").toFixed(3);
    case "um":
      return (value * 24.4).toFixed(3);
    case "gsm":
      return (value * 2.708).toFixed(3);
    case "m":
      return convert(value).from("yd").to("m").toFixed(3);
    case "kg":
      return convert(value).from("lb").to("kg").toFixed(3);
    case "Kg":
      return convert(value).from("lb").to("kg").toFixed(3);
    case "liter":
      return convert(value).from("gal").to("l").toFixed(3); // Convert gallons to liters
    case "mm":
      return convert(value).from("in").to("mm").toFixed(3); // Convert inches to millimeters
    case "Gram/m^2":
      return convert(value).from("lb/yd2").to("g/m2").toFixed(3); // Convert ounces per square yard to grams per square meter
    case "m²":
      return convert(value).from("yd2").to("m2").toFixed(3); // Convert square yards to square meters
    default:
      return value;
  }
};

export const formatSecondsToHHMMSS = (seconds: number): string => {
  if (!seconds) return "00:00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [hours, minutes, remainingSeconds]
    .map((unit) => unit.toString().padStart(2, "0"))
    .join(":");
};

export const startOfPreviousYear = () => {
  const currentYear = new Date().getFullYear();
  return new Date(currentYear - 1, 0, 1); // January 1st of the previous year
};

export const initialFromDate = (key: string, defaultDate?: Date) => {
  const savedDate = localStorage.getItem(key);
  return savedDate
    ? new Date(savedDate)
    : defaultDate
    ? defaultDate
    : startOfPreviousYear();
};

export const areDatesValid = (startDate, endDate) => {
  return (
    startDate &&
    !isNaN(new Date(startDate).getTime()) &&
    endDate &&
    !isNaN(new Date(endDate).getTime())
  );
};

export const areAllItemsChecked = (quoteConfirm) => {
  if (!quoteConfirm?.documentItems?.length) return false;
  return quoteConfirm.documentItems.every((item) => item.isChecked === false);
};

export const validateUsAddressFields = (
  address: any
): { isValid: boolean; missingFields: string[] } => {
  const missingFields: string[] = [];

  if (!address?.country) missingFields.push("customers.modal.country");
  if (!address?.city) missingFields.push("sales.quote.city");
  if (!address?.address2) missingFields.push("customers.modal.address2");
  if (!address?.zipCode) missingFields.push("customers.modal.zipCode");

  if (address?.country?.toLowerCase() === "us" && !address?.state) {
    missingFields.push("customers.modal.state");
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

export const renderExceptionMessage = (
  exceptionKey: any,
  values: any,
  t: any
) => {
  if (exceptionKey && values?.length > 0) {
    return t("CalculationExceptions." + exceptionKey).replace(
      /\{\{(\d+)\}\}/g,
      (_, index) => values[index] || ""
    );
  } else if (exceptionKey) {
    return t("CalculationExceptions." + exceptionKey);
  }
  return "";
};

// Utility functions for rounding and formatting numbers to 2 decimal places.
// Commonly used in receipts, summaries, and any monetary value display.

export const round2 = (n: number | string | undefined | null): number =>
  Math.round((Number(n ?? 0) + Number.EPSILON) * 100) / 100;

export const fmt2 = (n: number | string | undefined | null): string =>
  round2(n).toFixed(2);

export const  removeDuplicateParameters = (generalParameters) => {
  // Create a Map to track unique parameters
  const uniqueMap = new Map();
  
  // Iterate through the parameters
  generalParameters.forEach(param => {
    // Create a unique key based on the 4 criteria
    const uniqueKey = `${param.parameterId}_${param.sectionId}_${param.subSectionId}_${param.actionIndex}`;
    
    // Only add if we haven't seen this combination before
    if (!uniqueMap.has(uniqueKey)) {
      uniqueMap.set(uniqueKey, param);
    }
  });
  
  // Return the unique parameters as an array
  return Array.from(uniqueMap.values());
};
/**
 * Filters out null and undefined values from arrays to prevent [null] being sent to API endpoints.
 * For non-array values, returns the value as-is.
 * @param value - The value to process (can be array or any other type)
 * @returns The processed value with null/undefined filtered out if it's an array
 */
export const filterNullFromArrays = (value: any): any => {
  return Array.isArray(value) 
    ? value.filter(item => item !== null && item !== undefined)
    : value;
};
