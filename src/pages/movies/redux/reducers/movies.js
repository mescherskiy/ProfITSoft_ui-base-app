import {
  REQUEST_MOVIES,
  RECEIVE_MOVIES,
  ERROR_RECEIVE_MOVIES,
  REQUEST_DELETE_MOVIE,
  SUCCESS_DELETE_MOVIE,
  ERROR_DELETE_MOVIE,
  REQUEST_FILTER_MOVIES,
  SUCCESS_FILTER_MOVIES,
  ERROR_FILTER_MOVIES,
  UPDATE_MOVIES,
} from '../../constants/actionTypes';

const initialState = {
  list: [],
  errors: [],
  isFetchingMovies: false,
};

const convertErrors = (errors) => {
  console.log("Errors ", errors)
  errors.map(error => ({
    code: error.code,
    description: error.description,
  }))
};

export default function Reducer(state = initialState, action) {
  switch (action.type) {

    case REQUEST_MOVIES: {
      return {
        ...state,
        isFetchingMovies: true,
      };
    }

    case RECEIVE_MOVIES: {
      const movies = action.payload;

      return {
        ...state,
        list: movies?.list || initialState.list,
        isFetchingMovies: false,
      };
    }

    case ERROR_RECEIVE_MOVIES: {
      return {
        ...state,
        errors: convertErrors(action.payload),
        isFetchingMovies: false
      }
    }

    case REQUEST_DELETE_MOVIE: {
      const id = action.payload;
      const newList = state.list.filter(movie => movie.id !== id);

      return {
        ...state,
        list: newList,
        errors: [],
      }
    }

    case SUCCESS_DELETE_MOVIE: {
      return {
        ...state,
        errors: [],
      }
    }

    case ERROR_DELETE_MOVIE: {
      return {
        ...state,
        errors: [action.payload]
      }
    }

    case REQUEST_FILTER_MOVIES: {
      return {
        ...state,
      }
    }

    case SUCCESS_FILTER_MOVIES: {
      const filteredMovies = action.payload;
      return {
        ...state,
        list: filteredMovies
      }
    }

    case ERROR_FILTER_MOVIES: {
      const error = action.payload
      return {
        ...state,
        errors: action.payload
      }
    }

    case UPDATE_MOVIES: {
      const movies = action.payload
      return {
        ...state,
        list: movies
      }
    }

    default: {
      return state;
    }
  }
}
