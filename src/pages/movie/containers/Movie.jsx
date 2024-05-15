import Card from 'components/Card';
import CardContent from 'components/CardContent';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import actionsMovie from '../redux/actions/movie'
import { useIntl } from 'react-intl';
import TextField from 'components/TextField';
import Button from 'components/Button';
import Typography from 'components/Typography';
import Loading from 'components/Loading';
import IconButton from 'components/IconButton';
import Edit from 'components/Edit';
import { useTheme } from '@emotion/react';
import Snackbar from 'components/Snackbar';

const getClasses = createUseStyles((theme) => ({
  editBtn: {
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 100
  }
}));

const Movie = () => {

  const { formatMessage } = useIntl();
  const mov = useSelector(({ movie }) => movie)
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const classes = getClasses({ theme });

  const initialEditState = {
    title: "",
    year: "",
    genre: [],
    director: ""
  }

  const initialInvalidState = {
    title: false,
    year: false,
    genre: false,
    director: false,
  }

  const [movie, setMovie] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editedMovie, setEditedMovie] = useState(initialEditState)
  const [componentDidMount, setComponentDidMount] = useState(false)
  const [successfullyEdited, setSuccessfullyEdited] = useState(false)
  const [invalidFields, setInvalidFields] = useState(initialInvalidState)
  const [isError, setIsError] = useState(false)

  const fillInEditedMovie = () => {
    setEditedMovie({
      title: movie.title,
      year: movie.year,
      genre: movie.genre,
      director: movie.director.name
    })
  }

  useEffect(() => {
    if (movieId !== "new") {
      dispatch(actionsMovie.fetchMovie(movieId))
        .then(res => setMovie(res.payload))

    } else {
      setEditMode(true)
      setComponentDidMount(true)
    }

  }, [])

  useEffect(() => {
    if (movie) {
      fillInEditedMovie()
      setComponentDidMount(true)
    }
  }, [movie])

  const handleSaveChanges = async (id, newMovie) => {
    if (validateFields(newMovie)) {
      await dispatch(actionsMovie.fetchUpdateMovie(id, newMovie))
        .then(res => {
          setMovie(res.payload)
          setSuccessfullyEdited(true)
          setEditMode(false)
        })
    } else {
      setIsError(true)
    }
  }

  const handleCancel = () => {
    if (movieId === "new") {
      navigate("/movies")
    } else {
      setEditMode(false)
      setEditedMovie(initialEditState)
    }

  }

  const validateFields = (movie) => {
    setInvalidFields(initialInvalidState)
    if (!movie || !movie.title || movie.title.trim().length < 1 || movie.title.trim().length > 20) {
      setInvalidFields(prev => ({ ...prev, title: true }))
    }
    if (!movie.year || (parseInt(movie.year) === NaN) || movie.year < 1900 || movie.year > new Date().getFullYear) {
      setInvalidFields(prev => ({ ...prev, year: true }))
    }
    if (!movie.genre || !Array.isArray(movie.genre) || movie.genre.length < 1) {
      setInvalidFields(prev => ({ ...prev, genre: true }))
    }
    if (!movie.director || !movie.director.trim() || movie.director.trim() < 2 || movie.director.trim().length > 50) {
      setInvalidFields(prev => ({ ...prev, director: true }))
    }
    if (invalidFields !== initialEditState) {
      console.log(invalidFields)
      return false;
    }
    return true;
  }

  return (
    <div>
      {!componentDidMount && (
        <Loading />
      )}
      {componentDidMount && (
        <>
          {!editMode && (
            <Card>
              <div className={classes.editBtn}>
                <IconButton onClick={() => {
                  fillInEditedMovie();
                  setEditMode(true);
                }}>
                  <Edit />
                </IconButton>
              </div>

              {movie && (
                <CardContent>
                  <h3>{formatMessage({ id: "title" })}: {movie.title}</h3>
                  <h4>{formatMessage({ id: "year" })}: {movie.year}</h4>
                  <p>{formatMessage({ id: "genre" })}: {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}</p>
                  <p>{formatMessage({ id: "director" })}: {movie.director.name} (ID: {movie.director.id})</p>
                </CardContent>
              )}

            </Card>
          )}
          {editMode && editedMovie !== initialEditState && (
            <Card>
              <CardContent>
                <TextField
                  isError={invalidFields.title}
                  label={formatMessage({ id: 'title' })}
                  onChange={({ target }) => setEditedMovie({
                    ...editedMovie,
                    title: target.value,
                  })}
                  value={editedMovie.title}
                />
                <TextField
                  isError={invalidFields.year}
                  label={formatMessage({ id: 'year' })}
                  onChange={({ target }) => setEditedMovie({
                    ...editedMovie,
                    year: target.value,
                  })}
                  value={editedMovie.year}
                />
                <TextField
                  isError={invalidFields.genre}
                  label={formatMessage({ id: 'genre' })}
                  onChange={({ target }) => setEditedMovie({
                    ...editedMovie,
                    genre: target.value.split(","),
                  })}
                  value={Array.isArray(editedMovie.genre) ? editedMovie.genre.join(", ") : ""}
                />
                <TextField
                  isError={invalidFields.director}
                  label={formatMessage({ id: 'director' })}
                  onChange={({ target }) => setEditedMovie({
                    ...editedMovie,
                    director: target.value,
                  })}
                  value={editedMovie.director}
                />
                <div >

                  <Button
                    variant="secondary"
                    colorVariant="secondary"
                    onClick={handleCancel}
                  >
                    <Typography color="inherit">
                      {formatMessage({ id: "cancelBtn" })}
                    </Typography>
                  </Button>
                  <Button
                    colorVariant="primary"
                    variant="secondary"
                    onClick={() => handleSaveChanges(movieId, editedMovie)}
                  >
                    <Typography>
                      <strong>
                        {formatMessage({ id: movieId === "new" ? "createBtn" : "saveBtn" })}
                      </strong>
                    </Typography>
                  </Button>
                </div>
              </CardContent>
              <Snackbar
                open={successfullyEdited}
                onClose={(event, reason) => {
                  if (reason === "clickaway") {
                    return;
                  }
                  setSuccessfullyEdited(false);
                }}
                message={formatMessage({ id: "movieEdited" })}
              />
              <Snackbar
                open={isError}
                onClose={(event, reason) => {
                  if (reason === "clickaway") {
                    return;
                  }
                  setIsError(false);
                }}
                message={formatMessage({ id: "invalid" })}
              />
            </Card>

          )}
          <Button onClick={() => navigate("/movies")}>
            {formatMessage({ id: "goBack" })}
          </Button>
        </>
      )}

    </div>

  )
}

export default Movie