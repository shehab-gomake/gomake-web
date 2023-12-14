import {getOutsourcingSuppliersListApi} from "@/services/api-service/suppliers/suppliers-endpoints";
import {useGomakeAxios} from "@/hooks";
import {useSetRecoilState} from "recoil";
import {jobActionsState, outsourceSuppliersState, workFlowsState} from "@/widgets/product-pricing-widget/state";
import {useEffect} from "react";

const workflows = [
    {
        "id": "c3d25ac5-f18c-4d7f-926a-188f69e8eb91",
        "generalInformation": [
            {
                "name": "Shape",
                "values": [
                    "rectangular"
                ],
                "outSourceValues": null,
                "rectangles": null,
                "materialWidth": 0,
                "materialLength": 0,
                "unitType": 0,
                "defaultUnit": null,
                "id": "e6cb1b69-d1f9-4319-85e8-4c2ae7c3e7de",
                "translations": null,
                "propertyType": 1,
                "htmlElementType": 1,
                "isEditable": false
            },
            {
                "name": "Size",
                "values": [
                    "A4"
                ],
                "outSourceValues": null,
                "rectangles": null,
                "materialWidth": 0,
                "materialLength": 0,
                "unitType": 0,
                "defaultUnit": null,
                "id": "e3f211c6-c9d2-4ba1-83b6-87d2cf3402b4",
                "translations": null,
                "propertyType": 1,
                "htmlElementType": 1,
                "isEditable": false
            },
            {
                "name": "Width",
                "values": [
                    "21"
                ],
                "outSourceValues": null,
                "rectangles": null,
                "materialWidth": 0,
                "materialLength": 0,
                "unitType": 1,
                "defaultUnit": "cm",
                "id": "4ba9a275-4fbc-4313-b284-e9b1cf8b452e",
                "translations": null,
                "propertyType": 1,
                "htmlElementType": 1,
                "isEditable": false
            },
            {
                "name": "Length",
                "values": [
                    "29.7"
                ],
                "outSourceValues": null,
                "rectangles": null,
                "materialWidth": 0,
                "materialLength": 0,
                "unitType": 1,
                "defaultUnit": "cm",
                "id": "d2c965d3-6b08-4380-9d4b-17c361d7e484",
                "translations": null,
                "propertyType": 1,
                "htmlElementType": 1,
                "isEditable": false
            },
            {
                "name": "Quantity",
                "values": [
                    "100"
                ],
                "outSourceValues": null,
                "rectangles": null,
                "materialWidth": 0,
                "materialLength": 0,
                "unitType": 0,
                "defaultUnit": null,
                "id": "4991945c-5e07-4773-8f11-2e3483b70b53",
                "translations": null,
                "propertyType": 1,
                "htmlElementType": 1,
                "isEditable": false
            },
            {
                "name": "Units per Sheet",
                "values": [
                    "4"
                ],
                "outSourceValues": null,
                "rectangles": null,
                "materialWidth": 0,
                "materialLength": 0,
                "unitType": 0,
                "defaultUnit": null,
                "id": "93710be2-6d10-4f54-b7e2-b0096cf22802",
                "translations": null,
                "propertyType": 0,
                "htmlElementType": 1,
                "isEditable": false
            },
            {
                "name": "Sheet Total quantity",
                "values": [
                    "25"
                ],
                "outSourceValues": null,
                "rectangles": null,
                "materialWidth": 0,
                "materialLength": 0,
                "unitType": 0,
                "defaultUnit": null,
                "id": "419d265b-f98c-4f66-a174-4732c214b25d",
                "translations": null,
                "propertyType": 0,
                "htmlElementType": 1,
                "isEditable": false
            },
            {
                "name": "Sheet size",
                "values": [
                    "70/50"
                ],
                "outSourceValues": null,
                "rectangles": null,
                "materialWidth": 0,
                "materialLength": 0,
                "unitType": 0,
                "defaultUnit": null,
                "id": "2dda8fb8-3a8b-42a8-a0f3-94c354b5f646",
                "translations": null,
                "propertyType": 0,
                "htmlElementType": 1,
                "isEditable": false
            }
        ],
        "productType": null,
        "sectionName": null,
        "profitInMoney": 60.5,
        "totalCost": {
            "name": "Cost",
            "values": [
                "60.5"
            ],
            "outSourceValues": [
                "0"
            ],
            "rectangles": null,
            "materialWidth": 0,
            "materialLength": 0,
            "unitType": 2,
            "defaultUnit": "USD",
            "id": "00000000-0000-0000-0000-000000000000",
            "translations": null,
            "propertyType": 0,
            "htmlElementType": 1,
            "isEditable": false
        },
        "totalRealProductionTime": {
            "name": "Delivery time",
            "values": [
                "25.07"
            ],
            "outSourceValues": [
                "0"
            ],
            "rectangles": null,
            "materialWidth": 0,
            "materialLength": 0,
            "unitType": 5,
            "defaultUnit": "m",
            "id": "00000000-0000-0000-0000-000000000000",
            "translations": null,
            "propertyType": 0,
            "htmlElementType": 1,
            "isEditable": false
        },
        "profit": {
            "name": "Profit",
            "values": [
                "100"
            ],
            "outSourceValues": [
                "0"
            ],
            "rectangles": null,
            "materialWidth": 0,
            "materialLength": 0,
            "unitType": 6,
            "defaultUnit": "%",
            "id": "00000000-0000-0000-0000-000000000000",
            "translations": null,
            "propertyType": 0,
            "htmlElementType": 1,
            "isEditable": true
        },
        "totalPrice": {
            "name": "Price",
            "values": [
                "121"
            ],
            "outSourceValues": [
                "0"
            ],
            "rectangles": null,
            "materialWidth": 0,
            "materialLength": 0,
            "unitType": 2,
            "defaultUnit": "USD",
            "id": "00000000-0000-0000-0000-000000000000",
            "translations": null,
            "propertyType": 0,
            "htmlElementType": 1,
            "isEditable": true
        },
        "recommendationRang": {
            "deliveryTime": 3,
            "price": 1,
            "profit": 7,
            "deliveryTimePercent": 32.708416433984844,
            "pricePercent": 40,
            "profitPercent": 6.307010685431327
        },
        "selected": true,
        "actions": [
            {
                "actionId": "2604bfed-998d-45f9-ba3e-edcbfb84c97d",
                "actionName": "Pre Press",
                "mongoDBMachineId": null,
                "machineName": null,
                "categoryId": null,
                "profit": {
                    "name": "Profit",
                    "values": [
                        "100"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 6,
                    "defaultUnit": "%",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": true
                },
                "totalPrice": {
                    "name": "Price",
                    "values": [
                        "40.8"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 2,
                    "defaultUnit": "USD",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": true
                },
                "totalCost": {
                    "name": "Cost",
                    "values": [
                        "20.4"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 2,
                    "defaultUnit": "USD",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": false
                },
                "totalProductionTime": {
                    "name": "Delivery time",
                    "values": [
                        "10"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 5,
                    "defaultUnit": "m",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": true
                },
                "outputs": [
                    {
                        "name": "Running Time",
                        "values": [
                            "10"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 5,
                        "defaultUnit": "m",
                        "id": "82b7dbe1-58d7-45a2-bdb0-f6a5acaf6405",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Margin in length",
                        "values": [
                            "18"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 1,
                        "defaultUnit": "mm",
                        "id": "823ffb92-b43c-4b19-84a5-707d0298595b",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Margin in width",
                        "values": [
                            "10"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 1,
                        "defaultUnit": "mm",
                        "id": "a37a1d50-f688-426a-b295-5baad2b0a20e",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Units per Sheet",
                        "values": [
                            "4"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "93710be2-6d10-4f54-b7e2-b0096cf22802",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Sheet neto quantity",
                        "values": [
                            "25"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "162c78de-5be6-4682-88c6-923b46742164",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Sheet Loss quantity ",
                        "values": [
                            "0"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "e2470e9f-8f32-4c19-961d-72ba59548730",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Sheet Total quantity",
                        "values": [
                            "25"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "419d265b-f98c-4f66-a174-4732c214b25d",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "sheets cost",
                        "values": [
                            "20.4"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 2,
                        "defaultUnit": "USD",
                        "id": "1d4f4f33-d606-43c1-8de4-5aee94862c37",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Sheet size",
                        "values": [
                            "70/50"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "2dda8fb8-3a8b-42a8-a0f3-94c354b5f646",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Unit new width",
                        "values": [
                            "21"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 1,
                        "defaultUnit": "cm",
                        "id": "04e8c754-6bec-4c7e-aa4a-7a689e5d0923",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Unit new length",
                        "values": [
                            "29.7"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 1,
                        "defaultUnit": "cm",
                        "id": "93716e25-3748-43aa-bd7b-db0e324bdf5e",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Bleed",
                        "values": [
                            "2"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 1,
                        "defaultUnit": "mm",
                        "id": "f9d50397-5fba-465b-aaa1-5e87f36039e0",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Imposition",
                        "values": null,
                        "outSourceValues": null,
                        "rectangles": [
                            {
                                "x": 10,
                                "y": 18,
                                "width": 297,
                                "length": 210
                            },
                            {
                                "x": 309,
                                "y": 18,
                                "width": 297,
                                "length": 210
                            },
                            {
                                "x": 10,
                                "y": 230,
                                "width": 297,
                                "length": 210
                            },
                            {
                                "x": 309,
                                "y": 230,
                                "width": 297,
                                "length": 210
                            }
                        ],
                        "materialWidth": 700,
                        "materialLength": 500,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 2,
                        "isEditable": false
                    }
                ],
                "source": 0,
                "supplierId": null,
                "totalPriceValue": 40.8,
                "profitValue": 100,
                "totalCostValue": 20.4,
                "totalUIQuantity": 100,
                "materialQuantity": 25,
                "beatesQuantity": null,
                "printArea": 6.236999999999999,
                "materialVolume": 0.000875,
                "pagesQuantity": null
            },
            {
                "actionId": "672ef00e-4026-4c0c-8efb-d538dda9e11a",
                "actionName": "Printing",
                "mongoDBMachineId": "64ca8d1b193b50f7d87784c4",
                "machineName": "HP Indigo 12000HD -  525",
                "categoryId": "1",
                "profit": {
                    "name": "Profit",
                    "values": [
                        "100"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 6,
                    "defaultUnit": "%",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": true
                },
                "totalPrice": {
                    "name": "Price",
                    "values": [
                        "67"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 2,
                    "defaultUnit": "USD",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": true
                },
                "totalCost": {
                    "name": "Cost",
                    "values": [
                        "33.5"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 2,
                    "defaultUnit": "USD",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": false
                },
                "totalProductionTime": {
                    "name": "Delivery time",
                    "values": [
                        "15.01"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 5,
                    "defaultUnit": "m",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": true
                },
                "outputs": [
                    {
                        "name": "Running Time",
                        "values": [
                            "0.01"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 5,
                        "defaultUnit": "m",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Running cost",
                        "values": [
                            "0.71"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 2,
                        "defaultUnit": "USD",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Setup time",
                        "values": [
                            "15"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 5,
                        "defaultUnit": "m",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Setup Cost",
                        "values": [
                            "32.79"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 2,
                        "defaultUnit": "USD",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Beats quantity",
                        "values": [
                            "25"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Beats cost",
                        "values": [
                            "0"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 2,
                        "defaultUnit": "USD",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Cyan cost",
                        "values": [
                            "0"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 2,
                        "defaultUnit": "USD",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Cyan area",
                        "values": [
                            "6.24"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 3,
                        "defaultUnit": "m2",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Both side Same print color",
                        "values": [
                            "true"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 1,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Printing Colors",
                        "values": [
                            "1 color"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 1,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Colors",
                        "values": [
                            "Cyan (C)"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 1,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Layers",
                        "values": [
                            "1"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 1,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Load",
                        "values": [
                            "100"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 1,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Printing Sides",
                        "values": [
                            "one side"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 1,
                        "htmlElementType": 1,
                        "isEditable": false
                    }
                ],
                "source": 0,
                "supplierId": null,
                "totalPriceValue": 67,
                "profitValue": 100,
                "totalCostValue": 33.5,
                "totalUIQuantity": 100,
                "materialQuantity": 25,
                "beatesQuantity": 25,
                "printArea": 6.236999999999999,
                "materialVolume": 0.000875,
                "pagesQuantity": null
            },
            {
                "actionId": "a6c12b45-7dc3-48b2-9176-8d8749cd79f5",
                "actionName": "Cutting",
                "mongoDBMachineId": "6542121f69c7688e41f2371a",
                "machineName": "Baumann Wohlenberg Cutting width 92 HTVC - 1",
                "categoryId": "19",
                "profit": {
                    "name": "Profit",
                    "values": [
                        "100"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 6,
                    "defaultUnit": "%",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": true
                },
                "totalPrice": {
                    "name": "Price",
                    "values": [
                        "9.58"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 2,
                    "defaultUnit": "USD",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": true
                },
                "totalCost": {
                    "name": "Cost",
                    "values": [
                        "4.79"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 2,
                    "defaultUnit": "USD",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": false
                },
                "totalProductionTime": {
                    "name": "Delivery time",
                    "values": [
                        "0.04"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 5,
                    "defaultUnit": "m",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": true
                },
                "outputs": [
                    {
                        "name": "Max Cutting height",
                        "values": [
                            "120"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Running Time",
                        "values": [
                            "0.04"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 5,
                        "defaultUnit": "m",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Running cost",
                        "values": [
                            "4.63"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 2,
                        "defaultUnit": "USD",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Shape",
                        "values": [
                            "Rectangular"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 1,
                        "htmlElementType": 1,
                        "isEditable": false
                    }
                ],
                "source": 0,
                "supplierId": null,
                "totalPriceValue": 9.58,
                "profitValue": 100,
                "totalCostValue": 4.79,
                "totalUIQuantity": 100,
                "materialQuantity": 25,
                "beatesQuantity": null,
                "printArea": 6.236999999999999,
                "materialVolume": 0.000875,
                "pagesQuantity": null
            },
            {
                "actionId": "f9b1e0e6-7a81-4d33-a357-147a34bdb59f",
                "actionName": "packing",
                "mongoDBMachineId": "6564edca5dd7b8a9aa6a9f2b",
                "machineName": "manual package - manual",
                "categoryId": "42",
                "profit": {
                    "name": "Profit",
                    "values": [
                        "100"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 6,
                    "defaultUnit": "%",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": true
                },
                "totalPrice": {
                    "name": "Price",
                    "values": [
                        "3.62"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 2,
                    "defaultUnit": "USD",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": true
                },
                "totalCost": {
                    "name": "Cost",
                    "values": [
                        "1.81"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 2,
                    "defaultUnit": "USD",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": false
                },
                "totalProductionTime": {
                    "name": "Delivery time",
                    "values": [
                        "0.02"
                    ],
                    "outSourceValues": [
                        "0"
                    ],
                    "rectangles": null,
                    "materialWidth": 0,
                    "materialLength": 0,
                    "unitType": 5,
                    "defaultUnit": "m",
                    "id": "00000000-0000-0000-0000-000000000000",
                    "translations": null,
                    "propertyType": 0,
                    "htmlElementType": 1,
                    "isEditable": true
                },
                "outputs": [
                    {
                        "name": "Running Time",
                        "values": [
                            "0.02"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 5,
                        "defaultUnit": "m",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Running cost",
                        "values": [
                            "0.83"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 2,
                        "defaultUnit": "USD",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Setup time",
                        "values": [
                            "0"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 5,
                        "defaultUnit": "m",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Packages amount",
                        "values": [
                            "1"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Setup Cost",
                        "values": [
                            "0"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 2,
                        "defaultUnit": "USD",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Cartons Cost",
                        "values": [
                            "0.98"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 2,
                        "defaultUnit": "USD",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Package Weight",
                        "values": [
                            "248.42"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 7,
                        "defaultUnit": "kg",
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    },
                    {
                        "name": "Units in package",
                        "values": [
                            "3100"
                        ],
                        "outSourceValues": null,
                        "rectangles": null,
                        "materialWidth": 0,
                        "materialLength": 0,
                        "unitType": 0,
                        "defaultUnit": null,
                        "id": "00000000-0000-0000-0000-000000000000",
                        "translations": null,
                        "propertyType": 0,
                        "htmlElementType": 1,
                        "isEditable": false
                    }
                ],
                "source": 0,
                "supplierId": null,
                "totalPriceValue": 3.62,
                "profitValue": 100,
                "totalCostValue": 1.81,
                "totalUIQuantity": 100,
                "materialQuantity": 25,
                "beatesQuantity": null,
                "printArea": 6.236999999999999,
                "materialVolume": 0.000875,
                "pagesQuantity": null
            }
        ],
        "monials": 79.01542711941617
    }
];

const actions = [
    {
        "actionId": "672ef00e-4026-4c0c-8efb-d538dda9e11a",
        "productType": null,
        "machineCategories": [
            {
                "machineCategoryId": "1",
                "machines": [
                    {
                        "machineId": "64ca8d1b193b50f7d87784c4",
                        "machineName": "HP Indigo 12000HD -  525"
                    }
                ]
            }
        ]
    },
    {
        "actionId": "a6c12b45-7dc3-48b2-9176-8d8749cd79f5",
        "productType": null,
        "machineCategories": [
            {
                "machineCategoryId": "19",
                "machines": [
                    {
                        "machineId": "6542121f69c7688e41f2371a",
                        "machineName": "Baumann Wohlenberg Cutting width 92 HTVC - 1"
                    }
                ]
            }
        ]
    },
    {
        "actionId": "f9b1e0e6-7a81-4d33-a357-147a34bdb59f",
        "productType": null,
        "machineCategories": [
            {
                "machineCategoryId": "42",
                "machines": [
                    {
                        "machineId": "6564edca5dd7b8a9aa6a9f2b",
                        "machineName": "manual package - manual"
                    }
                ]
            }
        ]
    },
    {
        "actionId": "672ef00e-4026-4c0c-8efb-d538dda9e11a",
        "productType": null,
        "machineCategories": [
            {
                "machineCategoryId": "1",
                "machines": [
                    {
                        "machineId": "64ca8d1b193b50f7d87784c4",
                        "machineName": "HP Indigo 12000HD -  525"
                    }
                ]
            },
            {
                "machineCategoryId": "2",
                "machines": [
                    {
                        "machineId": "6548fa8c69c7688e41f23751",
                        "machineName": "Heidelberg Speedmaster SX 52 - 1"
                    }
                ]
            }
        ]
    },
    {
        "actionId": "a6c12b45-7dc3-48b2-9176-8d8749cd79f5",
        "productType": null,
        "machineCategories": [
            {
                "machineCategoryId": "19",
                "machines": [
                    {
                        "machineId": "6542121f69c7688e41f2371a",
                        "machineName": "Baumann Wohlenberg Cutting width 92 HTVC - 1"
                    }
                ]
            }
        ]
    },
    {
        "actionId": "f9b1e0e6-7a81-4d33-a357-147a34bdb59f",
        "productType": null,
        "machineCategories": [
            {
                "machineCategoryId": "42",
                "machines": [
                    {
                        "machineId": "6564edca5dd7b8a9aa6a9f2b",
                        "machineName": "manual package - manual"
                    }
                ]
            }
        ]
    },
    {
        "actionId": "672ef00e-4026-4c0c-8efb-d538dda9e11a",
        "productType": null,
        "machineCategories": [
            {
                "machineCategoryId": "1",
                "machines": [
                    {
                        "machineId": "64ca8d1b193b50f7d87784c4",
                        "machineName": "HP Indigo 12000HD -  525"
                    },
                    {
                        "machineId": "64cabbb5af8e85619868a453",
                        "machineName": "Xerox Iridesse - 555"
                    }
                ]
            },
            {
                "machineCategoryId": "2",
                "machines": [
                    {
                        "machineId": "6548fa8c69c7688e41f23751",
                        "machineName": "Heidelberg Speedmaster SX 52 - 1"
                    }
                ]
            }
        ]
    },
    {
        "actionId": "a6c12b45-7dc3-48b2-9176-8d8749cd79f5",
        "productType": null,
        "machineCategories": [
            {
                "machineCategoryId": "19",
                "machines": [
                    {
                        "machineId": "6542121f69c7688e41f2371a",
                        "machineName": "Baumann Wohlenberg Cutting width 92 HTVC - 1"
                    }
                ]
            }
        ]
    },
    {
        "actionId": "f9b1e0e6-7a81-4d33-a357-147a34bdb59f",
        "productType": null,
        "machineCategories": [
            {
                "machineCategoryId": "42",
                "machines": [
                    {
                        "machineId": "6564edca5dd7b8a9aa6a9f2b",
                        "machineName": "manual package - manual"
                    }
                ]
            }
        ]
    },
    {
        "actionId": "672ef00e-4026-4c0c-8efb-d538dda9e11a",
        "productType": null,
        "machineCategories": [
            {
                "machineCategoryId": "1",
                "machines": [
                    {
                        "machineId": "64ca8d1b193b50f7d87784c4",
                        "machineName": "HP Indigo 12000HD -  525"
                    },
                    {
                        "machineId": "64cabbb5af8e85619868a453",
                        "machineName": "Xerox Iridesse - 555"
                    }
                ]
            },
            {
                "machineCategoryId": "2",
                "machines": [
                    {
                        "machineId": "6548fa8c69c7688e41f23751",
                        "machineName": "Heidelberg Speedmaster SX 52 - 1"
                    }
                ]
            }
        ]
    },
    {
        "actionId": "a6c12b45-7dc3-48b2-9176-8d8749cd79f5",
        "productType": null,
        "machineCategories": [
            {
                "machineCategoryId": "19",
                "machines": [
                    {
                        "machineId": "6542121f69c7688e41f2371a",
                        "machineName": "Baumann Wohlenberg Cutting width 92 HTVC - 1"
                    }
                ]
            }
        ]
    },
    {
        "actionId": "f9b1e0e6-7a81-4d33-a357-147a34bdb59f",
        "productType": null,
        "machineCategories": [
            {
                "machineCategoryId": "42",
                "machines": [
                    {
                        "machineId": "6564edca5dd7b8a9aa6a9f2b",
                        "machineName": "manual package - manual"
                    }
                ]
            }
        ]
    },
    {
        "actionId": "672ef00e-4026-4c0c-8efb-d538dda9e11a",
        "productType": null,
        "machineCategories": [
            {
                "machineCategoryId": "1",
                "machines": [
                    {
                        "machineId": "64ca8d1b193b50f7d87784c4",
                        "machineName": "HP Indigo 12000HD -  525"
                    },
                    {
                        "machineId": "64cabbb5af8e85619868a453",
                        "machineName": "Xerox Iridesse - 555"
                    },
                    {
                        "machineId": "6574d484a0f57374ed3fcd7c",
                        "machineName": "Canon Océ VarioPrint 6250 - -"
                    }
                ]
            },
            {
                "machineCategoryId": "2",
                "machines": [
                    {
                        "machineId": "6548fa8c69c7688e41f23751",
                        "machineName": "Heidelberg Speedmaster SX 52 - 1"
                    }
                ]
            }
        ]
    },
    {
        "actionId": "a6c12b45-7dc3-48b2-9176-8d8749cd79f5",
        "productType": null,
        "machineCategories": [
            {
                "machineCategoryId": "19",
                "machines": [
                    {
                        "machineId": "6542121f69c7688e41f2371a",
                        "machineName": "Baumann Wohlenberg Cutting width 92 HTVC - 1"
                    }
                ]
            }
        ]
    },
    {
        "actionId": "f9b1e0e6-7a81-4d33-a357-147a34bdb59f",
        "productType": null,
        "machineCategories": [
            {
                "machineCategoryId": "42",
                "machines": [
                    {
                        "machineId": "6564edca5dd7b8a9aa6a9f2b",
                        "machineName": "manual package - manual"
                    }
                ]
            }
        ]
    }
];

const useStationsViews = () => {
    const {callApi} = useGomakeAxios();
    const setOutSuppliers = useSetRecoilState(outsourceSuppliersState);
    const setWorkflowsState = useSetRecoilState(workFlowsState);
    const setActions = useSetRecoilState(jobActionsState);
    const getOutSourcingSuppliers = () => {
        const callBack = (res) => {
            if (res.success) {
                setOutSuppliers(res.data);
            }
        }
        getOutsourcingSuppliersListApi(callApi, callBack, {}).then();
    }

    useEffect(() => {
        setActions(actions);
        setWorkflowsState(workflows)
    }, [])

  return {
      getOutSourcingSuppliers,
      workflows,
      actions
  }
}

export {useStationsViews}