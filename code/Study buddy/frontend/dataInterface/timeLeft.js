import { minutesToMs } from '../util/calculateMs';
import { getGoal } from './goal';
import { getTimeStudiedInWeek } from './timeStudied';

/*
	50% framework
	50% manual
*/

export async function getTimeLeftInGoal(token) {
	return Math.max(0, await getGoal(token) - await getTimeStudiedInWeek(Date.now(), token));
}