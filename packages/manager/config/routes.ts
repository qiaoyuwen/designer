export default [
  {
    path: '/login',
    name: 'login',
    component: './login',
    layout: false,
    hideInMenu: true,
  },
  {
    path: '/preview',
    name: 'preview',
    component: './preview',
    layout: false,
    hideInMenu: true,
  },
  {
    path: '/project-designer',
    name: 'project-designer',
    component: './project-designer',
    layout: false,
    hideInMenu: true,
  },
  {
    path: '/project-designer/config',
    name: 'project-designer-config',
    component: './project-designer/config',
    layout: false,
    hideInMenu: true,
  },
  {
    path: '/project',
    name: 'project',
    icon: 'setting',
    routes: [
      {
        path: '/project/project-list',
        name: 'project-list',
        component: './project/project-list',
      },
      {
        path: '/project/project-page-list',
        name: 'project-page-list',
        component: './project/project-page-list',
      },
      {
        path: '/project/project-page-list/config',
        name: 'project-page-list-config',
        component: './project/project-page-list/config',
        hideInMenu: true,
      },
      {
        path: '/project',
        redirect: '/project/project-list',
      },
    ],
  },
  {
    path: '/system',
    name: 'system',
    icon: 'setting',
    routes: [
      {
        path: '/system/user-list',
        name: 'user-list',
        component: './system/user-list',
      },
      {
        path: '/system/role-list',
        name: 'role-list',
        component: './system/role-list',
      },
      {
        path: '/system',
        redirect: '/system/user-list',
      },
    ],
  },
  {
    path: '/',
    redirect: '/project',
  },
  {
    component: './404',
  },
];
