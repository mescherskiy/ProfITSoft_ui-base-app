import axios from 'misc/requests';
import config from 'config';
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
import mockMovies from '../../constants/mockMovies.json';

const MOCK_GET_MOVIES_RESPONSE = {
    list: mockMovies,
};

const MOCK_FILTER_RESPONSE = (filter) => {
    return mockMovies.filter(movie => (!filter.title || movie.title === filter.title) &&
        (!filter.year || movie.year === filter.year) &&
        (!filter.genre || filter.genre.every(genre => movie.genre.includes(genre))) &&
        (!filter.director || movie.director === filter.director)
    )
}


const requestMovies = () => ({
    type: REQUEST_MOVIES,
});

const receiveMovies = (movies) => ({
    payload: movies,
    type: RECEIVE_MOVIES,
});

const errorReceiveMovies = (errors) => ({
    payload: errors,
    type: ERROR_RECEIVE_MOVIES,
});

const getMovies = () => {
    const {
        USERS_SERVICE,
    } = config;
    return axios.get(`${USERS_SERVICE}/movies`);
};

const requestDeleteMovie = (id) => ({
    payload: id,
    type: REQUEST_DELETE_MOVIE,
})

const successDeleteMovie = () => ({
    type: SUCCESS_DELETE_MOVIE,
})

const errorDeleteMovie = (error) => ({
    payload: error,
    type: ERROR_DELETE_MOVIE,
})

const fetchMovies = () => (dispatch) => {
    dispatch(requestMovies());
    return getMovies()
        .catch((err) => {
            console.log("Err: ", err)
            if (err.code === "ERR_NETWORK") {
                return MOCK_GET_MOVIES_RESPONSE;
            }

            return Promise.reject(err);
        })
        .then((movies) => dispatch(receiveMovies(movies)))
        .catch((error) => dispatch(errorReceiveMovies(error)));
};

const requestFilterMovies = (filter) => ({
    payload: filter,
    type: REQUEST_FILTER_MOVIES
})

const successFilterMovies = (movies) => ({
    payload: movies,
    type: SUCCESS_FILTER_MOVIES
})

const errorFilterMovies = (error) => ({
    payload: error,
    type: ERROR_FILTER_MOVIES
})

const fetchFilterMovies = (filter) => (dispatch) => {
    dispatch(requestFilterMovies)
    return postFilter(filter)
        .catch((err) => {
            if (err.code === "ERR_NETWORK") {
                const resp = MOCK_FILTER_RESPONSE(filter);
                console.log("Response in fetchFilter: ", resp)
                return resp;
            }

            return Promise.reject(err);
        })
        .then((movies) => dispatch(successFilterMovies(movies)))
        .catch((error) => dispatch(errorFilterMovies(error)));
}

const postFilter = (filter) => {
    const {
        USERS_SERVICE,
    } = config;
    return axios.post(`${USERS_SERVICE}/movies/_list`);
};

const updateMovies = (movies) => ({
    payload: movies,
    type: UPDATE_MOVIES
})

const fetchUpdateMovies = (movies) => (dispatch) => {
    dispatch(updateMovies(movies))
}

const exportFunctions = {
    fetchMovies,
    receiveMovies,
    requestDeleteMovie,
    successDeleteMovie,
    errorDeleteMovie,
    fetchFilterMovies,
    fetchUpdateMovies,
};

export default exportFunctions;
