/* 100% manual */

export function Nose({buddyDetails}) {
	const noseHeight = buddyDetails.frameHeight * 0.07;
	const noseWidth = buddyDetails.frameWidth * 0.1;
	const noseCenterX = buddyDetails.frameWidth * 0.5;
	const noseCenterY = buddyDetails.frameHeight * 0.67 - buddyDetails.outlineWidth / 2;

	const top = noseCenterY - noseHeight / 2;
	const bottom = noseCenterY + noseHeight / 2;
	const left = noseCenterX - noseWidth / 2;
	const right = noseCenterX + noseWidth / 2;

	return <path d={`M ${left} ${top} L ${right} ${top}, ${noseCenterX} ${bottom} Z`} fill={buddyDetails.outlineColor} stroke={buddyDetails.outlineColor} strokeWidth={buddyDetails.outlineWidth} />
}