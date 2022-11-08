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
          rowKey: 'column1',
          requestConifg: {
            dataType: 'static',
            dataSource: `{{[\n  {\n    column1: '列名1',\n    column2: '1',\n    column3: '2022-11-07 16:25:49',\n  },\n]}}`,
          },
          columns: [
            {
              title: '列1',
              dataIndex: 'column1',
            },
            {
              title: '列2',
              dataIndex: 'column2',
              valueType: 'Select',
              valueOptions: [
                {
                  label: '选项1',
                  value: '1',
                },
                {
                  label: '选项2',
                  value: '2',
                },
              ],
              render: "{{(dom, entity) => React.createElement(Antd.Tag, null, entity['column2'])}}",
            },
            {
              title: '列3',
              dataIndex: 'column3',
              valueType: 'DateRange',
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
                      $setComponentsProps('@ModalName', {visible: true, title: '编辑'})
                    },
                  }, '编辑'),
                  React.createElement(Antd.Button, {
                    key: 'remove',
                    type: 'link',
                    danger: true,
                    onClick: () => {
                      $setComponentsProps('@ModalName', {visible: true})
                    },
                  }, '删除')
                ])
              }}}`,
            },
          ],
          pagination: {
            showSizeChanger: true,
            showQuickJumper: true,
          },
          toolBarRender: `{{() => {
            return React.createElement(
              Antd.Button,
              {
                type: 'primary',
                onClick: () => {
                  $setComponentsProps('@ModalName', { visible: true, title: '新增' });
                },
              },
              '新增',
            );
          }}}`,
        },
      },
    },
  ],
});
