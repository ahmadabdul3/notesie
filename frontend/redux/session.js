
const actions = {};

actions.loginSuccess = function(data) {
  return {
    type: 'LOGIN_SUCCESS',
    data
  };
};

actions.signupSuccess = function(data) {
  return {
    type: 'SIGNUP_SUCCESS',
    data
  };
};

actions.logoutSuccess = function() {
  return {
    type: 'LOGOUT_SUCCESS',
  };
};

actions.updateUser = function(data) {
  return {
    type: 'UPDATE_USER',
    data,
  };
};

actions.fetchUserOnInitSuccess = function(data) {
  return {
    type: 'FETCH_USER_ON_INIT_SUCCESS',
    data,
  };
}

actions.loginSuccess = function(data) {
  return {
    type: 'LOGIN_SUCCESS',
    data,
  };
}

export { actions };

const initialState = {
  authenticated: false,
  user: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: { ...action.data.user },
        authenticated: true,
      };

    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        user: { ...action.data.user },
        authenticated: true,
      };

    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        user: {},
        authenticated: false,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...action.data.user },
      };

    case 'FETCH_USER_ON_INIT_SUCCESS':
      return {
        ...state,
        user: { ...action.data.user },
        authenticated: true,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: { ...action.data.user },
        authenticated: true,
      };

    default: return state;
  }
}
