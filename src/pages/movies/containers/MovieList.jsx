import Typography from 'components/Typography';
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl';
import { createUseStyles } from 'react-jss';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import Button from 'components/Button';
import Dialog from 'components/Dialog';
import Paper from 'components/Paper';
import Table from 'components/Table';
import TableBody from 'components/TableBody';
import TableCell from 'components/TableCell';
import TableContainer from 'components/TableContainer';
import TableHead from 'components/TableHead';
import TablePagination from 'components/TablePagination';
import TableRow from 'components/TableRow';
import useTheme from 'misc/hooks/useTheme';
import IconButton from 'components/IconButton';
import Delete from 'components/Delete';
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import actionsMovies from '../redux/actions/movies'
import Snackbar from 'components/Snackbar';
import TextField from 'components/TextField';
import storage from '../../../misc/storage'

const getClasses = createUseStyles((theme) => ({
  root: {
    height: 'fit-content',
  },

  tableRow: {
    position: "relative",
    '&:hover $deleteButton': {
      opacity: 1,
    },
  },

  deleteButton: {
    position: 'absolute',
    marginLeft: theme.spacing(2),
    width: 'inherit',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    right: 10,
    top: 10,
  },

  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    margin: 4,
  }
}));

const columns = [
  { id: 'title', label: 'Title', width: '25%', fontWeight: 700, },
  { id: 'year', label: 'Year', width: '5%' },
  { id: 'genre', label: 'Genre', width: '35%' },
  { id: 'director', label: 'Director', width: '35%' },
];

