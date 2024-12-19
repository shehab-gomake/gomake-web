const JobComponent = ({item, getItemProps}) => {
    const isEditable = item.isEditable;
    return (
        <div
            {...getItemProps({
                style: {
                    backgroundColor: isEditable ? item.bgColor : "#2E3091",
                    pointerEvents: isEditable ? "auto" : "none",
                    color: "white",
                    borderRadius: "4px",
                    border: "1px solid inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: 'center',
                    gap: '10px',
                },
            })}
        >
            <div className="rct-item-content" style={{textAlign: "center"}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',}}>
                    <div>{item.title}</div>
                    {
                        isEditable && <div style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            border: '2px solid #FFF',
                            backgroundColor: item.statusColor,
                        }}/>
                    }
                </div>
            </div>
        </div>
    );
};

export {JobComponent}