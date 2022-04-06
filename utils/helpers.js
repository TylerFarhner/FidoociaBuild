import { parse, differenceInMinutes, differenceInSeconds } from 'date-fns';

// These are helper functions to help with time-related features throughout the project.

const toHHMMSS = (x) => {
  var sec_num = parseInt(x, 10) // don't forget the second param
  var hours = Math.floor(sec_num / 3600)
  var minutes = Math.floor((sec_num - hours * 3600) / 60)
  var seconds = sec_num - hours * 3600 - minutes * 60
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return hours + ':' + minutes + ':' + seconds
}

const timeFromNow = (date, timeIn) => {
  let time;
  const now = new Date();
  let format = String('yyyy-MM-dd h:mm' + (date.split(':').length > 2 ? ':ssaa' : 'aa'));
  switch(timeIn) {
    case 'minutes': time = differenceInMinutes(parse(date, format, now), now);
      break;
    case 'seconds': time = differenceInSeconds(parse(date, format, now), now);
      break;
  }
  return time;
}

const timeParse = (string, format) => {
  // wrapper for date-fns parse for quicker parsing
  // parse(`${d} ${t}`, 'yyyy-MM-dd h:mmaa', now)
  // probably unnecessary
  const c = (x) => x.split('').map((x) => format.includes(x)).includes(true);
  let f = c('y') ? 'yyyy' : '';
  f += c('M') ? (c('y') ? '-MM' : 'MM') : '';
  f += c('d') ? (c('yM') ? '-dd' : 'dd') : '';
  f += c('yMd') && c('hma') ? ' ' : '';
  f += c('h') ? 'h' : '';
  f += c('m') ? (c('h') ? ':mm' : 'mm') : '';
  f += c('a') ? 'aa' : '';
  return parse(string, f, now);
};

export {timeParse, toHHMMSS, timeFromNow}; // time helpers