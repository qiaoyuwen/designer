import React, { useEffect, useMemo } from 'react';
import { createForm, Form as FormType, registerValidateRules } from '@formily/core';
import { Form } from '@formily/antd-v5';
import { observer } from '@formily/react';
import {
  usePrefix,
  useSelected,
  useOperation,
  useSelectedNode,
  useWorkbench,
  IconWidget,
  NodePathWidget,
} from '@designer/react';
import { SchemaField } from './SchemaField';
import { ISettingFormProps } from './types';
import { SettingsFormContext } from './shared/context';
import { useLocales, useSnapshot } from './effects';
import { Empty } from 'antd';
import cls from 'classnames';
import './styles.less';

export const SettingsForm: React.FC<ISettingFormProps> = observer((props) => {
  const workbench = useWorkbench();
  const currentWorkspace = workbench?.activeWorkspace || workbench?.currentWorkspace;
  const currentWorkspaceId = currentWorkspace?.id;
  const operation = useOperation(currentWorkspaceId);
  const node = useSelectedNode(currentWorkspaceId);
  const selected = useSelected(currentWorkspaceId);
  const prefix = usePrefix('settings-form');
  const schema = node?.designerProps?.propsSchema;
  const isEmpty = !(node && node.designerProps?.propsSchema && selected.length === 1);
  const form = useMemo(() => {
    return createForm({
      initialValues: node?.designerProps?.defaultProps,
      values: node?.props,
      effects(form: FormType) {
        useLocales(node);
        useSnapshot(operation);
        props.effects?.(form);
      },
    });
  }, [node, node?.props, schema, operation, isEmpty]);

  useEffect(() => {
    registerValidateRules({
      nameValidator: () => {
        const findedItem = node.parent.children.find(
          (item) => item !== node && item.props['name'] && item.props['name'] === node.props['name'],
        );
        if (findedItem) {
          return `同级组件字段标识重复`;
        }
        return '';
      },
    });
  }, [node]);

  const render = () => {
    if (!isEmpty) {
      return (
        <div className={cls(prefix, props.className)} style={props.style} key={node.id}>
          <SettingsFormContext.Provider value={props}>
            <Form
              form={form}
              colon={false}
              labelWidth={120}
              labelAlign="left"
              wrapperAlign="right"
              tooltipLayout="text"
            >
              <SchemaField schema={schema} components={props.components} scope={{ $node: node, ...props.scope }} />
            </Form>
          </SettingsFormContext.Provider>
        </div>
      );
    }
    return (
      <div className={prefix + '-empty'}>
        <Empty />
      </div>
    );
  };

  return (
    <IconWidget.Provider tooltip>
      <div className={prefix + '-wrapper'}>
        {!isEmpty && <NodePathWidget workspaceId={currentWorkspaceId} />}
        <div className={prefix + '-content'}>{render()}</div>
      </div>
    </IconWidget.Provider>
  );
});
