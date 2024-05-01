import {Card, IconButton, MenuItem, Paper, Stack} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import {CardFooter} from "react-bootstrap";
import {FONT_FAMILY} from "@/utils/font-family";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useRef, useState} from "react";
import {ClickOutside} from "@/components/click-out-side/click-out-side";
import {DateFormatterDDMMYYYY} from "@/utils/adapter";
import {IBoardMissionsFile} from "@/widgets/production-floor/views/board-missions-view/files/state";
import {useRecoilState} from "recoil";
import {printHouseProfile} from "@/store/print-house-profile";
import {getUserToken} from "@/services/storage-data";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";
import {DotsLoader} from "@/components/dots-loader/dots-Loader";
import {useRouter} from "next/router";

const FileCardComponent = ({file}: { file: IBoardMissionsFile }) => {
    const {primaryColor, grayColor} = useGomakeTheme();
    const [open, setOpen] = useState<boolean>(false);
    const [companyProfile] = useRecoilState(printHouseProfile);
    const menuRef = useRef(null);
    const [boardMissions] = useRecoilState(boardMissionsDetailsState);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {query} = useRouter();
    const {productType} = query
    const onClickDelete = async () => {
        try {
            setIsLoading(true);
            // Fetch the file from the server
            const response = await fetch(companyProfile.filesApiAddress + '/api/Files/DeleteFile', {
                method: 'POST',
                body: JSON.stringify({
                    orderItemId: boardMissions.orderItemId,
                    filename: file.name,
                    source: file.filePath,
                    productType: productType ? productType : ''
                }),
                headers: {
                    'authorization': "Bearer " + getUserToken(),
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setIsLoading(false)
        } catch (error) {
            console.error('Download failed:', error);
        }
    }
    const onClickDownload = async () => {
        try {
            setIsLoading(true);
            // Fetch the file from the server
            const response = await fetch(companyProfile.filesApiAddress + '/api/Files/downloadfile', {
                method: 'POST',
                body: JSON.stringify({
                    orderItemId: boardMissions.orderItemId,
                    filename: file.name,
                    source: file.filePath
                }),
                headers: {
                    'authorization': "Bearer " + getUserToken(),
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Get the file as a Blob
            const blob = await response.blob();

            // Create a URL for the Blob object
            const downloadUrl = window.URL.createObjectURL(blob);

            // Create a link element to download the blob
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = file?.name; // Provide the filename and extension
            document.body.appendChild(link);
            link.click();
            setIsLoading(false);

            // Clean up by revoking the object URL and removing the link
            window.URL.revokeObjectURL(downloadUrl);
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
        }
        setOpen(false);
    }
    return (
        <div style={{position: 'relative', margin: '35px 0'}}>
            <Card sx={{width: 206, height: 180, padding: '8px', backgroundColor: primaryColor(100)}}>
                <CardMedia
                    sx={{height: 120, borderRadius: '8px'}}
                    image={file?.screenShotURL}
                    title="green iguana"
                />
                <CardFooter style={{
                    marginTop: '8px',
                    padding: '0 8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Stack style={{color: grayColor(700), ...FONT_FAMILY.Inter(500, 12)}}>
                        <span>{file?.name}</span>
                        <span>{DateFormatterDDMMYYYY(file?.uploadDate)}</span>
                    </Stack>
                    {
                    isLoading ? <DotsLoader/> : <ClickOutside onClick={() => setOpen(false)} exceptionRef={menuRef}>
                        <IconButton
                            onClick={() => setOpen(!open)}
                            sx={{
                                height: 22,
                                width: 22
                            }}
                            size={"small"}
                        >
                            <MoreVertIcon sx={{width: 20, height: 20}}>M</MoreVertIcon>
                        </IconButton>
                    </ClickOutside>
                    }
                    {
                        !!open && !isLoading && <Paper ref={menuRef} sx={{
                            position: 'absolute',
                            right: '16px',
                            top: 'calc(100% - 8px)',
                        }}>
                            <MenuItem onClick={onClickDownload}>download</MenuItem>
                            <MenuItem onClick={onClickDelete}>delete</MenuItem>
                        </Paper>
                    }
                </CardFooter>
            </Card>
        </div>
    )
}

export {FileCardComponent}