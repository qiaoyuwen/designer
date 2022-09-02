import React, { useEffect, useRef, useState } from 'react';
import { usePrefix } from '@designer/react';
import { takeMessage } from '@designer/core';
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
  value?: any;
  options?: ISelectionInputOption[];
  defaultOption?: string;
  onChange?: (value: any) => void;
  exclude?: string[];
  include?: string[];
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

const createOptions = (options: ISelectionInputOption[], include: string[], exclude: string[]) => {
  return options.filter(({ value }) => {
    if (Array.isArray(include) && include.length) {
      return include.includes(value);
    }
    if (Array.isArray(exclude) && exclude.length) {
      return !exclude.includes(value);
    }
    return true;
  });
};

export function createSelectionInput(
  inputOptions: ISelectionInputOption[] = [],
  controllerWidth?: number,
): React.FC<ISelectionInputProps> {
  return ({ defaultOption, ...props }) => {
    const prefix = usePrefix('selection-input');
    const options = createOptions(props.options || inputOptions, props.include, props.exclude);
    const [current, setCurrent] = useState(defaultOption || options[0]?.value);
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
      <div className={cls(prefix, props.className)} style={props.style}>
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
            display: options.length === 1 ? 'none' : undefined,
            width: !option?.component ? '100%' : controllerWidth || 40,
          }}
          showArrow={false}
          dropdownMatchSelectWidth={false}
          value={current}
          onChange={(selection) => {
            setCurrent(selection);
            const nextOption = options.find((op) => op.value === selection);
            props.onChange?.(transformOnChangeValue(optionsValue.current[nextOption?.value], nextOption));
          }}
        >
          {options?.map((option) => {
            const token = `SettingComponents.SelectionInput.${option.label || option.value}`;
            const localeLabel = takeMessage(token);
            const label = localeLabel === token ? option.label || option.value : localeLabel;
            return (
              <Select.Option key={option.value} value={option.value}>
                {label}
              </Select.Option>
            );
          })}
        </Select>
      </div>
    );
  };
}
