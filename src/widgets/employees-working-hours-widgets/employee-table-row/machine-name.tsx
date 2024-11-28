import {Fade, Tooltip} from "@mui/material";
import {FONT_FAMILY} from "@/utils/font-family";
import React, {useEffect, useRef, useState} from "react";

interface IProps {
    machineName: string;
}

const MachineNameComponent = ({machineName}: IProps) => {
    const ref = useRef(null);
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        const element = ref.current;
        setShow(element && element.scrollWidth > element.clientWidth);

    }, [ref])
    return <Tooltip title={machineName} TransitionComponent={Fade}
                    disableHoverListener={!show}

                    TransitionProps={{timeout: 1000}}>
                                <span ref={ref}
                                      style={{
                                          display: 'inline-block',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          maxWidth: '150px',
                                          minHeight: 'fit-content',
                                          ...FONT_FAMILY.Inter(400, 16)
                                      }}>{machineName}</span>
    </Tooltip>
}

export {MachineNameComponent}