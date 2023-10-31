import { GomakeIcon } from "@/icons/Gomake-icon";
import { useStyle } from "./style";
import { Stack, TextareaAutosize } from "@mui/material";
import { ContactAddressConfirmPage } from "./conatct-address-component/contact-address-component";
import { SeconderyPrimaryTableRow } from "@/components/tables/seconderyPrimaryTable/secondery-primary-table";
import { SecondaryButton } from "@/components/button/secondary-button";
import { DropdownMenuUpward } from "@/components/dropdown-menu-upward/dropdown-menu-upward";
import { useState } from "react";

import { GoMakeModal } from "@/components/modal";
import { GomakeTextInput } from "@/components/text-input";

const ConfirmQuote = () => {
    const { clasess } = useStyle();
    const row = [
        ['test', 'test', 'test', 'test', 'test', 'test', 'test', 'test'],
        ['test', 'test', 'test', 'test', 'test', 'test', 'test', 'test'],
        ['test', 'test', 'test', 'test', 'test', 'test', 'test', 'test'],
        ['test', 'test', 'test', 'test', 'test', 'test', 'test', 'test'],
        ['test', 'test', 'test', 'test', 'test', 'test', 'test', 'test'],
    ];
    const HeaderRow = [
        '#', 'Item code', 'Item name', 'Details', 'Amount', 'Discount', 'Unit Price', 'Final Price'
    ];
    const [openModal, setopenModal] = useState(false);
    const openApproveOfferModal = () => {
        setopenModal(true);
    };
    return (
        <>
            <div style={clasess.HeaderConfirmPage}>
                <div style={clasess.GomakeIconStyle}>
                    <GomakeIcon />
                </div>
            </div>
            <div style={clasess.MainContainerInConfirmPage}>
                <Stack direction={'row'}>
                    <span style={clasess.mainTitleStyle}>Quote - 1012381</span>
                </Stack>
                <Stack display={'flex'} paddingTop={1} paddingBottom={1} direction={'row'} borderBottom={'1px solid #EAECF0'} gap={5}>
                    <Stack>
                        <span style={clasess.subTitleStyle}>Date of Reference : 10/19/2023 </span>
                    </Stack>
                    <Stack marginLeft={'30px'}>
                        <span style={clasess.subTitleStyle}>Delivery Time : 11 working days </span>
                    </Stack>
                </Stack>
                <div style={{ marginTop: 16 }}>
                    <ContactAddressConfirmPage />
                </div>
                <div style={{ marginTop: 16 }}>
                    <SeconderyPrimaryTableRow rows={row} headers={HeaderRow} />
                    <div style={{ display: 'flex', flexDirection: 'row', border: "1px solid #EAECF0" }}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Stack style={{ width: 194, backgroundColor: "#8283BE", height: 44, border: 1, padding: "12px 24px 12px 24px", gap: 12 }}>
                                <span style={{ color: "white", fontSize: 12 }}>total Before VAT</span>
                            </Stack>
                            <Stack style={{ width: 241, height: 44, border: 1, padding: "16px 24px 16px 24px", gap: 12 }}>
                                <span style={{ color: "black", fontSize: 12 }}>400,000 ILS</span>
                            </Stack>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Stack style={{ width: 194, backgroundColor: "#8283BE", height: 44, border: 1, padding: "12px 24px 12px 24px", gap: 12 }}>
                                <span style={{ color: "white", fontSize: 12 }}>Discount</span>
                            </Stack>
                            <Stack style={{ width: 241, height: 44, border: 1, padding: "16px 24px 16px 24px", gap: 12 }}>
                                <span style={{ color: "black", fontSize: 12 }}>10% (-234 ILS)</span>
                            </Stack>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Stack style={{ width: 194, backgroundColor: "#8283BE", height: 44, border: 1, padding: "12px 24px 12px 24px", gap: 12 }}>
                                <span style={{ color: "white", fontSize: 12 }}>VAT (17%)</span>
                            </Stack>
                            <Stack style={{ width: 241, height: 44, border: 1, padding: "16px 24px 16px 24px", gap: 12 }}>
                                <span style={{ color: "black", fontSize: 12 }}>700 ILS</span>
                            </Stack>
                        </div>
                    </div>
                    <div style={{ border: "1px solid #EAECF0", borderBottomRightRadius: 10, borderBottomLeftRadius: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Stack style={{ width: 194, backgroundColor: "#8283BE", height: 44, border: 1, padding: "12px 24px 12px 24px", gap: 12, borderBottomLeftRadius: 10 }}>
                                <span style={{ color: "white", fontSize: 12 }}>Total Price</span>
                            </Stack>
                            <Stack style={{ width: 241, height: 44, border: 1, padding: "16px 24px 16px 24px", gap: 12 }}>
                                <span style={{ color: "#F135A3", fontSize: 12 }}>500,000 ILS</span>
                            </Stack>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 34, width: 1360, height: 70 }}>
                    <div>
                        <Stack direction={'row'}>
                            <span style={clasess.subTitleStyle}>Comments</span>
                        </Stack>
                        <TextareaAutosize placeholder={'Text here'} style={{ width: "100%", height: '44px', border: "1px solid #D0D5DD", borderRadius: 8, padding: "10px 14px 10px 14px" }}></TextareaAutosize>
                    </div>
                </div>


            </div>
            <div>
                <div style={{ backgroundColor: "#F4F1F6", color: "#fff", padding: "20px", textAlign: "center", position: "fixed", bottom: 0, width: " 100%", height: "132px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: "space-between", width: "73%" }}>
                        <div>
                            <Stack direction={'row'}>
                                <span style={clasess.subTitleStyle}>Your Name <span style={clasess.subTitleStyle2}>Ahmad </span> </span>
                            </Stack>
                            <Stack direction={'row'}>
                                <span style={clasess.subTitleStyle}>Date of signature:<span style={clasess.subTitleStyle2}>10,Oct 2023 </span> </span>
                            </Stack>
                        </div>
                        <div style={{ display: 'flex', justifyContent: "space-between", gap: 12 }}>
                            <div>
                                <DropdownMenuUpward title={'Reject Offer'} items={['Reject1', 'Reject2', 'Reject3', 'Reject4', 'Reject5', 'Reject6']} placement={'bottom-start'} />
                            </div>
                            <div>
                                <SecondaryButton style={{ width: "100%" }} variant={'outlined'}>Partially Approved</SecondaryButton>
                            </div>
                            <div>
                                <SecondaryButton style={{ width: "100%" }} variant={'outlined'}>Attach Files</SecondaryButton>
                            </div>
                            <div>
                                <SecondaryButton style={{ width: "100%" }} variant={'outlined'}>Print</SecondaryButton>
                            </div>

                            <div>
                                <SecondaryButton style={{ width: "100%" }} variant={'contained'} onClick={openApproveOfferModal}>Approve Offer</SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <GoMakeModal
                    openModal={openModal}
                    modalTitle={''}
                    insideStyle={{width:669,height:431}}
                    withClose={false}
                >
                    <div>
                            <Stack direction={'row'}>
                                        <span style={clasess.subTitleStyle}>Your name</span>
                            </Stack>
                            <GomakeTextInput
                                placeholder={'enter your name'}
                                    onChange={(e: any) => {
                                
                                    }}
                            />
                             <Stack direction={'row'}>
                                <span style={clasess.subTitleStyle}>Date of signature:<span style={clasess.subTitleStyle2}>10,Oct 2023 </span> </span>
                            </Stack>
                            <Stack direction={'row'}>
                                        <span style={clasess.subTitleStyle}>Signature</span>
                            </Stack>
                
                    </div>
                </GoMakeModal>
        </>
        
    );
};
export {ConfirmQuote};