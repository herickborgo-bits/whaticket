import { FormControl, Icon, InputLabel, MenuItem, Select } from "@mui/material";

const CustomSelect = ({ name, label, options, canNone }) => {
    return (
        <FormControl
            variant="outlined"
            margin="dense"
            fullWidth
        >
            <InputLabel>{label}</InputLabel>
            <Select
                sx={{ padding: "12px" }}
                name={name}
                label={label}
                defaultValue=""
                IconComponent={(_props) => {
                    const open = _props.className.toString().includes("iconOpen");
                    if (open) return <Icon>keyboard_arrow_up</Icon>;
                    return <Icon>keyboard_arrow_down</Icon>;
                }}
            >
                    {canNone && <MenuItem value={""}>None</MenuItem>}
                    {options &&
                        options.map((option) => {
                            return (
                                <MenuItem value={option.value} key={option.key}>
                                    {option.name}
                                </MenuItem>
                            );
                        })
                    }
            </Select>
        </FormControl>
    );
}

export default CustomSelect;