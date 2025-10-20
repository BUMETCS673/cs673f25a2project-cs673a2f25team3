import { buddyEye } from "../../util/buddyEyes";
import { statusToString } from "../../util/status";

/*
	5% framework
	95% manual
*/

export function Deer({outlineColor = "black", insideColor = "#8B4513", size = 200, outlineWidth = 4, status = 4}) {
    const frameWidth = size * 0.8 + outlineWidth;
    const frameHeight = size;

    return (
        <svg width={frameWidth} height={frameHeight} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={statusToString(status) + " cat buddy"}>
            {headBase(frameWidth, frameHeight, outlineWidth, insideColor, outlineColor)}
            {ears(frameWidth, frameHeight, outlineWidth, insideColor, outlineColor)}
            {eyes(status, frameWidth, frameHeight, outlineColor, outlineWidth)}
            {nose(frameWidth, frameHeight, outlineWidth, outlineColor)}
        </svg>
    );
}

function headBase(frameWidth, frameHeight, outlineWidth, insideColor, outlineColor) {
    return <circle cx={frameWidth * 0.5} cy={frameHeight * 0.54} r={frameWidth * 0.49} stroke={outlineColor} strokeWidth={outlineWidth} fill={insideColor} />
}
function ears(frameWidth, frameHeight, outlineWidth, insideColor, outlineColor) {
    const antlerX = frameWidth * 0.17;
    const bottom = frameHeight * 0.24;

    const stickOne = frameHeight * 0.16;
    const stickTwo = frameHeight * 0.08;

    return (
        <>
            <path d={`M ${antlerX} 0 L ${antlerX} ${bottom}`} fill={insideColor} stroke={outlineColor} strokeWidth={outlineWidth} />
            <path d={`M ${antlerX * 0.5} ${stickOne} L ${antlerX} ${stickOne}`} fill={insideColor} stroke={outlineColor} strokeWidth={outlineWidth} />
            <path d={`M ${antlerX} ${stickTwo} L ${antlerX * 1.5} ${stickTwo}`} fill={insideColor} stroke={outlineColor} strokeWidth={outlineWidth} />
            
            <path d={`M ${frameWidth - antlerX} 0 L ${frameWidth - antlerX} ${bottom}`} fill={insideColor} stroke={outlineColor} strokeWidth={outlineWidth} />
            <path d={`M ${frameWidth - antlerX} ${stickOne} L ${frameWidth - antlerX * 0.5} ${stickOne}`} fill={insideColor} stroke={outlineColor} strokeWidth={outlineWidth} />
            <path d={`M ${frameWidth - antlerX * 1.5} ${stickTwo} L ${frameWidth - antlerX} ${stickTwo}`} fill={insideColor} stroke={outlineColor} strokeWidth={outlineWidth} />
            
        </>
    );
}
function eyes(status, frameWidth, frameHeight, outlineColor, outlineWidth) {
    const eyeWidth = frameWidth * 0.1;
    const distFromSide = 0.3;
    const startY = frameHeight * 0.55;

    return (
        <>
            {buddyEye(status, eyeWidth, frameWidth * distFromSide, startY, outlineColor, outlineWidth)}
            {buddyEye(status, eyeWidth, frameWidth * (1 - distFromSide) - eyeWidth, startY, outlineColor, outlineWidth, true)}
        </>
    )
}
function nose(frameWidth, frameHeight, outlineWidth, outlineColor) {
    return <circle cx={frameWidth * 0.5} cy={frameHeight*0.95 - outlineWidth / 2} r={frameHeight * 0.05} stroke={outlineColor} strokeWidth={outlineWidth} fill={outlineColor} />
}