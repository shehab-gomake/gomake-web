import {GoMakeModal, GomakeTextInput} from "@/components";
import Stack from "@mui/material/Stack";
import {IconButton} from "@mui/material";
import {SettingsIcon} from "@/icons/settings";
import {convertHeightToVH, convertWidthToVW} from "@/utils/adapter";
import {
    useQuantityParameter
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/use-quantity-parameter";
import {
    QuantityTypesComponent
} from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/quantity-types-component";

const QuantityParameter = ({
                               classes,
                               parameter,
                               index,
                               temp,
                               onChangeSubProductsForPrice,
                               subSection,
                               section,
                               type
                           }) => {
    const {openModal, setOpenModal, productTypesNumber} = useQuantityParameter()
    return (
        <Stack direction={"row"}>
            <GomakeTextInput
                style={classes.textInputStyle}
                defaultValue={parameter.defaultValue}
                placeholder={parameter.name}
                value={index !== -1 ? temp[index].values : ""}
                disabled={productTypesNumber > 1}
                onChange={(e: any) => {
                    onChangeSubProductsForPrice(
                        parameter?.id,
                        subSection?.id,
                        section?.id,
                        parameter?.parameterType,
                        parameter?.name,
                        parameter?.actionId,
                        {values: e.target.value},
                        subSection?.type,
                        index,
                        parameter?.actionIndex
                    );
                }}
                type={type}
            />
            {
                productTypesNumber > 1 &&
                <IconButton onClick={() => setOpenModal(true)}>
                    <SettingsIcon
                        stroke={"rgba(237, 2, 140, 1)"}
                        width={24}
                        height={24}
                    />
                </IconButton>
            }
            <GoMakeModal  insideStyle={{width: convertWidthToVW(444), height: convertHeightToVH(746)}}
                         modalTitle={'Types quantity'} openModal={openModal} onClose={() => setOpenModal(false)}>
                <QuantityTypesComponent/>
            </GoMakeModal>
        </Stack>
    );
};

export {QuantityParameter};