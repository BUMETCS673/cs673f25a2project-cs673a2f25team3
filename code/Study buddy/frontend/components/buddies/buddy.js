import { View, Image } from "react-native";
import { homesStyles } from "../../styles/buddyStyles";
import { useBuddyValues } from "../../dataInterface/buddyValues";
import { statusToString } from "../../util/status";

/*
    40% manual
    60% AI
*/

// Static mapping of all 20 buddy images (5 statuses × 4 buddy types)
const buddyImages = {
    "Angry": {
        "cat": require("../../assets/images/Angry/Cat.png"),
        "deer": require("../../assets/images/Angry/Deer.png"),
        "owl": require("../../assets/images/Angry/Owl.png"),
        "wolf": require("../../assets/images/Angry/Wolf.png"),
    },
    "Dead": {
        "cat": require("../../assets/images/Dead/Cat.png"),
        "deer": require("../../assets/images/Dead/Deer.png"),
        "owl": require("../../assets/images/Dead/Owl.png"),
        "wolf": require("../../assets/images/Dead/Wolf.png"),
    },
    "Happy": {
        "cat": require("../../assets/images/Happy/Cat.png"),
        "deer": require("../../assets/images/Happy/Deer.png"),
        "owl": require("../../assets/images/Happy/Owl.png"),
        "wolf": require("../../assets/images/Happy/Wolf.png"),
    },
    "Normal": {
        "cat": require("../../assets/images/Normal/Cat.png"),
        "deer": require("../../assets/images/Normal/Deer.png"),
        "owl": require("../../assets/images/Normal/Owl.png"),
        "wolf": require("../../assets/images/Normal/Wolf.png"),
    },
    "Unhappy": {
        "cat": require("../../assets/images/Unhappy/Cat.png"),
        "deer": require("../../assets/images/Unhappy/Deer.png"),
        "owl": require("../../assets/images/Unhappy/Owl.png"),
        "wolf": require("../../assets/images/Unhappy/Wolf.png"),
    },
};

export function HomeBuddy() {
    const buddyDetails = {...useBuddyValues()};

    const buddyType = buddyDetails.buddyType || "deer";
    const statusString = statusToString(buddyDetails.status) || "Happy";
    const imageSource = buddyImages[statusString]?.[buddyType];

    return (
        <View style={homesStyles.buddyContainer}>
            <Image
                source={imageSource}
                style={{width: buddyDetails.size, height: buddyDetails.size}}
                resizeMode="contain"
                alt={`${statusString} ${buddyType}`}
            />
        </View>
        
    )
}