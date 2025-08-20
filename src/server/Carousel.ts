/**
 * 处理系统用户相关请求，包括登录、修改个人信息等
 * @author hbs@bistu.edu.cn
 *
 */
import { BASEURL, axios } from '@/http';

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
  IServerCarouselImageView,
} from './ServerType';

import { clearCookies } from '@/cookies/user';

/**
 * 增加
 * @param carousel
 * @returns
 */
export async function serverCarouselAdd(carousel: IServerCarousel): Promise<IServerResponseData<string>> {
  try {
    let res = await axios.post<any, IServerResponseData<string>>(BASEURL.carousel + 'admin/add', carousel);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 删除
 * @param carousel
 * @returns
 */
export async function serverCarouselDelete(carousel: IServerCarousel): Promise<IServerResponseData<number>> {
  try {
    let res = await axios.post<any, IServerResponseData<number>>(BASEURL.carousel + 'admin/delete', carousel);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 修改
 * @param carousel
 * @returns
 */
export async function serverCarouselUpdate(carousel: IServerCarousel): Promise<IServerResponseData<number>> {
  try {
    let res = await axios.post<any, IServerResponseData<number>>(BASEURL.carousel + 'admin/update', carousel);
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
export async function serverGetCarouselPage(
  pageNo: number,
  pageSize: number,
): Promise<IServerResponseData<Page<IServerCarousel>>> {
  try {
    let res = await axios.get<any, IServerResponseData<Page<IServerCarousel>>>(BASEURL.carousel + 'admin/page', {
      params: {
        page: pageNo,
        size: pageSize,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 增加临时文件
 * @param files
 * @returns
 */
export async function serverAddCarouselPhotoUploadTempFiles(files: FormData): Promise<IServerResponseData<string>> {
  try {
    let res = await axios.post<any, IServerResponseData<string>>(
      BASEURL.carousel + 'admin/add-carousel-photo-temp-file',
      files,
    );
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 删除临时文件
 * @param files
 * @returns
 */
export async function serverDeleteCarouselPhotoUploadTempFiles(files: FormData): Promise<IServerResponseData<string>> {
  try {
    let res = await axios.post<any, IServerResponseData<string>>(
      BASEURL.carousel + 'admin/delete-carousel-photo-temp-file',
      files,
    );
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function serverGetCarouselPhotoFileById(carouselId: number): Promise<IServerResponseData<string>> {
  try {
    let res = await axios.get<any, IServerResponseData<string>>(BASEURL.carousel + 'download-photo-file-in-base64', {
      params: {
        carouselId: carouselId,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function serverGetAllCarouselPhotoFilesById(): Promise<IServerResponseData<string[]>> {
  try {
    let res = await axios.get<any, IServerResponseData<string[]>>(BASEURL.carousel + 'download-photo-files-in-base64');

    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function serverGetAllCarouselImageView(): Promise<IServerResponseData<IServerCarouselImageView[]>> {
  try {
    let res = await axios.get<any, IServerResponseData<IServerCarouselImageView[]>>(
      BASEURL.carousel + 'get-all-carousel-image-view',
    );

    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
