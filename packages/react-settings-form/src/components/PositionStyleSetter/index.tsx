import { useField, Field, observer } from '@formily/react';
import { usePrefix, IconWidget } from '@designer/react';
import { Select } from '@formily/antd';
import { FoldItem } from '../FoldItem';
import { SizeInput } from '../SizeInput';
import { InputItems } from '../InputItems';
import cls from 'classnames';

export interface IPositionStyleSetterProps {
  className?: string;
  style?: React.CSSProperties;
  value?: string;
  onChange?: (value: string) => void;
}

const PositionOptions = [
  {
    label: '默认定位',
    value: 'static',
  },
  {
    label: '相对定位',
    value: 'relative',
  },
  {
    label: '绝对定位',
    value: 'absolute',
  },
];

export const PositionStyleSetter: React.FC<IPositionStyleSetterProps> = observer((props) => {
  const field = useField();
  const prefix = usePrefix('position-style-setter');

  return (
    <FoldItem className={cls(prefix, props.className)} label={field.title}>
      <FoldItem.Base>
        <Select options={PositionOptions} style={{ width: '100%' }} value={props.value} onChange={props.onChange} />
      </FoldItem.Base>
      <FoldItem.Extra>
        <InputItems width="50%">
          <InputItems.Item icon={<IconWidget infer="Top" size={16} />}>
            <Field
              name="top"
              basePath={field.address.parent()}
              component={[SizeInput, { style: { width: '100%' }, exclude: ['inherit', 'auto'] }]}
              dataSource={PositionOptions}
            />
          </InputItems.Item>
          <InputItems.Item icon={<IconWidget infer="Right" size={16} />}>
            <Field
              name="right"
              basePath={field.address.parent()}
              component={[SizeInput, { style: { width: '100%' }, exclude: ['inherit', 'auto'] }]}
              dataSource={PositionOptions}
            />
          </InputItems.Item>
          <InputItems.Item icon={<IconWidget infer="Bottom" size={16} />}>
            <Field
              name="bottom"
              basePath={field.address.parent()}
              component={[SizeInput, { style: { width: '100%' }, exclude: ['inherit', 'auto'] }]}
              dataSource={PositionOptions}
            />
          </InputItems.Item>
          <InputItems.Item icon={<IconWidget infer="Left" size={16} />}>
            <Field
              name="left"
              basePath={field.address.parent()}
              component={[SizeInput, { style: { width: '100%' }, exclude: ['inherit', 'auto'] }]}
              dataSource={PositionOptions}
            />
          </InputItems.Item>
        </InputItems>
      </FoldItem.Extra>
    </FoldItem>
  );
});
