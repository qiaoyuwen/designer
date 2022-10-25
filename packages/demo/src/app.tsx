import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import { Route } from '@ant-design/pro-layout/lib/typings';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { User } from './models';
import { UserServices } from './services';
import { ProjectServices } from './services/project';
import NoFoundPage from './pages/404';
import IndexPage from './pages';
import { MenuUtils } from './utils/menu';
export { default as request } from '@/http/request';

const loginPath = '/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: User;
  loading?: boolean;
  fetchUserInfo?: () => Promise<User | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const user = await UserServices.getUserDetail();
      return user;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

// 动态菜单
let extraRoutes: Route[] = [];

export function patchRoutes({ routes }: { routes: any }) {
  console.log('routes', routes);
  if (routes[1]) {
    routes[1].routes = [...routes[1].routes, ...extraRoutes];
  } else {
    routes[0].routes = [...routes[0].routes, ...extraRoutes];
  }
}

const resolveMenus = (menus: any[]) => {
  for (const menu of menus) {
    if (!menu.component && !menu.redirect) {
      menu.component = IndexPage;
    }
    if (menu.routes) {
      resolveMenus(menu.routes);
    }
  }
};

export async function render(oldRender: () => void) {
  const innerRender = async () => {
    const project = await ProjectServices.getProjectDetail();
    try {
      const menus = JSON.parse(project.menuConfig || '[]');
      MenuUtils.setMenus(menus);
      resolveMenus(menus);

      let redirect = '';
      const getRedirect = (innerMenus: Route[]) => {
        innerMenus.forEach((item) => {
          if (!redirect && (!item.routes || item.routes.length === 0) && !item.hideInMenu) {
            redirect = item.path!;
          } else {
            if (item.routes && item.routes.length > 0) {
              getRedirect(item.routes);
            }
          }
        });
      };
      getRedirect(menus);

      extraRoutes = [
        ...menus,
        {
          path: '/',
          redirect,
          extra: true,
        },
        {
          component: NoFoundPage,
        },
      ];
    } catch {}
    oldRender();
  };
  innerRender();
}
