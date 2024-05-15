import {
    REQUEST_MOVIE,
    RECEIVE_MOVIE,
    ERROR_RECEIVE_MOVIE,
    REQUEST_UPDATE_MOVIE,
    SUCCESS_UPDATE_MOVIE,
    ERROR_UPDATE_MOVIE,
} from '../../constants/actionTypes';

const initialState = {
    id: "",
    title: "",
    year: "",
    genre: [],
    director: {
        id: "",
        name: ""
    },
    error: ""
};

// const convertErrors = (errors) => {
//     if (errors) {
//         console.log("Errors ", errors)
//         errors.map(error => ({
//             code: error.code,
//             description: error.description,
//         }))
//     }

// };

export default function Reducer(state = initialState, action) {
    switch (action.type) {

        case REQUEST_MOVIE: {
            return {
                ...state,
            };
        }

        case RECEIVE_MOVIE: {
            const movie = action.payload;
            console.log("Movie in reducer :", movie)

            return {
                ...state,
                id: movie.id,
                title: movie.title,
                year: movie.year,
                genre: movie.genre.join(", "),
                director: {
                    id: movie.director.id,
                    name: movie.director.name
                }
            };
        }

        case ERROR_RECEIVE_MOVIE: {
            return {
                ...state,
                error: action.payload,
            }
        }

        case REQUEST_UPDATE_MOVIE: {
            return {
                ...state,
            }
        }

        case SUCCESS_UPDATE_MOVIE: {
            const newMovie = action.payload;
            return {
                ...newMovie
            }
        }

        case ERROR_UPDATE_MOVIE: {
            return {
                ...state,
                error: action.payload
            }
        }

        default: {
            return state;
        }
    }
}
