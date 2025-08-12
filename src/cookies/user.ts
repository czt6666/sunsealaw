import { IServerSysUserLoginResult } from '@/server/ServerType';

export function clearCookies() {
  localStorage.removeItem('ACCESS_TOKEN');
  localStorage.removeItem('USER_ADMIN');
  localStorage.removeItem('USER_NAME');
  localStorage.removeItem('USER_REAL_NAME');
  localStorage.removeItem('USER_ID');
  localStorage.removeItem('USER_PAGE_SIZE');
}

export function setUserCookies(user: IServerSysUserLoginResult) {
  localStorage.setItem('ACCESS_TOKEN', user.token);
  localStorage.setItem('USER_ADMIN', user.admin + '');
  localStorage.setItem('USER_NAME', user.userName);
  localStorage.setItem('USER_REAL_NAME', user.userRealName);
  localStorage.setItem('USER_ID', user.userId + '');
}

export function getToken() {
  return localStorage.getItem('ACCESS_TOKEN');
}

export function getUserID(): number {
  const ret = localStorage.getItem('USER_ID');
  if (ret == null) return 0;
  return parseInt(ret);
}

export function getUserName() {
  return localStorage.getItem('USER_NAME');
}

export function getUserRealName() {
  return localStorage.getItem('USER_REAL_NAME');
}

/**
 * 用户是否是管理员角色
 * @returns
 */
export function isAdmin(): boolean {
  const ret = localStorage.getItem('USER_ADMIN');
  console.log(ret);
  if (!ret) return false;
  return ret == 'true';
}

/**
 * 返回用户浏览数据时的页面大小，即每页显示数据
 * @returns 页面大小
 */
export function getUserPageSize(): number {
  var r = localStorage.getItem('USER_PAGE_SIZE');
  if (r == null) return 10;
  return parseInt(r);
}

/**
 * 设置用户浏览数据时的页面大小，即每页显示数据
 * @param pageSize 页面大小
 */
export function setUserPageSize(pageSize: number) {
  localStorage.setItem('USER_PAGE_SIZE', pageSize + '');
}
