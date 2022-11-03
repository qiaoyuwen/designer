import { PageContainer } from '@ant-design/pro-layout';
import type { FunctionComponent } from 'react';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { useTableRequest } from '@/hooks';
import { useProjectDesignerPage } from './hooks';
import Actions from '@/components/actions';
import { ProjectPage } from '@/models';
import { ProjectPageServices } from '@/services';
import AddModal from './add-modal';
import { history, IRouteComponentProps } from 'umi';
import { useProject } from '@/data';

const getProjectPagesById = (id: string) => {
  return (params: any) => {
    return ProjectPageServices.getProjectPagesPagination({
      ...params,
      projectId: id,
    });
  };
};

const ProjectDesignerPage: FunctionComponent<IRouteComponentProps<{}, { id: string }>> = (props) => {
  const { id } = props.location.query;
  const [project] = useProject(id);
  const [request] = useTableRequest<ProjectPage>(getProjectPagesById(id));
  const [{ tableActionRef }, { visible, selectedItem, openModal, onOk, onCancel }, { remove, changeStatus }] =
    useProjectDesignerPage();

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
          <Button
            key="edit"
            type="link"
            onClick={() => {
              console.log('item', item);
              openModal(item);
            }}
          >
            编辑
          </Button>
          <Button key="config" type="link" onClick={() => history.push(`/project-designer/config?id=${item.id}`)}>
            配置
          </Button>
          <Button key="config" type="link" onClick={() => window.open(`/preview?id=${item.id}`, '_blank')}>
            预览
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
      header={{
        title: `配置视图: ${project?.name}`,
      }}
      extra={[
        <Button
          key="add"
          type="primary"
          onClick={() => {
            openModal({
              project: {
                id: project?.id,
              } as any,
            } as any);
          }}
        >
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

export default ProjectDesignerPage;
