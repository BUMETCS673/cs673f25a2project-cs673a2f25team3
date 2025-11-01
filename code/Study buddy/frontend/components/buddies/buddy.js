import { View } from "react-native";
import { homesStyles } from "../../styles/homeStyle";
import { useBuddyValues } from "../../dataInterface/buddyValues";
import { Cat } from "./cat";
import { Deer } from "./deer";

/*
    10% framework
    90% manual
*/

export function HomeBuddy() {
    const buddyDetails = {...useBuddyValues()};

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