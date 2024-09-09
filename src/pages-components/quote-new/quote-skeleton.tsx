
import { Box, Skeleton } from "@mui/material";

const QuoteNewPageSkeletonWidget = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Skeleton variant="text" width={250} height={60} />
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: 10, gap: 25 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={200} height={40} />
      </div>

      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: 20, gap: 30 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={200} height={40} />
      </div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: 20, gap: 30 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="text" width={200} height={40} />
      </div>
      {/* Skeleton for the business and contact sections */}
      <Skeleton variant="rectangular" width="100%" height={450} style={{ marginBottom: 20, borderRadius: 16 }} />

      {/* Skeleton for the buttons at the bottom */}
      <Box sx={{ display: "flex", gap: 2, marginTop: 4, flexDirection: "row", justifyContent: "space-between" }}>
        <Skeleton variant="rectangular" width="33%" height={40} />
        <Skeleton variant="rectangular" width="33%" height={40} />
        <Skeleton variant="rectangular" width="33%" height={40} />
      </Box>
      <Box sx={{ display: "flex", gap: 2, marginTop: 4, flexDirection: "row", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 15, marginTop: 4, flexDirection: "row", justifyContent: "space-between" }}>
          <Skeleton variant="rectangular" width={150} height={40} style={{ borderRadius: 8 }} />
          <Skeleton variant="rectangular" width={150} height={40} style={{ borderRadius: 8 }} />
        </div>
        <div style={{ display: "flex", gap: 15, marginTop: 4, flexDirection: "row", justifyContent: "space-between" }}>
          <Skeleton variant="rectangular" width={80} height={40} style={{ borderRadius: 8 }} />
          <Skeleton variant="rectangular" width={80} height={40} style={{ borderRadius: 8 }} />
          <Skeleton variant="rectangular" width={80} height={40} style={{ borderRadius: 8 }} />
          <Skeleton variant="rectangular" width={80} height={40} style={{ borderRadius: 8 }} />
          <Skeleton variant="rectangular" width={80} height={40} style={{ borderRadius: 8 }} />
        </div>
      </Box>
    </Box>
  );
};

export { QuoteNewPageSkeletonWidget };