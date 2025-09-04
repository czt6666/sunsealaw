/**
 * 处理系统用户相关请求，包括登录、修改个人信息等
 * @author hbs@bistu.edu.cn
 *
 */
import { BASEURL, axios } from '@/http';

import type {
  IServerResponseData,
  ICaptcha,
  IServerSysUserLoginResult,
  IServerSysUser,
  IServerUserWithPhotoView,
} from './ServerType';

import { clearCookies } from '@/cookies/user';

import { Pageable, Page, SimplePage, convertPage } from '@/server/ServerType';

export function getUserPhotoUrl(photo: string) {
  if (photo) return '/static/' + photo;
  return '/static/default_user.svg';
}

export function getUserPhotoUrlBySysUser(sysUser: IServerSysUser) {
  return getUserPhotoUrl(sysUser.photo);
}

/**
 * 用户登录
 * @param username
 * @param password
 * @param captchaCode
 * @param captchaKey
 * @returns
 */
export async function serverLogin(
  username: string, //用户名
  password: string, //用户密码
  captchaCode: string, //验证码
  captchaKey: string, //验证码对应的键
): Promise<IServerResponseData<IServerSysUserLoginResult>> {
  try {
    let res = await axios.post<any, IServerResponseData<IServerSysUserLoginResult>>(BASEURL.sysuser + 'login', {
      userName: username,
      password: password,
      captchaCode: captchaCode,
      captchaKey: captchaKey,
    });
    return res;
  } catch (err) {
    console.log(err);

    throw err;
  }
}

/**
 * 用户登出
 * @param username
 * @param password
 * @returns
 */
