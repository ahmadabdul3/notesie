const appRoutes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  noteDocWithId: '/notes-document/:id',
  noteDoc: id => `/notes-document/${id}`,
};

export default appRoutes;
