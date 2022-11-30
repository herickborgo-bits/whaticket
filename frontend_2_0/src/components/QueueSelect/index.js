import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { useTranslation } from "react-i18next";
import MDBox from "components/MDBox";
import { Autocomplete, Icon } from "@mui/material";

const useStyles = makeStyles(theme => ({
	chips: {
		display: "flex",
		flexWrap: "wrap",
	},
	chip: {
		margin: 2,
	},
}));

const QueueSelect = ({ selectedQueueIds, onChange }) => {
	const classes = useStyles();
	const { i18n } = useTranslation();
	const [queues, setQueues] = useState([]);

	useEffect(() => {
		(async () => {
			try {
				const { data } = await api.get("/queue");
				setQueues(data);
			} catch (err) {
				toastError(err);
			}
		})();
	}, []);

	const handleChange = e => {
		// onChange(e.target.value);
		onChange(e);
	};

	return (
		<div>
			<FormControl fullWidth margin="dense" variant="outlined">
				<InputLabel>{i18n.t("queueSelect.inputLabel")}</InputLabel>
				<Select
					label={i18n.t("queueSelect.inputLabel")}
					multiple
					name="queueIds"
					sx={{ padding: "12px" }}
					labelwidth={60}
					value={selectedQueueIds}
					onChange={handleChange}
					IconComponent={(_props) => {
                        const open = _props.className.toString().includes("iconOpen");

                        if (open) return <Icon>keyboard_arrow_up</Icon>

                        return <Icon>keyboard_arrow_down</Icon>
                    }}
					MenuProps={{
						anchorOrigin: {
							vertical: "bottom",
							horizontal: "left",
						},
						transformOrigin: {
							vertical: "top",
							horizontal: "left",
						},
						getcontentanchorel: null,
					}}
					renderValue={selected => (
						<div className={classes.chips}>
							{selected?.length > 0 &&
								selected.map(id => {
									const queue = queues.find(q => q.id === id);
									return queue ? (
										<Chip
											key={id}
											sx={{ backgroundColor: queue.color }}
											variant="outlined"
											label={queue.name}
											className={classes.chip}
										/>
									) : null;
								})}
						</div>
					)}
				>
					{queues.map(queue => (
						<MenuItem key={queue.id} value={queue.id}>
							{queue.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
};

export default QueueSelect;
