
const routes = [
  {
    path: '/index',
    component: () => import('layouts/MainLayout.vue'),
    meta: { botonchat: true },
    children: [
    ]
  },
  { path: '/login', component: () => import('pages/Login.vue') },
  { path: '/registro/cliente', component: () => import('pages/registro/RegistroCliente.vue') },
  { path: '/room/:id', component: () => import('pages/Room.vue') },
  { path: '/streaming/:id', component: () => import('pages/Streaming.vue') },
  { path: '/rooms', component: () => import('pages/Rooms.vue') },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '*',
    redirect: '/login'
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
