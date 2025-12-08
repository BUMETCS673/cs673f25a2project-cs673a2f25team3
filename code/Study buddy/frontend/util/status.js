/*
	100% manual
*/

export function statusToString(status) {
    switch (status) {
        case 4: return "Happy";
        case 3: return "Normal";
        case 2: return "Unhappy";
        case 1: return "Angry";
        case 0: return "Dead";
    }
}