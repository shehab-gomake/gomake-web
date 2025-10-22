import { useState, useRef, KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  Stack,
  Box,
  CircularProgress,
} from "@mui/material";
import { GomakeTextInput } from "@/components/text-input/text-input";
import { GoMakeAutoComplate } from "@/components/auto-complete/auto-complete";
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";
import GppGoodRoundedIcon from "@mui/icons-material/GppGoodRounded";

const countryList = require("country-list");
const allCountries = countryList.getNames();
const allCountryCodes = countryList.getCodes();
const countriesWithCodes = allCountries.map(
  (country: string, index: number) => ({
    label: country,
    value: allCountryCodes[index],
    id: allCountryCodes[index],
  })
);

interface LandingModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: (email: string, country: string) => void | Promise<void>;
  isVerificationStep?: boolean;
  onVerifyCode?: (code: string) => void | Promise<void>;
  userEmail?: string;
}

export const LandingModal = ({
  open,
  onClose,
  onContinue,
  isVerificationStep = false,
  onVerifyCode,
  userEmail,
}: LandingModalProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState<any>(null);
  const [emailError, setEmailError] = useState("");
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(6).fill("")
  );
  const [codeError, setCodeError] = useState("");
  const [isLoadingContinue, setIsLoadingContinue] = useState(false);
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = async () => {
    if (!email) {
      setEmailError(t("Email is required") || "Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError(t("Invalid email format") || "Invalid email format");
      return;
    }
    if (!country) {
      return;
    }

    setIsLoadingContinue(true);
    try {
      await onContinue(email, country.value);
    } catch (error) {
      console.error("Error in continue:", error);
    } finally {
      setIsLoadingContinue(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);

    const newCode = [...verificationCode];
    newCode[index] = digit;
    setVerificationCode(newCode);

    if (codeError) {
      setCodeError("");
    }

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newCode = [...verificationCode];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCode[i] = pastedData[i];
    }

    setVerificationCode(newCode);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex((digit) => !digit);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join("");

    if (!code || code.length === 0) {
      setCodeError("Verification code is required");
      return;
    }
    if (code.length !== 6) {
      setCodeError("Verification code must be 6 digits");
      return;
    }

    setIsLoadingVerify(true);
    try {
      if (onVerifyCode) {
        await onVerifyCode(code);
      }
    } catch (error) {
      console.error("Error in verify:", error);
    } finally {
      setIsLoadingVerify(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: "16px",
          background: "linear-gradient(135deg, #ffffff 0%, #fef5fa 100%)",
          margin: { xs: "16px", sm: "32px" },
          maxHeight: { xs: "calc(100% - 32px)", sm: "calc(100% - 64px)" },
        },
      }}
    >
      <DialogContent
        sx={{ padding: { xs: "24px 20px", sm: "40px" }, overflowY: "auto" }}
      >
        {!isVerificationStep ? (
          <>
            <Box style={classes.modalTitleContainer}>
              <div style={classes.modalTitle}>Welcome to Go AI</div>
              <Box sx={(classes as any).modalSubtitle}>
                Get started by providing your information
              </Box>
            </Box>

            <Stack spacing={3} style={classes.formContainer}>
              <div>
                <div style={classes.label}>
                  {t("customers.email")} <span style={classes.required}>*</span>
                </div>
                <GomakeTextInput
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  error={!!emailError}
                  placeholder={t("customers.email")}
                  autoFocus
                  style={classes.input}
                />
                {emailError && (
                  <div style={classes.errorText}>{emailError}</div>
                )}
              </div>

              <div>
                <div style={classes.label}>
                  {t("profileSettings.country")}{" "}
                  <span style={classes.required}>*</span>
                </div>
                <GoMakeAutoComplate
                  value={country}
                  onChange={(e: any, value: any) => setCountry(value)}
                  options={countriesWithCodes}
                  placeholder={t("profileSettings.country")}
                  disableClearable={false}
                  withArrow={true}
                  style={classes.input}
                />
              </div>

              <div style={classes.buttonContainer}>
                <SecondaryButton
                  variant="contained"
                  onClick={handleContinue}
                  disabled={!email || !country || isLoadingContinue}
                  style={classes.button}
                  fullWidth
                >
                  {isLoadingContinue ? (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                      <span>Loading...</span>
                    </Box>
                  ) : (
                    t("sales.documentDeliveries.continue")
                  )}
                </SecondaryButton>
              </div>
            </Stack>
          </>
        ) : (
          <>
            <Box
              style={{
                ...classes.modalTitleContainer,
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <Box sx={classes.verificationIconContainer}>
                <Box sx={classes.verificationIcon}>
                  <GppGoodRoundedIcon
                    sx={{
                      fontSize: { xs: "32px", sm: "38px" },
                      color: "#fff",
                    }}
                  />
                </Box>
              </Box>
              <Box sx={classes.modalTitle2}>Verify Your Email</Box>
              <Box sx={classes.modalSubtitle}>
                We've sent a 6-digit verification code to your email
              </Box>
              <Box sx={(classes as any).userEmail}>{userEmail}</Box>
            </Box>
            <Stack spacing={{ xs: 2.5, sm: 3 }} style={classes.formContainer}>
              <div>
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: "6px", sm: "12px" },
                    justifyContent: "center",
                    marginTop: { xs: "12px", sm: "16px" },
                    flexWrap: "wrap",
                  }}
                >
                  {verificationCode.map((digit, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: { xs: "40px", sm: "48px" },
                        height: { xs: "48px", sm: "56px" },
                      }}
                    >
                      <input
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleCodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        onPaste={index === 0 ? handleCodePaste : undefined}
                        autoFocus={index === 0}
                        style={{
                          width: "100%",
                          height: "100%",
                          fontSize: window.innerWidth < 600 ? "20px" : "24px",
                          fontWeight: "600",
                          textAlign: "center",
                          border: `2px solid ${
                            codeError ? "#f44336" : "#e0e0e0"
                          }`,
                          borderRadius:
                            window.innerWidth < 600 ? "8px" : "12px",
                          outline: "none",
                          transition: "all 0.2s ease",
                          background: "#fff",
                          color: "#333",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "#9333ea";
                          e.target.style.boxShadow =
                            "0 0 0 3px rgba(147, 51, 234, 0.1)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = codeError
                            ? "#f44336"
                            : "#e0e0e0";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </Box>
                  ))}
                </Box>
                {codeError && (
                  <div
                    style={{
                      ...classes.errorText,
                      textAlign: "center",
                      marginTop: "12px",
                    }}
                  >
                    {codeError}
                  </div>
                )}
              </div>

              <div style={classes.buttonContainer}>
                <SecondaryButton
                  variant="contained"
                  onClick={handleVerifyCode}
                  disabled={
                    verificationCode.join("").length !== 6 || isLoadingVerify
                  }
                  style={classes.button}
                  fullWidth
                >
                  {isLoadingVerify ? (
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <CircularProgress size={20} sx={{ color: "#fff" }} />
                      <span>Verifying...</span>
                    </Box>
                  ) : (
                    "Verify Code"
                  )}
                </SecondaryButton>
              </div>
            </Stack>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
