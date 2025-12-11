import {
  CircularProgress,
  Collapse,
  Fade,
  IconButton,
  MenuItem,
  Paper,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import {
  EWorkSource,
  HtmlElementType,
  RuleType,
} from "@/widgets/product-pricing-widget/enums";
import Divider from "@mui/material/Divider";
import {
  ParametersMapping,
  TextAreaActionsMapping,
} from "@/widgets/product-pricing-widget/components/action/key-value-view";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CheckIcon from "@mui/icons-material/Check";
import { useStyle } from "@/widgets/production-floor/views/board-missions-view/stations/style";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { PrimaryButton } from "@/components/button/primary-button";
import { IBoardMissionsStation } from "@/widgets/production-floor/views/board-missions-view/stations/interface";
import { DateFormatterShort } from "@/utils/date-formatters";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  boardMissionsUpdateActionEmployee,
  boardMissionsUpdateActionMachine,
  cancelBoardMissionsActionDone,
  getBoardMissionActionMaterialsApi,
  updateBoardMissionsActionDoneWithMaterialsApi,
} from "@/services/api-service/production-floor/production-floor-endpoints";
import { getDocumentMailDataApi } from "@/services/api-service/generic-doc/documents-api";
import { contactResolutionService, conversationComposerService } from "@/services/frontdesk";
import { chatwootSelectedAccountAtom, chatwootProfileAtom } from "@/store/frontdesk/atoms/chatwoot.atoms";
import { useChatwootProfile } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-profile";
import { useChatwootInboxes } from "@/widgets/frontdesk/providers/chatwoot/hooks/use-chatwoot-inboxes";
import { ChannelType } from "@/services/frontdesk/api/chatwoot/types/inboxes.types";
import type { ContactCreatePayload } from "@/services/frontdesk/api/chatwoot/types/contacts.types";
import { getCapitalizedNameFromEmail } from "@/widgets/frontdesk/providers/chatwoot/utils/contact-utils";
import { convertAttachmentsToFiles } from "@/widgets/frontdesk/providers/chatwoot/utils/attachment.utils";
import type { AttachmentSource } from "@/widgets/frontdesk/providers/chatwoot/types/attachment.types";
import { EmailAttachment } from "@/widgets/frontdesk/providers/email/types/email.types";
import { getFileExtension, getMimeTypeFromExtension } from "@/widgets/frontdesk/providers/chatwoot/utils/attachment.utils";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { printHouseHasFrontDeskFeature } from "@/store/print-house-profile";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/material/Button";
import { GomakeTextInput, ThreeOptionsModal } from "@/components";
import { ModalType } from "@/enums";
import { useBoardMissionsUpdatedOutputs } from "./use-board-missions-updated-outputs";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { boardMissionsDetailsState } from "@/widgets/production-floor/state/boards";
import { Permissions } from "@/components/CheckPermission/enum";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import {
  boardMissionsStationsState,
  isOrderCompletedState,
  isPackagingModalOpenState,
  isPrintNodeModalOpenState,
} from "@/widgets/production-floor/views/board-missions-view/stations/state";
import { useUserPermission } from "@/hooks/use-permission";
import { PrintPackingSlipModalWidget } from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/print-packing-slip-modal-widget";
import { TableOutPutComponent } from "@/widgets/product-pricing-widget/components/table-output/table-output-component";
import {
  boardMissionMaterialState,
  materialModalState,
} from "./material-and-production-time-modal/states";
import { MaterialsAndProductionTimeModalWidget } from "./material-and-production-time-modal";
import { convertUtcToLocalIsoString } from "@/components/date-time/date-time-component";
import { outsourceSuppliersState } from "@/widgets/product-pricing-widget/state";
import { FONT_FAMILY } from "@/utils/font-family";
import { formatSecondsToHHMMSS } from "@/utils/helpers";
import { useIsMobile } from "@/hooks/use-responsive";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface IProps extends IBoardMissionsStation {
  delay: number;
  selected?: boolean;
  isLastStation?: boolean;
  getStations?: any;
  isHaveSubACtions?: boolean;
  isHideTimeAndDate?: boolean;
  supplierId?: string;
  isSubAction?: boolean;
  storage?: string;
}

