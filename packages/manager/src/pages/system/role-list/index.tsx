import { PageContainer } from '@ant-design/pro-layout';
import type { FunctionComponent } from 'react';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { useTableRequest } from '@/hooks';
import { useRoleList } from './hooks';
import { RoleServices } from '@/services';
import Actions from '@/components/actions';
import AddModal from './add-modal';
import { Role } from '@/models';

const UserList: FunctionComponent = () => {
  const [request] = useTableRequest<Role>(RoleServices.getRolesPagination);
  const [{ tableActionRef }, { visible, openModal, selectedItem, onOk, onCancel }, { remove }] = useRoleList();

  const columns: ProColumnType<Role>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
    },
    {
      title: '角色名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '描述',
      dataIndex: 'description',
      align: 'center',
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
      render: (_, item) => (
        <Actions>
          <Button key="edit" type="link" onClick={() => openModal(item)}>
            编辑
          </Button>
          <Button key="delete" type="link" danger onClick={() => remove(item)}>
            删除
          </Button>
        </Actions>
      ),
    },
  ];

  return (
    <PageContainer
      extra={[
        <Button key="add" type="primary" onClick={() => openModal()}>
          新增角色
        </Button>,
      ]}
    >
      <ProTable<Role> actionRef={tableActionRef} columns={columns} rowKey="id" request={request} />
      <AddModal visible={visible} formData={selectedItem} onOk={onOk} onCancel={onCancel} />
    </PageContainer>
  );
};

export default UserList;
