/*
	100% manual
*/

import { statusToString } from "../../util/status";

export function Cat({outlineColor = "black", insideColor = "orange", size = 200, outlineWidth = 4, status = 4}) {
	const frameWidth = size * 0.9 + outlineWidth;
	const frameHeight = size;

	return (
		<svg width={frameWidth} height={frameHeight} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={statusToString(status) + " cat buddy"}>
			{headBase(frameWidth, frameHeight, outlineWidth, insideColor, outlineColor)}
			{ears(frameWidth, frameHeight, outlineWidth, insideColor, outlineColor)}
			{eyes(status, frameWidth, frameHeight, outlineColor, outlineWidth)}
			{nose(frameWidth, frameHeight, outlineWidth, outlineColor)}
			{whiskers(frameWidth, frameHeight, outlineColor, outlineWidth)}
		</svg>
	);
}

function headBase(frameWidth, frameHeight, outlineWidth, insideColor, outlineColor) {
	return <circle cx={frameWidth * 0.5} cy={frameHeight * 0.55 - outlineWidth / 2} r={frameWidth * 0.49} stroke={outlineColor} stroke-width={outlineWidth} fill={insideColor} />
}
function ears(frameWidth, frameHeight, outlineWidth, insideColor, outlineColor) {
	return (
		<>
			<path d={getEarString(true, frameWidth, frameHeight, outlineWidth)} fill={insideColor} stroke={outlineColor} stroke-width={outlineWidth} />
			<path d={getEarString(false, frameWidth, frameHeight, outlineWidth)} fill={insideColor} stroke={outlineColor} stroke-width={outlineWidth} />
		</>
	);
}
function eyes(status, frameWidth, frameHeight, outlineColor, outlineWidth) {
	switch (status) {
		// eyes look like n
		case 4: return (
			<>
				<path d={getEyeString(true, frameWidth, frameHeight)} fill="none" stroke={outlineColor} stroke-width={outlineWidth} />
				<path d={getEyeString(false, frameWidth, frameHeight)} fill="none" stroke={outlineColor} stroke-width={outlineWidth} />
			</>
		)
		// need to add eyes for 0-3
		default: return <></>
	}
}
function nose(frameWidth, frameHeight, outlineWidth, outlineColor) {
	return <path d={getNoseString(frameWidth, frameHeight, outlineWidth)} fill={outlineColor} stroke={outlineColor} stroke-width={outlineWidth} />
}
function whiskers(frameWidth, frameHeight, outlineColor, outlineWidth) {
	function singleWhisker(x1, y1, x2, y2) {
		return <path d={"M " + x1 + " " + y1 + " L " + x2 + " " + y2} fill="none" stroke={outlineColor} stroke-width={outlineWidth} />
	}

	return (
		<>
			{singleWhisker(frameWidth * 0.2, frameHeight * 0.66, frameWidth * 0.4, frameHeight * 0.66)}
			{singleWhisker(frameWidth * 0.8, frameHeight * 0.66, frameWidth * 0.6, frameHeight * 0.66)}
			{singleWhisker(frameWidth * 0.22, frameHeight * 0.56, frameWidth * 0.41, frameHeight * 0.62)}
			{singleWhisker(frameWidth * 0.78, frameHeight * 0.56, frameWidth * 0.59, frameHeight * 0.62)}
			{singleWhisker(frameWidth * 0.22, frameHeight * 0.76, frameWidth * 0.41, frameHeight * 0.70)}
			{singleWhisker(frameWidth * 0.78, frameHeight * 0.76, frameWidth * 0.59, frameHeight * 0.70)}
		</>
	)
}

function getEyeString(left, frameWidth, frameHeight) {
	const eyeWidth = frameWidth * 0.15;
	const distFromSide = 0.25;
	const startY = frameHeight * 0.5;
	const yChange = eyeWidth / -2;
	const xChange = eyeWidth / 4;

	const startX = left ? frameWidth * distFromSide : frameWidth * (1 - distFromSide) - eyeWidth;
	
	return "M " + startX + " " + startY + " C " + (startX + xChange) + " " + (startY + yChange) + ", " + (startX + eyeWidth - xChange) + " " + (startY + yChange) + ", " + (startX + eyeWidth) + " " + startY;
}
function getEarString(left, frameWidth, frameHeight, outlineWidth) {
	const x1 = left ? frameWidth * 0.054 : frameWidth -  frameWidth * 0.054;
	const y1 = frameHeight * 0.345 + outlineWidth;
	const x2 = left ? (outlineWidth / 2) : frameWidth - (outlineWidth / 2);
	const y2 = (outlineWidth / 2);
	const x3 = left ? frameWidth * 0.27 : frameWidth - frameWidth * 0.27;
	const y3 = frameHeight * 0.15;
	return "M " + x1 + " " + y1 + " L " + x2 + " " + y2 + ", " + x3 + " " + y3;
}
function getNoseString(frameWidth, frameHeight, outlineWidth) {
	const noseHeight = frameHeight * 0.07;
	const noseWidth = frameWidth * 0.1;
	const noseCenterX = frameWidth * 0.5;
	const noseCenterY = frameHeight * 0.67 - outlineWidth / 2;

	const top = noseCenterY - noseHeight / 2;
	const bottom = noseCenterY + noseHeight / 2;
	const left = noseCenterX - noseWidth / 2;
	const right = noseCenterX + noseWidth / 2;

	return "M " + left + " " + top + " L " + right + " " + top + ", " + noseCenterX + " " + bottom + " Z";
}

