/**
 * 将给定时间格式化为：YYYY-MM-DD HH:mm:ss
 * @param date
 * @returns
 */
export const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return '';
  const dateMat = new Date(date);

  const year = dateMat.getFullYear() + '';
  const month = dateMat.getMonth() + 1 + '';
  const day = dateMat.getDate() + '';
  const hh = dateMat.getHours() + '';
  const mm = dateMat.getMinutes() + '';
  const ss = dateMat.getSeconds() + '';
  const timeFormat =
    year +
    '-' +
    (month.length == 1 ? '0' + month : month) +
    '-' +
    (day.length == 1 ? '0' + day : day) +
    ' ' +
    (hh.length == 1 ? '0' + hh : hh) +
    ':' +
    (mm.length == 1 ? '0' + mm : mm) +
    ':' +
    (ss.length == 1 ? '0' + ss : ss);
  return timeFormat;
};

//Output: 12/31/2022
export const formatDate0 = (date: Date | string | null | undefined) => {
  if (!date) return '';
  const dateMat = new Date(date);

  const formattedDate = dateMat.toLocaleDateString('en-US');
  return formattedDate; // Output: 12/31/2022, for example, if date is December 31, 2022 at 11:59 PM Pacific Standard Time (PST) or 12:59 AM Pacific Daylight Time (PDT) in New York City.
};

//Output: January 1, 2022
export const formatDate01 = (date: Date | string | null | undefined) => {
  if (!date) return '';
  const dateMat = new Date(date);

  // 'January', 'February', etc.
  const monthString = dateMat.toLocaleString('en-US', { month: 'long' }); // Output: January, for example, if date is January 1, 2022 at 11:59 PM Pacific Standard Time (PST) or 12:59 AM Pacific Daylight Time (PDT) in New York City.
  // '1', '2', etc.
  const dayOfMonth = dateMat.toLocaleString('en-US', { day: 'numeric' }); // Output: 1, for example, if date is January 1, 2022 at 11:59 PM Pacific Standard Time (PST) or 12:59 AM Pacific Daylight Time (PDT) in New York City.
  // '2022', etc.
  const year = dateMat.getFullYear() + '';
  const day = dateMat.getDate() + '';
  return monthString + ' ' + dayOfMonth + ', ' + year; // Output: January 1, 2022, for example, if date is January 1, 2022 at 11:59 PM Pacific Standard Time (PST) or 12:59 AM Pacific Daylight Time (PDT) in New York City.
};

/**
 * 将给定时间格式化为：YYYY-MM-DD
 * @param date
 * @returns
 */
export const formatDate1 = (date: Date | string | null | undefined) => {
  if (!date) return '';
  const dateMat = new Date(date);

  const year = dateMat.getFullYear() + '';
  const month = dateMat.getMonth() + 1 + '';
  const day = dateMat.getDate() + '';
  const hh = dateMat.getHours() + '';
  const mm = dateMat.getMinutes() + '';
  const ss = dateMat.getSeconds() + '';
  const timeFormat = year + '-' + (month.length == 1 ? '0' + month : month) + '-' + (day.length == 1 ? '0' + day : day);
  return timeFormat;
};

/**
 * 将给定时间格式化为：HH:mm:ss
 * @param date
 * @returns
 */
export const formatDate2 = (date: Date | string | null | undefined) => {
  if (!date) return '';
  const dateMat = new Date(date);

  const year = dateMat.getFullYear() + '';
  const month = dateMat.getMonth() + 1 + '';
  const day = dateMat.getDate() + '';
  const hh = dateMat.getHours() + '';
  const mm = dateMat.getMinutes() + '';
  const ss = dateMat.getSeconds() + '';
  const timeFormat =
    (hh.length == 1 ? '0' + hh : hh) + ':' + (mm.length == 1 ? '0' + mm : mm) + ':' + (ss.length == 1 ? '0' + ss : ss);
  return timeFormat;
};

/**
 *将目前时间格式化为：YYYY-MM-DD HH:mm:ss
 */
const getNow = () => {
  return formatDate(new Date());
};
