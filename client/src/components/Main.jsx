import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ACTypes from '../store/types';
import axios from 'axios';
import Task from './MainTask';

import Icon from '@mui/material/Icon';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import FilterListIcon from '@mui/icons-material/FilterList';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const initState = {
  name: '',
  email: '',
  text: '',
}

const Main = () => {
  const { user } = useSelector((store) => store.user);
  const tasks = useSelector((store) => store.tasks.tasks);

  const [values, setValues] = useState(initState);

  const [show, setShow] = useState(false);

  const [tasksPagination, setTaskPagination] = useState(tasks);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(3);

  const lastTaskIndex = currentPage * tasksPerPage;
  const firstTaskIndex = lastTaskIndex - tasksPerPage;
  const currentTasks = tasksPagination.slice(firstTaskIndex, lastTaskIndex);

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(tasksPagination.length / tasksPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = pageNumber => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => prev + 1);
  const prevPage = () => setCurrentPage(prev => prev - 1);

  const dispatch = useDispatch();
  const navigate = useNavigate()

  if (user.login) {
    navigate('/private')
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}tasks/all`, { withCredentials: true })
      .then((res) => {
        dispatch({ type: ACTypes.SET_TASKS, payload: res.data });
        setTaskPagination(res.data);
      });
  }, [])

  const inputHandler = (e) => {
    setValues((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    });
  }

  const submitHandler = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}tasks/add`, values, { withCredentials: true })
      .then((res) => {
        dispatch({ type: ACTypes.SET_TASKS, payload: res.data });
        setTaskPagination(res.data);
        setValues(initState);
      });
      setShow(true);
  }

  const [checkedFilter, setCheckedFilter] = useState(false);
  const [nameFilter, setNameFilter] = useState(false);
  const [emailFilter, setEmailFilter] = useState(false);

  const checkedSortingHandler = () => {
    setCheckedFilter(!checkedFilter);
    axios.post(`${process.env.REACT_APP_API_URL}filter/checked`, { state: checkedFilter }, { withCredentials: true })
      .then((res) => {
        dispatch({ type: ACTypes.SET_TASKS, payload: res.data });
        setTaskPagination(res.data);
      });
  }

  const nameSortingHandler = () => {
    setNameFilter(!nameFilter);
    axios.post(`${process.env.REACT_APP_API_URL}filter/name`, { state: nameFilter }, { withCredentials: true })
      .then((res) => {
        dispatch({ type: ACTypes.SET_TASKS, payload: res.data });
        setTaskPagination(res.data);
      });
  }

  const emailSortingHandler = () => {
    setEmailFilter(!emailFilter);
    axios.post(`${process.env.REACT_APP_API_URL}filter/email`, { state: emailFilter }, { withCredentials: true })
      .then((res) => {
        dispatch({ type: ACTypes.SET_TASKS, payload: res.data });
        setTaskPagination(res.data);
      });
  }

  return (
    <>
      <Stack sx={{ width: '100%', display: `${show ? 'visible' : 'none'}` }} spacing={2}>
        <Alert onClose={() => {setShow(false)}}>This is a success alert — check it out!</Alert>
      </Stack>
      <div id="add-icon">
        <button class='btn' type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
          <Icon>add_circle</Icon>
        </button>
        <div class="collapse" id="collapseExample">
          <form onSubmit={submitHandler}>
            <div className="add-from">
              <TextField id="outlined-basic" label="Имя" variant="outlined" type="text" name="name" value={values.name} required onChange={inputHandler} />
            </div>
            <div className="add-from">
              <TextField id="outlined-basic" label="Почта" variant="outlined" type="email" name="email" value={values.email} required inputProps={{ pattern: "^([a-z0-9_-]+.)*[a-z0-9_-]+@[a-z0-9_-]+(.[a-z0-9_-]+)*.[a-z]{2,6}$" }} onChange={inputHandler} />
            </div>
            <div className="add-from">
              <TextField id="outlined-multiline-flexible" label="Таска" multiline variant="outlined" type="text" name="text" value={values.text} required inputProps={{ pattern: "^[а-яА-ЯёЁa-zA-Z0-9]+$" }} onChange={inputHandler} />
            </div>
            <div className="add-from">
              <button class="btn btn-outline-dark" type="submit">Добавить</button>
            </div>
          </form>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th scope="col"> <LibraryAddCheckIcon />
              <Tooltip title={checkedFilter ? 'Сначала незавершенные' : 'Сначала завершенные'} placement="top">
                <FilterListIcon onClick={checkedSortingHandler} />
              </Tooltip>
            </th>
            <th scope="col">Имя
              <Tooltip title={nameFilter ? 'От А до Я' : 'От Я до А'} placement="top">
                <FilterListIcon onClick={nameSortingHandler} />
              </Tooltip>
            </th>
            <th scope="col">Почта
              <Tooltip title={emailFilter ? 'От А до Z' : 'От Z до А'} placement="top">
                <FilterListIcon onClick={emailSortingHandler} />
              </Tooltip>
            </th>
            <th scope="col">Таска </th>
          </tr>
        </thead>
        <tbody>
          {tasks && currentTasks.map((task) =>
            <Task key={task.id} task={task} />
          )}
        </tbody>
      </table>

      <nav className="nav-pagination" aria-label="Page navigation example">
        <ul class="pagination justify-content-end">
          <li class={currentPage === 1 ? "none" : "page-item"} onClick={prevPage}>
            <a class="page-link" href="#">Previous</a>
          </li>
          {
            pageNumbers.length > 1 ? pageNumbers.map((number) => (
              <li class="page-item" key={number} onClick={() => paginate(number)}><a class="page-link" href="#">{number}</a></li>

            )) : null
          }
          <li class={currentPage === pageNumbers.pop() ? "none" : "page-item"} onClick={nextPage}>
            <a class="page-link" href="#">Next</a>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Main;
