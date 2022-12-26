import React, { Fragment, useState } from 'react';
import { Collapse as AntdCollapse, CollapseProps, CollapsePanelProps } from 'antd';
import { useField, observer, useFieldSchema, RecursionField } from '@formily/react';
import { Schema, SchemaKey } from '@formily/json-schema';
import cls from 'classnames';

const useCollapses = () => {
  const collapsesField = useField();
  const schema = useFieldSchema();
  const collapses: { name: SchemaKey; props: any; schema: Schema }[] = [];
  schema.mapProperties((schema, name) => {
    const field = collapsesField.query(collapsesField.address.concat(name)).take();
    if (field?.display === 'none' || field?.display === 'hidden') return;
    if (schema['x-component']?.indexOf('Collapse') > -1) {
      collapses.push({
        name,
        props: {
          key: schema?.['x-component-props']?.key || name,
          ...schema?.['x-component-props'],
        },
        schema,
      });
    }
  });
  return collapses;
};

type ComposedCollapse = React.FC<React.PropsWithChildren<CollapseProps>> & {
  Panel: React.FC<React.PropsWithChildren<CollapsePanelProps>>;
};

export const Collapse: ComposedCollapse = observer((props: CollapseProps) => {
  const collapses = useCollapses();
  const [activeKey, setActiveKey] = useState(
    props.activeKey || (collapses[0]?.name ? `${collapses[0]?.name}` : undefined),
  );

  return (
    <AntdCollapse
      {...props}
      className={cls('formily-antd-collapse', props.className)}
      activeKey={activeKey}
      onChange={(key) => {
        props.onChange?.(key);
        setActiveKey(key);
      }}
    >
      {collapses.map(({ props, schema, name }, key) => (
        <AntdCollapse.Panel key={key} {...props}>
          <RecursionField schema={schema} name={name} />
        </AntdCollapse.Panel>
      ))}
    </AntdCollapse>
  );
}) as unknown as ComposedCollapse;

const Panel: React.FC<React.PropsWithChildren<CollapsePanelProps>> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

Collapse.Panel = Panel;
