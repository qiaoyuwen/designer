import { Table as AntdTable } from 'antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC, useDesigner } from '@designer/react';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import { clone } from '@designer/utils';

export const Table: DnFC<React.ComponentProps<typeof AntdTable>> = (props) => {
  const newProps = clone(props);
  const designer = useDesigner();
  let nodeIdAttrName = '';
  let id = '';
  if (designer.props?.nodeIdAttrName) {
    nodeIdAttrName = designer.props.nodeIdAttrName;
    id = newProps[nodeIdAttrName];
    newProps[nodeIdAttrName] = undefined;
  }
  const containerProps = {
    [nodeIdAttrName]: id,
  };
  return (
    <div {...containerProps}>
      <AntdTable {...newProps} />
    </div>
  );
};

Table.Behavior = createBehavior({
  name: 'Table',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Table',
  designerProps: {
    droppable: true,
    propsSchema: createVoidFieldSchema(AllSchemas.Table),
  },
  designerLocales: AllLocales.Table,
});

Table.Resource = createResource({
  icon: 'DataTableSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Table',
        'x-component-props': {
          columns: [
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '年龄',
              dataIndex: 'age',
              key: 'age',
            },
            {
              title: '住址',
              dataIndex: 'address',
              key: 'address',
            },
          ],
          dataSource: [
            {
              key: '1',
              name: '胡彦斌',
              age: 32,
              address: '西湖区湖底公园1号',
            },
            {
              key: '2',
              name: '胡彦祖',
              age: 42,
              address: '西湖区湖底公园1号',
            },
            {
              key: '3',
              name: '胡彦斌',
              age: 32,
              address: '西湖区湖底公园1号',
            },
            {
              key: '4',
              name: '胡彦祖',
              age: 42,
              address: '西湖区湖底公园1号',
            },
            {
              key: '5',
              name: '胡彦斌',
              age: 32,
              address: '西湖区湖底公园1号',
            },
            {
              key: '6',
              name: '胡彦祖',
              age: 42,
              address: '西湖区湖底公园1号',
            },
            {
              key: '7',
              name: '胡彦斌',
              age: 32,
              address: '西湖区湖底公园1号',
            },
            {
              key: '8',
              name: '胡彦祖',
              age: 42,
              address: '西湖区湖底公园1号',
            },
            {
              key: '9',
              name: '胡彦斌',
              age: 32,
              address: '西湖区湖底公园1号',
            },
            {
              key: '10',
              name: '胡彦祖',
              age: 42,
              address: '西湖区湖底公园1号',
            },
            {
              key: '11',
              name: '胡彦斌',
              age: 32,
              address: '西湖区湖底公园1号',
            },
            {
              key: '12',
              name: '胡彦祖',
              age: 42,
              address: '西湖区湖底公园1号',
            },
          ],
          pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
          },
        },
      },
    },
  ],
});
