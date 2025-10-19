export function Cat({outlineColor = "black", insideColor = "orange", size = 200, outlineWidth = 4, health = "happy"}) {
	const width = size * 0.9 + outlineWidth;
	const height = size;

	return (
		<svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" role="img" aria-label={health + " Cat Buddy"}>
			<circle cx={width * 0.5} cy={height * 0.55 - outlineWidth / 2} r={size * 0.45} stroke={outlineColor} stroke-width={outlineWidth} fill={insideColor} />
			<path d={getEarString(true, width, height, outlineWidth)} fill={insideColor} stroke={outlineColor} stroke-width={outlineWidth} />
			<path d={getEarString(false, width, height, outlineWidth)} fill={insideColor} stroke={outlineColor} stroke-width={outlineWidth} />
			{getEyes(health, width, height, outlineColor, outlineWidth)}
			<path d={noseString(width, height, outlineWidth)} fill={outlineColor} stroke={outlineColor} stroke-width={outlineWidth} />
			{whiskers(width, height, outlineColor, outlineWidth)}
		</svg>
	);
}

function getEyes(health, width, height, outlineColor, outlineWidth) {
	if (health == "happy") {
		return (
			<>
				<path d={getEyeString(true, width, height)} fill="none" stroke={outlineColor} stroke-width={outlineWidth} />
				<path d={getEyeString(false, width, height)} fill="none" stroke={outlineColor} stroke-width={outlineWidth} />
			</>
		)
	} else {
		return <></>;
	}
}

function getEyeString(left, imageWidth, imageHeight) {
	const eyeWidth = imageWidth * 0.15;
	const distFromSide = 0.25;
	const startY = imageHeight * 0.5;
	const yChange = eyeWidth / -2;
	const xChange = eyeWidth / 4;

	const startX = left ? imageWidth * distFromSide : imageWidth * (1 - distFromSide) - eyeWidth;
	
	return "M " + startX + " " + startY + " C " + (startX + xChange) + " " + (startY + yChange) + ", " + (startX + eyeWidth - xChange) + " " + (startY + yChange) + ", " + (startX + eyeWidth) + " " + startY;
}
function getEarString(left, width, height, outlineWidth) {
	const x1 = left ? width * 0.054 : width -  width * 0.054;
	const y1 = height * 0.345 + outlineWidth;
	const x2 = left ? (outlineWidth / 2) : width - (outlineWidth / 2);
	const y2 = (outlineWidth / 2);
	const x3 = left ? width * 0.27 : width - width * 0.27;
	const y3 = height * 0.15;
	return "M " + x1 + " " + y1 + " L " + x2 + " " + y2 + ", " + x3 + " " + y3;
}

function whiskers(width, height, outlineColor, outlineWidth) {
	function singleWhisker(x1, y1, x2, y2) {
		return <path d={"M " + x1 + " " + y1 + " L " + x2 + " " + y2} fill="none" stroke={outlineColor} stroke-width={outlineWidth} />
	}

	return (
		<>
			{singleWhisker(width * 0.2, height * 0.66, width * 0.4, height * 0.66)}
			{singleWhisker(width * 0.8, height * 0.66, width * 0.6, height * 0.66)}
			{singleWhisker(width * 0.22, height * 0.56, width * 0.41, height * 0.62)}
			{singleWhisker(width * 0.78, height * 0.56, width * 0.59, height * 0.62)}
			{singleWhisker(width * 0.22, height * 0.76, width * 0.41, height * 0.70)}
			{singleWhisker(width * 0.78, height * 0.76, width * 0.59, height * 0.70)}
		</>
	)
}

function noseString(width, height, outlineWidth) {
	const noseHeight = height * 0.07;
	const noseWidth = width * 0.1;
	const noseCenterX = width * 0.5;
	const noseCenterY = height * 0.67 - outlineWidth / 2;

	const top = noseCenterY - noseHeight / 2;
	const bottom = noseCenterY + noseHeight / 2;
	const left = noseCenterX - noseWidth / 2;
	const right = noseCenterX + noseWidth / 2;

	return "M " + left + " " + top + " L " + right + " " + top + ", " + noseCenterX + " " + bottom + " Z";
}

