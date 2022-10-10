﻿export default [
  {
    path: '/login',
    name: 'login',
    component: './login',
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
