/*
	100% manual
*/

export function statusToString(status) {
    switch (status) {
        case 4: return "Happy";
        case 3: return "Okay";
        case 2: return "Sad";
        case 1: return "Sick";
        case 0: return "Dead";
    }
}