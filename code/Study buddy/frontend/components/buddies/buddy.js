import { View } from "react-native";
import { homesStyles } from "../../styles/homeStyle";
import { getBuddyValues } from "../../dataInterface/buddyValues";
import { Cat } from "./cat/cat";
import { Deer } from "./deer/deer";

export function HomeBuddy() {
    const buddyDetails = {...getBuddyValues(), size: 200, outlineWidth: 4};

    var buddy;
    switch (buddyDetails.buddyType) {
        case "cat": buddy = <Cat buddyDetails={buddyDetails} />; break;
        case "deer": buddy = <Deer buddyDetails={buddyDetails} />; break;
    }

    return (
        <View style={homesStyles.buddyContainer}>
            {buddy}
        </View>
    )
}