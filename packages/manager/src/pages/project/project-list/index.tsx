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

const ProjectListPage: FunctionComponent = () => {
  const [request] = useTableRequest<Project>(ProjectServices.getProjectsPagination);
  const [{ tableActionRef }] = useProjectList();

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
      render: () => <Actions />,
    },
  ];

  return (
    <PageContainer
      extra={[
        <Button key="add" type="primary">
          新增项目
        </Button>,
      ]}
    >
      <ProTable<Project> actionRef={tableActionRef} columns={columns} rowKey="id" request={request} />
    </PageContainer>
  );
};

export default ProjectListPage;
