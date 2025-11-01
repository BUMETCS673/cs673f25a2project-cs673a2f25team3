import { statusToString } from "../../util/status";
import { BuddyEye } from "./buddyEyes";

/*
	5% framework
	95% manual
*/

export function Deer({buddyDetails}) {
	return (
		<svg width={buddyDetails.size * 0.82} height={buddyDetails.size} viewBox="0 0 164 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={statusToString(buddyDetails.status) + " deer buddy"}>
			{/* head */}
			<circle cx={82} cy={108} r={80} stroke={buddyDetails.outlineColor} strokeWidth={4} fill={buddyDetails.insideColor} />
			{/* antlers */}
			<path d={`M 28 0 L 28 48`} stroke={buddyDetails.outlineColor} strokeWidth={4} />
			<path d={`M 14 32 L 28 32`} stroke={buddyDetails.outlineColor} strokeWidth={4} />
			<path d={`M 28 16 L 42 16`} stroke={buddyDetails.outlineColor} strokeWidth={4} />
			
			<path d={`M 136 0 L 136 48`} stroke={buddyDetails.outlineColor} strokeWidth={4} />
			<path d={`M 136 32 L 150 32`} stroke={buddyDetails.outlineColor} strokeWidth={4} />
			<path d={`M 122 16 L 136 16`} stroke={buddyDetails.outlineColor} strokeWidth={4} />
			{/* eyes */}
			<BuddyEye buddyDetails={buddyDetails} eyeWidth={18.4} startX={49} startY={120} />
			<BuddyEye buddyDetails={buddyDetails} eyeWidth={18.4} startX={115 - 18.4} startY={120} reverse={true} />
			{/* nose */}
			<circle cx={82} cy={188} r={10} stroke={buddyDetails.outlineColor} strokeWidth={4} fill={buddyDetails.outlineColor} />
		</svg>
	);
}