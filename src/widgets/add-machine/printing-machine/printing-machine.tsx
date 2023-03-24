import TextField from "@mui/material/TextField";
import {FormControl, InputLabel, MenuItem, Select, Switch} from "@mui/material";
import {GomakePrimaryButton, GomakeTextInput} from "@/components";

const PrintingMachineForm = () => {
    return (
        <div>
            <TextField label={'Monthly maintenance cost'} variant={'outlined'}/>
            <TextField label={'Electricity cost per working hour'} variant={'outlined'}/>
            <TextField label={'Daily Productivity in hours'} variant={'outlined'}/>
            <TextField label={'Life expectancy years'} variant={'outlined'}/>
            <TextField label={'Print life '} variant={'outlined'}/>
            <TextField label={'Minimum manpower operation'} variant={'outlined'}/>
            <TextField label={'Minimum manpower operation'} variant={'outlined'}/>
            <TextField label={'Setup time (min)'} variant={'outlined'}/>
            <TextField label={'Setup time (min)'} variant={'outlined'}/>
            <FormControl>
                <InputLabel id="resolution-select-label">Resolution</InputLabel>
                <Select labelId="resolution-select-label"
                        id="demo-simple-select"
                        label="Age">
                    <MenuItem value={1}>2400 X 2400</MenuItem>
                    <MenuItem value={2}>2438 X 2438</MenuItem>
                </Select>
            </FormControl>
            <h3>Media Dimensions - Minimum</h3>
            <TextField label={'Media Width'} variant={'outlined'}/>
            <TextField label={'Media Length'} variant={'outlined'}/>
            <h3>Media Dimensions - Maximum</h3>
            <TextField label={'Media Width'} variant={'outlined'}/>
            <TextField label={'Media Length'} variant={'outlined'}/>
            <h3>Minimal margin without printing</h3>
            <TextField label={'Width margin'} variant={'outlined'}/>
            <TextField label={'Length margin'} variant={'outlined'}/>
            <h3>Media Weight</h3>
            <TextField label={'min'} variant={'outlined'}/>
            <TextField label={'max'} variant={'outlined'}/>
            <h3>Media Thickness</h3>
            <TextField label={'min'} variant={'outlined'}/>
            <TextField label={'max'} variant={'outlined'}/>
            <h3>Media Thickness</h3>
            <TextField label={'min'} variant={'outlined'}/>
            <TextField label={'max'} variant={'outlined'}/>
            <h3>Media coating unit</h3>
            <InputLabel> media coating <Switch/> </InputLabel>
            <TextField label={'max'} variant={'outlined'}/>
            <h3>Rated speed by meter by number of colors</h3>
            <InputLabel> media coating <Switch/> </InputLabel>
            <TextField label={'max'} variant={'outlined'}/>
            <h3>Rated speed by paper size by number of colors</h3>
                <GomakePrimaryButton>add color</GomakePrimaryButton>
        </div>
    );
}
export {PrintingMachineForm};