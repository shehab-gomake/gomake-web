import { useSnackBar } from "@/hooks/use-snack-bar";
import { useRecoilValue } from "recoil";
import { printHouseProfile } from "@/store/print-house-profile";

const COUNTRY_DIAL_CODES: Record<string, string> = {
  // Common countries
  IL: "972", // Israel
  US: "1", // United States
  GB: "44", // United Kingdom
  CA: "1", // Canada
  AU: "61", // Australia
  DE: "49", // Germany
  FR: "33", // France
  IT: "39", // Italy
  ES: "34", // Spain
  NL: "31", // Netherlands
  BE: "32", // Belgium
  CH: "41", // Switzerland
  AT: "43", // Austria
  SE: "46", // Sweden
  NO: "47", // Norway
  DK: "45", // Denmark
  FI: "358", // Finland
  PL: "48", // Poland
  PT: "351", // Portugal
  GR: "30", // Greece
  IE: "353", // Ireland
  NZ: "64", // New Zealand
  ZA: "27", // South Africa
  BR: "55", // Brazil
  MX: "52", // Mexico
  AR: "54", // Argentina
  CL: "56", // Chile
  CO: "57", // Colombia
  PE: "51", // Peru
  IN: "91", // India
  CN: "86", // China
  JP: "81", // Japan
  KR: "82", // South Korea
  SG: "65", // Singapore
  MY: "60", // Malaysia
  TH: "66", // Thailand
  PH: "63", // Philippines
  ID: "62", // Indonesia
  VN: "84", // Vietnam
  AE: "971", // United Arab Emirates
  SA: "966", // Saudi Arabia
  EG: "20", // Egypt
  TR: "90", // Turkey
  RU: "7", // Russia
  UA: "380", // Ukraine
};

const getCountryDialCode = (countryCode: string): string | null => {
  if (!countryCode) return null;
  const upperCode = countryCode.toUpperCase();
  return COUNTRY_DIAL_CODES[upperCode] || null;
};

const useWhatsAppWeb = () => {
  const { alertFault } = useSnackBar();
  const printHouseProfileState = useRecoilValue<any>(printHouseProfile);

  const ensurePhoneNumberWithPrefix = (phoneNumber: string): string => {
    if (!phoneNumber) return phoneNumber;

    // Remove all non-digit characters except +
    const cleanedPhone = phoneNumber.trim();

    // If phone already has prefix (starts with +), return as is
    if (cleanedPhone.startsWith("+")) {
      // Remove all non-digit characters except + for WhatsApp URL
      return cleanedPhone.replace(/[^\d+]/g, "");
    }

    // Use the country code from print house profile
    const countryCode = printHouseProfileState?.country;

    if (!countryCode) {
      return cleanedPhone.replace(/[^\d]/g, "");
    }

    // Get the country dial code
    const dialCode = getCountryDialCode(countryCode);

    if (!dialCode) {
      // If country code is not found in mapping, return cleaned number without prefix
      console.warn(`Country dial code not found for: ${countryCode}`);
      return cleanedPhone.replace(/[^\d]/g, "");
    }

    // Remove all non-digit characters and prepend the dial code with +
    const digitsOnly = cleanedPhone.replace(/[^\d]/g, "");
    return `+${dialCode}${digitsOnly}`;
  };

  const openWhatsAppWebLink = (whatsappMassage, phoneNumber, isWeb = true) => {
    if (!whatsappMassage?.trim()) {
      alertFault("alerts.noTemplateFound");
      return;
    }

    // Ensure phone number has country prefix (uses printHouseProfileState.country)
    const formattedPhone = ensurePhoneNumberWithPrefix(phoneNumber);

    // Remove all non-digit characters (including +) for WhatsApp URL
    // WhatsApp expects digits only in the URL (e.g., 972501234567, not +972501234567)
    const phoneForUrl = formattedPhone.replace(/[^\d]/g, "");

    const url = isWeb
      ? `https://web.whatsapp.com/send?phone=${phoneForUrl}&text=${encodeURIComponent(
          whatsappMassage
        )}`
      : `whatsapp://send?phone=${phoneForUrl}&text=${encodeURIComponent(
          whatsappMassage
        )}`;

    window.open(url, "_blank");
  };

  const getWhatsAppUrl = (message: string, phone: string) => {
    if (!message || !phone) return null;
    const encodedMessage = encodeURIComponent(message);
    // Remove all non-digit characters (including +) for WhatsApp URL
    // Uses printHouseProfileState.country automatically
    const formattedPhone = ensurePhoneNumberWithPrefix(phone).replace(
      /[^\d]/g,
      ""
    );
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  };

  const getWhatsWebUrl = (message: string, phone: string) => {
    if (!message || !phone) return null;
    const encodedMessage = encodeURIComponent(message);
    // Remove all non-digit characters (including +) for WhatsApp URL
    // Uses printHouseProfileState.country automatically
    const formattedPhone = ensurePhoneNumberWithPrefix(phone).replace(
      /[^\d]/g,
      ""
    );
    return `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;
  };

  return {
    openWhatsAppWebLink,
    getWhatsAppUrl,
    getWhatsWebUrl,
    ensurePhoneNumberWithPrefix,
  };
};
export { useWhatsAppWeb };
