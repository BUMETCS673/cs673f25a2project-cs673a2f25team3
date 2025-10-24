import { isSameWeek } from '../util/compareTimes';
import { getStudySessions } from './studySessions';

/*
    20% framework
    80% manual
*/

export function getTimeStudiedInWeek(date) {
  var timeStudied = 0;
  const studySessions = getStudySessions();

  studySessions.forEach(studySession => {
    if (isSameWeek(date, studySession.created_at)) timeStudied += studySession.duration;
  });

  return timeStudied;
}
