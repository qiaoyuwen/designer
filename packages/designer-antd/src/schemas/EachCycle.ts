import { ISchema } from '@formily/react';

export const EachCycle: ISchema & {
  Item?: ISchema;
} = {
  type: 'object',
  properties: {},
};

EachCycle.Item = {
  type: 'object',
  properties: {},
};
