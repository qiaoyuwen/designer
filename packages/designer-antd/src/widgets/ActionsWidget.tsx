import { FunctionComponent, useEffect } from 'react';
import { Space, Button } from 'antd';
import { useDesigner, TextWidget } from '@designer/react';
import { GlobalRegistry } from '@designer/core';
import { observer } from '@formily/react';
import { loadInitialSchema, saveSchema } from '../service';

const supportLocales = ['zh-cn', 'en-us'];

export const ActionsWidget: FunctionComponent = observer(() => {
  const designer = useDesigner();
  useEffect(() => {
    loadInitialSchema(designer);
  }, [designer]);

  useEffect(() => {
    if (!supportLocales.includes(GlobalRegistry.getDesignerLanguage())) {
      GlobalRegistry.setDesignerLanguage('zh-cn');
    }
  }, []);
  return (
    <Space style={{ marginRight: 10 }}>
      {/* <Radio.Group
        value={GlobalRegistry.getDesignerLanguage()}
        optionType="button"
        options={[
          { label: 'English', value: 'en-us' },
          { label: '简体中文', value: 'zh-cn' },
        ]}
        onChange={(e) => {
          GlobalRegistry.setDesignerLanguage(e.target.value);
        }}
      /> */}

      <Button
        onClick={() => {
          saveSchema(designer);
        }}
      >
        <TextWidget>Save</TextWidget>
      </Button>
    </Space>
  );
});
