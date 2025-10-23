import { statusToString } from "../../../util/status";
import { Ears } from "./ears";
import { Eyes } from "./eyes";
import { HeadBase } from "./headBase";
import { Nose } from "./nose";
import { Whiskers } from "./whiskers";

/*
	5% framework
	95% manual
*/

export function Cat({buddyDetails}) {
	buddyDetails.frameWidth = size * 0.9 + outlineWidth;
	buddyDetails.frameHeight = size;

	return (
		<svg width={buddyDetails.frameWidth} height={buddyDetails.frameHeight} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={statusToString(buddyDetails.status) + " cat buddy"}>
			<HeadBase buddyDetails={buddyDetails} />
			<Ears buddyDetails={buddyDetails} />
			<Eyes buddyDetails={buddyDetails} />
			<Nose buddyDetails={buddyDetails} />
			<Whiskers buddyDetails={buddyDetails} />
		</svg>
	);
}



