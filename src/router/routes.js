const routes = [
  // Hub de Condomínios - Página Inicial
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'HubCondominios',
        component: () => import('pages/IndexPage.vue'),
      },
    ],
  },

  // Rota dinâmica para condomínios
  {
    path: '/:condominio',
    component: () => import('layouts/LayoutBase.vue'),
    children: [
      {
        path: '',
        name: 'CondominioHome',
        component: () => import('pages/HomePage.vue'),
      },
      {
        path: 'avisos',
        name: 'CondominioAvisos',
        component: () => import('pages/AvisosPage.vue'),
      },
      {
        path: 'eventos',
        name: 'CondominioEventos',
        component: () => import('pages/EventosPage.vue'),
      },
      {
        path: 'faq',
        name: 'CondominioFAQ',
        component: () => import('pages/FAQPage.vue'),
      },
      {
        path: 'sobre',
        name: 'CondominioSobre',
        component: () => import('pages/SobrePage.vue'),
      },
    ],
  },

  // Página de erro para condomínio não encontrado
  {
    path: '/404',
    component: () => import('pages/ErrorNotFound.vue'),
    props: {
      message: 'Condomínio não encontrado',
      submessage: 'Verifique o endereço ou entre em contato com a administração.',
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
