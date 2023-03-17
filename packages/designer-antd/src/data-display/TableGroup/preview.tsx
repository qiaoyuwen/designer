import { useEffect, useCallback } from 'react';
import { createBehavior, createResource, TreeNode } from '@designer/core';
import { DnFC, TreeNodeWidget, useTreeNode } from '@designer/react';
import { observer } from '@formily/react';
import { AllSchemas } from '../../schemas';
import { AllLocales } from '../../locales';
import { createVoidFieldSchema } from '../../components/Field/shared';
import { parseNode } from '../../utils';
import { InnerTable } from './table';
import { Container } from '../../common/Container';
import { TableGroup as FormilyTableGroup } from '@designer/formily-antd';

export const TableGroup: DnFC & {
  InnerTable?: any;
  Pagination?: any;
} = observer(() => {
  const node = useTreeNode();
  const table = parseNode(node, 'TableGroup.InnerTable');
  const pagination = parseNode(node, 'TableGroup.Pagination');

  const initTable = useCallback(() => {
    if (!table) {
      const newTable = new TreeNode({
        componentName: 'Field',
        props: {
          type: 'array',
          'x-component': 'TableGroup.InnerTable',
        },
      });
      node.append(newTable);
    }
  }, [table, node]);

  const initPagination = useCallback(() => {
    if (!pagination) {
      const newPagination = new TreeNode({
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'TableGroup.Pagination',
          'x-component-props': {
            showSizeChanger: true,
            showQuickJumper: true,
            total: 55,
          },
        },
      });
      node.append(newPagination);
    }
  }, [pagination, node]);

  useEffect(() => {
    initTable();
    initPagination();
  }, [initTable, initPagination]);
  return (
    <Container>
      {table && <TreeNodeWidget node={table} />}
      {pagination && <TreeNodeWidget node={pagination} />}
    </Container>
  );
});

TableGroup.InnerTable = InnerTable;
TableGroup.Pagination = FormilyTableGroup.Pagination;

TableGroup.Behavior = createBehavior(
  {
    name: 'TableGroup',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'TableGroup',
    designerProps: {
      droppable: false,
      propsSchema: createVoidFieldSchema(AllSchemas.TableGroup),
    },
    designerLocales: AllLocales.TableGroup,
  },
  {
    name: 'TableGroup.InnerTable',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'TableGroup.InnerTable',
    designerProps: {
      draggable: false,
      droppable: true,
      propsSchema: createVoidFieldSchema(AllSchemas.TableGroup.Table),
    },
    designerLocales: AllLocales.TableGroupTable,
  },
  {
    name: 'TableGroup.InnerTable.Column',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'TableGroup.InnerTable.Column',
    designerProps: {
      droppable: true,
      allowDrop: (node) => {
        return node.props['type'] === 'object' && node.parent?.props?.['x-component'] === 'TableGroup.InnerTable';
      },
      propsSchema: createVoidFieldSchema(AllSchemas.TableGroup.Table.Column),
    },
    designerLocales: AllLocales.TableGroupTableColumn,
  },
  {
    name: 'TableGroup.Pagination',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'TableGroup.Pagination',
    designerProps: {
      draggable: false,
      droppable: false,
      propsSchema: createVoidFieldSchema(AllSchemas.TableGroup.Pagination),
    },
    designerLocales: AllLocales.TableGroupPagination,
  },
);

TableGroup.Resource = createResource({
  icon: 'ArrayTableSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'object',
        'x-decorator': 'FormItem',
        'x-component': 'TableGroup',
      },
    },
  ],
});
