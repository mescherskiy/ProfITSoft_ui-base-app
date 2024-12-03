import axios from 'misc/requests';
import config from 'config';
import {
    REQUEST_MOVIE,
    RECEIVE_MOVIE,
    ERROR_RECEIVE_MOVIE,
    REQUEST_UPDATE_MOVIE,
    SUCCESS_UPDATE_MOVIE,
    ERROR_UPDATE_MOVIE,
} from '../../constants/actionTypes';
import movies from '../../constants/mockDetailedMovies.json';

const MOCK_GET_MOVIE_RESPONSE = (id) => {
    console.log("ID : ", id)
    console.log("Movies : ", movies)
    const movie = movies.find(movie => movie.id === Number(id))
    console.log("Find movie: ", movie)
    return movie;
}

const MOCK_UPDATE_OR_CREATE_MOVIE_RESPONSE = (id, newMovie) => {
    if (id === "new") {
        return {
            id: 999,
            title: newMovie.title,
            year: newMovie.year,
            genre: newMovie.genre,
            director: {
                id: 999,
                name: newMovie.director
            },
        }
    } else {
        const movie = movies.find(movie => movie.id === Number(id))
        const updateMovie = {
            ...movie,
            title: newMovie.title,
            year: newMovie.year,
            genre: newMovie.genre,
            director: {
                ...movie.director,
                name: newMovie.director
            },
        }
        return updateMovie;
    }

}

const requestMovie = (id) => ({
    payload: id,
    type: REQUEST_MOVIE,
});

const receiveMovie = (movie) => ({
    payload: movie,
    type: RECEIVE_MOVIE,
});

const errorReceiveMovie = (error) => ({
    payload: error,
    type: ERROR_RECEIVE_MOVIE,
});

const getMovieById = (id) => {
    const {
        USERS_SERVICE,
    } = config;
    return axios.get(`${USERS_SERVICE}/movies/${id}`);
};

const fetchMovie = (id) => (dispatch) => {
    dispatch(requestMovie(id))
    return getMovieById(id)
        .catch((err) => {
            console.log("Err: ", err)
            if (err.code === "ERR_NETWORK") {
                const movie = MOCK_GET_MOVIE_RESPONSE(id);
                console.log("Mocked movie :", movie)
                return movie;
            }

            return Promise.reject(err);
        })
        .then((movie) => dispatch(receiveMovie(movie)))
        .catch((error) => dispatch(errorReceiveMovie(error)));
}

const requestUpdateMovie = () => ({
    type: REQUEST_UPDATE_MOVIE,
})

const successUpdateMovie = (newMovie) => ({
    payload: newMovie,
    type: SUCCESS_UPDATE_MOVIE,
})

const errorUpdateMovie = (err) => ({
    payload: err,
    type: ERROR_UPDATE_MOVIE,
})

const updateMovie = (id) => {
    const {
        USERS_SERVICE,
    } = config;
    return axios.put(`${USERS_SERVICE}/movies/${id}`);
}

const fetchUpdateMovie = (id, newMovie) => (dispatch) => {
    dispatch(requestUpdateMovie())
    return updateMovie(id, newMovie)
        .catch((err) => {
            console.log("Err: ", err)
            if (err.code === "ERR_NETWORK") {
                const updatedMovie = MOCK_UPDATE_OR_CREATE_MOVIE_RESPONSE(id, newMovie);
                console.log("Updated movie :", updatedMovie)
                return updatedMovie;
            }

            return Promise.reject(err);
        })
        .then((updatedMovie) => dispatch(successUpdateMovie(updatedMovie)))
        .catch((error) => dispatch(errorUpdateMovie(error)));
}

const exportFunctions = {
    fetchMovie,
    fetchUpdateMovie,
};

export default exportFunctions;