const JobComponent = ({item, getItemProps, isSelected}) => {
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
                    opacity: isSelected ? 0.5 : 1, // Reduce opacity if selected,
                    transition: "opacity 0.2s, border 0.2s", // Smooth transitions
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