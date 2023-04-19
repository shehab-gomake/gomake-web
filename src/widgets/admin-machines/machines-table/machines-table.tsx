import {useEffect, useState} from "react";
import {use} from "i18next";
import {useGomakeAxios} from "@/hooks";
import {IMachine} from "@/widgets/admin-machines/add-machine/interface/machine-attributes";
import {styled} from "@mui/material/styles";
import {Modal, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow} from "@mui/material";
import {FONT_FAMILY} from "@/utils/font-family";
import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {useRouter} from "next/router";
import {IconButton} from '@mui/material';
import Link from "next/link";
import {Box} from "@mui/system";
import Button from "@mui/material/Button";

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#EBECFF',
        color: '#292929',
        ...FONT_FAMILY.Lexend(500, 14)
    },
    [`&.${tableCellClasses.body}`]: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: '#2E3092',

    },
}));

const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(even)': {
        backgroundColor: '#F6F6F6',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
const MachinesTable = () => {
    const [state, setState] = useState<any[]>([]);
    const [deleteMachineModal, setDeleteMachineModal] = useState<boolean>(false);
    const [selectedMachineId, setSelectedMachineId] = useState<string>();
    const {callApi} = useGomakeAxios();
    const router = useRouter();
    const {categoryId} = router.query
    useEffect(() => {
        callApi('Get', `/v1/administrator/machines/category/${categoryId}`).then((res) => setState(res?.data.data?.data))
    }, [categoryId]);
    const deleteMachine = () => {
        callApi('post', '/v1/administrator/machines/delete', {id: selectedMachineId}).then(() => {
        }).then(() => {
            callApi('Get', `/v1/administrator/machines/category/${categoryId}`).then((res) => setState(res?.data.data?.data))
                .then(() => {
                    setDeleteMachineModal(false);
                    setSelectedMachineId('');
                })
        })
    };
    useEffect(() => console.log(state), [state])

    const onClickDeleteMachineButton = (machineId: string) => {
        setSelectedMachineId(machineId);
        setDeleteMachineModal(true);
    }

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>code</StyledTableCell>
                            <StyledTableCell align={'center'}>name</StyledTableCell>
                            <StyledTableCell align={'center'}>factor</StyledTableCell>
                            <StyledTableCell align={'center'}>model</StyledTableCell>
                            <StyledTableCell align={'center'}>action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            state.length > 0 && state?.map((machine) => {
                                return <StyledTableRow>
                                    <StyledTableCell>{machine.code}</StyledTableCell>
                                    <StyledTableCell align={'center'}>{machine.nickName}</StyledTableCell>
                                    <StyledTableCell align={'center'}>{machine.manufacturer}</StyledTableCell>
                                    <StyledTableCell align={'center'}>{machine.model}</StyledTableCell>
                                    <StyledTableCell align={'center'}>
                                        <IconButton href={`/admin/machine/update-machine/${machine._id}`}
                                                    component={Link}>
                                            <EditRoundedIcon/>
                                        </IconButton>
                                        <IconButton onClick={() => onClickDeleteMachineButton(machine)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal
                open={deleteMachineModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    p: 4,
                }}>
                    <h1>confirm deleting machine</h1>
                    <Button onClick={() => setDeleteMachineModal(false)}>cancel</Button>
                    <Button onClick={() => deleteMachine()}>delete</Button>
                </Box>
            </Modal>
        </>
    );
}
export {MachinesTable};