
interface IframeProps {
    src: string;
 };
const IframeDocumentDesign = ({ src } : IframeProps) => {
    return (
            <div style={{height:"100%",width:"100%", position: "relative"}}>
                <iframe
                    style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}}
                        src={src}
                        allowFullScreen
                ></iframe>
            </div>
    );
};

export {IframeDocumentDesign}; 