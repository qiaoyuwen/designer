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

const UserList: FunctionComponent = () => {
  const [request] = useTableRequest<User>(UserServices.getUsersPagination);
  const [{ tableActionRef }] = useUserList();

  const columns: ProColumnType<User>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'name',
      align: 'center',
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
      render: (_, item) => (
        <Actions>
          <Button key="changeStatus" type="link">
            重置密码
          </Button>
          <Button key="delete" type="link" danger>
            删除
          </Button>
        </Actions>
      ),
    },
  ];

  return (
    <PageContainer
      extra={[
        <Button key="add" type="primary">
          新增用户
        </Button>,
      ]}
    >
      <ProTable<User> actionRef={tableActionRef} columns={columns} rowKey="id" request={request} />
    </PageContainer>
  );
};

export default UserList;
