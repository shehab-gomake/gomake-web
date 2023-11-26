import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Stack } from '@mui/material';
import { useStyle } from './style';

interface IProps {
    imagePath: string;
    name?: string;
    job?: string;
}
const MemberCard = ({ imagePath ,name, job }: IProps) => {
    const { classes } = useStyle();

    return (
        <Card sx={{ width: 120 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            image={imagePath}
            alt="image"
          />
            <Stack direction={'column'} alignItems={"center"} gap={"6px"} >
            <Typography style={classes.nameMemberStyle} >{name}</Typography>
            <Typography style={classes.jobMemberStyle}>{job}</Typography>
          </Stack>
        </CardActionArea>
      </Card>
    )
};
export { MemberCard };