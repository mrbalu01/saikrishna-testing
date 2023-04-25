const moment = require('moment');
const { AgeFromDateString } = require("age-calculator");


exports.convertToSecond = (duration, durationUnits) => {
   console.log(duration, durationUnits)
   switch (durationUnits) {
      case 'HOURS': return duration * 60 * 60;
      case 'MINUTES': return duration * 60
      case 'SECONDS': return duration
      case 'DAYS': return duration * 24 * 60 * 60
      default: return duration // Invalid 
   }
}

exports.toMins = function (m) {
   return m.minutes() + m.hours() * 60;
}

exports.toMoment = function (time) {
   return moment(time.hour + ':' + time.min + ' ' + time.ampm, 'h:mma')
}

exports.convertDobToAge = (dob) => {
   if (dob) {
       var DOB = new Date(dob);
       let ageFromDate = new AgeFromDateString(DOB).age;
       return ageFromDate;
   }
   return "";
}
