let StoreMenus: any[] = [];

const setMenus = (menus: any[]) => {
  StoreMenus = menus;
};

const getMenus = () => {
  return StoreMenus;
};

const findMenuPageIdByPath = (path: string): string => {
  const innerFind = (menus: any[]): string => {
    for (const menu of menus) {
      if (menu.path === path) {
        return menu.pageId;
      }
      if (menu.routes) {
        return innerFind(menu.routes);
      }
    }
    return '';
  };

  return innerFind(StoreMenus);
};

export const MenuUtils = {
  setMenus,
  getMenus,
  findMenuPageIdByPath,
};
