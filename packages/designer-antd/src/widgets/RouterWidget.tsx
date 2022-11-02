import { FC, useEffect, useMemo, useState } from 'react';
import { RouterSetter, traverseTree } from '@designer/react-settings-form';
import { Menu } from 'antd';

export interface IRouterWidgetProps {
  value?: string;
  pageOptions?: { value: string; label: string }[];
  onChange: (router: any[]) => void;
  onSelect?: (pageId: string) => void;
}

export const RouterWidget: FC<IRouterWidgetProps> = (props) => {
  const [routers, setRouters] = useState<any[]>([]);

  useEffect(() => {
    if (props.value) {
      try {
        setRouters(JSON.parse(props.value));
      } catch {}
    }
  }, [props.value]);

  const items = useMemo(() => {
    const filter = (innerRouters) => {
      const filterResult = [];
      for (const innerRouter of innerRouters) {
        if (!innerRouter.hideInMenu) {
          const newItem: any = {
            key: innerRouter.key || innerRouter.name,
            label: innerRouter.name,
          };
          if (innerRouter.children && innerRouter.children.length !== 0) {
            newItem.children = filter(innerRouter.children);
          }
          filterResult.push(newItem);
        }
      }
      return filterResult;
    };
    const result = filter(routers);
    return result;
  }, [routers]);

  const onRouterChange = (newRouter: any[]) => {
    setRouters(newRouter);
    props?.onChange(newRouter);
  };

  const onSelect = ({ key }: { key: string }) => {
    let router: any;
    traverseTree(routers, (item) => {
      if (item.key === key) {
        router = item;
      }
    });
    if (router) {
      props.onSelect?.(router.pageId);
    }
  };

  return (
    <div>
      <RouterSetter value={routers} pageOptions={props.pageOptions} onChange={onRouterChange} />
      <Menu style={{ marginTop: 24 }} items={items} mode="inline" onSelect={onSelect} />
    </div>
  );
};
