import { ArrayField } from '@formily/core';
import { RecursionField, useField, useFieldSchema } from '@formily/react';
import { FC, Fragment, PropsWithChildren } from 'react';

export const EachCycle: FC<PropsWithChildren> & {
  Item: FC<PropsWithChildren>;
} = () => {
  const field = useField<ArrayField>();
  const schema = useFieldSchema();
  const dataSource = Array.isArray(field.value) ? field.value : [];

  return (
    <Fragment>
      {dataSource.map((item, index) => {
        const itemsSchema = Array.isArray(schema.items) ? schema.items[index] || schema.items[0] : schema.items;
        return <RecursionField key={index} schema={itemsSchema} name={index} />;
      })}
    </Fragment>
  );
};

EachCycle.Item = (props) => {
  return <Fragment>{props.children}</Fragment>;
};
