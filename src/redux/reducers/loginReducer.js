import Cookies from 'js-cookie';

const getUser = () => {
  const cookie = Cookies.get('user');

  if (cookie) {
    return JSON.parse(cookie);
  }

  return null;
};

const initialState = {
  isLoggedIn: !!getUser(),
  user: getUser(),
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      Cookies.set('user', JSON.stringify(action.payload), { expires: 365 });
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };
    case 'LOGOUT':
      Cookies.remove('user');
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    default:
      return state;
  }
};

export default loginReducer;
