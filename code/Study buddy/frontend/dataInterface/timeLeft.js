import { minutesToMs } from '../util/calculateMs';
import { getGoal } from './goal';
import { getTimeStudiedInWeek } from './timeStudied';

/*
	50% framework
	50% manual
*/

export function getTimeLeftInGoal() {
	return Math.max(0, getGoal() - getTimeStudiedInWeek(Date.now()));
}