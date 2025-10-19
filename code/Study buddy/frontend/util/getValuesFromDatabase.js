
import { daysToMs, minutesToMs } from './calculateMs';
import { isSameDay } from './compareDays';

/*
	100% manual
*/

export function getTimeStudied(date) {
	var timeStudied = 0;
	const studySessions = getStudySessions();

	studySessions.forEach(studySession => {
	if (isSameDay(date, studySession.created_at)) timeStudied += studySession.duration
	});

	return timeStudied;
}

// needs to be updated to support real data
export function getStudySessions() {
	// create a fake example

	return [
		createFakeStudySession(5, Date.now()),
		createFakeStudySession(3, Date.now()),
		createFakeStudySession(2, Date.now()),
		createFakeStudySession(20, Date.now() - daysToMs(5))
	]
}

function createFakeStudySession(minutes, endTime) {
  return {
    id: 3,
    user_id: 3,
    duration: minutesToMs(minutes),
    start_time: endTime - minutesToMs(minutes),
    end_time: endTime,
    created_at: endTime
  };
}

// needs to be updated to support real data
export function getGoal() {
  return minutesToMs(30);
}