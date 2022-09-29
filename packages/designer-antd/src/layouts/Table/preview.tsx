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
          requestConifg: {
            url: 'https://proapi.azurewebsites.net/github/issues',
          },
          columns: [
            {
              title: '标题',
              dataIndex: 'title',
            },
            {
              title: '状态',
              dataIndex: 'state',
              valueType: 'Select',
              valueOptions: [
                {
                  label: '未解决',
                  value: 'open',
                },
                {
                  label: '解决中',
                  value: 'processing',
                },
              ],
              width: '100px',
              render: "{{(dom, entity) => React.createElement(Antd.Tag, null, entity['state'])}}",
            },
            {
              title: '创建时间',
              dataIndex: 'created_at',
              valueType: 'DateRange',
              width: '200px',
            },
            {
              title: '操作',
              dataIndex: 'options',
              hideInSearch: true,
              width: '160px',
              render: `{{(dom, entity) => {
                return React.createElement(React.Fragment, null, [
                  React.createElement(Antd.Button, {
                    key: 'edit',
                    type: 'link',
                    style: {
                      marginRight: 0
                    },
                    onClick: () => {
                      $setComponentsProps('@ModalName', {visible: true})
                    }
                  }, '编辑'),
                  React.createElement(Antd.Button, {
                    key: 'remove',
                    type: 'link',
                    danger: true,
                  }, '删除')
                ])
              }}}`,
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
