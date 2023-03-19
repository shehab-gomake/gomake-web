import {Box, CircularProgress, CircularProgressProps, Typography} from "@mui/material";

const CircularProgressWithLabel = (props: CircularProgressProps & { value: number }) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress size={60}  variant="determinate" color={'inherit'} thickness={6}   {...props} />
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
        </Box>
    );
}

export {CircularProgressWithLabel}