import Svg, { Circle, Path } from "react-native-svg";
import { statusToString } from "../../util/status";
import { BuddyEye } from "./buddyEyes";

/*
	5% framework
	95% manual
*/

export function Cat({buddyDetails}) {
	return (
		<Svg
			width={buddyDetails.size * 0.92}
			height={buddyDetails.size}
			viewBox="0 0 184 200"
			accessibilityLabel={statusToString(buddyDetails.status) + " cat buddy"}
		>
			{/* head */}
			<Circle cx={92} cy={108} r={90} stroke={buddyDetails.outlineColor} strokeWidth={4} fill={buddyDetails.insideColor} />
			{/* ears */}
			<Path d={`M 10 73 L 2 2, 50 30`} fill={buddyDetails.insideColor} stroke={buddyDetails.outlineColor} strokeWidth={4} />
			<Path d={`M 174 73 L 182 2, 134 30`} fill={buddyDetails.insideColor} stroke={buddyDetails.outlineColor} strokeWidth={4} />
			{/* eyes */}
			<BuddyEye buddyDetails={buddyDetails} eyeWidth={18.4} startX={55} startY={96} />
			<BuddyEye buddyDetails={buddyDetails} eyeWidth={18.4} startX={129 - 18.4} startY={96} reverse={true} />
			{/* nose */}
			<Path d={`M 83 125 L 101 125, 92 139 Z`} fill={buddyDetails.outlineColor} stroke={buddyDetails.outlineColor} strokeWidth={4} />
			{/* whiskers */}
			<Path d={`M 36.8 132 L 73.6 132`} stroke={buddyDetails.outlineColor} strokeWidth={4} />
			<Path d={`M 147.2 132 L 110.4 132`} stroke={buddyDetails.outlineColor} strokeWidth={4} />
			<Path d={`M 40.5 112 L 75.4 124`} stroke={buddyDetails.outlineColor} strokeWidth={4} />
			<Path d={`M 143.5 112 L 108.6 124`} stroke={buddyDetails.outlineColor} strokeWidth={4} />
			<Path d={`M 40.5 152 L 75.4 140`} stroke={buddyDetails.outlineColor} strokeWidth={4} />
			<Path d={`M 143.5 152 L 108.6 140`} stroke={buddyDetails.outlineColor} strokeWidth={4} />
		</Svg>
	);
}



