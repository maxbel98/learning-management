import {
  ADD_USER,
  DEL_USER,
  ADD_MSG,
  ADD_LOGMSG,
  UPDATE_AVATAR,
  UPDATE_PROFILE,
  AVATAR_TO_STATE,
  REQUEST_ALL_USERS,
  GET_SELECTED_USERS,
  ADD_LOAD_STATUS,
} from './types';

const initialState = {
  user: {
    login: '',
    status: false,
    message: '',
    loginMessage: '',
    photo: '',
    email: '',
    phone: '',
    group: '',
    groupName: '',
    photoSrc: '',
    adminstatus: false,
    loading: false,
    selectedGroupName: '',
    selectedGroupList: [],
    selectedGroupItems: [],
  },
};
export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_USER: {
      return {
        ...state,
        user: {
          ...state.user,
          login: action.login,
          status: true,
          adminstatus: action.status,
          photo: action.photo,
          group: action.group,
          groupName: action.groupName,
          loading: true,
        },
      };
    }
    case ADD_MSG: {
      return {
        ...state,
        user: { message: action.message,loading:action.loading },
      };
    }
    case ADD_LOGMSG: {
      return {
        ...state,
        user: { loginMessage: action.loginMessage,loading:action.loading },
      };
    }
    case ADD_LOAD_STATUS: {
      return {
        ...state,
        user: {loading:action.loading },
      };
    }
    case DEL_USER: {
      return {
        ...state,
        user: { login: '', status: false, loading: true },
      };
    }
    case AVATAR_TO_STATE: {
      return {
        ...state,
        user: { ...state.user, photo: action.photo, photoSrc: action.photo.name },
      };
    }
    case UPDATE_AVATAR: {
      return {
        ...state,
        user: { ...state.user, photo: action.photo, photoSrc: action.photo.name },
      };
    }
    case UPDATE_PROFILE: {
      return {
        ...state,
        user: {
          ...state.user,
          email: action.email,
          login: action.login,
          phone: action.phone,
          group: action.group,
          groupName: action.groupName,
          photoSrc: action.photo,
        },
      };
    }
    case REQUEST_ALL_USERS: {
      return {
        ...state,
        users: action.users,
      };
    }
    case GET_SELECTED_USERS: {
      return {
        ...state,
        selectedGroupList: action.selectedGroupList,
        selectedGroupItems: action.selectedGroupItems,
      };
    }
    default:
      return state;
  }
}
