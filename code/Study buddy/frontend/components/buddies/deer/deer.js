import { buddyEye } from "../../../util/buddyEyes";
import { statusToString } from "../../../util/status";
import { Ears } from "./ears";
import { Eyes } from "./eyes";
import { HeadBase } from "./headBase";
import { Nose } from "./nose";

/*
	5% framework
	95% manual
*/

export function Deer({buddyDetails}) {
    buddyDetails.frameWidth = buddyDetails.size * 0.8 + buddyDetails.outlineWidth;
    buddyDetails.frameHeight = buddyDetails.size;

    return (
        <svg width={buddyDetails.frameWidth} height={buddyDetails.frameHeight} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={statusToString(buddyDetails.status) + " deer buddy"}>
            <HeadBase buddyDetails={buddyDetails} />
            <Ears buddyDetails={buddyDetails} />
            <Eyes buddyDetails={buddyDetails} />
            <Nose buddyDetails={buddyDetails} />
        </svg>
    );
}