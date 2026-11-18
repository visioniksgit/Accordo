export const headerMenu = [
  {
    id: 1,
    title: 'Home',
    // styleType: 'link',
    customClass: 'nav-item',
    path: '/',
  },
  {
    id: 2,
    title: 'About Us',
    customClass: 'nav-item dropdown',
    customChildren: false,
    children: [
      { title: 'about1', type: 'link', path: '/' },
      { title: 'about2', type: 'link', path: '/' },
      // { title: 'about', type: 'link', path: '/' },
      // { title: 'about', type: 'link', path: '/' },
      // { title: 'about', type: 'link', path: '/' },
    ],
  }
];
