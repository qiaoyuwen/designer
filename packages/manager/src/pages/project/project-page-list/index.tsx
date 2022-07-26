import { PageContainer } from '@ant-design/pro-layout';
import type { FunctionComponent } from 'react';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { useTableRequest } from '@/hooks';
import { useProjectPageList } from './hooks';
import Actions from '@/components/actions';
import { ProjectPage } from '@/models';
import { ProjectPageServices } from '@/services';
import AddModal from './add-modal';
import { history } from 'umi';

const ProjectPageListPage: FunctionComponent = () => {
  const [request] = useTableRequest<ProjectPage>(ProjectPageServices.getProjectPagesPagination);
  const [{ tableActionRef }, { visible, selectedItem, openModal, onOk, onCancel }, { remove, changeStatus }] =
    useProjectPageList();

  const columns: ProColumnType<ProjectPage>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
    },
    {
      title: '页面名',
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
      title: '所属项目',
      dataIndex: 'project.name',
      align: 'center',
      search: false,
      render: (_, item) => {
        return item.project?.name || '-';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      search: false,
      render: (_, item) => {
        return item.status ? '已上线' : '未上线';
      },
    },
    {
      title: '操作',
      align: 'center',
      search: false,
      width: 220,
      render: (_, item) => (
        <Actions>
          <Button key="edit" type="link" onClick={() => openModal(item)}>
            编辑
          </Button>
          <Button
            key="config"
            type="link"
            onClick={() => history.push(`/project/project-page-list/config?id=${item.id}`)}
          >
            配置
          </Button>
          <Button key="online" type="link" onClick={() => changeStatus(item)}>
            {item.status ? '下线' : '上线'}
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
          新增页面
        </Button>,
      ]}
    >
      <ProTable<ProjectPage> actionRef={tableActionRef} columns={columns} rowKey="id" request={request} />
      <AddModal
        visible={visible}
        formData={{
          ...selectedItem,
          projectId: selectedItem?.project?.id,
        }}
        onOk={onOk}
        onCancel={onCancel}
      />
    </PageContainer>
  );
};

export default ProjectPageListPage;
