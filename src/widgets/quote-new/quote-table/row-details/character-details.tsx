import { IconButton } from "@mui/material";
import { useStyleCharacterDetails } from "./style-character-details";
import parse from "html-react-parser";
import { NotesForActionModal } from "@/widgets/product-pricing-widget/components/action/notes-for-action-modal";
import { EditUnderLineIcon } from "@/icons/edit-icon-under-line";
import { useCharacterDetails } from "./use-character-details";

interface CharacterDetailsProps {
  details: string;
  getQuote?: () => void;
  documentItemId?: string | number;
  detailsStyle?: React.CSSProperties;
  showAllStyle?: React.CSSProperties;
  showLessHeightFit?: boolean;
  canUpdate?: boolean;
  documentType?: number;
  workName?: string;
  isPrePaymentPage?: boolean;
}

const CharacterDetails = ({
  details,
  getQuote,
  documentItemId,
  showAllStyle,
  detailsStyle,
  showLessHeightFit = false,
  canUpdate = true,
  documentType,
  workName,
  isPrePaymentPage
}: CharacterDetailsProps) => {
  const {
    t,
    isRTL,
    isEdit,
    showAll,
    data,
    setData,
    handleShowLess,
    handleShowMore,
    setIsEdit,
    handleClose,
    handleSave,
    jobName,
    setJobName,
    truncatedDetails,
    canNotEditWhenShowJobNameOnly,
  } = useCharacterDetails({
    details,
    getQuote,
    documentItemId,
    documentType,
    workName,
  });

  const { classes } = useStyleCharacterDetails({ showAll, showLessHeightFit });

  const canEditDetails = canUpdate && !canNotEditWhenShowJobNameOnly && !isPrePaymentPage;

  return (
    <>
      <div
        onClick={canEditDetails ? () => setIsEdit(true) : undefined}
        style={{
          cursor: canEditDetails ? "pointer" : "default",
          position: "relative",
          textAlign: isRTL ? "right" : "left",
          ...detailsStyle,
        }}
      >
        <div style={{ ...classes.mainContainer }}>
          {parse(truncatedDetails || "")}
          {!showAll && ".. "}
          {details?.length > 90 && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                showAll ? handleShowLess() : handleShowMore();
              }}
              style={showAllStyle || { ...classes.showAllContaner }}
            >
              {showAll ? t("sales.quote.showLess") : t("sales.quote.showMore")}
            </span>
          )}
        </div>

        {canEditDetails && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setIsEdit(true);
            }}
            style={{
              position: "absolute",
              top: 0,
              [isRTL ? "left" : "right"]: 0,
            }}
          >
            <EditUnderLineIcon />
          </IconButton>
        )}
      </div>
      <NotesForActionModal
        key={`notes-modal-${documentItemId}`}
        openModal={isEdit}
        onClose={handleClose}
        value={data}
        setValue={setData}
        onSend={handleSave}
        modalTitle={t("sales.cart.editDetails")}
        id={documentItemId}
        isHaveJobName={true}
        jobName={jobName}
        setJobName={setJobName}
        documentType={documentType}
      />
    </>
  );
};
export { CharacterDetails };
