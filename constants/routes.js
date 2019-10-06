const appRoutes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  notebookWithId: '/notebook/:id',
  notebook: id => `/notebook/${id}`,
  account: '/account',
};

export default appRoutes;
