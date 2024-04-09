import Stack from "@mui/material/Stack";
import {useCallback, useEffect, useState} from "react";
import {IBoardMissionsStationTimer} from "@/widgets/production-floor/views/board-missions-view/stations/interface";
import {IconButton} from "@mui/material";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import {FONT_FAMILY} from "@/utils/font-family";

interface IProps extends IBoardMissionsStationTimer{
    onToggle: () => void
}
const ActionTimer = ({isTimerRunning, totalRunningTime, onToggle}: IProps) => {
    const [seconds, setSeconds] = useState<number>(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;

        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive]);

    useEffect(() => {
        setSeconds(totalRunningTime ? totalRunningTime : 0);
        setIsActive(isTimerRunning);
    }, [isTimerRunning, totalRunningTime])

    const formatTime = useCallback(() => {
        if (seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const remainingSeconds = seconds % 60;

            const hh = hours.toString().padStart(2, '0');
            const mm = minutes.toString().padStart(2, '0');
            const ss = remainingSeconds.toString().padStart(2, '0');

            return `${hh}:${mm}:${ss}`;
        }
        return '00:00:00'
    }, [seconds]);

    return (
        <Stack direction={'row'} alignItems={'center'}>
            <span style={{...FONT_FAMILY.Inter(600, 14), color: '#344054'}}>{formatTime()}</span>
            <IconButton onClick={(e) => {
                e.stopPropagation();
                onToggle();
                }}>
                {
                    isActive ? <PauseCircleIcon style={{color: '#43459D'}}/> : <PlayCircleIcon style={{color: '#43459D'}}/>
                }
            </IconButton>
        </Stack>
    )
}

export {ActionTimer}