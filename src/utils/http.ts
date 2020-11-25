import Taro, { getCurrentInstance } from "@tarojs/taro";
import urlConfig from "@/config/baseurl";

interface ResponseOptionsType {
  header: Object;
  dataType: string;
  timeout: number;
  xhrFields: Object;
}

interface ResponseDataType {
  statusCode: number;
  data: { code: number; msg: string; [propName: string]: any };
  errMsg: string;
  header?: Object;
  cookies?: string[];
}

// 请求基本设置
const cfgOptions: ResponseOptionsType = {
  header: {
    "content-type": "application/json",
    "Cookie": ""
  },
  dataType: "json",
  timeout: 5000,
  xhrFields: { withCredentials: true },
};

// 拦截器设置
const interceptor = function (chain: any) {
  Taro.showLoading()
  const requestParams = chain.requestParams;
  const { method, data, url, header } = requestParams;

  const token = Taro.getStorageSync("token");
  if (!!token) {
    header.Authorization = token;
  }
  const cookie = Taro.getStorageSync("cookie")
  if (!!cookie) {
    header.Cookie = cookie
  }

  console.log(`request:: ${method || "GET"} --> ${url} data: `, data);

  return chain
    .proceed(requestParams)
    .then((res: ResponseDataType) => {
      Taro.hideLoading();
      console.log(`response:: <-- ${url} result:`, res);
      const {
        data: { msg, message }, data
      } = res;
      if (res.statusCode === 200) {
        return data;
      } else if (res.statusCode === 301) {
        Taro.showToast({
          title: msg ?? message ?? "请求失败",
          icon: "none",
          duration: 1500,
        });
        setTimeout(() => {
          Taro.navigateTo({
            url: `/pages/login/index?redirect=${getCurrentInstance().router?.path}`
          })
        }, 1000);
        return
      } else {
        return Taro.showToast({
          title: msg ?? message ?? "请求失败",
          icon: "none",
          duration: 1500,
        });
      }
    })
    .catch((err: { errMsg: any; }) => {
      Taro.hideLoading();
      Taro.showToast({
        title: err.errMsg,
        icon: "none",
        duration: 1500,
      });
    });
};
Taro.addInterceptor(interceptor);

interface RequestOptionType {
  url: string;
  data?: any;
}
type RequestMethod = 'POST' | 'GET' | 'PUT' | 'DELETE'

const request = (
  options: RequestOptionType,
  method: RequestMethod
): Promise<any> => {
  const { url, data } = options;
  return Taro.request({
    ...cfgOptions,
    url: urlConfig.baseurl + url,
    method,
    data,
  });
};

const get = (url: string, data: object) => request({ url, data }, "GET");
const post = (url: string, data: object) => request({ url, data }, "POST");

export { get, post };