export async function serverLoginOut() {
  try {
    clearCookies(); //删除Cookies相关数据
    let res = await axios.post(BASEURL.sysuser + 'logout');

    if (res) return res;
    return null;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 注册用户
 * @param username
 * @param password
 * @returns
 */
export async function serverSignUp(
  username: string,
  password: string,
  captchaCode: string, //验证码
  captchaKey: string, //验证码对应的键
): Promise<IServerResponseData<string> | null> {
  try {
    let res = await axios.post<any, IServerResponseData<string> | null>(BASEURL.sysuser + 'signUp', {
      userName: username,
      pwd: password,
      captchaCode: captchaCode,
      captchaKey: captchaKey,
    });

    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 返回公钥
 * @returns
 */
export async function serverGetPublicKey(): Promise<IServerResponseData<string> | null> {
  try {
    let res = await axios.get<any, IServerResponseData<string> | null>(BASEURL.sysuser + 'publicKey');
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 返回验证
 * @returns
 */
export async function serverGetCaptchaJpg(): Promise<IServerResponseData<ICaptcha> | null> {
  try {
    let res = await axios.get<any, IServerResponseData<ICaptcha> | null>(BASEURL.sysuser + 'captcha.jpg');
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 增加用户
 * @param name
 * @param note
 * @returns
 */
export async function serverUserAdd(sysUser: IServerSysUser): Promise<IServerResponseData<string>> {
  try {
    let res = await axios.post<any, IServerResponseData<string>>(BASEURL.sysuser + 'admin/add', sysUser);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 删除用户
 * @param name
 * @param note
 * @returns
 */
export async function serverUserDelete(sysUser: IServerSysUser): Promise<IServerResponseData<number>> {
  try {
    let res = await axios.post<any, IServerResponseData<number>>(BASEURL.sysuser + 'admin/delete', sysUser);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 修改用户
 * @param name
 * @param note
 * @returns
 */
export async function serverUserUpdate(sysUser: IServerSysUser): Promise<IServerResponseData<number>> {
  try {
    let res = await axios.post<any, IServerResponseData<number>>(BASEURL.sysuser + 'admin/update', sysUser);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 修改用户
 * @param name
 * @param note
 * @returns
 */
export async function serverUserUpdateOwnInfo(sysUser: IServerSysUser): Promise<IServerResponseData<number>> {
  try {
    let res = await axios.post<any, IServerResponseData<number>>(BASEURL.sysuser + 'auth/update-own-info', sysUser);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 用户自己修改密码
 * @param name
 * @param note
 * @returns
 */
export async function serverUserUpdateOwnPwd(sysUser: IServerSysUser): Promise<IServerResponseData<number>> {
  try {
    let res = await axios.post<any, IServerResponseData<number>>(BASEURL.sysuser + 'auth/update-own-pwd', sysUser);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 将用户密码改为默认密码'123456'
 * @param name
 * @param note
 * @returns
 */
export async function serverUserResetPwd(sysUser: IServerSysUser): Promise<IServerResponseData<number>> {
  try {
    let res = await axios.post<any, IServerResponseData<number>>(BASEURL.sysuser + 'admin/reset-pwd', sysUser);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 获得用户
 * @param name
 * @param note
 * @returns
 */
export async function serverGetUserByUserName(userName: string): Promise<IServerResponseData<IServerSysUser>> {
  try {
    let res = await axios.get<any, IServerResponseData<IServerSysUser>>(BASEURL.sysuser + 'get-by-user-name', {
      params: {
        userName: userName,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 获得用户
 * @param name
 * @param note
 * @returns
 */
export async function serverGetUserBySysUserId(id: number): Promise<IServerResponseData<IServerSysUser>> {
  try {
    let res = await axios.get<any, IServerResponseData<IServerSysUser>>(BASEURL.sysuser + id);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 获得所有用户，不包括管理员
 * @returns
 */
export async function serverGetAllUserWithoutAdmin(): Promise<IServerResponseData<IServerSysUser[]>> {
  try {
    let res = await axios.get<any, IServerResponseData<IServerSysUser[]>>(
      BASEURL.sysuser + 'get-all-user-without-admin',
    );

    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**
 * 获得用户
 * @param name
 * @param note
 * @returns
 */
export async function serverGetUserPage(
  pageNo: number,
  pageSize: number,
): Promise<IServerResponseData<Page<IServerSysUser>>> {
  try {
    let res = await axios.get<any, IServerResponseData<Page<IServerSysUser>>>(BASEURL.sysuser + 'page', {
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
 * 增加用户头像临时文件
 * @param files
 * @returns
 */
export async function serverAddUserPhotoUploadTempFiles(files: FormData): Promise<IServerResponseData<string>> {
  try {
    let res = await axios.post<any, IServerResponseData<string>>(
      BASEURL.sysuser + 'admin/add-user-photo-temp-file',
      files,
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
export async function serverDeleteUserPhotoUploadTempFiles(files: FormData): Promise<IServerResponseData<string>> {
  try {
    let res = await axios.post<any, IServerResponseData<string>>(
      BASEURL.sysuser + 'admin/delete-user-photo-temp-file',
      files,
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
export async function serverAddUserPhotoUploadTempFilesByAuthenticatedUser(
  files: FormData,
): Promise<IServerResponseData<string>> {
  try {
    let res = await axios.post<any, IServerResponseData<string>>(
      BASEURL.sysuser + 'auth/add-user-photo-temp-file',
      files,
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
export async function serverDeleteUserPhotoUploadTempFilesByAuthenticatedUser(
  files: FormData,
): Promise<IServerResponseData<string>> {
  try {
    let res = await axios.post<any, IServerResponseData<string>>(
      BASEURL.sysuser + 'auth/delete-user-photo-temp-file',
      files,
    );
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/** * 修改用户编号,用户修改显示次序 * @param sysUsers 用户显示的次序 * @returns */ export async function serverUserUpdateOrder(
  sysUsers: IServerSysUser[],
): Promise<IServerResponseData<number>> {
  try {
    let res = await axios.post<any, IServerResponseData<number>>(BASEURL.sysuser + 'admin/update-order', sysUsers);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function serverGetUserPhotoFileInBase64ById(userId: number): Promise<IServerResponseData<string>> {
  try {
    let res = await axios.get<any, IServerResponseData<string>>(BASEURL.sysuser + 'download-photo-file-in-base64', {
      params: {
        userId: userId,
      },
    });

    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function serverGetAllUserWithPhotoViewInBase64(): Promise<
  IServerResponseData<IServerUserWithPhotoView[]>
> {
  try {
    let res = await axios.get<any, IServerResponseData<IServerUserWithPhotoView[]>>(
      BASEURL.sysuser + 'get-all-user-view-in-base64',
    );

    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
