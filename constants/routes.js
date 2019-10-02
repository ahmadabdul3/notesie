const appRoutes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  notebookWithId: '/notebook/:id',
  notebook: id => `/notebook/${id}`,
};

export default appRoutes;
