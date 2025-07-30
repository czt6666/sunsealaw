import { defineStore } from 'pinia'

export const userStore = defineStore( 'user',{
 
  state: () => {
    return {
      userName: '', //登录ID
      userRealName: '', //真实姓名
      roles: [] as string[], //角色
    }
  },
  actions: {
    setUserName(name: string) {
      this.userName = name
    },
    setUserRealName(name: string) {
      this.userRealName = name
    },
    setRoles(roles: string[]) {
      this.roles = roles
    },
    hasRole(role: string) {
      this.roles.forEach((item, index) => {
        if (item === role) return true
      })
      return false
    },
    
    isAdmin() {
      return this.hasRole('Admin')
    },
  },
})
