/*
	100% manual
*/

export function BuddyEye({buddyDetails, eyeWidth, startX, startY, reverse = false}) {
	switch (buddyDetails.status) {
		case 4: {
			const yChange = eyeWidth / -2;
			const xChange = eyeWidth / 4;
			
			return <path d={`M ${startX} ${startY} C ${startX + xChange} ${startY + yChange}, ${startX + eyeWidth - xChange} ${startY + yChange}, ${startX + eyeWidth} ${startY}`} fill="none" stroke={buddyDetails.outlineColor} strokeWidth={buddyDetails.outlineWidth} />;
		}
		case 3: {
			return <path d={`M ${startX} ${startY} L ${startX + eyeWidth} ${startY}`} fill="none" stroke={buddyDetails.outlineColor} strokeWidth={buddyDetails.outlineWidth} />;
		}
		case 2: {
			const eyeHeight = eyeWidth / 2;
			const left = !reverse ? startX : startX + eyeWidth;
			const right = !reverse ? startX + eyeWidth : startX;
			const top = startY - eyeHeight;
			const bottom = startY;

			return <path d={`M ${left} ${top} L ${right} ${bottom}`} fill="none" stroke={buddyDetails.outlineColor} strokeWidth={buddyDetails.outlineWidth} />;
		}
		case 1: {
			const eyeHeight = eyeWidth / 2;
			const left = !reverse ? startX : startX + eyeWidth;
			const right = !reverse ? startX + eyeWidth : startX;
			const top = startY - eyeHeight;
			const middleY = startY - eyeHeight / 2;
			const bottom = startY;

			return <path d={`M ${left} ${top} L ${right} ${middleY}, ${left}, ${bottom}`} fill="none" stroke={buddyDetails.outlineColor} strokeWidth={buddyDetails.outlineWidth} />;
		}
		default: {
			const eyeHeight = eyeWidth / 2;
			const left = startX + eyeWidth / 4;
			const right = startX + eyeWidth * 3 / 4;
			const top = startY - eyeHeight;
			const bottom = startY;

			return (
				<>
					<path d={`M ${left} ${top} L ${right} ${bottom}`} fill="none" stroke={buddyDetails.outlineColor} strokeWidth={buddyDetails.outlineWidth} />
					<path d={`M ${left} ${bottom} L ${right} ${top}`} fill="none" stroke={buddyDetails.outlineColor} strokeWidth={buddyDetails.outlineWidth} />
				</>
			);
		}
	}
}