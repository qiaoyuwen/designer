import { Dropdown, Menu, Space } from 'antd';
import React, { PropsWithChildren } from 'react';
import type { FunctionComponent } from 'react';
import { DownOutlined } from '@ant-design/icons';

const Actions: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const actions: React.ReactNode[] = [];
  const moreActions: React.ReactNode[] = [];
  React.Children.toArray(children)
    .filter((child) => child)
    .forEach((child, index) => {
      if (index < 2) {
        actions.push(child);
      } else {
        moreActions.push(child);
      }
    });

  return (
    <Space size="middle">
      {actions}
      {moreActions.length > 0 && (
        <Dropdown
          overlay={
            <Menu>
              {moreActions.map((action, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Menu.Item key={index}>{action}</Menu.Item>
              ))}
            </Menu>
          }
        >
          <a onClick={(e) => e.preventDefault()}>
            更多
            <DownOutlined />
          </a>
        </Dropdown>
      )}
    </Space>
  );
};

export default Actions;
