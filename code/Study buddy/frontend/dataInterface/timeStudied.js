import { isSameWeek } from '../util/compareTimes';
import { getStudySessions } from './studySessions';

/*
    20% framework
    80% manual
*/

export async function getTimeStudiedInWeek(date, token) {
  var timeStudied = 0;
  const studySessions = await getStudySessions(token);

  studySessions.forEach(studySession => {
    if (isSameWeek(date, studySession.created_at)) timeStudied += studySession.duration;
  });

  return timeStudied;
}
