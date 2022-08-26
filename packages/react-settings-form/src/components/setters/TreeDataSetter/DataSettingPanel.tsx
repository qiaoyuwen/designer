import React, { Fragment } from 'react';
import { Form as FormCore } from '@formily/core';
import { observer } from '@formily/reactive-react';
import { usePrefix, TextWidget } from '@designer/react';
import { Header } from './Header';

import { ITreeDataSource } from './types';
import './styles.less';
import { OptionDataSettingForm } from './forms';

export interface IDataSettingPanelProps {
  treeDataSource: ITreeDataSource;
  effects?: (form: FormCore<any>) => void;
  localeTokenPrefix: string;
}

export const DataSettingPanel: React.FC<IDataSettingPanelProps> = observer((props) => {
  const { localeTokenPrefix } = props;
  const prefix = usePrefix('tree-data-setter');
  if (!props.treeDataSource.selectedKey)
    return (
      <Fragment>
        <Header title={<TextWidget token={`${localeTokenPrefix}.nodeProperty`} />} extra={null} />
        <div className={`${prefix + '-layout-item-content'}`}>
          <TextWidget token={`${localeTokenPrefix}.pleaseSelectNode`} />
        </div>
      </Fragment>
    );
  return (
    <Fragment>
      <Header title={<TextWidget token={`${localeTokenPrefix}.nodeProperty`} />} />
      <div className={`${prefix + '-layout-item-content'}`}>
        <OptionDataSettingForm {...props} />
      </div>
    </Fragment>
  );
});
