import { IOutput, IRectangle } from "@/widgets/product-pricing-widget/interface";
import { useRef, useState } from "react";
import { GoMakeModal } from "@/components";
import { PrimaryButton } from "@/components/button/primary-button";
import { IconButton, Stack } from "@mui/material";
import html2canvas from "html2canvas";
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { useWindowSize } from "@uidotdev/usehooks";

const PrintImageComponent = ({ materialLength, materialWidth, rectangles, name }: IOutput) => {
    const [open, setOpen] = useState<boolean>(false);
    const imageElement = useRef(null);
    const size = useWindowSize();
    const modalWidthFactor = 0.7;
    const modalHeightFactor = 0.9;
    const convertRange = (value, x0, x1, y0, y1) => {
        return y0 + (y1 - y0) * (value - x0) / (x1 - x0);
    }
    const handleDownloadClick = () => {
        const element = imageElement?.current;
        if (element) {
            html2canvas(element).then(canvas => {
                const dataUrl = canvas.toDataURL('image/png');

                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = name + '.png';
                link.click();
            });
        }
    };
    const resizer = (number) => {
        let max = materialWidth > materialLength ? materialWidth / 1000 : materialLength / 1000;
        let divider = 1000;
        let newNumber = (number / divider);
        // newNumber = convertRange(newNumber,0,materialWidth,0,size.width*modalWidthFactor);
        return newNumber;
    }
    const resizerHeight = (number) => {
        let max = materialWidth > materialLength ? materialWidth / 1000 : materialLength / 1000;
        let divider = 1000;
        let newNumber = (number / divider);
        //newNumber = convertRange(newNumber,0,materialLength,0,size.height*modalHeightFactor);
        return newNumber;
    }
    return (
        <div>
            <PrimaryButton variant={'contained'} style={{ fontSize: '15px', padding: '5px 15px' }} onClick={() => setOpen(true)}>{name}</PrimaryButton>
            <GoMakeModal openModal={open} onClose={() => setOpen(false)}
                modalTitle={name}
                insideStyle={{ width: size.width * modalWidthFactor, height: size.height * modalHeightFactor }}>
                <Stack>
                    <IconButton style={{ alignSelf: 'end' }} onClick={handleDownloadClick}>
                        <DownloadRoundedIcon />
                    </IconButton>
                    <Stack justifyContent={'center'} alignItems={'center'}>
                        <div ref={imageElement} style={{
                            width: `100%`,
                            height: `100%`,
                            border: '1px solid black',
                            position: 'relative'
                        }}>
                            {
                                rectangles?.map(({ x, y, width, length }: IRectangle) => {
                                    const newWidth = resizer(width);
                                    const newHeight = resizerHeight(length);
                                    const newX = resizer(x);
                                    const newY = resizerHeight(y);
                                    return (
                                        <div style={{
                                            position: 'absolute',
                                            left: newX,
                                            top: newY,
                                            width: newWidth,
                                            height: newHeight,
                                            backgroundColor: 'black',
                                        }} />
                                    )
                                })
                            }
                        </div>
                    </Stack>
                </Stack>
            </GoMakeModal>
        </div>
    );
}
export { PrintImageComponent }