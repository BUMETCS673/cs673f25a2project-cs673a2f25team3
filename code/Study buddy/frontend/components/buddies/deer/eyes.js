import { BuddyEye } from "../buddyEyes";

/* 100% manual */

export function Eyes({buddyDetails}) {
	const eyeWidth = buddyDetails.frameWidth * 0.1;
	const distFromSide = 0.3;
	const startY = buddyDetails.frameHeight * 0.55;

	return (
		<>
			<BuddyEye buddyDetails={buddyDetails} eyeWidth={eyeWidth} startX={buddyDetails.frameWidth * distFromSide} startY={startY} />
			<BuddyEye buddyDetails={buddyDetails} eyeWidth={eyeWidth} startX={buddyDetails.frameWidth * (1 - distFromSide) - eyeWidth} startY={startY} reverse={true} />
		</>
	)
}