import { View, Text } from "react-native";
import { homesStyles } from "../../styles/homeStyle";
import { Cat } from "./cat";
import { Deer } from "./deer";
import { styles } from "../../styles/style";
import { AuthContext } from "../../AuthContext";
import { useContext, useEffect, useState } from "react";

/*
    10% framework
    90% manual
*/

export function HomeBuddy() {
	const { studyData } = useContext(AuthContext);
	const [buddy, setBuddy] = useState();

	useEffect(() => {
		const parsedExp = (() => {
			const raw = studyData?.exp;
			if (Number.isFinite(raw)) return raw;
			if (typeof raw === "string" && raw.trim().length > 0) {
				const asNumber = Number(raw);
				if (Number.isFinite(asNumber)) return asNumber;
			}
			return 0;
		})();
		const size = Math.max(0, 100 + parsedExp / 2);

		if (studyData) {
			const buddyDetails = {
				...studyData,
				outlineColor: "black",
				insideColor: "#8B4513",
				size: size
			}
			console.log(buddyDetails);
			switch (studyData.type) {
				case "cat": setBuddy(<Cat buddyDetails={buddyDetails} />); break;
				case "deer": setBuddy( <Deer buddyDetails={buddyDetails} />); break;
			}
		}
	}, [studyData]);
	
	return (
		<View style={homesStyles.buddyContainer}>
			{buddy}
			<Text style={styles.cardH1}>{studyData?.name}</Text>
		</View>
	)
}