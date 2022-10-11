import { PageContainer } from '@ant-design/pro-layout';
import type { FunctionComponent } from 'react';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { useTableRequest } from '@/hooks';
import { useProjectList } from './hooks';
import Actions from '@/components/actions';
import { Project } from '@/models';
import { ProjectServices } from '@/services/project';
import AddModal from './add-modal';

const ProjectListPage: FunctionComponent = () => {
  const [request] = useTableRequest<Project>(ProjectServices.getProjectsPagination);
  const [{ tableActionRef }, { visible, selectedItem, openModal, onOk, onCancel }, { remove }] = useProjectList();

  const columns: ProColumnType<Project>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
    },
    {
      title: '项目名',
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
          新增项目
        </Button>,
      ]}
    >
      <ProTable<Project> actionRef={tableActionRef} columns={columns} rowKey="id" request={request} />
      <AddModal visible={visible} formData={selectedItem} onOk={onOk} onCancel={onCancel} />
    </PageContainer>
  );
};

export default ProjectListPage;
