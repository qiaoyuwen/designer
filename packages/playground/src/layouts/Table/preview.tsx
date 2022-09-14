import { ProTable } from '@designer/formily-antd';
import { createBehavior, createResource } from '@designer/core';
import { DnFC, useDesigner } from '@designer/react';
import { createVoidFieldSchema } from '../../components/Field';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import { clone } from '@designer/utils';

export const Table: DnFC<React.ComponentProps<typeof ProTable>> = (props) => {
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
      <ProTable {...newProps} />
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
          rowKey: 'id',
          /* requestConifg: {
            url: 'https://proapi.azurewebsites.net/github/issues',
          }, */
          columns: [
            {
              title: '标题',
              dataIndex: 'title',
            },
            {
              title: '状态',
              dataIndex: 'state',
            },
            {
              title: '创建时间',
              dataIndex: 'created_at',
            },
            {
              title: '操作',
              dataIndex: 'options',
              hideInSearch: false,
              width: '120px',
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
