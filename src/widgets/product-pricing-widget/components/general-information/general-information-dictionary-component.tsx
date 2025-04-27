import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { Divider } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { formatValueWithUnit } from "@/utils/is-currency";

const GeneralInformationDictionaryComponent = ({
  details2,
}: {
  details2?: any;
}) => {
  const { t } = useTranslation();
  const { neutralColor, primaryColor } = useGomakeTheme();

  return (
    <Stack gap={"10px"} flexWrap={"wrap"}>
      {details2 &&
        Object.entries(details2)
          .sort(([keyA], [keyB]) => {
            if (keyA === "") return -1;
            if (keyB === "") return 1;
            return 0;
          })
          .map(([sectionKey, parameters]) => (
            <Stack key={sectionKey || "empty-section"} gap={"10px"}>
              <Stack
                direction={"row"}
                flexWrap={"wrap"}
                gap={"16px"}
                alignItems="center"
              >
                {sectionKey ? (
                  <div
                    style={{
                      ...FONT_FAMILY.Inter(700, 15),
                      color: primaryColor(900),
                      width: "max-content",
                    }}
                  >
                    {t(`${sectionKey}`)}
                  </div>
                ) : (
                  <></>
                )}
                {Array.isArray(parameters) &&
                  parameters?.flatMap(
                    (parameter: any, index: number, array: any[]) => {
                      const key = `data2-parameter-${index}`;
                      const parameterComponent = (
                        <Stack
                          key={key}
                          direction={"row"}
                          gap={"10px"}
                          alignItems={"center"}
                        >
                          <span
                            style={{
                              ...FONT_FAMILY.Lexend(500, 14),
                              color: neutralColor(500),
                              width: "max-content",
                            }}
                          >
                            {parameter.name}
                          </span>
                          {parameter.values?.map((value) => (
                            <span
                              key={value}
                              style={{
                                ...FONT_FAMILY.Inter(500, 14),
                                color: primaryColor(900),
                                width: "max-content",
                              }}
                            >
                              {formatValueWithUnit(
                                value,
                                parameter?.defaultUnit
                              )}
                            </span>
                          ))}
                        </Stack>
                      );
                      const isLastElement = index >= array.length - 1;

                      return isLastElement
                        ? [parameterComponent]
                        : [
                            parameterComponent,
                            <Divider
                              key={`divider-${key}`}
                              orientation="vertical"
                              flexItem
                            />,
                          ];
                    }
                  )}
              </Stack>
            </Stack>
          ))}
    </Stack>
  );
};

export { GeneralInformationDictionaryComponent };
