

import { useStyle } from "./style";
import {DocumentCreation} from "./components/document-creation/document-creation";
import { useState } from "react";
import { TitleDefinition } from "./components/TitleDefinition/title-definition";

const DocumentDesign = () => {
    const {classes} = useStyle();
    const [documentCreation , setdocumentCreation] = useState([]);
    return (
        <div style={classes.container}>
            <div style={classes.header}>
                <DocumentCreation documentCreation={documentCreation} setdocumentCreation={undefined}    />
            </div>
            <div>
                <TitleDefinition documentCreation={undefined} setdocumentCreation={undefined}/>
            </div>
           
        </div>
    );
};

export {DocumentDesign};
