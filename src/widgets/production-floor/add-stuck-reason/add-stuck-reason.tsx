import { GomakeTextInput } from "@/components/text-input/text-input";
import { useAddStuckReason } from "./use-add-stuck-reason";
import { useTranslation } from "react-i18next";
const AddStuckReasonWidget = ({ stuckReason, setStuckReason }) => {
    const { selectedReason, setSelectedReason, predefinedReasons, t } = useAddStuckReason();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: "center", flexWrap: 'wrap', gap: '12px' }}>
                {predefinedReasons.map((reason) => (
                    <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                            type="radio"
                            name="stuckReason"
                            value={reason}
                            checked={selectedReason === reason}
                            onChange={(e) => {
                                setSelectedReason(e.target.value);
                                setStuckReason(e.target.value);
                            }}
                        />
                        {reason}
                    </label>
                ))}
            </div>
            <GomakeTextInput
                placeholder={t("sales.quote.stuckReason")}
                value={stuckReason}
                onChange={(e) => {
                    setStuckReason(e.target.value);
                    if (e.target.value !== selectedReason) {
                        setSelectedReason("Other");
                    }
                }}
                style={{ height: 40, width: "100%", minWidth: "300px" }}
            />
        </div>
    );
}

export { AddStuckReasonWidget }