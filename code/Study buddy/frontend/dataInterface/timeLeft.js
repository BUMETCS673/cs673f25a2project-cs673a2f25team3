import { minutesToMs } from '../util/calculateMs';
import { getGoal } from './goal';
import { getTimeStudiedInWeek } from './timeStudied';

export function getTimeLeftInGoal() {
	return Math.max(0, getGoal() - getTimeStudiedInWeek(Date.now()));
}