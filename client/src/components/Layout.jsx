import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ACTypes from '../store/types';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  textAlign: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

const initState = {
  login: '',
  password: '',
}

function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);


  const [values, setValues] = useState(initState);
  const [response, setResponse] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setResponse(false);
    setValues(initState);
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}auth/name`, { withCredentials: true })
      .then((res) => {
        dispatch({ type: ACTypes.SET_USER, payload: res.data });
      });
  }, []);

  const logoutHandler = (e) => {
    e.preventDefault();
    axios.get(`${process.env.REACT_APP_API_URL}auth/signout`, { withCredentials: true });
    dispatch({ type: ACTypes.LOGOUT });
    navigate('/');
  }

  const inputHandler = (e) => {
    setValues((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    });
  }

  const submitHandler = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}auth/login`, values, { withCredentials: true })
      .then((res) => {
        if (res.data === 'Неверное имя или пароль!') {
          setResponse(true);
          setValues(initState);
        } else {
          setResponse(false);
          setOpen(false);
          setValues(initState);
          dispatch({ type: ACTypes.LOGIN, payload: res.data });
          navigate('/private')
        }
      });
  }

  return (
    <>
      {!user.login &&
        <>
          <nav class="navbar navbar-dark bg-dark">
            <div className="container-fluid">
              <ul className="nav justify-content-end">
                <li className="nav-item">
                  <button type="button" className="btn btn-dark btn-lg opacity-75" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={handleOpen}>
                    Войти
                  </button>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        Вход
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <div className={response ? "alert alert-danger" : "none"} role="alert">
                          Неверное имя или пароль!
                        </div>
                        <form onSubmit={submitHandler}>
                          <div className="mb-3">
                            <TextField error={response ? true : false} id="outlined-basic" label="Логин" variant="outlined" type="text" name="login" value={values.login} required onChange={inputHandler} />
                          </div>
                          <div className="mb-3">
                            <TextField error={response ? true : false} id="outlined-basic" label="Пароль" type="password" variant="outlined" name="password" value={values.password} required onChange={inputHandler} />
                          </div>
                          <button type="submit" className="btn btn-outline-dark">Войти</button>
                        </form>
                      </Typography>
                    </Box>
                  </Modal>
                </li>
              </ul>
            </div>
          </nav>
        </>}
      {user.login &&
        <>
          <nav class="navbar navbar-dark bg-dark">
            <div className="container-fluid">
              <ul className="nav justify-content-end">
                <li className="nav-item" id="auth-nav">
                  <p>Привет, {user.login}!</p>
                </li>
                <li className="nav-item">
                  <button className="btn btn-dark btn-lg" onClick={logoutHandler}>Выйти</button>
                </li>
              </ul>
            </div>
          </nav>
        </>
      }
      <Outlet />
    </>
  );
}

export default Layout;
