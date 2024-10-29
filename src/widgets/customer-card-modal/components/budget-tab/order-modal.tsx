import { useState } from "react";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { PrimaryTable } from "@/components/tables/primary-table";
import { DeleteIcon } from "@/widgets/settings-mailing/messageTemplates/components/more-circle/icons/delete";
import { Checkbox } from "@mui/material"; // Import Checkbox for the second table
import { CheckboxCheckedIcon, CheckboxIcon } from "@/icons";

const OrdersModal = ({ isOpen, onClose, orders }) => {
    // State to manage switching between modals
    const [isClientOrdersModalOpen, setIsClientOrdersModalOpen] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState([]);

    // Table headers for the current budget's orders
    const ordersTableHeaders = ["Order Number", "Total Price Without VAT", "Total Price", "Status", "More"];

    // Table headers for client's orders selection modal
    const clientOrdersTableHeaders = ["#", "Order Number", "Total Price Without VAT", "Total Price"];

    // Simulated client orders data
    const clientOrders = [
        { orderNumber: "ORD-101", totalPriceWithoutVat: "$8,000", totalPrice: "$9,600" },
        { orderNumber: "ORD-102", totalPriceWithoutVat: "$4,000", totalPrice: "$4,800" },
        { orderNumber: "ORD-103", totalPriceWithoutVat: "$2,000", totalPrice: "$2,400" },
    ];

    // Mapping orders for the current budget modal
    const mapOrdersData = () => orders?.map(order => [
        order.orderNumber,
        order.totalPriceWithoutVat,
        order.totalPrice,
        order.status,
        <div style={{ cursor: "pointer" }}><DeleteIcon /></div>
    ]);

    // Mapping client's orders data for selection
    const mapClientOrdersData = () => clientOrders.map(order => [
        <Checkbox
            checked={selectedOrders.includes(order.orderNumber)}
            onChange={(e) => handleSelectOrder(e, order.orderNumber)}
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
        />,
        order.orderNumber,
        order.totalPriceWithoutVat,
        order.totalPrice,
    ]);

    // Handling selection of orders
    const handleSelectOrder = (e, orderNumber) => {
        if (e.target.checked) {
            setSelectedOrders([...selectedOrders, orderNumber]);
        } else {
            setSelectedOrders(selectedOrders.filter(order => order !== orderNumber));
        }
    };

    // Handle button click to switch to the client's orders modal
    const handleClientOrdersClick = () => {
        setIsClientOrdersModalOpen(true);
    };

    // Handle closing both modals
    const handleClose = () => {
        setIsClientOrdersModalOpen(false);
        onClose();
    };

    return (
        <>
            {/* Orders in the current budget modal */}
            <GoMakeModal
                open={isOpen && !isClientOrdersModalOpen}
                onClose={handleClose}
                insideStyle={{ width: 800, height: "fit-content" }}
                modalTitle={"The Documents in the Budget"}
            >
                <div style={{ marginTop: 25 }}>
                    <GomakePrimaryButton
                        style={{ width: "fit-content", marginBottom: 25, height: 40, backgroundColor: "#EC038D" }}
                        onClick={handleClientOrdersClick}
                    >
                        Belongs to the budget
                    </GomakePrimaryButton>
                    <PrimaryTable
                        stickyFirstCol={true}
                        stickyHeader={true}
                        rows={mapOrdersData()}
                        headers={ordersTableHeaders}
                        maxHeight={300}
                    />
                </div>
            </GoMakeModal>

            {/* Orders of this client modal */}
            <GoMakeModal
                open={isClientOrdersModalOpen}
                onClose={handleClose}
                insideStyle={{ width: 800, height: "fit-content" }}
                modalTitle={"Documents of This Client"}
            >
                <div style={{ marginTop: 25 }}>
                    <PrimaryTable
                        stickyFirstCol={true}
                        stickyHeader={true}
                        rows={mapClientOrdersData()}
                        headers={clientOrdersTableHeaders}
                        maxHeight={300}
                    />
                </div>
            </GoMakeModal>
        </>
    );
};

export { OrdersModal };
