import { Fragment, useState } from 'react';
import { observer } from '@formily/reactive-react';
import { ITreeDataSource } from './types';
import { TextWidget, usePrefix } from '@designer/react';
import { Header } from './Header';
import { MonacoInput } from '../../MonacoInput';
import './styles.less';

export interface IJSONPanelProps {
  treeDataSource: ITreeDataSource;
  localeTokenPrefix: string;
}

export const JSONPanel: React.FC<IJSONPanelProps> = observer((props) => {
  const { treeDataSource, localeTokenPrefix } = props;
  const prefix = usePrefix('tree-data-setter');

  const getJsonValue = () => {
    let result = '';
    try {
      result = JSON.stringify(treeDataSource.dataSource);
    } catch {}
    return result;
  };

  const [value, setValue] = useState(getJsonValue());

  return (
    <Fragment>
      <Header title={<TextWidget token={`${localeTokenPrefix}.jsonPanel`} />} />
      <div className={`${prefix + '-layout-item-content'}`}>
        <MonacoInput
          value={value}
          language="json"
          onChange={(value) => {
            try {
              setValue(value);
              treeDataSource.dataSource = JSON.parse(value);
            } catch {}
          }}
        />
      </div>
    </Fragment>
  );
});
