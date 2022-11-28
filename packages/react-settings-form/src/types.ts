import React from 'react';
import { Form } from '@formily/core';
export interface ISettingFormProps {
  className?: string;
  style?: React.CSSProperties;
  components?: Record<string, React.FC<any>>;
  uploadAction?: string;
  effects?: (form: Form) => void;
  scope?: any;
  pageOptions?: { value: string; label: string }[];
}