const BoardMissionsStationActionItem = ({
  id,
  actionId,
  actionName,
  source,
  machineName,
  employeeName,
  delay,
  dueDate,
  outputs,
  isDone,
  boardMissionActionId,
  boardMissionActionTimer,
  selected,
  isLastStation,
  isEditable,
  isNeedEmployee,
  isNeedMachine,
  isNeedMaterial,
  getStations,
  isHaveSubACtions,
  subActions,
  isHideTimeAndDate,
  supplierName,
  supplierId,
  productType,
  realProductionTime,
  isSubAction = false,
  storage,
}: IProps) => {
  const isMobile = useIsMobile();
  const { primaryColor, grayColor } = useGomakeTheme();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate, alertFaultGetData } =
    useSnackBar();
  const [boardMissions, setBoardMissions] = useRecoilState(
    boardMissionsDetailsState
  );
  const suppliersState = useRecoilValue(outsourceSuppliersState);
  const suppliers = useMemo(() => {
    return suppliersState?.map((s) => ({
      value: s.supplierId,
      label: s.supplierName,
    }));
  }, [suppliersState]);
  const getSupplierId = useCallback(() => {
    if (supplierId) {
      const supplier = suppliers?.find((sup) => sup.value === supplierId);
      return !!supplier ? supplier.label : "";
    }
    return "";
  }, [supplierId, suppliers, suppliersState]);
  const [stations, setStations] = useRecoilState(boardMissionsStationsState);
  const setIsPrintNodeModalOpen = useSetRecoilState(isPrintNodeModalOpenState);
  const [openPackagingModal, setOpenPackagingModal] = useRecoilState(
    isPackagingModalOpenState
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [isOrderCompleted] = useRecoilState(isOrderCompletedState);

  // FrontDesk email sending setup for programmatic sending
  const hasFrontDeskFeature = useRecoilValue(printHouseHasFrontDeskFeature);
  const selectedAccountId = useRecoilValue(chatwootSelectedAccountAtom);
  const setSelectedAccountId = useSetRecoilState(chatwootSelectedAccountAtom);
  const currentUser = useRecoilValue(chatwootProfileAtom);
  const { profile: profileUser, fetchProfile } = useChatwootProfile();
  const { inboxes } = useChatwootInboxes();

  // Helper function to send email programmatically without opening modal
  const sendEmailProgrammatically = useCallback(
    async (
      boardMissionId: string | number,
      contactEmail?: string,
      contactPhone?: string,
      contactName?: string,
      customerId?: string | number,
      customerName?: string
    ): Promise<boolean> => {
      if (!hasFrontDeskFeature) {
        console.log("[sendEmailProgrammatically] FrontDesk feature not enabled, skipping email send");
        return false;
      }

      try {
        // Get email data from API
        let emailData: any = null;
        await new Promise<void>((resolve) => {
          getDocumentMailDataApi(
            callApi,
            (res) => {
              if (res?.success && res?.data) {
                emailData = res.data;
                console.log("[sendEmailProgrammatically] Email data received:", {
                  tos: emailData.tos,
                  subject: emailData.subject,
                  hasBody: !!emailData.body,
                  hasAttachments: !!emailData.attachments,
                });
              } else {
                console.error("[sendEmailProgrammatically] API response error:", res);
              }
              resolve();
            },
            {
              documentType: DOCUMENT_TYPE.boardMission,
              document: {
                boardMissionId,
                ...(contactEmail && { contactEmail }),
                ...(contactPhone && { contactPhone }),
                messageType: 0,
                sendMailIfNotVerifiedAgent: true,
                sendWithInvoices: false,
                ...(customerId && { customerId }),
                ...(customerName && { customerName }),
                ...(contactName && { contactName }),
              },
            }
          );
        });

        if (!emailData) {
          console.error("[sendEmailProgrammatically] Failed to load email data - emailData is null");
          return false;
        }

        console.log("[sendEmailProgrammatically] Processing email data:", emailData);

        // Resolve account ID
        const extractAccountId = (profile: any) => {
          if (!profile) return null;
          return (
            profile.account_id ||
            profile.accountId ||
            (profile.meta && (profile.meta.account_id || profile.meta.accountId)) ||
            null
          );
        };

        let resolvedAccountId =
          typeof selectedAccountId === "number" ? selectedAccountId : null;
        if (!resolvedAccountId) {
          resolvedAccountId =
            extractAccountId(currentUser) ?? extractAccountId(profileUser);
        }
        if (!resolvedAccountId) {
          const refreshedProfile = await fetchProfile();
          resolvedAccountId = extractAccountId(refreshedProfile);
        }
        if (resolvedAccountId) {
          setSelectedAccountId(resolvedAccountId);
        }

        if (!resolvedAccountId) {
          console.error("[sendEmailProgrammatically] Unable to resolve Chatwoot account");
          return false;
        }

        const accountId = Number(resolvedAccountId);
        if (Number.isNaN(accountId)) {
          console.error("[sendEmailProgrammatically] Resolved account ID is not a number");
          return false;
        }

        // Get sender inbox
        const emailInboxes = inboxes?.filter(
          (inbox) => inbox.channel_type === ChannelType.EMAIL
        ) || [];
        if (emailInboxes.length === 0) {
          console.error("[sendEmailProgrammatically] No email inboxes found");
          return false;
        }
        const senderInbox = emailInboxes[0];

        // Prepare email data from API response
        const toEmails = Array.isArray(emailData.tos)
          ? emailData.tos.filter((email: string) => email && email.trim())
          : emailData.tos && typeof emailData.tos === "string"
            ? [emailData.tos.trim()].filter(Boolean)
            : [];

        const ccEmails = emailData.cc === null || emailData.cc === undefined
          ? []
          : Array.isArray(emailData.cc)
            ? emailData.cc.filter((email: string) => email && email.trim())
            : typeof emailData.cc === "string"
              ? [emailData.cc.trim()].filter(Boolean)
              : [];

        const bccEmails = emailData.bcc === null || emailData.bcc === undefined
          ? []
          : Array.isArray(emailData.bcc)
            ? emailData.bcc.filter((email: string) => email && email.trim())
            : typeof emailData.bcc === "string"
              ? [emailData.bcc.trim()].filter(Boolean)
              : [];
        const messageContent = emailData.body || emailData.html || emailData.text || "";
        const subject = emailData.subject || "";

        console.log("[sendEmailProgrammatically] Prepared email data:", {
          toEmails,
          ccEmails,
          bccEmails,
          subject,
          messageLength: messageContent.length,
        });

        if (toEmails.length === 0) {
          console.error("[sendEmailProgrammatically] No recipients found in tos array");
          return false;
        }

        // Convert attachments
        const mapToAttachmentSource = (attachment: EmailAttachment): AttachmentSource => ({
          content: attachment.content,
          data: attachment.data,
          url: attachment.url,
          filename: attachment.filename,
          mimeType: attachment.mimeType,
          contentType: attachment.contentType,
          size: attachment.size,
        });

        const normalizedAttachments =
          Array.isArray(emailData.attachments)
            ? emailData.attachments.map((attachment: EmailAttachment) => {
              let filename = attachment.filename || "document";
              const extension = getFileExtension(attachment.url || "", null);
              if (extension && !filename.includes(".")) {
                filename = `${filename}.${extension}`;
              }
              const mimeType =
                attachment.mimeType ||
                attachment.contentType ||
                (extension ? getMimeTypeFromExtension(extension) : "application/octet-stream");
              return {
                id: attachment.id,
                filename,
                mimeType,
                contentType: mimeType,
                size: attachment.size,
                url: attachment.url,
                content: attachment.content ?? attachment.data,
              };
            })
            : [];

        const attachmentSources = normalizedAttachments.map(mapToAttachmentSource);
        const attachments = await convertAttachmentsToFiles(attachmentSources);

        // Send email to each recipient via Chatwoot
        console.log(`[sendEmailProgrammatically] Sending email to ${toEmails.length} recipient(s)`);
        const results = await Promise.allSettled(
          toEmails.map(async (recipientEmail: string) => {
            try {
              console.log(`[sendEmailProgrammatically] Processing recipient: ${recipientEmail}`);
              const contactNameForEmail =
                contactName || getCapitalizedNameFromEmail(recipientEmail);
              const contactPayload: ContactCreatePayload = {
                name: contactNameForEmail,
                email: recipientEmail,
              };

              const contact = await contactResolutionService.findOrCreateContact(
                accountId,
                contactPayload
              );

              if (!contact?.id) {
                throw new Error(`Failed to find or create contact for ${recipientEmail}`);
              }

              console.log(`[sendEmailProgrammatically] Contact created/found: ${contact.id} for ${recipientEmail}`);

              const conversationId = await conversationComposerService.composeAndCreate(
                accountId,
                {
                  inboxId: senderInbox.id,
                  contactId: contact.id,
                  sourceId: recipientEmail,
                  message: messageContent,
                  subject: subject,
                  ccEmails,
                  bccEmails,
                  toEmails: [recipientEmail],
                  attachments,
                  channelType: ChannelType.EMAIL,
                  additionalAttributes: {
                    gomake_document: {
                      id: boardMissionId,
                      type: DOCUMENT_TYPE.boardMission,
                    },
                  },
                }
              );

              if (!conversationId) {
                throw new Error(`Failed to create conversation for ${recipientEmail}`);
              }

              console.log(`[sendEmailProgrammatically] Email sent successfully to ${recipientEmail}, conversationId: ${conversationId}`);
              return { recipientEmail, success: true, conversationId };
            } catch (error) {
              console.error(`[sendEmailProgrammatically] Error sending email to ${recipientEmail}:`, error);
              return { recipientEmail, success: false, error: error instanceof Error ? error.message : String(error) };
            }
          })
        );

        const successfulSends = results.filter(
          (result) => result.status === "fulfilled" && result.value.success
        );
        const failedSends = results.filter(
          (result) => result.status === "rejected" || (result.status === "fulfilled" && !result.value.success)
        );

        console.log(`[sendEmailProgrammatically] Email sending results: ${successfulSends.length} successful, ${failedSends.length} failed`);
        if (failedSends.length > 0) {
          console.error("[sendEmailProgrammatically] Failed sends:", failedSends);
        }

        return successfulSends.length > 0;
      } catch (error) {
        console.error("[sendEmailProgrammatically] Error sending email programmatically:", error);
        return false;
      }
    },
    [
      callApi,
      hasFrontDeskFeature,
      selectedAccountId,
      setSelectedAccountId,
      currentUser,
      profileUser,
      fetchProfile,
      inboxes,
    ]
  );

  const [chooseMachine, setChooseMachine] = useState<boolean>(false);
  const [chooseEmployee, setChooseEmployee] = useState<boolean>(false);
  const {
    employeesList,
    machinesList,
    onClickGetEmployeeForAction,
    onClickGetMachineForAction,
  } = useBoardMissionsUpdatedOutputs();
  const { CheckPermission } = useUserPermission();

  const inputsParameters = outputs.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.PARAMETER &&
      parameter?.htmlElementType === HtmlElementType.TEXT
  );
  const outputsParameters = outputs.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.OUTPUT &&
      parameter?.htmlElementType === HtmlElementType.TEXT
  );
  const textAreaOutputs = outputs?.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.OUTPUT &&
      parameter?.htmlElementType === HtmlElementType.TEXT_AREA
  );
  const tableOutputs = outputs?.filter(
    (parameter) =>
      parameter &&
      parameter?.propertyType === RuleType.OUTPUT &&
      parameter?.htmlElementType === HtmlElementType.TABLE
  );

  const onClickBackToProcess = async (
    boardMissionsActionId: string,
    productType: string
  ) => {
    setLoading(true);
    const callBack = (res) => {
      setLoading(false);

      if (res.success) {
        const currentActionId = res.data.currentStationId;
        setStations(
          stations.map((station) => {
            if (station.boardMissionActionId == boardMissionActionId) {
              return { ...station, isDone: false };
            }
            return { ...station };
          })
        );
        setBoardMissions({
          ...boardMissions,
          currentStation: {
            ...boardMissions.currentStation,
            boardMissionActionTimer: {
              ...boardMissions.currentStation?.boardMissionActionTimer,
              isTimerRunning: false,
              totalRunningTime: 0,
            },
          },
          currentBoardMissionActionId: currentActionId,
        });

        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };
    await cancelBoardMissionsActionDone(callApi, callBack, {
      boardMissionsActionId: boardMissionsActionId,
      productType: productType,
    });
  };

  const [open, setOpen] = useState<boolean>(false);
  const [contactsFilter, setContactsFilter] = useState<string>("");
  const [openMachine, setOpenMachine] = useState<boolean>(false);

  const onClickBoardMissionsUpdateActionEmployee = async (
    boardMissionActionId: string,
    employeeId: string,
    employeeName: string
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getStations();
      } else {
        alertFaultUpdate();
      }
    };
    await boardMissionsUpdateActionEmployee(callApi, callBack, {
      boardMissionActionId,
      employeeId,
      employeeName,
    });
  };

  const onClickBoardMissionsUpdateActionMachine = async (
    boardMissionActionId: string,
    machineId: string,
    machineName: string
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessUpdate();
        getStations();
      } else {
        alertFaultUpdate();
      }
    };
    await boardMissionsUpdateActionMachine(callApi, callBack, {
      boardMissionActionId,
      machineId,
      machineName: machineName,
      workFlowActionId: id,
    });
  };

  const onContactsInputChange = (e) => {
    setOpen(true);
    setContactsFilter(e.target.value);
  };

  const onMachinesInputChange = (e) => {
    setOpenMachine(true);
  };

  const onMachineClick = (value: any, label: any) => {
    setOpenMachine(false);
    setChooseMachine(false);
    onClickBoardMissionsUpdateActionMachine(
      boardMissionActionId,
      value?.value,
      label
    );
  };

  const onContactClick = (value: any, label: any) => {
    setContactsFilter(value.label);
    setOpen(false);
    setChooseEmployee(false);
    onClickBoardMissionsUpdateActionEmployee(
      boardMissionActionId,
      value?.value,
      label
    );
  };

  const [isReadyModal, setIsReadyModal] = useState<boolean>(false);
  const setState = useSetRecoilState<any>(boardMissionMaterialState);
  const [openMaterialsModal, setOpenMaterialsModal] =
    useRecoilState<any>(materialModalState);
  const [activeStation, setActiveStation] = useState(null);
  const handleOpenModal = (station) => {
    setActiveStation(station);
    setOpenMaterialsModal(true);
  };

  const handleCloseModal = () => {
    setOpenMaterialsModal(false);
    setActiveStation(null);
  };

  const onClickOpenDoneModal = (e) => {
    e.stopPropagation();
    if (isLastStation && isOrderCompleted) {
      setIsReadyModal(true);
    } else {
      setIsReadyModal(false);
    }
    getBoardMissionActionMaterials(boardMissionActionId).then();
  };

  const getBoardMissionActionMaterials = async (
    boardMissionsActionId: string
  ) => {
    const callBack = (res) => {
      setLoading(false);

      if (res.success) {
        setState(res.data);
        handleOpenModal(boardMissionsActionId);
      } else {
        alertFaultGetData();
      }
    };
    await getBoardMissionActionMaterialsApi(callApi, callBack, {
      boardMissionsActionId: boardMissionsActionId,
      productType: productType,
    });
  };

  // ===== Done scope selection (All jobs vs product type only) =====
  const [openDoneScopeModal, setOpenDoneScopeModal] = useState<boolean>(false);
  const [pendingDoneData, setPendingDoneData] = useState<{
    updatedState: any;
    sendMSg?: boolean;
  } | null>(null);

  const performDoneWithMaterials = async (
    updatedStateArg: any,
    productTypeArg: string,
    sendMSgArg?: boolean
  ) => {
    setLoading(true);
    const callBack = async (res) => {
      setLoading(false);
      if (res.success) {
        setIsPrintNodeModalOpen(res.data.showPrintNodeModal);
        alertSuccessUpdate();

        // If sendMSgArg is true, send email programmatically without opening modal
        if (sendMSgArg && hasFrontDeskFeature) {
          try {
            const success = await sendEmailProgrammatically(
              boardMissions?.boardMissionId,
              boardMissions?.clientEmail,
              boardMissions?.clientPhone,
              boardMissions?.contactName,
              boardMissions?.clientId,
              boardMissions?.clientName
            );
            if (!success) {
              console.warn("[performDoneWithMaterials] Failed to send email programmatically, but action was completed");
            }
          } catch (error) {
            console.error("[performDoneWithMaterials] Error sending email programmatically:", error);
          }
        }

        const currentActionId = res?.data?.currentStationId;
        setStations(
          stations.map((station) => {
            if (station?.boardMissionActionId === boardMissionActionId) {
              return {
                ...station,
                isDone: true,
                boardMissionActionTimer: {
                  isTimerRunning: false,
                  totalRunningTime: Number(updatedStateArg.productionTime),
                },
              };
            }
            return {
              ...station,
            };
          })
        );
        setBoardMissions({
          ...boardMissions,
          currentStation: {
            ...boardMissions.currentStation,
            boardMissionActionTimer: {
              ...boardMissions.currentStation?.boardMissionActionTimer,
              isTimerRunning: false,
              totalRunningTime: 0,
            },
          },
          currentBoardMissionActionId: currentActionId,
        });
        if (isLastStation) {
          setOpenPackagingModal(true);
        }
      } else {
        alertFaultUpdate();
        setLoading(false);
      }
    };
    await updateBoardMissionsActionDoneWithMaterialsApi(callApi, callBack, {
      updatedState: updatedStateArg,
      productType: productTypeArg,
      isSendMessage: hasFrontDeskFeature ? false : sendMSgArg, // Always false - we handle email sending programmatically via FrontDesk
    });
  };

  const onClickDoneWithMaterials = async (
    updatedState: {
      currentStationId: string;
      boardMissionActionId: string;
      productionTime: string;
      materials: {
        ProductType: string;
        WorkFlowActionId: string;
        materialKey: string;
        currentValue: string;
      }[];
    },
    sendMSg?: boolean
  ) => {
    // If there is a product type, ask scope: all jobs vs product type only
    if (productType && isLastStation) {
      setPendingDoneData({ updatedState, sendMSg });
      setOpenDoneScopeModal(true);
      return;
    }

    // No product type → mark whole job
    await performDoneWithMaterials(updatedState, productType, sendMSg);
  };

  const [isHovered, setIsHovered] = useState(false);

  // Modify the modal close handler

  return (
    <>
      {isHaveSubACtions ? (
        <div>
          {/* General action header */}
          <Fade in={true} timeout={delay}>
            <Stack
              onClick={() => setIsOpen(!isOpen)}
              alignItems={"center"}
              direction={"row"}
              justifyContent={"space-between"}
              style={{
                ...classes.actionContainer,
                border: selected
                  ? classes.actionContainerBorder
                  : "1px solid #D0D5DD",
              }}
            >
              <Stack
                direction={"row"}
                gap={"10px"}
                alignItems={"center"}
                flexWrap={"wrap"}
              >
                <Stack
                  direction={"row"}
                  gap={"12px"}
                  flexWrap={"nowrap"}
                  minWidth={"fit-content"}
                >
                  <IconButton
                    onClick={() => setIsOpen(!isOpen)}
                    style={classes.toggleSubWorkFlowActionButton}
                  >
                    {isOpen ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                </Stack>
                <Stack
                  style={classes.sectionTitle}
                  direction={"row"}
                  alignItems={"center"}
                  gap={"10px"}
                >
                  <span
                    style={{ color: "#000", ...FONT_FAMILY.Inter(500, 14) }}
                  >
                    {actionName}
                  </span>
                </Stack>
                <Divider
                  orientation={"vertical"}
                  flexItem
                  style={{ background: "#000" }}
                />
                <span style={{ ...classes.detailValue, color: "#000" }}>
                  {DateFormatterShort(convertUtcToLocalIsoString(dueDate))}
                </span>
                {isDone && (
                  <>
                    <Divider
                      orientation={"vertical"}
                      flexItem
                      style={classes.dividerStyle}
                    />
                    <span style={classes.realTimeValue}>
                      {formatSecondsToHHMMSS(realProductionTime ?? 0)}
                    </span>
                  </>
                )}
                {source == EWorkSource.OUT && (
                  <Stack style={classes.sectionTitle}>
                    <span style={classes.outSourceLabel}>OS</span>
                  </Stack>
                )}
              </Stack>
              <Stack
                direction={"row"}
                gap={"12px"}
                flexWrap={"nowrap"}
                minWidth={"fit-content"}
              >
                <PermissionCheck
                  userPermission={
                    Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
                  }
                >
                  {isEditable && (
                    <div>
                      {loading ? (
                        <CircularProgress size={isMobile ? 20 : 30} />
                      ) : isDone ? (
                        <PrimaryButton
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClickBackToProcess(
                              boardMissionActionId,
                              productType
                            ).then();
                          }}
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          sx={{
                            padding: "5px 12px",
                            ...FONT_FAMILY.Inter(600, isMobile ? 12 : 14),
                            borderRadius: "8px",
                            textTransform: "capitalize",
                            transition: "all 0.2s ease-in-out",
                            minWidth: "100px",
                            "&:hover": {
                              backgroundColor: "#f9fafb",
                              color: grayColor(300),
                              border: `1px solid ${grayColor(300)}`,
                              boxShadow: `0 0 0 0.25px ${grayColor(300)}`,
                            },
                          }}
                        >
                          {isHovered
                            ? t("boardMissions.reopen")
                            : t("boardMissions.completed")}
                        </PrimaryButton>
                      ) : (
                        <PrimaryButton
                          variant={"outlined"}
                          sx={{
                            height: isMobile ? "25px" : "30px",
                            width: isMobile ? "25px" : "30px",
                            minWidth: isMobile ? "25px" : "30px",
                            padding: 0,
                            borderRadius: "8px",
                            color: grayColor(300),
                            border: `1px solid ${grayColor(300)}`,
                            boxShadow: `0 0 0 0.25px ${grayColor(300)}`,
                            "&:hover": {
                              backgroundColor: primaryColor(500),
                              color: "#fff",
                              border: "none",
                            },
                          }}
                          onClick={onClickOpenDoneModal}
                        >
                          <CheckIcon
                            sx={isMobile ? { fontSize: "16px" } : undefined}
                          />
                        </PrimaryButton>
                      )}
                    </div>
                  )}
                </PermissionCheck>
              </Stack>
            </Stack>
          </Fade>
          {/* Collapse subActions */}
          <Collapse in={isOpen} collapsedSize={0} orientation={"vertical"}>
            <Stack padding={"10px 0"} gap={"10px"}>
              {subActions?.map((subAction, i) => (
                <Stack
                  key={subAction?.boardMissionActionId}
                  direction={"row"}
                  alignItems={"center"}
                  position={"relative"}
                  padding={"0 5px"}
                >
                  {/* Divider between actions */}
                  {i + 1 < subActions?.length ? (
                    <Divider
                      orientation={"vertical"}
                      style={{
                        width: "2px",
                        backgroundColor: "#667085",
                        margin: i === 0 ? "-10px 0 -10px 0" : "-10px 0",
                      }}
                      flexItem
                    />
                  ) : (
                    <Divider
                      style={classes.subWorkFlowDividerVertical}
                      absolute
                      orientation={"vertical"}
                    />
                  )}

                  <Divider
                    orientation={"horizontal"}
                    style={{
                      width: "30px",
                      height: "2px",
                      backgroundColor: "#667085",
                    }}
                  />
                  {/* Sub Action Item */}
                  <BoardMissionsStationActionItem
                    delay={i * 300}
                    selected={subAction.boardMissionActionId}
                    isHaveSubACtions={!!subAction.subActions}
                    subActions={subAction.subActions}
                    isHideTimeAndDate={true}
                    isSubAction={true}
                    {...subAction}
                  />
                </Stack>
              ))}
            </Stack>
          </Collapse>
        </div>
      ) : (
        <Fade
          in={true}
          timeout={delay}
          style={{
            width: "100%",
            position: "relative",
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"baseline"}
            justifyContent={"space-between"}
            onClick={() => setIsOpen(isHideTimeAndDate ? isOpen : !isOpen)}
            style={{
              ...classes.actionContainer,
              backgroundColor: isDone ? "#EAECF0" : "#F9FAFB",
              border: selected
                ? classes.actionContainerBorder
                : "1px solid var(--Colors-Border-border-primary, #D0D5DD)",
            }}
          >
            <Stack style={{ width: "100%" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
                width={"100%"}
              >
                <Stack
                  direction={"row"}
                  gap={isMobile ? "8px" : "16px"}
                  alignItems={"center"}
                  width="90%"
                  flexWrap={"wrap"}
                >
                  <Stack
                    style={classes.sectionTitle}
                    direction={"row"}
                    alignItems={"center"}
                    gap={"10px"}
                  >
                    <span
                      style={{ ...FONT_FAMILY.Inter(500, isMobile ? 13 : 14) }}
                    >
                      {actionName}
                    </span>
                    {source === EWorkSource.OUT && supplierId ? (
                      <span style={classes.supplierTitle}>
                        {getSupplierId()}
                      </span>
                    ) : (
                      isNeedMachine &&
                      source != EWorkSource.OUT && (
                        <>
                          {!chooseMachine ? (
                            <Button
                              dir={dir}
                              disabled={isDone}
                              endIcon={!isDone && <KeyboardArrowDownIcon />}
                              onClick={(e) => {
                                if (
                                  CheckPermission(
                                    Permissions.IS_CAN_UPDATE_MACHINE_IN_PRODUCTION_FLOOR
                                  ) &&
                                  isEditable
                                ) {
                                  e.stopPropagation();
                                  setChooseMachine(true);
                                  onClickGetMachineForAction(actionId);
                                }
                              }}
                              variant={"text"}
                              sx={classes.machineTitle}
                            >
                              {machineName != null ? (
                                <>
                                  {machineName?.length > 20
                                    ? machineName.slice(0, 20) + "..."
                                    : machineName}
                                </>
                              ) : (
                                <>{t("boardMissions.selectNewMachine")}</>
                              )}
                            </Button>
                          ) : (
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div style={{ position: "relative" }}>
                                <GomakeTextInput
                                  placeholder={t(
                                    "materials.inputs.selectMachine"
                                  )}
                                  style={{
                                    height: "40px",
                                    marginBottom: "3px",
                                  }}
                                  value={contactsFilter}
                                  onChange={onMachinesInputChange}
                                  onClick={() => setOpenMachine(!openMachine)}
                                />
                                {!!openMachine && (
                                  <ClickOutside
                                    onClick={() => setOpenMachine(false)}
                                  >
                                    <Paper sx={classes.paperStyle}>
                                      {machinesList?.map((value, index) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            onClick={() =>
                                              onMachineClick(value, value.label)
                                            }
                                            sx={{
                                              ...FONT_FAMILY.Inter(
                                                500,
                                                isMobile ? 14 : 16
                                              ),
                                            }}
                                          >
                                            {value.label?.slice(
                                              0,
                                              isMobile ? 16 : 18
                                            ) + "..."}
                                          </MenuItem>
                                        );
                                      })}
                                    </Paper>
                                  </ClickOutside>
                                )}
                              </div>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setChooseMachine(false);
                                }}
                                sx={{
                                  fontSize: isMobile ? "16px" : "24px",
                                }}
                              >
                                <ClearRoundedIcon
                                  sx={{
                                    fontSize: isMobile ? "18px" : "20px",
                                  }}
                                />
                              </IconButton>
                            </Stack>
                          )}
                        </>
                      )
                    )}
                    {isNeedEmployee && source != EWorkSource.OUT && (
                      <>
                        {!chooseEmployee ? (
                          <Button
                            dir={dir}
                            disabled={isDone}
                            endIcon={!isDone && <KeyboardArrowDownIcon />}
                            onClick={(e) => {
                              if (
                                CheckPermission(
                                  Permissions.IS_CAN_UPDATE_MACHINE_IN_PRODUCTION_FLOOR
                                ) &&
                                isEditable
                              ) {
                                e.stopPropagation();
                                setChooseEmployee(true);
                                onClickGetEmployeeForAction(actionId);
                              }
                            }}
                            variant={"text"}
                            sx={classes.machineTitle}
                          >
                            {employeeName ? (
                              employeeName
                            ) : (
                              <>{t("boardMissions.selectNewEmployee")}</>
                            )}
                          </Button>
                        ) : (
                          <Stack
                            direction={"row"}
                            gap={"5px"}
                            alignItems={"center"}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div style={{ position: "relative" }}>
                              <GomakeTextInput
                                placeholder={t(
                                  "products.profits.exceptions.selectEmployee"
                                )}
                                style={{
                                  height: "40px",
                                  marginBottom: "3px",
                                }}
                                value={contactsFilter}
                                onChange={onContactsInputChange}
                                onClick={() => setOpen(!open)}
                              />
                              {!!open && (
                                <ClickOutside onClick={() => setOpen(false)}>
                                  <Paper sx={classes.paperStyle}>
                                    {employeesList?.map((value, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          onClick={() =>
                                            onContactClick(value, value.label)
                                          }
                                          sx={{
                                            ...FONT_FAMILY.Inter(
                                              500,
                                              isMobile ? 14 : 16
                                            ),
                                          }}
                                        >
                                          {value.label}
                                        </MenuItem>
                                      );
                                    })}
                                  </Paper>
                                </ClickOutside>
                              )}
                            </div>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setChooseEmployee(false);
                              }}
                            >
                              <ClearRoundedIcon />
                            </IconButton>
                          </Stack>
                        )}
                      </>
                    )}
                  </Stack>
                  {!isHideTimeAndDate && (
                    <>
                      <Divider
                        orientation={"vertical"}
                        flexItem
                        style={{
                          height: "20px",
                          alignSelf: "center",
                          color: "#D6D6D6",
                        }}
                      />
                      <Stack
                        direction={"row"}
                        gap={"5px"}
                        alignItems={"center"}
                      >
                        <span style={classes.detailValue}>
                          {DateFormatterShort(
                            convertUtcToLocalIsoString(dueDate)
                          )}
                        </span>
                      </Stack>
                      {isDone && (
                        <>
                          <Divider
                            orientation={"vertical"}
                            flexItem
                            style={classes.dividerStyle}
                          />
                          <span style={classes.realTimeValue}>
                            {formatSecondsToHHMMSS(realProductionTime ?? 0)}
                          </span>
                        </>
                      )}
                      {source == EWorkSource.OUT && (
                        <Stack style={classes.sectionTitle}>
                          <span style={classes.outSourceLabel}>OS</span>
                        </Stack>
                      )}
                    </>
                  )}
                  {storage && (
                    <span style={classes.sectionTitle}>
                      {t("boardMissions.storage")}: {storage}
                    </span>
                  )}
                </Stack>
                {/* Completed and Check */}
                <PermissionCheck
                  userPermission={
                    Permissions.EDIT_BOARD_MISSION_IN_PRODUCTION_FLOOR
                  }
                >
                  {isEditable && !isHideTimeAndDate && (
                    <div>
                      {loading ? (
                        <CircularProgress size={isMobile ? 20 : 30} />
                      ) : isDone ? (
                        <PrimaryButton
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClickBackToProcess(
                              boardMissionActionId,
                              productType
                            ).then();
                          }}
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          sx={{
                            padding: "5px 12px",
                            ...FONT_FAMILY.Inter(600, isMobile ? 12 : 14),
                            borderRadius: "8px",
                            textTransform: "capitalize",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              backgroundColor: "#f9fafb",
                              color: grayColor(300),
                              border: `1px solid ${grayColor(300)}`,
                              boxShadow: `0 0 0 0.25px ${grayColor(300)}`,
                            },
                            minWidth: "100px",
                          }}
                        >
                          {isHovered
                            ? t("boardMissions.reopen")
                            : t("boardMissions.completed")}
                        </PrimaryButton>
                      ) : (
                        <PrimaryButton
                          variant={"outlined"}
                          sx={{
                            height: isMobile ? "25px" : "30px",
                            width: isMobile ? "25px" : "30px",
                            minWidth: isMobile ? "25px" : "30px",
                            padding: 0,
                            borderRadius: "8px",
                            color: grayColor(300),
                            border: `1px solid ${grayColor(300)}`,
                            boxShadow: `0 0 0 0.25px ${grayColor(300)}`,
                            "&:hover": {
                              backgroundColor: primaryColor(500),
                              color: "#fff",
                              border: "none",
                            },
                          }}
                          onClick={onClickOpenDoneModal}
                        >
                          <CheckIcon
                            sx={isMobile ? { fontSize: "16px" } : undefined}
                          />
                        </PrimaryButton>
                      )}
                    </div>
                  )}
                </PermissionCheck>
              </Stack>
              <Collapse
                in={isSubAction ? true : isOpen}
                collapsedSize={0}
                orientation={"vertical"}
                onClick={(e) => e.stopPropagation()}
              >
                {inputsParameters.length > 0 && (
                  <>
                    <Divider />
                    <Stack
                      padding={"10px 0"}
                      direction={"row"}
                      gap={isMobile ? "8px" : "16px"}
                      flexWrap={"wrap"}
                    >
                      <ParametersMapping
                        parameters={inputsParameters}
                        isProductionFloor={true}
                      />
                    </Stack>
                  </>
                )}
                {outputsParameters.length > 0 &&
                  source === EWorkSource.INTERNAL && (
                    <>
                      <Divider />
                      <Stack
                        padding={"10px 0"}
                        direction={"row"}
                        gap={isMobile ? "8px" : "16px"}
                        flexWrap={"wrap"}
                      >
                        <ParametersMapping
                          source={source}
                          parameters={outputsParameters}
                          isProductionFloor={true}
                        />
                        <TextAreaActionsMapping
                          parameters={textAreaOutputs}
                          actionId={id}
                          orderItemId={boardMissions?.orderItemId}
                          productType={boardMissions.productType}
                        />
                        {tableOutputs?.map((parameter) => (
                          <TableOutPutComponent {...parameter} />
                        ))}
                      </Stack>
                    </>
                  )}
              </Collapse>
            </Stack>
          </Stack>
        </Fade>
      )}
      {activeStation && (
        <MaterialsAndProductionTimeModalWidget
          openModal={openMaterialsModal}
          onClose={handleCloseModal}
          onUpdate={onClickDoneWithMaterials}
          showIsReady={isReadyModal}
        />
      )}
      {/* Select Done Scope Modal */}
      <ThreeOptionsModal
        modalType={ModalType.WARNING}
        title={"Select Jobs to Mark as Ready"}
        subTitle={
          productType
            ? `Would you like to mark all jobs as ready or only ${productType} jobs?`
            : ""
        }
        yesBtn={"Mark All Jobs Ready"}
        noBtn={productType ? `Mark ${productType} Only` : ""}
        openModal={openDoneScopeModal}
        onClose={() => {
          setOpenDoneScopeModal(false);
          setPendingDoneData(null);
        }}
        onClickYes={() => {
          if (pendingDoneData) {
            performDoneWithMaterials(
              pendingDoneData.updatedState,
              "",
              pendingDoneData.sendMSg
            );
          }
        }}
        onClickNo={() => {
          if (pendingDoneData) {
            performDoneWithMaterials(
              pendingDoneData.updatedState,
              productType,
              pendingDoneData.sendMSg
            );
          }
        }}
      />
    </>
  );
};

export { BoardMissionsStationActionItem };
