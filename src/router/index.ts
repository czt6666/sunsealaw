import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
      keepAlive: true,
      requireAuth: false,
    },
    component: () => import("@/views/accounts/Login.vue"),
  },

  //个人设置
  {
    path: "/user-info",
    component: () => import("@/views/accounts/UserInfo.vue"),
  },

  //个人重置密码
  {
    path: "/reset-password",
    component: () => import("@/views/accounts/UserResetPwd.vue"),
  },

  //新闻列表
  {
    path: "/news",
    name: "News",
    component: () => import("@/views/news/NewsList.vue"),
  },

  //新闻详细信息
  {
    path: "/news-detail/:id",

    component: () => import("@/views/news/NewsDetail.vue"),
  },

  //新闻管理
  {
    path: "/manager-news",
    component: () => import("@/views/manage/news/NewsManager.vue"),
  },

  //新闻添加
  {
    path: "/manager-news-add",
    component: () => import("@/views/manage/news/AddNews.vue"),
  },

  //新闻更新
  {
    path: "/manager-news-update/:id",
    component: () => import("@/views/manage/news/UpdateNews.vue"),
  },

  //服务:Capital Markets
  {
    path: "/service/capital-markets",
    component: () => import("@/views/service/CapitalMarkets.vue"),
  },

  //服务:Corporate, M&A,and Private Equity
  {
    path: "/service/corporate-m-a-and-private-equity",
    component: () => import("@/views/service/CorporateMAAndPrivateEquity.vue"),
  },

  //服务:Employment & Labor Law
  {
    path: "/service/employment-labor-law",
    component: () => import("@/views/service/EmploymentLaborLaw.vue"),
  },

  //服务:Healthcare & Life Sciences Compliance
  {
    path: "/service/healthcare-life-sciences-compliance",
    component: () => import("@/views/service/HealthcareLifeSciencesCompliance.vue"),
  },

  //服务:Intellectual Property
  {
    path: "/service/intellectual-property",
    component: () => import("@/views/service/IntellectualProperty.vue"),
  },

  //服务:Immigration Law
  {
    path: "/service/immigration-law",
    component: () => import("@/views/service/ImmigrationLaw.vue"),
  },

  //服务:Wills, Trusts & Estates Planning
  {
    path: "/service/wills-trusts-estates-planning",
    component: () => import("@/views/service/WillsTrustsEstatesPlanning.vue"),
  },

  //服务:Civil & Commercial Litigation
  {
    path: "/service/civil-commercial-litigation",
    component: () => import("@/views/service/CivilCommercialLitigation.vue"),
  },

  //律师团队
  {
    path: "/team",
    name: "Team",
    component: () => import("@/views/lawyer/TeamMemberList.vue"),
  },

  //律师团队成员详细信息
  {
    path: "/team-member/:id",
    component: () => import("@/views/lawyer/TeamMemberDetail.vue"),
  },

  //律师团队管理
  {
    path: "/manager-team-member",
    component: () => import("@/views/manage/TeamMemberManager.vue"),
  },

  //轮播图管理
  {
    path: "/manager-carousel",
    component: () => import("@/views/manage/CarouselManager.vue"),
  },

  //联系我们
  {
    path: "/contact",
    name: "Contact",
    component: () => import("@/views/contact/Contact.vue"),
  },

  //联系我们管理
  {
    path: "/manager-contact-us",
    component: () => import("@/views/manage/ContactUsManager.vue"),
  },

  //关于我们
  {
    path: "/about",
    name: "About",
    component: () => import("@/views/About.vue"),
  },

  //免责声明
  {
    path: "/disclaimer",
    name: "Disclaimer",
    component: () => import("@/views/Disclaimer.vue"),
  },

  //使用声明
  {
    path: "/terms",
    name: "Terms",
    component: () => import("@/views/Terms.vue"),
  },

  //隐私政策
  {
    path: "/privacy",
    name: "Privacy",
    component: () => import("@/views/Privacy.vue"),
  },

  //联系我们
  {
    path: "/visitus",
    name: "VisitUs",
    component: () => import("@/views/VisitUs.vue"),
  },

  //首页
  {
    path: "/",
    component: () => import("@/views/index.vue"),
  },

  //测试
  {
    path: "/test",
    component: () => import("@/views/manage/news/AddNews2.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
