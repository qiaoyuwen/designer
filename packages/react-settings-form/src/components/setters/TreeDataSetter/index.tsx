import { Fragment, useMemo, useState } from 'react';
import cls from 'classnames';
import { IDataSourceItem, ITreeDataSource } from './types';
import { observable } from '@formily/reactive';
import { observer } from '@formily/reactive-react';
import { Form } from '@formily/core';
import { usePrefix, useTheme, TextWidget } from '@designer/react';
import { Button, Modal, Tabs } from 'antd';
import { uid } from '@designer/utils';
import './styles.less';
import { TreePanel } from './TreePanel';
import { DataSettingPanel } from './DataSettingPanel';
import { JSONPanel } from './JSONPanel';
import { takeMessage } from '@designer/core';

type TabKey = 'tree' | 'json';
type TreeDataType = 'Option' | 'TableColumn';

export interface ITreeDataSetterProps {
  className?: string;
  style?: React.CSSProperties;
  onChange: (dataSource: IDataSourceItem[]) => void;
  value?: IDataSourceItem[];
  allowTree?: boolean;
  effects?: (form: Form<any>) => void;
  labelKey?: string;
  type?: TreeDataType;
}

export function createTreeDataSetter({
  localeTokenPrefix,
  type = 'Option',
}: {
  localeTokenPrefix: string;
  type?: TreeDataType;
}): React.FC<ITreeDataSetterProps> {
  return observer((props) => {
    const {
      className,
      value,
      onChange,
      allowTree = true,
      effects = () => {},
      labelKey = type === 'TableColumn' ? 'title' : 'label',
    } = props;

    const theme = useTheme();
    const prefix = usePrefix('tree-data-setter');
    const [modalVisible, setModalVisible] = useState(false);
    const [tab, setTab] = useState<TabKey>('tree');
    const treeDataSource: ITreeDataSource = useMemo(() => {
      return observable({
        dataSource: (value || []).map((item) => ({
          ...item,
          key: uid(),
        })),
        selectedKey: '',
      });
    }, [value, modalVisible]);
    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    return (
      <Fragment>
        <Button block onClick={openModal}>
          <TextWidget token={`${localeTokenPrefix}.configureDataSource`} />
        </Button>
        <Modal
          title={<TextWidget token={`${localeTokenPrefix}.configureDataSource`} />}
          width="65%"
          bodyStyle={{ padding: 10 }}
          transitionName=""
          maskTransitionName=""
          visible={modalVisible}
          onCancel={closeModal}
          onOk={() => {
            onChange(treeDataSource.dataSource);
            closeModal();
          }}
        >
          <Tabs activeKey={tab} onChange={(activeKey: TabKey) => setTab(activeKey)}>
            <Tabs.TabPane tab={takeMessage(`${localeTokenPrefix}.dataSourceTab`)} key="tree">
              {tab === 'tree' && (
                <div className={`${cls(prefix, className)} ${prefix + '-' + theme} ${prefix + '-layout'}`}>
                  <div className={`${prefix + '-layout-item left'}`}>
                    <TreePanel
                      labelKey={labelKey}
                      localeTokenPrefix={localeTokenPrefix}
                      allowTree={allowTree}
                      treeDataSource={treeDataSource}
                    />
                  </div>
                  <div className={`${prefix + '-layout-item right'}`}>
                    <DataSettingPanel
                      treeDataSource={treeDataSource}
                      effects={effects}
                      localeTokenPrefix={localeTokenPrefix}
                      type={type}
                    />
                  </div>
                </div>
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab={takeMessage(`${localeTokenPrefix}.jsonTab`)} key="json">
              {tab === 'json' && (
                <div className={`${cls(prefix, className)} ${prefix + '-' + theme} ${prefix + '-layout'}`}>
                  <div className={`${prefix + '-layout-item single'}`}>
                    <JSONPanel treeDataSource={treeDataSource} localeTokenPrefix={localeTokenPrefix} />
                  </div>
                </div>
              )}
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      </Fragment>
    );
  });
}