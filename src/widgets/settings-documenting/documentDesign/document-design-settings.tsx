

import { useStyle } from "./style";
import {DocumentCreation} from "./components/document-creation/document-creation";

const DocumentDesign = () => {
    const {classes} = useStyle();
    return (
        <div style={classes.container}>
            <div style={classes.header}>
                <DocumentCreation documentCreation={{
                    doument: {
                        id: "",
                        documentType: ""
                    },
                    agent: {
                        id: "",
                        agentId:"",
                    }
                }} setdocumentCreation={undefined}    />
            </div>
           
        </div>
    );
};

export {DocumentDesign};
