/* 100% manual */

export function SingleWhisker({buddyDetails, x1, y1, x2, y2}) {
    return <path 
        d={`M ${buddyDetails.frameWidth * x1} ${buddyDetails.frameHeight * y1} L ${buddyDetails.frameWidth * x2} ${buddyDetails.frameHeight * y2}`} 
        fill="none" 
        stroke={buddyDetails.outlineColor} 
        strokeWidth={buddyDetails.outlineWidth} 
    />
}