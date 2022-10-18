import { PageContainer } from '@ant-design/pro-layout';
import type { FunctionComponent } from 'react';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { useTableRequest } from '@/hooks';
import { useUserList } from './hooks';
import type { User } from '@/models/user';
import { UserServices } from '@/services/user';
import Actions from '@/components/actions';
import { useModel } from 'umi';
import AddModal from './add-modal';

const UserList: FunctionComponent = () => {
  const { initialState } = useModel('@@initialState');

  const [request] = useTableRequest<User>(UserServices.getUsersPagination);
  const [{ tableActionRef }, { visible, openModal, onOk, onCancel }, { remove }] = useUserList();

  const columns: ProColumnType<User>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      align: 'center',
    },
    {
      title: '超级管理员',
      dataIndex: 'root',
      align: 'center',
      render: (_, item) => {
        return item.isRoot ? '是' : '否';
      },
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      align: 'center',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      align: 'center',
      search: false,
      width: 150,
      render: (_, item) => {
        if (!initialState?.currentUser?.isRoot || item.isRoot) {
          return <Actions />;
        }
        return (
          <Actions>
            <Button key="role" type="link" onClick={() => {}}>
              角色
            </Button>
            <Button key="delete" type="link" danger onClick={() => remove(item)}>
              删除
            </Button>
          </Actions>
        );
      },
    },
  ];

  return (
    <PageContainer
      extra={
        initialState?.currentUser?.isRoot
          ? [
              <Button key="add" type="primary" onClick={() => openModal()}>
                新增用户
              </Button>,
            ]
          : []
      }
    >
      <ProTable<User> actionRef={tableActionRef} columns={columns} rowKey="id" request={request} />
      <AddModal visible={visible} onOk={onOk} onCancel={onCancel} />
    </PageContainer>
  );
};

export default UserList;
