/* 100% manual */

export function Ears({buddyDetails}) {
	const antlerX = buddyDetails.frameWidth * 0.17;
    const bottom = buddyDetails.frameHeight * 0.24;

    const stickOne = buddyDetails.frameHeight * 0.16;
    const stickTwo = buddyDetails.frameHeight * 0.08;

    return (
        <>
            <path d={`M ${antlerX} 0 L ${antlerX} ${bottom}`} fill={buddyDetails.insideColor} stroke={buddyDetails.outlineColor} strokeWidth={buddyDetails.outlineWidth} />
            <path d={`M ${antlerX * 0.5} ${stickOne} L ${antlerX} ${stickOne}`} fill={buddyDetails.insideColor} stroke={buddyDetails.outlineColor} strokeWidth={buddyDetails.outlineWidth} />
            <path d={`M ${antlerX} ${stickTwo} L ${antlerX * 1.5} ${stickTwo}`} fill={buddyDetails.insideColor} stroke={buddyDetails.outlineColor} strokeWidth={buddyDetails.outlineWidth} />
            
            <path d={`M ${buddyDetails.frameWidth - antlerX} 0 L ${buddyDetails.frameWidth - antlerX} ${bottom}`} fill={buddyDetails.insideColor} stroke={buddyDetails.outlineColor} strokeWidth={buddyDetails.outlineWidth} />
            <path d={`M ${buddyDetails.frameWidth - antlerX} ${stickOne} L ${buddyDetails.frameWidth - antlerX * 0.5} ${stickOne}`} fill={buddyDetails.insideColor} stroke={buddyDetails.outlineColor} strokeWidth={buddyDetails.outlineWidth} />
            <path d={`M ${buddyDetails.frameWidth - antlerX * 1.5} ${stickTwo} L ${buddyDetails.frameWidth - antlerX} ${stickTwo}`} fill={buddyDetails.insideColor} stroke={buddyDetails.outlineColor} strokeWidth={buddyDetails.outlineWidth} />
            
        </>
    );
}