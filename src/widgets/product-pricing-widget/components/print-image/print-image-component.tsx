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
    const scaleX = (number)=>{
        return number / 1000;
    }
    const scaleY = (number)=>{
        return number / 1000;
    }
    console.log(materialWidth + "," + materialLength + "," + rectangles.length + "," + JSON.stringify(rectangles))
    return (
        <div>
            <PrimaryButton variant={'contained'} style={{fontSize: '15px', padding: '5px 15px'}} onClick={() => setOpen(true)}>{name}</PrimaryButton>
            <GoMakeModal openModal={open} onClose={() => setOpen(false)}
                         modalTitle={name}
                         insideStyle={{width: `${(scaleX(materialWidth)) + 100}px`, height: 'fit-content',maxHeight:'80%'}}>
                <Stack>
                    <IconButton style={{alignSelf: 'end'}} onClick={handleDownloadClick}>
                        <DownloadRoundedIcon/>
                    </IconButton>
                    <Stack  justifyContent={'center'} alignItems={'center'}>
                       <div>
                           <div ref={imageElement} style={{
                               width: `${scaleX(materialWidth)}px`,
                               height: `${scaleX(materialLength)}px`,
                               maxHeight:'80%',
                               border: '1px solid black',
                               position: 'relative'
                           }}>
                               {
                                   rectangles?.map(({x, y, width, length}: IRectangle) => {
                                       debugger
                                       //const newWidth =materialWidth/1000;
                                       //let diff =((newWidth / materialWidth)*100);
                                       //console.log(diff)
                                       return(
                                           <div style={{
                                               position: 'absolute',
                                               left: (scaleX(x)),
                                               top: (scaleY(y)),
                                               width: scaleX(width),
                                               height: scaleY(length),
                                               backgroundColor: 'black',
                                           }}/>
                                       )
                                   })
                               }
                           </div>
                       </div>
                    </Stack>
                </Stack>
            </GoMakeModal>
        </div>
    );
}
export {PrintImageComponent}