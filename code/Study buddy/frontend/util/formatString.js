/*
  100% manual
*/

export function createClock(miliseconds) {
    var day = Math.floor((miliseconds/1000/60/60/24));
    var hour = Math.floor((miliseconds/1000/60/60) % 24);
    var min = Math.floor((miliseconds/1000/60) % 60);
    var sec = Math.floor((miliseconds/1000) % 60);

    if (miliseconds > 1000*60 && sec < 10) {
        sec = `0${sec}`;
    }
    if (miliseconds > 1000*60*60 && min < 10) {
        min = `0${min}`;
    }
    if (miliseconds > 1000*60*60*24 && hour < 10) {
        hour = `0${hour}`;
    }

    if (day > 0) {
        return `${day}:${hour}:${min}:${sec}`;
    } else if (hour > 0) {
        return `${hour}:${min}:${sec}`;
    } else if (min > 0) {
        return `${min}:${sec}`;
    } else {
        return sec;
    }
}

export function timeToString(miliseconds) {
    var day = Math.floor((miliseconds/1000/60/60/24));
    var hour = Math.floor((miliseconds/1000/60/60) % 24);
    var min = Math.floor((miliseconds/1000/60) % 60);
    var sec = Math.floor((miliseconds/1000) % 60);

    if (day > 0) {
        return `${day} day${day != 1 ? "s" : ""}, ${hour} hour${hour != 1 ? "s" : ""}, ${min} minute${min != 1 ? "s" : ""}, and ${sec} second${sec != 1 ? "s" : ""}`;
    } else if (hour > 0) {
        return `${hour} hour${hour != 1 ? "s" : ""}, ${min} minute${min != 1 ? "s" : ""}, and ${sec} second${sec != 1 ? "s" : ""}`;
    } else if (min > 0) {
        return `${min} minute${min != 1 ? "s" : ""} and ${sec} second${sec != 1 ? "s" : ""}`;
    } else {
        return `${sec} second${sec != 1 ? "s" : ""}`;
    }
}