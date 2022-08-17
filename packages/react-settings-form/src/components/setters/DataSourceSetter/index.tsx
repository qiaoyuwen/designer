import React, { Fragment, useMemo, useState } from 'react';
import cls from 'classnames';
import { Modal, Button, Tabs } from 'antd';
import { Form } from '@formily/core';
import { observable } from '@formily/reactive';
import { observer } from '@formily/reactive-react';
import { usePrefix, useTheme, TextWidget } from '@designer/react';
import { DataSettingPanel } from './DataSettingPanel';
import { TreePanel } from './TreePanel';
import { transformDataToValue, transformValueToData } from './shared';
import { IDataSourceItem, ITreeDataSource } from './types';
import './styles.less';
import { JSONPanel } from './JSONPanel';

export interface IDataSourceSetterProps {
  className?: string;
  style?: React.CSSProperties;
  onChange: (dataSource: IDataSourceItem[]) => void;
  value: IDataSourceItem[];
  allowTree?: boolean;
  allowExtendOption?: boolean;
  defaultOptionValue?: {
    label: string;
    value: any;
  }[];
  effects?: (form: Form<any>) => void;
}

export const DataSourceSetter: React.FC<IDataSourceSetterProps> = observer((props) => {
  const {
    className,
    value = [],
    onChange,
    allowTree = true,
    allowExtendOption = true,
    defaultOptionValue,
    effects = () => {},
  } = props;
  const theme = useTheme();
  const prefix = usePrefix('data-source-setter');
  const [modalVisible, setModalVisible] = useState(false);
  const [tab, setTab] = useState('tree');
  const treeDataSource: ITreeDataSource = useMemo(
    () =>
      observable({
        dataSource: transformValueToData(value),
        selectedKey: '',
      }),
    [value, modalVisible],
  );
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <Fragment>
      <Button block onClick={openModal}>
        <TextWidget token="SettingComponents.DataSourceSetter.configureDataSource" />
      </Button>
      <Modal
        title={<TextWidget token="SettingComponents.DataSourceSetter.configureDataSource" />}
        width="65%"
        bodyStyle={{ padding: 10 }}
        transitionName=""
        maskTransitionName=""
        visible={modalVisible}
        onCancel={closeModal}
        onOk={() => {
          onChange(transformDataToValue(treeDataSource.dataSource));
          closeModal();
        }}
      >
        <Tabs activeKey={tab} onChange={setTab}>
          <Tabs.TabPane tab="节点配置" key="tree">
            {tab === 'tree' && (
              <div className={`${cls(prefix, className)} ${prefix + '-' + theme} ${prefix + '-layout'}`}>
                <div className={`${prefix + '-layout-item left'}`}>
                  <TreePanel
                    defaultOptionValue={defaultOptionValue}
                    allowTree={allowTree}
                    treeDataSource={treeDataSource}
                  />
                </div>
                <div className={`${prefix + '-layout-item right'}`}>
                  <DataSettingPanel
                    allowExtendOption={allowExtendOption}
                    treeDataSource={treeDataSource}
                    effects={effects}
                  />
                </div>
              </div>
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="JSON配置" key="json">
            {tab === 'json' && (
              <div className={`${cls(prefix, className)} ${prefix + '-' + theme} ${prefix + '-layout'}`}>
                <div className={`${prefix + '-layout-item single'}`}>
                  <JSONPanel treeDataSource={treeDataSource} />
                </div>
              </div>
            )}
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </Fragment>
  );
});
