import React from "react";

import { FormControl, MenuItem, Grid, Select } from "@mui/material";
import { Checkbox, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";

const TicketsQueueSelect = ({
	userQueues,
	selectedQueueIds = [],
	onChange,
}) => {
	const { i18n } = useTranslation();

	const handleChange = e => {
		onChange(e.target.value);
	};

	return (
		<Grid style={{ width: 150, marginLeft: 25 }}>
			<FormControl fullWidth margin="dense">
				<Select
					multiple
					displayEmpty
					variant="outlined"
					value={selectedQueueIds}
					onChange={handleChange}
					MenuProps={{
						anchorOrigin: {
							vertical: "bottom",
							horizontal: "left",
						},
						transformOrigin: {
							vertical: "top",
							horizontal: "left",
						},
						getContentAnchorEl: null,
					}}
					renderValue={() => i18n.t("ticketsQueueSelect.placeholder")}
				>
					{userQueues?.length > 0 &&
						userQueues.map(queue => (
							<MenuItem dense key={queue.id} value={queue.id}>
								<Checkbox
									style={{
										color: queue.color,
									}}
									size="small"
									color="primary"
									checked={selectedQueueIds.indexOf(queue.id) > -1}
								/>
								<ListItemText primary={queue.name} />
							</MenuItem>
						))}
				</Select>
			</FormControl>
		</Grid>
	);
};

export default TicketsQueueSelect;
