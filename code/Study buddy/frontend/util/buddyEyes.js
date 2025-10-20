export function eye(status, eyeWidth, startX, startY, outlineColor, outlineWidth) {
    switch (status) {
        case 4: {
            const yChange = eyeWidth / -2;
            const xChange = eyeWidth / 4;
            
            const eyeString = "M " + startX + " " + startY + " C " + (startX + xChange) + " " + (startY + yChange) + ", " + (startX + eyeWidth - xChange) + " " + (startY + yChange) + ", " + (startX + eyeWidth) + " " + startY;
            return <path d={eyeString} fill="none" stroke={outlineColor} strokeWidth={outlineWidth} />;
        }
    }
}