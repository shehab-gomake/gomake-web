import { memo, useCallback, useEffect, useRef } from "react";
import { TextField, CircularProgress } from "@mui/material";
import { useDebounce } from "@/utils/use-debounce";

// Note Input Component with Debouncing - moved outside to prevent recreation on each render
export const NoteInput = memo(({ fileId, value, onChange, onSave, isUpdating, disabled, placeholder, label }: {
  fileId: string;
  value: string;
  onChange: (value: string) => void;
  onSave: (note: string) => void;
  isUpdating: boolean;
  disabled: boolean;
  placeholder: string;
  label: string;
}) => {
  const debouncedNote = useDebounce(value, 1000); // 1 second debounce
  const previousSavedValueRef = useRef<string>(value);
  const onSaveRef = useRef(onSave);
  const isInitialMountRef = useRef(true);

  // Keep refs updated
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Initialize previousSavedValueRef only on mount
  useEffect(() => {
    if (isInitialMountRef.current) {
      previousSavedValueRef.current = value;
      isInitialMountRef.current = false;
    }
  }, []); // Only run on mount

  // Debounced save
  useEffect(() => {
    // Only save if the debounced value has actually changed from the previously saved value
    if (debouncedNote !== previousSavedValueRef.current && !isInitialMountRef.current) {
      previousSavedValueRef.current = debouncedNote;
      onSaveRef.current(debouncedNote);
    }
  }, [debouncedNote, fileId]); // Removed onSave from dependencies

  // Handle blur - save immediately when focus is lost
  const handleBlur = useCallback(() => {
    // Always save on blur if value has changed, regardless of debounce
    const currentValue = value;
    // Compare with the last saved value - if different, save immediately
    if (currentValue !== previousSavedValueRef.current) {
      // Update ref before saving to prevent duplicate saves
      previousSavedValueRef.current = currentValue;
      // Save immediately
      onSaveRef.current(currentValue);
    }
  }, [value]);

  return (
    <TextField
      label={label}
      multiline
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={handleBlur}
      disabled={disabled}
      fullWidth
      placeholder={placeholder}
      InputProps={{
        endAdornment: isUpdating ? (
          <CircularProgress size={20} sx={{ marginRight: 1 }} />
        ) : null,
      }}
    />
  );
});

NoteInput.displayName = "NoteInput";
