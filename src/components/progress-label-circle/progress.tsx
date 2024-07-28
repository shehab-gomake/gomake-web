import {Box, CircularProgress, CircularProgressProps, Typography} from "@mui/material";

const CircularProgressWithLabel = (props: CircularProgressProps & { value: number }) => {
    return (
        <div style={{position: 'relative', display: 'inline-flex'}}>
            <CircularProgress
                variant="determinate"
                size={60}
                thickness={6}
                {...props}
                className={"foreground"}
            />
            <CircularProgress
                variant="determinate"
                className={"background"}
                thickness={6}
                size={60}
                value={100 - props.value}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color="white"
                    fontSize='16px'
                    fontWeight={600}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </div>
    );
}

export {CircularProgressWithLabel}