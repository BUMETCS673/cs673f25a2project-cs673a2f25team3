import { View } from "react-native";
import { homesStyles } from "../../styles/homeStyle";
import { getBuddyValues } from "../../util/buddyValues";
import { Cat } from "./cat";
import { Deer } from "./deer";

export function HomeBuddy() {
    const buddyStyle = {...getBuddyValues(), size: 200, outlineWidth: 4};

    var buddy = <Cat buddyStyle />;
    switch (buddyStyle.buddyType) {
        case "cat": buddy = <Cat buddyStyle />; break;
        case "deer": buddy = <Deer buddyStyle />; break;
    }

    return (
        <View style={homesStyles.buddyContainer}>
            {buddy}
        </View>
    )
}