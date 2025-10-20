export function buddyEye(status, eyeWidth, startX, startY, outlineColor, outlineWidth) {
	switch (status) {
		case 4: {
			const yChange = eyeWidth / -2;
			const xChange = eyeWidth / 4;
			
			return <path d={`M ${startX} ${startY} C ${startX + xChange} ${startY + yChange}, ${startX + eyeWidth - xChange} ${startY + yChange}, ${startX + eyeWidth} ${startY}`} fill="none" stroke={outlineColor} strokeWidth={outlineWidth} />;
		}
		case 0: {
			const eyeHeight = eyeWidth / 2;
			const left = startX + eyeWidth / 4;
			const right = startX + eyeWidth * 3 / 4;
			const top = startY - eyeHeight;
			const bottom = startY;

			return (
				<>
					<path d={`M ${left} ${top} L ${right} ${bottom}`} fill="none" stroke={outlineColor} strokeWidth={outlineWidth} />
					<path d={`M ${left} ${bottom} L ${right} ${top}`} fill="none" stroke={outlineColor} strokeWidth={outlineWidth} />
				</>
			);
		}
	}
}