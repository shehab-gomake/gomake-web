import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import { GoMakeTextEditor } from "@/components/text-editor/go-make-text-editor";
import { useBoardMissionsActivities } from "@/widgets/production-floor/views/board-missions-view/activity/use-board-missions-activities";
import { ActivityComponent } from "@/widgets/production-floor/views/board-missions-view/activity/activity-component";
import { convertHeightToVH } from "@/utils/adapter";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import { toRgba } from "@/utils/helpers";

const BoardMissionsActivities = () => {
  const { t } = useTranslation();
  const loaderRef = useRef(null);
  const lastActivityRef = useRef(null);
  const {
    addComment,
    filtersButtonsArray,
    activitiesList,
    getAllActivities,
    addActivityLoader,
  } = useBoardMissionsActivities();

  useEffect(() => {
    if (addActivityLoader && loaderRef.current) {
      loaderRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [addActivityLoader]);

  useEffect(() => {
    getAllActivities().then();
  }, []);

  useEffect(() => {
    if (lastActivityRef && lastActivityRef.current) {
      lastActivityRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activitiesList]);

  return (
    <Stack width={"100%"} gap={"25px"} height={"100%"} overflow={"hidden"}>
      <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
        {filtersButtonsArray?.map((btn) => (
          <Button
            key={`activities-btn-${btn.name}`}
            onClick={btn.onClick}
            variant={"contained"}
            style={{
              width: "100px",
              backgroundColor: btn.selected
                ? btn.textColor
                : toRgba(btn.borderColor, 0.2),
              borderRadius: "var(--radius-full, 9999px)",
              color: btn.selected ? "#ffffff" : btn.textColor,
              border: btn.selected ? "none" : `1px solid ${btn.borderColor}`,
              boxShadow: "none",
              textTransform: "capitalize",
            }}
          >
            {t(btn.name)}
          </Button>
        ))}
      </Stack>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflow: "auto",
          // height: convertHeightToVH(650),
        }}
      >
        {activitiesList?.length > 0 &&
          activitiesList?.map((activity, index) => (
            <div
              key={"activity" + index}
              ref={
                index + 1 === activitiesList.length
                  ? lastActivityRef
                  : undefined
              }
            >
              <ActivityComponent {...activity} />
            </div>
          ))}
        {addActivityLoader && (
          <Stack
            ref={loaderRef}
            // height={"60px"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <DotsLoader />
          </Stack>
        )}
      </div>
      <GoMakeTextEditor
        onSend={addComment}
        containerStyle={{ marginTop: "auto", height: "unset" }}
      />
    </Stack>
  );
};

export { BoardMissionsActivities };
