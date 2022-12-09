import { InputNumber } from 'antd';
import { createSelectionInput, ISelectionInputProps } from '../SelectionInput';

const takeNumber = (value: any) => {
  const num = String(value)
    .trim()
    .replace(/[^\d\.]+/, '');
  if (num === '') return;
  return Number(num);
};

const createUnitType = (optionValue: string, label?: string) => {
  return {
    label: label || optionValue,
    value: optionValue,
    component: InputNumber,
    checker(value: any) {
      return String(value).includes(optionValue);
    },
    toInputValue(value: any) {
      return takeNumber(value);
    },
    toChangeValue(value: any) {
      return `${value || 0}${optionValue}`;
    },
  };
};

const createSpecialSizeOption = (optionValue: string, label?: string) => ({
  label: label || optionValue,
  value: optionValue,
  checker(value: any) {
    if (value === optionValue) return true;
    return false;
  },
  toChangeValue() {
    return optionValue;
  },
});

const NormalSizeOptions = [
  createSpecialSizeOption('inherit'),
  createSpecialSizeOption('auto'),
  createUnitType('px'),
  createUnitType('%'),
  createUnitType('vh'),
  createUnitType('em'),
];

export const SizeInput: React.FC<ISelectionInputProps> = createSelectionInput(NormalSizeOptions);

const createEmptySizeOption = (optionValue: string, label?: string) => ({
  label: label || optionValue,
  value: '',
  checker(value: any) {
    if (!value) return true;
    return false;
  },
  toChangeValue() {
    return '';
  },
});

const TableColumnWidthSizeOptions = [createEmptySizeOption('undefined'), createUnitType('px')];

export const TableColumnWidthSizeInput: React.FC<ISelectionInputProps> =
  createSelectionInput(TableColumnWidthSizeOptions);

export const BackgroundSizeInput = createSelectionInput([
  createSpecialSizeOption('cover'),
  createSpecialSizeOption('contain'),
  createUnitType('px'),
  createUnitType('%'),
  createUnitType('vh'),
  createUnitType('em'),
]);
