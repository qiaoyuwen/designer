import { Form, FormPathPattern } from '@formily/core';

export const createFormFieldSetComponentsFunc = ($form: Form) => {
  return (pattern: FormPathPattern, props: Record<string | number | symbol, any>) => {
    const field = $form.query(pattern).take();
    field?.setComponentProps(props);
  };
};
