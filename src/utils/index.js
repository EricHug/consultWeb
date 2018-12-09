import jieyang from './jieyang'
function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime(time) {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

// export function formatTime(time, option) {
//   const d = new Date(time)
//   const now = Date.now()

//   console.log(now,time)
//   const diff = (now - time) / 1000
//   console.log(diff)

//   if (diff < 30) {
//     return '刚刚'
//   } else if (diff < 3600) {
//     // less 1 hour
//     return Math.ceil(diff / 60) + '分钟前'
//   } else if (diff < 3600 * 24) {
//     return Math.ceil(diff / 3600) + '小时前'
//   } else if (diff < 3600 * 24 * 2) {
//     return '1天前'
//   }
//   if (option) {
//     return parseTime(time, option)
//   } else {
//     return (
//       d.getMonth() +
//       1 +
//       '月' +
//       d.getDate() +
//       '日' +
//       d.getHours() +
//       '时' +
//       d.getMinutes() +
//       '分'
//     )
//   }
// }

/**
 * @description 字符串转化为对象
 * @param strDes {string} 字符串
 * @param delimiter {string} 分隔符
 * @returns {object}
 */
export function parseStrObjByFor(strDes, delimiter) {
  var obj = {};
  if (strDes == null || strDes == '') {
    return obj;
  }
  delimiter = delimiter || ";";
  var arr = strDes.split(delimiter);
  var k, v, sub;
  for (var i = 0, len = arr.length; i < len; i++) {
    if (arr[i] !== '') {
      sub = arr[i].split("=");
      k = sub[0];
      v = sub[1];
      if (k !== '') {
        obj[k] = v;
      }
    }
  }
  return obj;
}

/**
 * @description code转名称
 * @param province {string} 省编码
 * @param city {string} 市编码
 * @param district {string} 区编码
 * @param town {string} 镇编码
 * @returns {string} 名称
 */
export function transCodeToName(province, city, district, town,delimiter) {
  let arr = []
  if(province && province=='440000'){
    // 暂时只做广东省
    arr.push('广东省')
  }
  if(city&&city=="445200"){
    // 暂时只做揭阳市
    arr.push('揭阳市')
  }
  if(district&&district!='445200'){
    console.log(district,jieyang.district[district])
    arr.push(jieyang.district[district])
  }
  if(district&&town){
    console.log(town,jieyang.town[district][town])
    arr.push(jieyang.town[district][town])
  }
  return arr.join(delimiter?delimiter:'')
}

/**
 * @description 判断是否为电话号码
 * @param str
 * @returns {boolean}
 */
export function isPhoneNumber(str) {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/
  return reg.test(str)
}

/**
 *@description 验证密码格式
 * @param str
 */
export function isValidPassword(str) {
  const reg = /^[a-zA-Z0-9_]\w{5,17}$/
  return reg.test(str)
}


//-------------------------------------------------------------------------请求的封装

const host = 'https://www.aiheart.top';
export {
  host
}
//请求封装
function request(url, method, data, header = {}) {
  // console.log(parseStrObjByFor('jesssionid=234324234;phpid=3333'))
  // wx.showLoading({
  //   title: '加载中' //数据请求前loading
  // })
  const session_id = wx.getStorageSync('JSESSIONID')
  header['content-type'] = 'application/x-www-form-urlencoded'
  if (session_id != '' && session_id != null) {
    header['cookie'] = 'JSESSIONID=' + session_id
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url, //仅为示例，并非真实的接口地址
      method,
      data,
      header,
      success: function (res) {
        // wx.hideLoading();
        if (session_id == "" || session_id == null) {
          const JSESSIONID = parseStrObjByFor(res.header['Set-Cookie'])['JSESSIONID']
          wx.setStorageSync('JSESSIONID', JSESSIONID) //如果本地没有就说明第一次请求 把返回的session id 存入本地
        }
        if (res.data.status == 2) {
          // 未登录
          wx.redirectTo({
            url: '/pages/login/main'
          })
        }
        console.log(res.data)
        resolve(res.data)
      },
      fail: function (error) {
        // wx.hideLoading();
        reject(false)
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  })
}
export function get(url, data, header = {}) {
  return request(url, 'GET', data, header)
}
export function post(url, data, header = {}) {
  return request(url, 'POST', data, header)
}

//-------------------------------------------------------------------------请求的封装

export default {
  formatNumber,
  formatTime
}
