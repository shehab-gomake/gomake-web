import {Card, CardActions, CardContent, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {useDrag} from "react-dnd";

const CardComponent = () => {
    const cardText = '1111';
    const [{ isDragging }, drag] = useDrag({
        type: 'CARD',
        item: { cardText },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    return (
        <Card ref={drag} sx={{display: 'block', flexShrink: 1, minWidth: '100%', minHeight: 150, boxShadow: '0 0 40px 0 #00000014' }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Word of the Day
                </Typography>
                <Typography variant="body2">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}

export {CardComponent}