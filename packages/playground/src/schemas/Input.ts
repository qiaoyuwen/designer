import { ISchema } from '@formily/react';

export const Input: ISchema & { TextArea?: ISchema } = {
  type: 'object',
  properties: {},
};

Input.TextArea = {
  type: 'object',
  properties: {},
};
