import { AppConfig } from '@/configs/app'

export const workbenchPrefix = '/workbench';
export const fastblendPrefix = '/fastblend';

const { prefixs } = AppConfig;

/** Api管理 */
export const ApiConfig = {
  main: {
    fileUpload: `${prefixs.api}${workbenchPrefix}/file/upload`,
    project: {
      info: `${prefixs.api}${workbenchPrefix}/project/get`,
    },
    user: {
      profile: `${prefixs.api}${workbenchPrefix}/user/profile`,
    },
    projectMenu: {
      list: `${prefixs.api}${fastblendPrefix}/page/list`,
      save: `${prefixs.api}${fastblendPrefix}/page/save`,
    },
  }
}
