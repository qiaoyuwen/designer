import React from 'react';
import { Table, TableProps } from 'antd';
import { TreeNode, createBehavior, createResource } from '@designer/core';
import { useTreeNode, TreeNodeWidget, DroppableWidget, useNodeIdProps, DnFC } from '@designer/react';
import { observer } from '@formily/react';
import { LoadTemplate } from '../../common/LoadTemplate';
import classnames from 'classnames';
import { queryNodesByComponentPath, createEnsureTypeItemsNode } from '../../shared';
import { useDropTemplate } from '../../hooks';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import { createFieldSchema, createVoidFieldSchema } from '../../components/Field/shared';

const ensureObjectItemsNode = createEnsureTypeItemsNode('object');

const HeaderCell: React.FC = (props: any) => {
  return (
    <th {...props} data-designer-node-id={props.className.match(/data-id\:([^\s]+)/)?.[1]}>
      {props.children}
    </th>
  );
};

const BodyCell: React.FC = (props: any) => {
  return (
    <td {...props} data-designer-node-id={props.className.match(/data-id\:([^\s]+)/)?.[1]}>
      {props.children}
    </td>
  );
};

export const NextTable: DnFC<TableProps<any>> = observer((props) => {
  const node = useTreeNode();
  const nodeId = useNodeIdProps();

  useDropTemplate('NextTable', (source) => {
    const columnNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'NextTable.Column',
        'x-component-props': {
          title: `Title`,
        },
      },
      children: source.map((node) => {
        node.props.title = undefined;
        return node;
      }),
    });
    const objectNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'object',
      },
      children: [columnNode],
    });
    return [objectNode];
  });
  const columns = queryNodesByComponentPath(node, ['NextTable', '*', 'NextTable.Column']);
  const defaultRowKey = () => {
    return node.id;
  };

  const renderTable = () => {
    if (node.children.length === 0) return <DroppableWidget />;
    return (
      <Table
        size="small"
        bordered
        {...props}
        scroll={{ x: '100%' }}
        className={classnames('ant-formily-next-table', props.className)}
        style={{ marginBottom: 10, ...props.style }}
        rowKey={defaultRowKey}
        dataSource={[{ id: '1' }]}
        pagination={false}
        components={{
          header: {
            cell: HeaderCell,
          },
          body: {
            cell: BodyCell,
          },
        }}
      >
        {columns.map((node) => {
          const children = node.children.map((child) => {
            return <TreeNodeWidget node={child} key={child.id} />;
          });
          const props = node.props['x-component-props'];
          return (
            <Table.Column
              {...props}
              title={<div data-content-editable="x-component-props.title">{props.title}</div>}
              dataIndex={node.id}
              className={`data-id:${node.id}`}
              key={node.id}
              render={(value, record, key) => {
                return children.length > 0 ? children : 'Droppable';
              }}
            />
          );
        })}
        {columns.length === 0 && <Table.Column render={() => <DroppableWidget />} />}
      </Table>
    );
  };

  useDropTemplate('NextTable.Column', (source) => {
    return source.map((node) => {
      node.props.title = undefined;
      return node;
    });
  });

  return (
    <div {...nodeId} className="dn-next-table">
      {renderTable()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addColumn'),
            icon: 'AddColumn',
            onClick: () => {
              const tableColumn = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'NextTable.Column',
                  'x-component-props': {
                    title: `Title`,
                  },
                },
              });
              ensureObjectItemsNode(node).append(tableColumn);
            },
          },
        ]}
      />
    </div>
  );
});

NextTable.Behavior = createBehavior(
  {
    name: 'NextTable',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'NextTable',
    designerProps: {
      droppable: true,
      propsSchema: createFieldSchema({
        component: AllSchemas.NextTable,
      }),
    },
    designerLocales: AllLocales.NextTable,
  },
  {
    name: 'NextTable.Column',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'NextTable.Column',
    designerProps: {
      droppable: true,
      allowDrop: (node) => {
        return node.props['type'] === 'object' && node.parent?.props?.['x-component'] === 'NextTable';
      },
      propsSchema: createVoidFieldSchema(AllSchemas.NextTable.Column),
    },
    designerLocales: AllLocales.NextTableColumn,
  },
);

NextTable.Resource = createResource({
  icon: 'ArrayTableSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'NextTable',
      },
    },
  ],
});
