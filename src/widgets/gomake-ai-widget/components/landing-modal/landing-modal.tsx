import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, Stack, Box } from "@mui/material";
import { GomakeTextInput } from "@/components/text-input/text-input";
import { GoMakeAutoComplate } from "@/components/auto-complete/auto-complete";
import { GomakePrimaryButton } from "@/components/button/button";
import { useStyle } from "./style";
import { SecondaryButton } from "@/components/button/secondary-button";

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
  onContinue: (email: string, country: string) => void;
}

export const LandingModal = ({
  open,
  onClose,
  onContinue,
}: LandingModalProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState<any>(null);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = () => {
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

    onContinue(email, country.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
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
        },
      }}
    >
      <DialogContent sx={{ padding: "40px" }}>
        <Box style={classes.modalTitleContainer}>
          <div style={classes.modalTitle}>Welcome to Go AI</div>
          <div style={classes.modalSubtitle}>
            Get started by providing your information
          </div>
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
            {emailError && <div style={classes.errorText}>{emailError}</div>}
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
              disabled={!email || !country}
              style={classes.button}
              fullWidth
            >
              {t("sales.documentDeliveries.continue")}
            </SecondaryButton>
          </div>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
