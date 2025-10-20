export function buddyEye(status, eyeWidth, startX, middleY, outlineColor, outlineWidth) {
    switch (status) {
        case 4: {
            const yChange = eyeWidth / -2;
            const xChange = eyeWidth / 4;
            
            return <path d={`M ${startX} ${middleY} C ${startX + xChange} ${middleY + yChange}, ${startX + eyeWidth - xChange} ${middleY + yChange}, ${startX + eyeWidth} ${middleY}`} fill="none" stroke={outlineColor} strokeWidth={outlineWidth} />;
        }
    }
}