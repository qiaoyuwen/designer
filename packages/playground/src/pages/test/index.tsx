import { Input } from '@formily/antd-v5';
import { createForm } from '@formily/core';
import { FormProvider, Field, FormConsumer } from '@formily/react';
import { FC, useMemo } from 'react';

const TestPage: FC = () => {
  const form = useMemo(() => {
    return createForm({
      // designable: true,
      initialValues: {
        input: '测试',
        a: 'sfasd',
      },
    });
  }, []);

  return (
    <FormProvider form={form}>
      <Field name="input" component={[Input, { placeholder: 'Please Input' }]} />
      <FormConsumer>
        {() => (
          <div
            style={{
              marginTop: 24,
              padding: 5,
              border: '1px dashed #666',
            }}
          >
            实时响应：{JSON.stringify(form.values || '')}
          </div>
        )}
      </FormConsumer>
    </FormProvider>
  );
};

export default TestPage;
