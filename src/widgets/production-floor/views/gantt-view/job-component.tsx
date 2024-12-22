
const JobComponent = ({item, getItemProps}) => {
    const isEditable = item.isEditable;
    return (
        <div
            {...getItemProps({
                style: {
                    background: isEditable ? item.bgColor : "#2E3091",
                    pointerEvents: isEditable ? "auto" : "none",
                    color: "white",
                    borderRadius: 0,
                    border: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: 'center',
                    gap: '10px',
                    opacity: isEditable && item.isHasSelected && !item.selected ? 0.3 : 1, // Reduce opacity if selected,
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