/**
 * 处理系统用户相关请求，包括登录、修改个人信息等
 * @author hbs@bistu.edu.cn
 *
 */
import { BASEURL, axios } from "@/http";

import type {
  Pageable,
  Page,
  SimplePage,
  convertPage,
  IServerResponseData,
  ICaptcha,
  IServerSysUserLoginResult,
  IServerSysUser,
  IServerCarousel,
  IServerCarouselView,
  IServerNews,
  IServerNewView,
  IServerContactUs,
} from "./ServerType";

import { clearCookies } from "@/cookies/user";

/**
 * 增加
 * @param contactUs
 * @returns
 */
export async function serverContactUsAdd(
  contactUs: IServerContactUs
): Promise<IServerResponseData<string>> {
  try {
    let res = await axios.post<any, IServerResponseData<string>>(
      BASEURL.contactus + "add",
      contactUs
    );
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 删除
 * @param contactUs
 * @returns
 */
export async function serverContactUsDelete(
  contactUs: IServerContactUs
): Promise<IServerResponseData<number>> {
  try {
    let res = await axios.post<any, IServerResponseData<number>>(
      BASEURL.contactus + "admin/delete",
      contactUs
    );
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 修改
 * @param contactUs
 * @returns
 */
export async function serverContactUsUpdate(
  contactUs: IServerContactUs
): Promise<IServerResponseData<number>> {
  try {
    let res = await axios.post<any, IServerResponseData<number>>(
      BASEURL.contactus + "admin/update",
      contactUs
    );
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 获得页面
 * @param pageNo 页码
 * @param pageSize 每页大小
 * @returns 页面数据
 */
export async function serverGetContactUsPage(
  pageNo: number,
  pageSize: number
): Promise<IServerResponseData<Page<IServerContactUs>>> {
  try {
    let res = await axios.get<any, IServerResponseData<Page<IServerContactUs>>>(
      BASEURL.contactus + "admin/page",
      {
        params: {
          page: pageNo,
          size: pageSize,
        },
      }
    );

    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
