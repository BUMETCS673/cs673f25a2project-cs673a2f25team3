import { isSameWeek } from '../util/compareTimes';
import { useStudySessions } from './studySessions';

/*
    20% framework
    80% manual
*/

export function useTimeStudiedInWeek(date) {
  var timeStudied = 0;
  const studySessions = useStudySessions();

  studySessions.forEach(studySession => {
    if (isSameWeek(date, studySession.created_at)) timeStudied += studySession.duration;
  });

  return timeStudied;
}
