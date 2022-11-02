import { FC, useEffect, useMemo, useState } from 'react';
import { RouterSetter } from '@designer/react-settings-form';
import { Menu } from 'antd';

export interface IRouterWidgetProps {
  value?: string;
  onChange: (router: any[]) => void;
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

  return (
    <div>
      <RouterSetter value={routers} onChange={onRouterChange} />
      <Menu style={{ marginTop: 24 }} items={items} mode="inline" />
    </div>
  );
};
