/**
 * 新闻服务器接口
 * 新闻增删改查
 * 新闻分页
 * 新闻图片上传
 * @author hbs@bistu.edu.cn
 *
 */
import { BASEURL, axios } from "@/http";

import type {
  Page,
  IServerResponseData,
  IServerNews,
  IServerNewsWithPhotoView,
} from "./ServerType";

/**
 * 增加
 * @param news
 * @returns
 */
export async function serverNewsAdd(
  news: IServerNews
): Promise<IServerResponseData<string>> {
  try {
    let res = await axios.post<any, IServerResponseData<string>>(
      BASEURL.news + "admin/add",
      news
    );
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 删除
 * @param news
 * @returns
 */
export async function serverNewsDelete(
  news: IServerNews
): Promise<IServerResponseData<number>> {
  try {
    let res = await axios.post<any, IServerResponseData<number>>(
      BASEURL.news + "admin/delete",
      news
    );
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 修改
 * @param news
 * @returns
 */
export async function serverNewsUpdate(
  news: IServerNews
): Promise<IServerResponseData<number>> {
  try {
    let res = await axios.post<any, IServerResponseData<number>>(
      BASEURL.news + "admin/update",
      news
    );
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 获得
 * @param name
 * @param note
 * @returns
 */
export async function serverGetNewsById(
  id: number
): Promise<IServerResponseData<IServerNews>> {
  try {
    let res = await axios.get<any, IServerResponseData<IServerNews>>(
      BASEURL.news + id
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
export async function serverGetNewsPage(
  pageNo: number,
  pageSize: number
): Promise<IServerResponseData<Page<IServerNews>>> {
  try {
    let res = await axios.get<any, IServerResponseData<Page<IServerNews>>>(
      BASEURL.news + "page",
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

/**
 * 增加用户头像临时文件
 * @param files
 * @returns
 */
export async function serverAddNewsPhotoUploadTempFiles(
  files: FormData
): Promise<IServerResponseData<string>> {
  try {
    let res = await axios.post<any, IServerResponseData<string>>(
      BASEURL.news + "admin/add-news-photo-temp-file",
      files
    );
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 删除用户头像临时文件
 * @param files
 * @returns
 */
export async function serverDeleteNewsPhotoUploadTempFiles(
  files: FormData
): Promise<IServerResponseData<string>> {
  try {
    let res = await axios.post<any, IServerResponseData<string>>(
      BASEURL.news + "admin/delete-news-photo-temp-file",
      files
    );
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function serverGetNewsPhotoFileById(
  newsId: number
): Promise<IServerResponseData<string>> {
  try {
    let res = await axios.get<any, IServerResponseData<string>>(
      BASEURL.news + "download-photo-file-in-base64",
      {
        params: {
          newsId: newsId,
        },
      }
    );

    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function serverGetNewsPhotoView(): Promise<
  IServerResponseData<IServerNewsWithPhotoView[]>
> {
  try {
    let res = await axios.get<
      any,
      IServerResponseData<IServerNewsWithPhotoView[]>
    >(BASEURL.news + "get-top-news");

    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
