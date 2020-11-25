const _toString = Object.prototype.toString

const isPlainObject = (obj: any): boolean => {
  return _toString.call(obj) === '[object Object]'
}

const isEmptyObject = (obj: Object): boolean => {
  return isPlainObject && Object.keys(obj).length === 0
}

/**
 * 生成随机字符串
 * @param len
 * @param withSymbol
 */
const createRandKey = (len: number = 16, withSymbol: boolean = false): string => {
  const chars = '0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ'
  const symbols = '!@#$%^&*_+><~-='
  const rands = `${chars}${withSymbol ? symbols : ''}`
  let result = ''
  for (let i = 0; i < len; i++) {
    result += rands.charAt(Math.random() * (rands.length -1) | 0)
  }
  return result
}

/**
 * 格式化时间
 * @param timestamp
 * @param format
 */
const formatDate = (timestamp: number, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  if (typeof timestamp !== "number") {
    throw new TypeError(`${timestamp} need to be number.`);
  }
  const date = new Date(timestamp);
  const year = date.getFullYear() + '',
    month = date.getMonth() + 1 + '',
    day = date.getDate() + '',
    hour = date.getHours() + '',
    minute = date.getMinutes() + '',
    second = date.getSeconds() + '';
  return format.replace(/YYYY|yyyy/g, year)
  .replace(/YY|yy/g, year.substr(2, 2))
  .replace(/MM/g, month.padStart(2, '0'))
  .replace(/DD/g, day.padStart(2, '0'))
  .replace(/HH|hh/g, hour.padStart(2, '0'))
  .replace(/mm/g, minute.padStart(2, '0'))
  .replace(/ss/g, second.padStart(2, '0'))
}

/**
 * 将时间戳转换为时间格式
 * @param durationms
 */
const timestampToDate = (durationms: number, unit: boolean = false): string => {
  if (typeof durationms !== "number") {
    throw new TypeError(`${durationms} need to be number.`);
  }
  const hour = (durationms / (60 * 60)) | 0,
    minute = ((durationms % (60 * 60)) / 60) | 0,
    second = durationms % 60 | 0;
  let result = "";
  if (hour) result += hour.toString().padStart(2, "0") + (unit ? '时' : '') + ":";
  result += minute.toString().padStart(2, "0") + (unit ? '分' : '') + ":";
  result += second.toString().padStart(2, "0") + (unit ? '秒' : '');
  return result;
};

/**
 * 格式化音频大小
 * @param size
 */
const formatMusicSize = (size: number): string => {
  return (size / (1024 * 1024)).toFixed(2) + 'MB'
}

/**
 * 格式化音频码率
 * @param br
 */
const formatMusicBr = (br: number): string => {
  // TODO 未知公式...
  const rand = (Math.random() * 99).toFixed(1)
  return rand + 'kHz'
}

/**
 * 获取数组随机项
 * @param arr
 * @param exclude 排除的元素集合
 */
const getRandFromArray = <T>(arr: T[], exclude: T[]): T => {
  if (exclude.length) {
    arr = arr.filter(v => !exclude.includes(v))
  }
  const randIndex = ~~(Math.random() * arr.length)
  return arr[randIndex]
}

/**
 * 获取数组随机多项
 * @param arr
 * @param size
 */
const getRandsFromArray = <T>(arr: T[], size: number = 0): T[] => {
  let res: T[] = []
  while (size > 0) {
      const randIndex = ~~(Math.random() * arr.length)
      res = res.concat(arr.splice(randIndex, 1))
      size--
  }
  return res
}

/**
 * 生成区间随机数
 * @param start
 * @param end
 */
const createRangeRandNumber = (start: number, end: number): number => {
  const last = end - start + 1
  return ~~(Math.random() * last + start)
}

/**
 * 格式化数字
 * @param num
 */
const formatNumber = (num: number) => {
  return num >= 1e5 ? num >= 1e8 ? (num / 1e8).toFixed(2) + '亿' :  (num / 1e4).toFixed(2) + '万' : num
}

export {
  createRandKey,
  formatDate,
  timestampToDate,
  formatMusicSize,
  isEmptyObject,
  getRandFromArray,
  getRandsFromArray,
  formatMusicBr,
  createRangeRandNumber,
  formatNumber
};
