import { useGoal } from './goal';
import { useTimeStudiedInWeek } from './timeStudied';

/*
	50% framework
	50% manual
*/

export function useTimeLeftInGoal() {
	return Math.max(0, useGoal() - useTimeStudiedInWeek(Date.now()));
}