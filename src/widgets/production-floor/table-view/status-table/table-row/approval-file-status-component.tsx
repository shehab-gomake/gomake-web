import {EFileStatus} from "@/widgets/messenger/enums";
import {Stack} from "@mui/material";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useCallback} from "react";

interface IProps {
    fileStatus: EFileStatus;
}

const ApprovalFileStatusComponent = ({fileStatus}: IProps) => {
    const {primaryColor, secondColor, theme} = useGomakeTheme();
    const getColor = useCallback(() => {
        switch (fileStatus) {
            case EFileStatus.PENDING:
                return primaryColor(400);
            case EFileStatus.REJECTED:
                return secondColor(400);
            case EFileStatus.APPROVED:
                return '#504FA1'
        }
    }, [theme, fileStatus]);
    return <Stack width={'18px'} height={'15px'} alignItems={'center'} justifyContent={'center'} borderRadius={'11px'}
                  border={'1px solid' + getColor()}>
        <svg width="10" height="10" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="bell-01" clipPath="url(#clip0_912_2804)">
                <path id="Icon"
                      d="M2.73031 6.12492C2.93597 6.30644 3.20613 6.41659 3.50201 6.41659C3.79789 6.41659 4.06804 6.30644 4.27371 6.12492M5.25201 2.33325C5.25201 1.86912 5.06764 1.424 4.73945 1.09582C4.41126 0.767626 3.96614 0.583252 3.50201 0.583252C3.03788 0.583252 2.59276 0.767626 2.26457 1.09582C1.93638 1.424 1.75201 1.86912 1.75201 2.33325C1.75201 3.23456 1.52465 3.85166 1.27066 4.25983C1.05642 4.60413 0.949301 4.77628 0.953229 4.82431C0.957578 4.87748 0.968844 4.89776 1.01169 4.92955C1.05039 4.95825 1.22485 4.95825 1.57376 4.95825H5.43026C5.77917 4.95825 5.95363 4.95825 5.99233 4.92955C6.03518 4.89776 6.04644 4.87748 6.05079 4.82431C6.05472 4.77628 5.9476 4.60413 5.73336 4.25983C5.47937 3.85166 5.25201 3.23456 5.25201 2.33325Z"
                      stroke={getColor()} strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_912_2804">
                    <rect width="7" height="7" fill="white"/>
                </clipPath>
            </defs>
        </svg>

    </Stack>
}

export {ApprovalFileStatusComponent}