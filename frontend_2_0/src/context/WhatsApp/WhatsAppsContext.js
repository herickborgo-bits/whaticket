import React, { createContext } from "react";

import useWhatsApps from "../../Hooks/useWhatsApps";

const WhatsAppsContext = createContext();

const WhatsAppsProvider = ({ children }) => {
	const { loading, whatsApps } = useWhatsApps();

	return (
		<WhatsAppsContext.Provider value={{ whatsApps, loading }}>
			{children}
		</WhatsAppsContext.Provider>
	);
};

export { WhatsAppsContext, WhatsAppsProvider };
