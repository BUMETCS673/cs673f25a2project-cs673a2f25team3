/* 100% manual */

export function HeadBase({buddyDetails}) {
	return <circle 
		cx={buddyDetails.frameWidth * 0.5} 
		cy={buddyDetails.frameHeight * 0.54} 
		r={buddyDetails.frameWidth * 0.49} 
		stroke={buddyDetails.outlineColor} 
		strokeWidth={buddyDetails.outlineWidth} 
		fill={buddyDetails.insideColor} 
	/>;
}