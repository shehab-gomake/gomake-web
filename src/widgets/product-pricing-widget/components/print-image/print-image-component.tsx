import {IOutput, IRectangle} from "@/widgets/product-pricing-widget/interface";
import {useRef, useState} from "react";
import {GoMakeModal} from "@/components";
import {PrimaryButton} from "@/components/button/primary-button";
import {IconButton, Stack} from "@mui/material";
import html2canvas from "html2canvas";
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

const PrintImageComponent = ({materialLength, materialWidth, rectangles, name}: IOutput) => {
    const [open, setOpen] = useState<boolean>(false);
    const imageElement = useRef(null);
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
    return (
        <div>
            <PrimaryButton variant={'contained'} style={{fontSize: '15px', padding: '5px 15px'}} onClick={() => setOpen(true)}>{name}</PrimaryButton>
            <GoMakeModal openModal={open} onClose={() => setOpen(false)}
                         modalTitle={name}
                         insideStyle={{width: `${(materialWidth/1000) + 100}px`, height: 'fit-content'}}>
                <Stack>
                    <IconButton style={{alignSelf: 'end'}} onClick={handleDownloadClick}>
                        <DownloadRoundedIcon/>
                    </IconButton>
                    <Stack  justifyContent={'center'} alignItems={'center'}>
                        <div ref={imageElement} style={{
                            width: `${materialWidth/1000}px`,
                            height: `${materialLength/1000}px`,
                            border: '1px solid black',
                            position: 'relative'
                        }}>
                            {
                                rectangles?.map(({x, y, width, length}: IRectangle) => <div style={{
                                    position: 'absolute',
                                    left: x/1000,
                                    top: y/1000,
                                    width: width/1000,
                                    height: length/1000,
                                    backgroundColor: 'black',
                                }}/>)
                            }
                        </div>
                    </Stack>
                </Stack>
            </GoMakeModal>
        </div>
    );
}
export {PrintImageComponent}