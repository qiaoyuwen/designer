import { FunctionComponent, useEffect } from 'react';
import { Space, Button } from 'antd';
import { useDesigner, TextWidget } from '@designer/react';
import { GlobalRegistry } from '@designer/core';
import { observer } from '@formily/react';
import { loadInitialSchema, saveSchema } from '../service';

const supportLocales = ['zh-cn', 'en-us'];

interface IActionsWidgetProps {
  initialSchema?: string;
  onSave?: (schemaJson: string) => Promise<void>;
  onPreview?: (schemaJson: string) => Promise<void>;
  onBack?: () => void;
  hideBackBtn?: boolean;
}

export const ActionsWidget: FunctionComponent<IActionsWidgetProps> = observer((props) => {
  const designer = useDesigner();
  useEffect(() => {
    loadInitialSchema(designer, props.initialSchema);
  }, [designer, props.initialSchema]);

  useEffect(() => {
    if (!supportLocales.includes(GlobalRegistry.getDesignerLanguage())) {
      GlobalRegistry.setDesignerLanguage('zh-cn');
    }
  }, []);
  return (
    <Space size={16}>
      <Button
        type="primary"
        onClick={() => {
          saveSchema(designer, props.onSave);
        }}
      >
        <TextWidget>Save</TextWidget>
      </Button>
      <Button
        type="primary"
        onClick={() => {
          saveSchema(designer, props.onPreview);
        }}
      >
        <TextWidget>Preview</TextWidget>
      </Button>
      {props.hideBackBtn !== true && (
        <Button
          onClick={() => {
            props.onBack?.();
          }}
        >
          <TextWidget>Back</TextWidget>
        </Button>
      )}
    </Space>
  );
});
