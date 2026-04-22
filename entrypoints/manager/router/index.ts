import { createRouter, createWebHashHistory } from 'vue-router';
import DomainView from '../views/DomainView.vue';
import TagView from '../views/TagView.vue';
import FolderView from '../views/FolderView.vue';

const routes = [
  {
    path: '/',
    redirect: '/domain',
  },
  {
    path: '/domain',
    name: 'domain',
    component: DomainView,
  },
  {
    path: '/tags',
    name: 'tags',
    component: TagView,
  },
  {
    path: '/folder',
    name: 'folder',
    component: FolderView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
