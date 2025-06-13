import MyStories from '@/components/pages/MyStories';
import Editor from '@/components/pages/Editor';
import Preview from '@/components/pages/Preview';

export const routes = {
  myStories: {
    id: 'myStories',
    label: 'My Stories',
    path: '/my-stories',
    icon: 'BookOpen',
    component: MyStories
  },
  editor: {
    id: 'editor',
    label: 'Editor',
    path: '/editor',
    icon: 'Edit3',
    component: Editor
  },
  preview: {
    id: 'preview',
    label: 'Preview',
    path: '/preview',
    icon: 'Play',
    component: Preview
  }
};

export const routeArray = Object.values(routes);
export default routes;