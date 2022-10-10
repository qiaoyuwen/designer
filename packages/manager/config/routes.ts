export default [
  {
    path: '/login',
    name: 'login',
    component: './login',
    layout: false,
    hideInMenu: true,
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
    redirect: '/system',
  },
  {
    component: './404',
  },
];
