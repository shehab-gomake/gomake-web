import { DebitLimitTypes, EnumInvoiceClosureMethod, EnumTermsPayment, EnumVATStatus } from "@/enums/accounting-enums";

const accountingInputs = (state, isSupplier,t) => {

    const allPaymentTerms = Object.values(EnumTermsPayment).filter(value => typeof value === 'number') as number[];
    const paymentTermsList = allPaymentTerms
    .filter(value => {
        if (isSupplier) {
            return [
                EnumTermsPayment.Net30EomSuppliers,
                EnumTermsPayment.Net45EomSuppliers,
                EnumTermsPayment.Net60EomSuppliers,
                EnumTermsPayment.BasicCash,
                EnumTermsPayment.SpreadPayments,
                EnumTermsPayment.Prepayment,
            ].includes(value);
        } else {
            return [
                EnumTermsPayment.BasicCash,
                EnumTermsPayment.SpreadPayments,
                EnumTermsPayment.Net30Eom,
                EnumTermsPayment.Net45Eom,
                EnumTermsPayment.Net60Eom,
                EnumTermsPayment.Prepayment,
                EnumTermsPayment.Net90Eom,
                EnumTermsPayment.Net120Eom,
            ].includes(value);
        }
    })
    .map(value => ({
        value,
        text: t(`accounting.${EnumTermsPayment[value]}`)
    }));

    const vatStatusList: { value: number; text: string }[] = Object.values(EnumVATStatus)
    .filter(value => typeof value === 'number')
    .map(value => ({
        value: value as number,
        text: t(`accounting.${EnumVATStatus[value]}`)
    }));

    const debitLimitTypesList: { value: number; text: string }[] = Object.values(DebitLimitTypes)
    .filter(value => typeof value === 'number')
    .map(value => ({
        value: value as number,
        text: t(`accounting.${DebitLimitTypes[value]}`) 
    }));

    const invoiceClosureMethodList: { value: boolean; text: string }[] = [
        {
            value: false,
            text: t(`accounting.${EnumInvoiceClosureMethod[EnumInvoiceClosureMethod.accounting]}`) 
        },
        {
            value: true,
            text: t(`accounting.${EnumInvoiceClosureMethod[EnumInvoiceClosureMethod.internalAndAccounting]}`) 
        }
    ];

    return [
        {
            name: "PaymentTerms",
            label: "accounting.paymentTerms",
            type: "select",
            placeholder: "accounting.paymentTerms",
            required: false,
            parameterKey: "termOfPayment",
            options: paymentTermsList,
            value: state?.termOfPayment,
            isValid: true,
        },
        {
            name: "CentralCard",
            label: "accounting.centralCard",
            type: "text",
            placeholder: "accounting.centralCard",
            required: false,
            parameterKey: "fatherCard",
            options: [],
            value: state?.fatherCard ,
            isValid: true,
        },
        {
            name: "vatStatus",
            label: "accounting.vatStatus",
            type: "select",
            placeholder: "accounting.vatStatus",
            required: false,
            parameterKey: "vatStatus",
            options: vatStatusList,
            value: state?.vatStatus,
            isValid: true,
        },
        {
            name: "deductedAtSource",
            label: "accounting.deductedAtSource",
            type: "switch",
            required: false,
            parameterKey: "deductedAtSource",
            options: [],
             value: state?.deductedAtSource,
            isValid: true,
        },
        {
            name: "invoiceClosureMethod",
            label: "accounting.invoiceClosureMethod",
            type: "select",
            placeholder: "accounting.invoiceClosureMethod",
            required: false,
            parameterKey: "isOptionalClosingOrder",
            options: invoiceClosureMethodList,
            value: state?.isOptionalClosingOrder,
            isValid: true,
        },
        {
            name: "debitLine",
            label: "accounting.debitLine",
            type: "text",
            placeholder: "accounting.debitLine",
            required: false,
            parameterKey: "debitLine",
            options: [],
            value: state?.debitLine,
            isValid: true,
        },
        {
            name: "debitLimitType",
            label: "accounting.debitLimitType",
            type: "select",
            placeholder: "accounting.debitLimitType",
            required: false,
            parameterKey: "debitLimitType",
            options: debitLimitTypesList,
            value: state?.debitLimitType,
            isValid: true,
        },
    ];
};

export { accountingInputs };