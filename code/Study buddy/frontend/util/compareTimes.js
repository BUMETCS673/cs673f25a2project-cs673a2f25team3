/*
  50% AI
  50% Manual
*/

import { daysToMs } from "./calculateMs";

export function isSameDay(dayOne, dayTwo) {
	const dateOne = new Date(dayOne);
	const dateTwo = new Date(dayTwo);

	return (
    dateOne.getFullYear() === dateTwo.getFullYear() &&
    dateOne.getMonth() === dateTwo.getMonth() &&
    dateOne.getDate() === dateTwo.getDate()
  );
}

export function isSameWeek(dayOne, dayTwo) {
  const dayFirst = Math.min(dayOne, dayTwo);
  const dayLast = Math.max(dayOne, dayTwo);
  const dateFirst = new Date(dayFirst);
	const dateLast = new Date(dayLast);
  
  if (dayLast - dayFirst > daysToMs(7)) return false;
  if (dateLast.getDay() == dateFirst.getDay()) {
    return dayLast - dayFirst < daysToMs(2);
  } else return dateLast.getDay() >= dateFirst.getDay();
}