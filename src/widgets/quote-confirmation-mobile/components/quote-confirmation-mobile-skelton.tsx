import { Skeleton } from "@mui/material";
import { useStyle } from "../style";

const QuoteConfirmationMobileSkeltonWidget = () => {
  const { classes } = useStyle();

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        marginBottom: "10px",
      }}
    >
      <div style={classes.titleSkeltonContainer}>
        <Skeleton variant="text" width={150} height={32} />
        -
        <Skeleton variant="text" width={80} height={32} />
      </div>

      <div style={classes.borderContainer} />

      <div style={{ ...classes.mainContainer, marginTop: "10px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column" as "column",
            justifyContent: "flex-start",
            padding: "0px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row" as "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Skeleton variant="text" width={150} height={32} />
            <Skeleton variant="text" width={80} height={32} />
            <Skeleton variant="text" width={80} height={32} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row" as "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Skeleton variant="text" width={90} height={32} />
            <Skeleton variant="text" width={90} height={32} />
          </div>
        </div>

        <div style={classes.borderContainer} />

        <div
          style={{
            display: "flex",
            flexDirection: "column" as "column",
            justifyContent: "flex-start",
            padding: "0px 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row" as "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Skeleton variant="text" width={80} height={32} />
            <Skeleton variant="text" width={80} height={32} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row" as "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Skeleton variant="text" width={120} height={32} />
          </div>
        </div>

        <div style={classes.borderContainer} />

        <Skeleton
          variant="rectangular"
          width="90%"
          height={250}
          style={{ alignSelf: "center", borderRadius: "8px" }}
        />

        <div style={classes.borderContainer} />

        <Skeleton
          variant="rectangular"
          width="90%"
          height={150}
          style={{ alignSelf: "center", borderRadius: "8px" }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: 10,
            gap: 25,
          }}
        >
          <Skeleton
            variant="rectangular"
            width="90%"
            height={40}
            style={{ borderRadius: "8px" }}
          />
          <Skeleton
            variant="rectangular"
            width="90%"
            height={40}
            style={{ borderRadius: "8px" }}
          />
          <Skeleton
            variant="rectangular"
            width="90%"
            height={40}
            style={{ borderRadius: "8px" }}
          />
        </div>
      </div>
    </div>
  );
};

export { QuoteConfirmationMobileSkeltonWidget };