const MovieList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { theme } = useTheme();
  const classes = getClasses({ theme });

  const initialFilterState = {
    title: "",
    year: 0,
    genre: [],
    director: ""
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [componentDidMount, setComponentDidMount] = useState(false);
  const [successfullyDeleted, setSuccessfullyDeleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState(initialFilterState)
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [rows, setRows] = useState([]);


  const {
    list,
  } = useSelector(({ movies }) => movies);

  const makeRows = (list) => {
    const updatedRows = list.map((movie) => ({
      id: movie.id,
      title: movie.title,
      year: movie.year,
      genre: movie.genre.join(", "),
      director: movie.director
    }))
    setRows(updatedRows);
  }

  const getAllMovies = () => {
    dispatch(actionsMovies.fetchMovies())
        .then(response => {
          const movies = response.payload.list;
          storage.setItem("movies", JSON.stringify(movies))
          makeRows(movies)
        })
  }

  useEffect(() => {
    setComponentDidMount(false)
    const movies = JSON.parse(storage.getItem("movies"))
    if (!list || list.length === 0) {
      movies ? dispatch(actionsMovies.fetchUpdateMovies(movies)) : getAllMovies()
    } else if (list !== movies) {
      storage.setItem("movies", JSON.stringify(list))
    }
  }, [])

  useEffect(() => {
    if (list || list.length > 0) {
      makeRows(list)
      setComponentDidMount(true)
    }
  }, [list])

  const handleDeleteMovie = (id) => {
    if (rows.some(movie => movie.id === id)) {
      dispatch(actionsMovies.requestDeleteMovie(id));
      dispatch(actionsMovies.successDeleteMovie());
      storage.setItem("movies", JSON.stringify(list));
      setOpenDeleteDialog(false);
      setSuccessfullyDeleted(true);
      setErrorMessage("");
    } else {
      const res = dispatch(actionsMovies.errorDeleteMovie(`Movie with ID ${id} not found`))
      setErrorMessage(res.payload)
      setSuccessfullyDeleted(false)
    }
  }

  const handleOnMovieClick = (id) => {
    console.log(`Navigating to page :${id}`)
    navigate(`./${id}`)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onCloseFilterDialog = () => {
    setOpenFilterDialog(false);
    setFilter(initialFilterState);
  }

  const handleApplyFilter = () => {
    console.log("Applying filter");
    dispatch(actionsMovies.fetchFilterMovies(filter))
      .then(response => {
        storage.setItem("movies", JSON.stringify(response.payload))
        makeRows(response.payload)
      })
    setOpenFilterDialog(false);
    setFilter(initialFilterState);
  }

  let dialogContextText;
  if (errorMessage.length > 0) {
    console.log("Error message: ", errorMessage)
    dialogContextText = formatMessage({ id: "movieNotFound" })
  } else {
    dialogContextText = `${formatMessage({ id: "confirmDelete" })} ${selectedMovie?.title} ?`
  }


  return (
    <>
      <div className={classes.toolbar}>
        <Button colorVariant='primary' onClick={() => navigate(`./new`)}>{formatMessage({id: "addBtn"})}</Button>
        <Button colorVariant='primary' onClick={() => setOpenFilterDialog(true)}>{formatMessage({id: "filterBtn"})}</Button>
        <Button colorVariant='header' onClick={getAllMovies}>{formatMessage({id: "resetBtn"})}</Button>
        <Dialog open={openFilterDialog} onClose={onCloseFilterDialog}>
          <DialogTitle>{formatMessage({id: "filterMovies"})}</DialogTitle>
          <DialogContent>
            <TextField
              label={formatMessage({ id: "title" })}
              value={filter.title}
              onChange={(e) => setFilter({
                ...filter,
                title: e.target.value
              })}
              fullWidth
              margin="normal"
            />
            <TextField
              label={formatMessage({ id: "year" })}
              value={filter.year}
              onChange={(e) => setFilter({
                ...filter,
                year: Number(e.target.value)
              })}
              fullWidth
              margin="normal"
            />
            <TextField
              label={formatMessage({ id: "genre" })}
              value={filter.genre}
              onChange={(e) => setFilter({
                ...filter,
                genre: e.target.value.split(", ")
              })}
              fullWidth
              margin="normal"
            />
            <TextField
              label={formatMessage({ id: "director" })}
              value={filter.director}
              onChange={(e) => setFilter({
                ...filter,
                director: e.target.value
              })}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onCloseFilterDialog}>{formatMessage({id: "cancelBtn"})}</Button>
            <Button onClick={handleApplyFilter} color="primary">{formatMessage({id: "applyBtn"})}</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Paper className={classes.root} width='100%' overflow='hidden'>

        {componentDidMount && (
          <>
            <TableContainer maxHeight={640} >
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow key={columns.entries + columns.length}>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ width: column.width, backgroundColor: "rgb(200 200 200)" }}
                      >
                        <Typography
                          color='primary'
                          variant='subtitle'>
                          <strong>
                            {formatMessage({ id: column.id })}
                          </strong>
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow onClick={() => handleOnMovieClick(row.id)} style={{ position: "relative" }} hover={true} role="checkbox" tabIndex={-1} key={row.id + row.title} classes={classes.tableRow} >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <Typography color='rgb(75 75 75)' variant={column.id === 'title' ? 'subtitle' : 'default'}>
                                  {column.format && typeof value === 'number'
                                    ? column.format(value)
                                    : value}
                                </Typography>
                                {column.id === "director" && (
                                  <IconButton
                                    position='absolute'
                                    classes={classes.deleteButton}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedMovie(row);
                                      console.log("Row: ", row)
                                      setOpenDeleteDialog(true);
                                    }}
                                  >
                                    <Delete />
                                  </IconButton>
                                )}
                              </TableCell>
                            );
                          })}

                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={formatMessage({ id: "rowsPerPage" })}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} ${formatMessage({ id: "displayedRows" })} ${count !== -1 ? count : `${formatMessage({ id: "moreThan" })} ${to}`}`}
            />
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
              <DialogTitle>{formatMessage({ id: "confirmation" })}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  {dialogContextText}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => {
                  setOpenDeleteDialog(false)
                  setErrorMessage("")
                }}
                  color="primary">
                  {formatMessage({id: "cancelBtn"})}
                </Button>
                <Button onClick={() => handleDeleteMovie(selectedMovie?.id)} color="primary" autoFocus>
                  {formatMessage({id: "deleteBtn"})}
                </Button>
              </DialogActions>
            </Dialog>
            <Snackbar
              open={successfullyDeleted}
              onClose={(event, reason) => {
                if (reason === "clickaway") {
                  return;
                }
                setSuccessfullyDeleted(false);
              }}
              message={formatMessage({ id: "movieDeleted" })}
            />
          </>
        )}
      </Paper>
    </>
  )
}

export default MovieList