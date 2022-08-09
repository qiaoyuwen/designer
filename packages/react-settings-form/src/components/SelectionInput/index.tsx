import { usePrefix } from '@designer/react';
import React, { useEffect, useRef, useState } from 'react';
import { Select } from 'antd';
import cls from 'classnames';
import './styles.less';

interface ISelectionInputOption {
  label?: string;
  value: string;
  component?: any;
  checker: (value: any) => boolean;
  toInputValue?: (value: any) => any;
  toChangeValue?: (value: any) => any;
}

export interface ISelectionInputProps {
  style?: React.CSSProperties;
  className?: string;
  value: any;
  options: ISelectionInputOption[];
  defaultOption?: string;
  onChange?: (value: any) => void;
}

const isValid = (val: any) => val !== undefined && val !== null;

const getEventValue = (event: any) => {
  if (event?.target) {
    if (isValid(event.target.value)) return event.target.value;
    if (isValid(event.target.checked)) return event.target.checked;
    return;
  }
  return event;
};

export function createPolyInput(inputOptions: ISelectionInputOption[] = []): React.FC<ISelectionInputProps> {
  return (props) => {
    const prefix = usePrefix('selection-input');
    const options = props.options || inputOptions;
    const [current, setCurrent] = useState(props.defaultOption || options[0]?.value);
    const option = options?.find(({ value }) => value === current);
    const optionsValue = useRef({});

    useEffect(() => {
      options?.forEach(({ checker, value }) => {
        if (checker(props.value)) {
          setCurrent(value);
        }
      });
    }, [props.value]);

    const transformOnChangeValue = (value: any, option: ISelectionInputOption) => {
      return option?.toChangeValue ? option?.toChangeValue(value) : value;
    };

    return (
      <div className={cls(prefix, props.className)}>
        {option?.component && (
          <div className={prefix + '-content'}>
            {React.createElement(option.component, {
              ...props,
              value: option?.toInputValue ? option?.toInputValue(props.value) : props.value,
              onChange: (event: any) => {
                const value = getEventValue(event);
                optionsValue.current[option?.value] = value;
                props.onChange?.(transformOnChangeValue(value, option));
              },
            })}
          </div>
        )}
        <Select
          className={prefix + '-controller'}
          style={{
            width: !option?.component ? '100%' : 'auto',
          }}
          value={current}
          onChange={(selection) => {
            setCurrent(selection);
            const nextOption = options.find((op) => op.value === selection);
            props.onChange?.(transformOnChangeValue(optionsValue.current[nextOption?.value], nextOption));
          }}
          options={options?.map((option) => ({
            value: option.value,
            label: option.label || option.label,
          }))}
        />
      </div>
    );
  };
}
