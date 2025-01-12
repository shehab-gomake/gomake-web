import { EPreferences } from "@/enums/prefernces";
import { usePrintHousePreferences } from "@/hooks/use-print-house-preferences";
import { ISetState } from "@/services/hooks/call-api.interface";
import get from "lodash.get";

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

//!old
// const isValidCustomer = (
//   customer,
//   filteredContacts,
//   filteredAddresses,
//   filteredUsers
// ) => {
//   if (!(customer && customer.name && customer.clientTypeId)) {
//     return false;
//   }
//   if (filteredContacts) {
//     for (const contact of filteredContacts) {
//       if (!contact.firstName) {
//         return false;
//       }
//     }
//   }
//   if (filteredAddresses) {
//     for (const address of filteredAddresses) {
//       if (!address.address1) {
//         return false;
//       }
//     }
//   }

//   if (filteredUsers) {
//     for (const user of filteredUsers) {
//       if (!user.email) {
//         return false;
//       }
//     }
//   }
//   if (filteredUsers) {
//     for (const user of filteredUsers?.filter((user) => !user.id)) {
//       if (!user.password) {
//         return false;
//       }
//     }
//   }
//   return true;
// };

export const isValidCustomer = (
  customer,
  filteredContacts,
  filteredAddresses,
  filteredUsers,
  CheckPreferenceValue
) => {
  const hasRequiredCustomerInfo =
    customer &&
    customer.name &&
    customer.clientTypeId &&
    (!CheckPreferenceValue(
      EPreferences.IS_BUSINESS_NUMBER_REQUIRED_IN_CUSTOMERS
    ) ||
      customer.buisnessNumber);

  if (!hasRequiredCustomerInfo) return false;

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
  if(!phoneNumber)
    return phoneNumber;
  const pattern = /^(?:\+|00)(1|[2-9]\d{1,2})[-\s]?/;
  const result = phoneNumber.replace(pattern, "");

  return result;
};

