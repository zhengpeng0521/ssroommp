var weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
function getDate(date, month, day) {
  const len = arguments.length
  if (len == 1) {
    return new Date(date)
  }
  if (len == 2) {
    return new Date(date, month)
  }
  if (len == 3) {
    return new Date(date, month, day)
  }
  return new Date()
}
var dateArr = function (startTime, endTime) {
  var arr = [],
    startTime = getDate(iosTimeChange(startTime)),
    endTime = getDate(iosTimeChange(endTime)),
    nowTime = getDate();

  startTime = startTime.getTime() > nowTime.getTime() ? startTime : nowTime;

  while (endTime.setDate(1) > startTime.setDate(1)) {
    var year = startTime.getFullYear(),
      month = startTime.getMonth();
    if (month > 12) {
      year += 1;
      month = 1;
    } else {
      month += 1;
    }
    arr.push(startTime.getTime());
    startTime.setFullYear(year);
    startTime.setMonth(month);
  }
  return arr;
}

var iosTimeChange = function (date) {
  var result = date.replace(new RegExp('-', 'g'), '/');
  return result
};

var getDisplayInfo = function (date, appointMonthGroupPlans) {
  date = getDate(date)
  var year = date.getFullYear(),
    month = date.getMonth(),
    d = getDate(year, month);

  var now = getDate(),
    thisYear = now.getFullYear(),
    thisMonth = now.getMonth(),
    appointPlans = [];

  //这个月一共多少天
  var days = getDaysOfMonth(d);
  //这个月是星期几开始的
  var beginWeek = getBeginDayOfMouth(d);
  var daysArr = [];

  if (appointMonthGroupPlans) {
    for (var k = 0; k < appointMonthGroupPlans.length; k++) {
      if (year === getDate(appointMonthGroupPlans[k].apointMonth).getFullYear() && month === getDate(appointMonthGroupPlans[k].apointMonth).getMonth()) {
        appointPlans = appointMonthGroupPlans[k].appointMonthPlans
      }
    }
    var appointPlansStartTime = appointPlans.length > 0 ? getDate(iosTimeChange(appointPlans[0].appointDay)).setHours(0, 0, 0, 0) : '',
      appointPlansEndtTime = appointPlans.length > 0 ? getDate(iosTimeChange(appointPlans[appointPlans.length - 1].appointDay)).setHours(0, 0, 0, 0) : '',
      nowTime = now.setHours(0, 0, 0, 0),
      daysTime, obj = {};

    for (var i = 0; i < days; i++) {
      (function (i) {
        daysTime = getDate(year, month, i + 1).getTime();
        obj = {
          days: i + 1,
          daysTime: daysTime,
          storeCount: 1,
          available: false,
          isFull: false,
          isLack:0,
        }
        if (nowTime <= daysTime &&
          daysTime >= appointPlansStartTime &&
          daysTime <= appointPlansEndtTime) {
          for (var j = 0; j < appointPlans.length; j++) {
            if (daysTime === getDate(iosTimeChange(appointPlans[j].appointDay)).setHours(0, 0, 0, 0) && appointPlans[j].appointStock > 0) {
              obj.available = true;
            }
            if (daysTime === getDate(iosTimeChange(appointPlans[j].appointDay)).setHours(0, 0, 0, 0) && appointPlans[j].appointStock == 0) {
              obj.isFull = true;
            }
            if (daysTime === getDate(iosTimeChange(appointPlans[j].appointDay)).setHours(0, 0, 0, 0) && appointPlans[j].isLack == 1){
              obj.isLack = 1
            }
          }
        }
        daysArr.push(obj)
      })(i)
    }
  }

  return {
    daysArr: daysArr,
    beginWeek: beginWeek
  }
};

var formatTimeToMonth = function (date) {
  var date = getDate(date),
    year = date.getFullYear(),
    month = formatNum(date.getMonth() + 1);
  return year + '年' + month + '月';
};
var formatNum = function (n) {
  if (n < 10) return '0' + n;
  return n;
};
var isLeapYear = function (year) {
  //传入为时间格式需要处理
  year = getDate(year).getFullYear()
  if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) return true;
  return false;
};
var getDaysOfMonth = function (date) {
  date = getDate(date);
  var month = date.getMonth(); //注意此处月份要加1，所以我们要减一
  var year = date.getFullYear();
  return [31, isLeapYear(date) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}
var getBeginDayOfMouth = function (date) {
  date = getDate(date);
  var month = date.getMonth();
  var year = date.getFullYear();
  var d = getDate(year, month, 1);
  return d.getDay();
}

module.exports = {
  weeks_ch: weeks_ch,
  dateArr: dateArr,
  formatTimeToMonth: formatTimeToMonth,
  getDisplayInfo: getDisplayInfo
}