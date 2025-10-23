/* 100% manual */

export function Nose({buddyDetails}) {
	return <circle 
		cx={buddyDetails.frameWidth * 0.5} 
		cy={buddyDetails.frameHeight*0.95 - buddyDetails.outlineWidth / 2} 
		r={buddyDetails.frameHeight * 0.05} 
		stroke={buddyDetails.outlineColor} 
		strokeWidth={buddyDetails.outlineWidth} 
		fill={buddyDetails.outlineColor} 
	/>
}