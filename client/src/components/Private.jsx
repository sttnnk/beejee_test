import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ACTypes from '../store/types';
import axios from 'axios';

import PrivateTask from './PrivateTask';

const Main = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((store) => store.user);
  const tasks = useSelector((store) => store.tasks.tasks);

  const [tasksPagination, setTaskPagination] = useState(tasks);
  if (tasksPagination !== tasks) {
    setTaskPagination(tasks);
  }
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

  if (!user.login) {
    navigate('/')
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}tasks/all`, { withCredentials: true })
      .then((res) => {
        dispatch({ type: ACTypes.SET_TASKS, payload: res.data });
        setTaskPagination(res.data);
      });
  }, [])

  return (
    <>
      <table class="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Имя</th>
            <th scope="col">Почта</th>
            <th scope="col">Таска</th>
          </tr>
        </thead>
        <tbody>
          {tasks && currentTasks.map((task) =>
            <PrivateTask key={task.id} task={task} />
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
