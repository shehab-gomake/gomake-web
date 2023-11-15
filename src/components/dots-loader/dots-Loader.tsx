import {useStyle} from "@/components/dots-loader/style";

const DotsLoader = () => {
    const {classes} = useStyle();
    return (
        <>
            <div style={classes.container} className="dots-loader">
                {
                    [1,2,3].map((v, index) => <div
                        style={{
                            ...classes.dot,
                            animationDelay: index * 0.2 + 's',
                    }}></div>)
                }
            </div>
        </>
    );
};

export {DotsLoader}