/*
  80% AI
  20% Manual
*/

export function isSameDay(dayOne, dayTwo) {
	const dateOne = new Date(dayOne);
	const dateTwo = new Date(dayTwo);

	return (
    dateOne.getFullYear() === dateTwo.getFullYear() &&
    dateOne.getMonth() === dateTwo.getMonth() &&
    dateOne.getDate() === dateTwo.getDate()
  );
}