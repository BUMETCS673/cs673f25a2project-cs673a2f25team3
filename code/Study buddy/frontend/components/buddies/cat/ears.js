/* 100% manual */

export function Ears({buddyDetails}) {
	const x1Left = buddyDetails.frameWidth * 0.054;
	const x1Right = buddyDetails.frameWidth - x1Left;
	const y1 = buddyDetails.frameHeight * 0.345 + buddyDetails.outlineWidth;
	const x2Left = buddyDetails.outlineWidth / 2;
	const x2Right = buddyDetails.frameWidth - x2Left;
	const y2 = buddyDetails.outlineWidth / 2;
	const x3Left = buddyDetails.frameWidth * 0.27;
	const x3Right = buddyDetails.frameWidth - x3Left;
	const y3 = buddyDetails.frameHeight * 0.15;

	return (
		<>
			<path d={`M ${x1Left} ${y1} L ${x2Left} ${y2}, ${x3Left} ${y3}`} fill={buddyDetails.insideColor} stroke={buddyDetails.outlineColor} strokeWidth={buddyDetails.outlineWidth} />
			<path d={`M ${x1Right} ${y1} L ${x2Right} ${y2}, ${x3Right} ${y3}`} fill={buddyDetails.insideColor} stroke={buddyDetails.outlineColor} strokeWidth={buddyDetails.outlineWidth} />
		</>
	);
}