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
        const parameter = subSection.parameters.find(param => param.code === targetCode);
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
    return 'English';
  } else if (arabicRegex.test(text)) {
    return 'Arabic';
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
}

export const isValidCustomer = (
  customer,
  filteredContacts,
  filteredAddresses,
  filteredUsers
) => {
  if (
    !(
      customer &&
      customer.name &&
      customer.clientTypeId
  
    )
  ) {
    return false;
  }
  for (const contact of filteredContacts) {
    if (!contact.firstName) {
      return false;
    }
  }
  for (const address of filteredAddresses) {
    if (!address.address1) {
      return false;
    }
  }
  for (const user of filteredUsers) {
    if (!user.email) {
      return false;
    }
  }
  //new users
  for (const user of filteredUsers.filter((user) => !user.id)) {
    if (!user.password) {
      return false;
    }
  }
  return true;
};

export   const downloadPdf = (url) => {
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

export  const isAtLeastOneSelected = (items) => {
  if (items && items?.length > 0) {
    return items.some(item => item.isSelected === true);

  }
}

export function removeTags(str) {
  if ((str === null) || (str === ''))
      return false;
  else
      str = str.toString();
  return str.replace(/(<([^>]+)>)/ig, '');
}

export function getCurrencySymbol(currencyCode) {
  const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'ILS': '₪'
  };

  return currencySymbols[currencyCode] || null;
}
