import {atom} from "recoil";
import {IActionMachinesList} from "@/widgets/production-floor-widget/interface";

export const actionsMachinesState = atom<IActionMachinesList[]>({
    key: "actionsMachinesState",
    default: [
        {
            actionId: "672ef00e-4026-4c0c-8efb-d538dda9e11a",
            actionName: "Printing",
            machines: [
                {
                    machineId: "64ca8d1b193b50f7d87784c4",
                    machineName: "HP Indigo 12000HD"
                },
                {
                    machineId: "64cabbb5af8e85619868a453",
                    machineName: "Xerox Iridesse"
                },
                {
                    machineId: "65034898066b9c2c33e17a04",
                    machineName: "HP Indigo WS6000"
                },
                {
                    machineId: "6548fa8c69c7688e41f23751",
                    machineName: "Heidelberg Speedmaster SX 52"
                },
                {
                    machineId: "654909de69c7688e41f2375e",
                    machineName: "Mark Andy 2200"
                },
                {
                    machineId: "65490bb669c7688e41f23766",
                    machineName: "EFI Pro 32r+"
                },
                {
                    machineId: "6574d484a0f57374ed3fcd7c",
                    machineName: "Canon Océ VarioPrint 6250"
                }
            ]
        },
        {
            actionId: "a28f0e6c-4a57-40f8-b963-6964922d1a23",
            actionName: "Lamination",
            machines: [
                {
                    machineId: "64edd5b2c081f6138deb6fc1",
                    machineName: "FOLIANT MERCURY 760SF"
                },
                {
                    machineId: "64edd7e0c081f6138deb7003",
                    machineName: "ARTTER GS5001"
                }
            ]
        },
        {
            actionId: "40b9c4a0-6401-40e9-877b-7cbcec415a87",
            actionName: "Scoring",
            machines: [
                {
                    machineId: "653b52cd8d57efa445f86ef5",
                    machineName: "GRAPHIC WHIZARD GW  8000p"
                }
            ]
        },
        {
            actionId: "aa7a20a3-524f-43a4-b64e-d46ac4fb9aaa",
            actionName: "Folding",
            machines: [
                {
                    machineId: "64d9efaf8b3987bce1656b4e",
                    machineName: "FALDO Paper folding machine suction feeded"
                }
            ]
        },
        {
            actionId: "1d4603d8-f1ab-4cfd-b5ba-6f9e4374f4c2",
            actionName: "Perforation",
            machines: [
                {
                    machineId: "653b52cd8d57efa445f86ef5",
                    machineName: "GRAPHIC WHIZARD GW  8000p"
                },
                {
                    machineId: "656c4907b3061f592ba2676a",
                    machineName: "manual package"
                }
            ]
        },
        {
            actionId: "b845d22d-6b77-470a-94a7-ae6228b5db79",
            actionName: "Puncture",
            machines: [
                {
                    machineId: "6566efed0774cff8398f3e00",
                    machineName: "GUANGYA TYMX-750"
                },
                {
                    machineId: "656a4215b3061f592ba26664",
                    machineName: "SPC FILEPACKER F.P-IV (60)BS"
                }
            ]
        },
        {
            actionId: "77df3207-1be8-4597-b387-88c152959a4e",
            actionName: "Rounding corners",
            machines: [
                {
                    machineId: "656a42b3b3061f592ba2666b",
                    machineName: "RUICAI D-7"
                }
            ]
        },
        {
            actionId: "65a06354-7aef-406d-8127-8172c9826345",
            actionName: "Pasting blocks",
            machines: [
                {
                    machineId: "65420c6369c7688e41f23715",
                    machineName: "Manual Manual"
                }
            ]
        },
        {
            actionId: "c1d30c95-104f-4f0a-ba00-5df2ff67c209",
            actionName: "Folding paste",
            machines: [
                {
                    machineId: "650c1f9c68ee34001652dd8e",
                    machineName: "Heidelberg Diana Go 85."
                }
            ]
        },
        {
            actionId: "5c755d21-a728-40d5-af2e-c31e02bebc1d",
            actionName: "Enhancement",
            machines: [
                {
                    machineId: "6543711669c7688e41f23721",
                    machineName: "Scodix Ultra 1000"
                },
                {
                    machineId: "6566efed0774cff8398f3e00",
                    machineName: "GUANGYA TYMX-750"
                }
            ]
        },
        {
            actionId: "4dbbafe1-0983-467d-96b4-8b0cdd844526",
            actionName: "Encapsulation",
            machines: [
                {
                    machineId: "650c24a09b578745f56cc979",
                    machineName: "SKY 335R6"
                }
            ]
        },
        {
            actionId: "a6c12b45-7dc3-48b2-9176-8d8749cd79f5",
            actionName: "Cutting",
            machines: [
                {
                    machineId: "6542121f69c7688e41f2371a",
                    machineName: "Baumann Wohlenberg Cutting width 92 HTVC"
                }
            ]
        },
        {
            actionId: "fa72da31-038e-419f-9079-1ce20ed67dbb",
            actionName: "Pins",
            machines: [
                {
                    machineId: "656b7ec9b3061f592ba266ec",
                    machineName: "HOHNER Economy 25/40 Wire Stitcher"
                }
            ]
        },
        {
            actionId: "97a442b9-b74a-44b3-938c-d8eceaa79552",
            actionName: "Linkage",
            machines: [
                {
                    machineId: "65685ee60ed1de4e29707c99",
                    machineName: "Mefu 1736/FLATBED – MF 1736 B4"
                }
            ]
        },
        {
            actionId: "f9b1e0e6-7a81-4d33-a357-147a34bdb59f",
            actionName: "Packaging",
            machines: [
                {
                    machineId: "6564edca5dd7b8a9aa6a9f2b",
                    machineName: "manual package"
                }
            ]
        },
        {
            actionId: "1d9f6a12-830f-49eb-8d37-24b23c684787",
            actionName: "Spiral closing",
            machines: [
                {
                    machineId: "656af763b3061f592ba266ba",
                    machineName: "ARTTER 520"
                },
                {
                    machineId: "656b0b64b3061f592ba266cf",
                    machineName: "ARTTER 520"
                }
            ]
        },
        {
            actionId: "ba7bb7b2-7efe-468d-bc9f-577ca12a7cd5",
            actionName: "Spiral perforation",
            machines: [
                {
                    machineId: "656af763b3061f592ba266ba",
                    machineName: "ARTTER 520"
                },
                {
                    machineId: "656b0b64b3061f592ba266cf",
                    machineName: "ARTTER 520"
                }
            ]
        },
        {
            actionId: "f140e2dd-7671-49c5-a6d1-a6d845606b66",
            actionName: "Books binder",
            machines: [
                {
                    machineId: "656bacabb3061f592ba26708",
                    machineName: "Müller Martini RF 700"
                }
            ]
        },
        {
            actionId: "d58273db-cdb0-4255-924f-a91bb98a0cae",
            actionName: "Making a hardcover",
            machines: [
                {
                    machineId: "656bacabb3061f592ba26708",
                    machineName: "Müller Martini RF 700"
                }
            ]
        },
        {
            actionId: "2974e3eb-5d03-4663-916f-745b77a14035",
            actionName: "Collection",
            machines: [
                {
                    machineId: "656ba300b3061f592ba26700",
                    machineName: "Duplo DFC-10"
                }
            ]
        }
    ]
});