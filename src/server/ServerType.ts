/**
 * 服务器返回统一的结果数据格式
 */
export interface IServerResponseData<P = {}> {
  code: number; //代码
  message: string; //信息
  data: P; //数据
}

/**
 * 验证码
 */
export interface ICaptcha {
  code: string;
  key: string;
}

// 分页元数据接口
export interface Pageable {
  pageNumber: number; // 当前页码（从0开始）
  pageSize: number; // 每页数量
  totalPages: number; // 总页数
  totalElements: number; // 总记录数
  sorted?: boolean; // 是否排序
  // 其他可能的字段...
}

// 分页响应接口（泛型）
export interface Page<T> {
  content: T[]; // 当前页数据列表
  pageable: Pageable; // 分页元数据
  last: boolean; // 是否是最后一页
  first: boolean; // 是否是第一页
  number: number; // 当前页码（同pageNumber）
  size: number; // 当前页大小（同pageSize）
  empty: boolean; // 数据是否为空
}

//简单页面
export interface SimplePage<T> {
  content: T[];
  currentPage: number; // 当前页码（从1开始）
  pageSize: number; // 每页数量
  totalPages: number; // 总页数
  totalItems: number; // 总记录数
}

// 转换函数示例
export function convertPage<T>(page: Page<T>): SimplePage<T> {
  return {
    content: page.content,
    currentPage: page.number + 1, // 转为1-based
    pageSize: page.size,
    totalPages: page.pageable.totalPages,
    totalItems: page.pageable.totalElements,
  };
}

/**
 * 登录返回结果
 */
export interface IServerSysUserLoginResult {
  token: string; //Token
  admin: boolean; //是否是管理员
  userName: string; //用户ID
  userRealName: string; //用户真实姓名
  userId: number; //用户的ID
}

/**
 * 用户
 */
export interface IServerSysUser {
  id: number; //id,主键
  userName: string; //user_name,学号或工号等，用户登录ID
  realName: string; //real_name,用户名称
  password: string; //pwd,密码
  companyRole: string; //公司内角色
  licensedInfo: string; //律师执业证信息
  details: string; //详细信息
  email: string; //email,电子邮件
  photo: string; //照片
  auth: number; //权限
}

// 用户视图
export interface IServerUserWithPhotoView {
  sysUser: IServerSysUser;
  photoBase64: string;
}

//联系我们
export interface IServerContactUs {
  id: number; //id,主键
  name: string;
  address: string;
  phone: string;
  email: string;
  message: string;
}

//轮播图
export interface IServerCarousel {
  id: number;
  photo: string;
  sysUserId: number;
  createDateTime: Date;
  title: string;
  subTitle: string;
  style: number;
}

export interface IServerCarouselImageView {
  image: string;
  title: string;
  subTitle: string;
}

export interface IServerCarouselView {
  carousel: IServerCarousel;
  sysUser: IServerSysUser;
}

//新闻
export interface IServerNews {
  id: number;
  createDateTime: Date;
  title: string;
  brief: string;
  contentJson: string;
  contentHtml: string;
  titlePhoto: string;
  sysUserId: number;
}

//新闻视图
export interface IServerNewView {
  news: IServerNews;
  sysUser: IServerSysUser;
}

//新闻视图
export interface IServerNewsWithPhotoView {
  news: IServerNews;
  photoBase64: string;
}
