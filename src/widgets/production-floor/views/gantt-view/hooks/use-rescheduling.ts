import { useState, useCallback } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks/use-snack-bar";
import { rescheduleActionsApi } from "@/services/api-service/jobs-time-line/jobs-time-line-endpoints";
import {
  ILocalReschedulingChange,
  IReschedulingAction,
  IReschedulingRequest,
} from "@/interfaces";
import { ReschedulingType } from "@/enums";

export const useRescheduling = () => {
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const [localChanges, setLocalChanges] = useState<
    Map<string, ILocalReschedulingChange>
  >(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLocalChange = useCallback(
    (
      itemId: string,
      actionId: string,
      boardMissionId: string,
      changeType: "employee" | "machine" | "time" | "resource",
      newValue: string,
      originalValue?: string,
      reason?: string,
      newStartTime?: string,
      newEndTime?: string,
      originalStartTime?: string,
      originalEndTime?: string,
      productType?: string
    ) => {
      setLocalChanges((prev) => {
        // Use itemId as unique key since each job has a unique itemId
        const existingChange = prev.get(itemId);
        const newChange: ILocalReschedulingChange = {
          actionId,
          boardMissionId,
          originalEmployeeId: existingChange?.originalEmployeeId,
          originalMachineId: existingChange?.originalMachineId,
          originalStartTime: existingChange?.originalStartTime,
          originalEndTime: existingChange?.originalEndTime,
          newEmployeeId: existingChange?.newEmployeeId,
          newMachineId: existingChange?.newMachineId,
          newStartTime: existingChange?.newStartTime,
          newEndTime: existingChange?.newEndTime,
          type: existingChange?.type || ReschedulingType.ResourceChange,
          reason: reason || existingChange?.reason || "",
          isModified: true,
          productType: productType || existingChange?.productType,
        };

        // Set original values if not already set
        if (!existingChange) {
          if (changeType === "employee") {
            newChange.originalEmployeeId = originalValue;
          } else if (changeType === "machine") {
            newChange.originalMachineId = originalValue;
          } else if (changeType === "resource") {
            // For resource changes, we need to parse the group ID
            // The originalValue should be the full group ID (e.g., "category,resource")
            newChange.originalMachineId = originalValue; // Store the full group ID
          } else if (changeType === "time") {
            // For time changes, we need to handle start/end separately
            // This will be handled by the calling component
          }
        }

        // Update the specific change
        if (changeType === "employee") {
          newChange.newEmployeeId = newValue;
          newChange.type = ReschedulingType.ResourceChange;
          // Handle combined employee + time changes
          if (newStartTime) newChange.newStartTime = newStartTime;
          if (newEndTime) newChange.newEndTime = newEndTime;
          if (originalStartTime)
            newChange.originalStartTime = originalStartTime;
          if (originalEndTime) newChange.originalEndTime = originalEndTime;
        } else if (changeType === "machine") {
          newChange.newMachineId = newValue;
          newChange.type = ReschedulingType.ResourceChange;
          // Handle combined machine + time changes
          if (newStartTime) newChange.newStartTime = newStartTime;
          if (newEndTime) newChange.newEndTime = newEndTime;
          if (originalStartTime)
            newChange.originalStartTime = originalStartTime;
          if (originalEndTime) newChange.originalEndTime = originalEndTime;
        } else if (changeType === "resource") {
          // For resource changes, store the new group ID
          newChange.newMachineId = newValue; // Store the full new group ID
          newChange.type = ReschedulingType.ResourceChange;
          // Handle combined resource + time changes
          if (newStartTime) newChange.newStartTime = newStartTime;
          if (newEndTime) newChange.newEndTime = newEndTime;
          if (originalStartTime)
            newChange.originalStartTime = originalStartTime;
          if (originalEndTime) newChange.originalEndTime = originalEndTime;
        } else if (changeType === "time") {
          // Time changes will be handled by separate methods
          newChange.type = ReschedulingType.TimeSlotModification;
        }

        if (reason) {
          newChange.reason = reason;
        }

        const newMap = new Map(prev);
        newMap.set(itemId, newChange);
        return newMap;
      });
    },
    []
  );

  const updateTimeChange = useCallback(
    (
      itemId: string,
      actionId: string,
      boardMissionId: string,
      startTime?: string,
      endTime?: string,
      originalStartTime?: string,
      originalEndTime?: string,
      reason?: string,
      productType?: string
    ) => {
      setLocalChanges((prev) => {
        // Use itemId as unique key since each job has a unique itemId
        const existingChange = prev.get(itemId);
        const newChange: ILocalReschedulingChange = {
          actionId,
          boardMissionId,
          originalEmployeeId: existingChange?.originalEmployeeId,
          originalMachineId: existingChange?.originalMachineId,
          originalStartTime:
            originalStartTime || existingChange?.originalStartTime,
          originalEndTime: originalEndTime || existingChange?.originalEndTime,
          newEmployeeId: existingChange?.newEmployeeId,
          newMachineId: existingChange?.newMachineId,
          newStartTime: startTime || existingChange?.newStartTime,
          newEndTime: endTime || existingChange?.newEndTime,
          type: ReschedulingType.TimeSlotModification,
          reason: reason || existingChange?.reason || "",
          isModified: true,
          productType: productType || existingChange?.productType,
        };

        const newMap = new Map(prev);
        newMap.set(itemId, newChange);
        return newMap;
      });
    },
    []
  );

  const removeLocalChange = useCallback((itemId: string) => {
    setLocalChanges((prev) => {
      const newMap = new Map(prev);
      newMap.delete(itemId);
      return newMap;
    });
  }, []);

  const clearAllLocalChanges = useCallback(() => {
    setLocalChanges(new Map());
  }, []);

  const getLocalChange = useCallback(
    (itemId: string): ILocalReschedulingChange | undefined => {
      return localChanges.get(itemId);
    },
    [localChanges]
  );

  const hasLocalChanges = useCallback((): boolean => {
    return localChanges.size > 0;
  }, [localChanges]);

  const getLocalChangesArray = useCallback((): ILocalReschedulingChange[] => {
    return Array.from(localChanges.values());
  }, [localChanges]);

  const submitRescheduleActions = useCallback(async (): Promise<boolean> => {
    if (!hasLocalChanges()) {
      alertFaultUpdate();
      return false;
    }

    setIsSubmitting(true);

    try {
      const changesArray = getLocalChangesArray();
      const rescheduleActions: IReschedulingAction[] = changesArray.map(
        (change) => {
          // For resource changes, we need to handle the group IDs properly
          let machineId = change.originalMachineId;
          let employeeId = change.originalEmployeeId;
          let newMachineId = change.newMachineId;
          let newEmployeeId = change.newEmployeeId;

          // Always parse group IDs to extract individual resource IDs
          // Parse original employee ID if it exists
          if (change.originalEmployeeId) {
            const originalEmployeeParts = change.originalEmployeeId.split(",");
            if (originalEmployeeParts.length >= 2) {
              employeeId = originalEmployeeParts[1].trim(); // Extract just the employee ID
            } else {
              employeeId = change.originalEmployeeId; // Fallback if not composite
            }
          }

          // Parse original machine ID if it exists
          if (change.originalMachineId) {
            const originalMachineParts = change.originalMachineId.split(",");
            if (originalMachineParts.length >= 2) {
              machineId = originalMachineParts[1].trim(); // Extract just the machine ID
            } else {
              machineId = change.originalMachineId; // Fallback if not composite
            }
          }

          // Parse new employee ID if it exists
          if (change.newEmployeeId) {
            const newEmployeeParts = change.newEmployeeId.split(",");
            if (newEmployeeParts.length >= 2) {
              newEmployeeId = newEmployeeParts[1].trim(); // Extract just the employee ID
            } else {
              newEmployeeId = change.newEmployeeId; // Fallback if not composite
            }
          }

          // Parse new machine ID if it exists
          if (change.newMachineId) {
            const newMachineParts = change.newMachineId.split(",");
            if (newMachineParts.length >= 2) {
              newMachineId = newMachineParts[1].trim(); // Extract just the machine ID
            } else {
              newMachineId = change.newMachineId; // Fallback if not composite
            }
          }

          const rescheduleAction: IReschedulingAction = {
            actionId: change.actionId,
            machineId: machineId,
            employeeId: employeeId,
            boardMissionId: change.boardMissionId,
            type: change.type,
            changes: {
              newEmployeeId: newEmployeeId,
              newMachineId: newMachineId,
              newStartTime: change.newStartTime,
              newEndTime: change.newEndTime,
            },
            reason: change.reason || "",
          };

          // Only include productType if it's not empty or null
          if (change.productType && change.productType.trim() !== "") {
            rescheduleAction.productType = change.productType;
          }

          return rescheduleAction;
        }
      );

      const request: IReschedulingRequest = {
        actions: rescheduleActions,
      };

      let success = false;
      await rescheduleActionsApi(
        callApi,
        (res) => {
          if (res.success) {
            alertSuccessUpdate();
            clearAllLocalChanges();
            success = true;
          } else {
            alertFaultUpdate();
            success = false;
          }
        },
        request
      );

      return success;
    } catch (error) {
      console.error("Error submitting reschedule actions:", error);
      alertFaultUpdate();
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    localChanges,
    hasLocalChanges,
    getLocalChangesArray,
    clearAllLocalChanges,
    callApi,
    alertSuccessUpdate,
    alertFaultUpdate,
  ]);

  return {
    localChanges,
    isSubmitting,
    addLocalChange,
    updateTimeChange,
    removeLocalChange,
    clearAllLocalChanges,
    getLocalChange,
    hasLocalChanges,
    getLocalChangesArray,
    submitRescheduleActions,
  };
};
