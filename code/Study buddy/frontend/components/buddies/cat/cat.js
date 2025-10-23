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

export function Cat({outlineColor = "black", insideColor = "orange", size = 200, outlineWidth = 4, status = 4}) {
	const frameWidth = size * 0.9 + outlineWidth;
	const frameHeight = size;
	const buddyDetails = {
		outlineColor: outlineColor,
		insideColor: insideColor,
		frameWidth: frameWidth,
		frameHeight: frameHeight,
		outlineWidth: outlineWidth,
		status: status
	}

	return (
		<svg width={frameWidth} height={frameHeight} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={statusToString(status) + " cat buddy"}>
			<HeadBase buddyDetails={buddyDetails} />
			<Ears buddyDetails={buddyDetails} />
			<Eyes buddyDetails={buddyDetails} />
			<Nose buddyDetails={buddyDetails} />
			<Whiskers buddyDetails={buddyDetails} />
		</svg>
	);
}



