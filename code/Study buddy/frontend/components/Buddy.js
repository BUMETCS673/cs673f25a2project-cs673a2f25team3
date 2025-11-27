import { View, Image } from "react-native";
import { buddyStyles } from "../styles/buddyStyles";
import { statusToString } from "../util/status";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";

import { API_BASE_URL } from "@env";

/*
    40% manual
    60% AI
*/

// Static mapping of all 20 buddy images (5 statuses × 4 buddy types)
const buddyImages = {
    "Angry": {
        "cat": require("../assets/images/Angry/Cat.png"),
        "deer": require("../assets/images/Angry/Deer.png"),
        "owl": require("../assets/images/Angry/Owl.png"),
        "wolf": require("../assets/images/Angry/Wolf.png"),
    },
    "Dead": {
        "cat": require("../assets/images/Dead/Cat.png"),
        "deer": require("../assets/images/Dead/Deer.png"),
        "owl": require("../assets/images/Dead/Owl.png"),
        "wolf": require("../assets/images/Dead/Wolf.png"),
    },
    "Happy": {
        "cat": require("../assets/images/Happy/Cat.png"),
        "deer": require("../assets/images/Happy/Deer.png"),
        "owl": require("../assets/images/Happy/Owl.png"),
        "wolf": require("../assets/images/Happy/Wolf.png"),
    },
    "Normal": {
        "cat": require("../assets/images/Normal/Cat.png"),
        "deer": require("../assets/images/Normal/Deer.png"),
        "owl": require("../assets/images/Normal/Owl.png"),
        "wolf": require("../assets/images/Normal/Wolf.png"),
    },
    "Unhappy": {
        "cat": require("../assets/images/Unhappy/Cat.png"),
        "deer": require("../assets/images/Unhappy/Deer.png"),
        "owl": require("../assets/images/Unhappy/Owl.png"),
        "wolf": require("../assets/images/Unhappy/Wolf.png"),
    },
};

export function Buddy() {
    const { studyData, token } = useContext(AuthContext);
    
    const[buddyType, setBuddyType] = useState("deer");
    const [statusString, setStatusString] = useState("Happy");
    const [imageSource, setImageSource] = useState(buddyImages["Happy"]?.["deer"]);
    const [size, setSize] = useState(150);

    useEffect(() => {
			async function fetchData() {
				try {
					const res = await fetch(`${API_BASE_URL}/buddy/me`, {
						headers: { Authorization: `Bearer ${token}` }
					});
		
					const buddy = await res.json();
					const tempBuddyType = buddy.type || "deer";
					const tempStatusString = statusToString(buddy.status) || "Happy";
					setBuddyType(tempBuddyType);
					setStatusString(tempStatusString);
					setImageSource(buddyImages[tempStatusString]?.[tempBuddyType]);
					setSize(Math.max(0, 150 + buddy.exp / 2));
				} catch (err) {
					console.log("Failed to fetch study buddy data:", err);
				}
			}
			
			fetchData();
			
		}, [studyData]);

    return (
        <View style={buddyStyles.buddyContainer}>
            <Image
                source={imageSource}
                style={{width: size, height: size}}
                resizeMode="contain"
                alt={`${statusString} ${buddyType}`}
            />
        </View>
    )
}