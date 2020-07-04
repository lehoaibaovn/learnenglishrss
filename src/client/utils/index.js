var Base64 = require('js-base64').Base64;
var has = Object.prototype.hasOwnProperty
var toString = Object.prototype.toString
import dateFormat from 'dateformat'
function replaceSpecialCharacter(value){
	return value.replace(/[\\+\\-\\/]/g,"");
}
var today
function _getTimeStamp(time, pattern) {
    if(!today){
			today = new Date()
    }
   	var calendar = new Date();
		calendar.setTime(time);
    let isToday = calendar.getDate() === today.getDate()
        && calendar.getMonth() === today.getMonth()
        &&calendar.getFullYear() === today.getFullYear();
      let format = isToday?pattern: "dd mmmm yyyy, "+pattern
      let timestamp = dateFormater(time, format)
    return timestamp;
  }
export const getTimeStamp=(time)=>{
  return _getTimeStamp(time, "HH:MM")
}
export const getTimeStampWithSecond = (time)=>{
  return _getTimeStamp(time, "HH:MM:ss")
}

export const daysLeftToString = (days)=>{
	var r;
	if(days<=30){
		r = days+"d";
	}else{
		if(days/30>12){
			let year = Math.round(days/(30*12));
			let month = Math.round(days/30);
			let monthLeft = month - year*12;
			let dayLeft = days-month*30;
			r = year+"y";
			if(monthLeft>0){
				r = r+monthLeft+"m";
			}
			if(dayLeft>0){
				r = r+dayLeft+"d";
			}
		}else{
			let month = Math.round(days/30);
			let dayLeft = days-month*30;
			if(dayLeft>0){
				r= month+"m"+dayLeft+"d";
			}else{
				r = month+"m";
			}
		}
	}
	return r;
}

export const getHashColorFromString=(value)=>{
	if(value){
		return "#"+(hashCode(value).toString().substr(2, 6))
	}
	return value
}
export const hashCode = (value) => {
	var hash = 0;
	if (value.length == 0) return hash;
	for (var i = 0; i < value.length; i++) {
		hash = ((hash<<5)-hash)+value.charCodeAt(i);
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}
export const rssKeyByName = (name) =>{
	return replaceSpecialCharacter(Base64.encode(name))
}

export const dateFormater = (val, format="mmmm dd, yyyy")=>{
	if(val){
		let date = new Date(val)
		let formated = dateFormat(date, format)
		return formated
	}
	return undefined

}

export const isEmpty = (val)=>{
  // Null and Undefined...
  if (val == null) return true

  // Booleans...
  if ('boolean' == typeof val) return false

  // Numbers...
  if ('number' == typeof val) return val === 0

  // Strings...
  if ('string' == typeof val) return val.length === 0

  // Functions...
  if ('function' == typeof val) return val.length === 0

  // Arrays...
  if (Array.isArray(val)) return val.length === 0

  // Errors...
  if (val instanceof Error) return val.message === ''

  // Objects...
  if (val.toString == toString) {
    switch (val.toString()) {

      // Maps, Sets, Files and Errors...
      case '[object File]':
      case '[object Map]':
      case '[object Set]': {
        return val.size === 0
      }

      // Plain objects...
      case '[object Object]': {
        for (var key in val) {
          if (has.call(val, key)) return false
        }

        return true
      }
    }
  }

  // Anything else...
  return false
}

export const toHms = (sec_num) => {
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {
      hours   = "0"+hours;
    }
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    if(hours==="00"){
      return minutes+':'+seconds;
    }else{
      return hours+':'+minutes+':'+seconds;
    }

}
