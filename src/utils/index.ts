
/**
 * Common methods 
 * Py was created in 2020.11.07
 */ 
import { isObject } from '@/utils/is';

/**
 * 将对象作为参数添加到URL中
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * @example 
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  let url = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  if (/\?$/.test(baseUrl)) {
    url = baseUrl + parameters;
  } else {
    url = baseUrl.replace(/\/?$/, '?') + parameters;
  }
  return url;
}
/** deepMerge */
export function deepMerge<T = any>(src: any, target: any): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

/**
 * 解析时间字符串--时间格式
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time: string | number | Date, cFormat: string = "") {
  if (arguments.length === 0 || !time) {
    return "";
  }
  const format: string = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date:any;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj:any = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result:any, key:any) => {
    const value:any = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

/**
 * @description: 根据数组中某个对象值去重
 */
export function unique<T = any>(arr: T[], key: string): T[] {
  const map = new Map();
  return arr.filter((item) => {
    const _item = item as any;
    return !map.has(_item[key]) && map.set(_item[key], 1);
  });
}

/**
 * @description: es6数组去重复
 */
export function es6Unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
/**
 * 计算平均值
 * @example  average(...[6, 7, 8]); // 7
 * @example  average(6, 7, 8, 9); // 7.5
 */
export const average = (...numbers: any[]) => numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / numbers.length;


/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 * @example const debouncedUse: Function = new Debounced().use(request, 1000)  //request 是请求方法
 */
export class Debounced {
  public use = (func: Function, wait: number = 1000, immediate?: boolean): Function => {
    let timeout: number | null | undefined;
    return  ( ...args: any) => {
        let context:any = this;
        if (timeout) clearTimeout(timeout);
        if (immediate) {
            var callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait)
            if (callNow) func.apply(context, args)
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
    }
  }
}

/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
export class Throttle {
  public use = (func: Function, wait: number ,type: number) : Function => {
    if(type===1){
      var previous = 0;
    }else if(type===2){
      var timeout: number | null;
    }
    return ( ...args: any) => {
        let context = this;
        if(type===1){
            let now = Date.now();
            if (now - previous > wait) {
                func.apply(context, args);
                previous = now;
            }
        }else if(type===2){
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null;
                    func.apply(context, args)
                }, wait)
            }
        }
    }
  }
}

// 货币格式转换
/*将100000转为"100,000.00"形式*/
export const dealNumber = function(money: number | string | null){
  if(money && money!=null){
    money = String(money);
    let left= money.split('.')[0],
        right=money.split('.')[1];
    right = right ? (right.length >= 2 ? '.' + right.substr(0,2) : '.'+right+'0') : '.00';
    let temp:any = left.split('').reverse().join('').match(/(\d{1,3})/g);
    return (Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
  } else if(money===0) {
    return '0.00';
  } else {
    return "";
  }
};
/*将100,000.00转为100000形式*/
export const undoNubmer = function(money: string | null){
  if(money && money!=null){
      money = String(money);
      const group = money.split('.');
      const left = group[0].split(',').join('');
      return Number(left + "." + group[1]);
  }else{
      return "";
  }
};