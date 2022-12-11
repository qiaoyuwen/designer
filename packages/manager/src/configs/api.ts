import { AppConfig } from '@/configs/app'

const { prefixs } = AppConfig;

/** Api管理 */
export const ApiConfig = {
  main: {
    fileUpload: `${prefixs.api}/file/upload`,
    project: {
      info: `${prefixs.api}/project/get`,
    },
    user: {
      profile: `${prefixs.api}/user/profile`,
    },
    projectMenu: {
      list: `${prefixs.api}/project/found/page/list`,
      save: `${prefixs.api}/project/found/page/save`,
    },
  }
}
