import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import ACTypes from '../store/types';
import axios from 'axios';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

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

function PrivateTask({ task }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);

  const [values, setValues] = useState(task);
  const [status, setStatus] = useState(task.isDone);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const inputHandler = (e) => {
    setValues((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value }
    });
  }

  const submitHandler = async (e) => {
    await axios.get(`${process.env.REACT_APP_API_URL}auth/name`, { withCredentials: true })
      .then((res) => {
        dispatch({ type: ACTypes.SET_USER, payload: res.data });
      });
    if (!user.login) {
      navigate('/');
      return;
    }
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}tasks/edit`, values, { withCredentials: true })
      .then((res) => {
        dispatch({ type: ACTypes.SET_TASKS, payload: res.data });
      })
    setOpen(false);
  }

  const statusHandler = () => {
    axios.post(`${process.env.REACT_APP_API_URL}tasks/status`, { id: task.id }, { withCredentials: true });
    setStatus(!status);
  }

  const deleteHandler = () => {
    if (!user.login) {
      navigate('/');
      return;
    }
    axios.post(`${process.env.REACT_APP_API_URL}tasks/delete`, { id: task.id }, { withCredentials: true })
      .then((res) => {
        dispatch({ type: ACTypes.SET_TASKS, payload: res.data });
      })
  }

  return (
    <>
      <tr>
        <th scope="row"><input class="form-check-input" type="checkbox" id="flexCheckDisabled" checked={status ? 'checked' : ''} onChange={statusHandler} /></th>
        <td>{task.name}</td>
        <td>{task.email}</td>
        <td>{task.text} <italic style={{ color: 'grey', display: `${task.isChanged ? 'visible' : 'none'}` }}>(отредактировано)</italic> </td>
        <td>
          <EditIcon onClick={handleOpen} />
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Редактировать
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <form onSubmit={submitHandler}>
                  <div className="mb-3">
                    <TextField id="outlined-basic" label="Имя" variant="outlined" type="text" name="name" value={values.name} required onChange={inputHandler} />
                  </div>
                  <div className="mb-3">
                    <TextField id="outlined-basic" label="Почта" variant="outlined" type="email" name="email" value={values.email} required inputProps={{ pattern: "^([a-z0-9_-]+.)*[a-z0-9_-]+@[a-z0-9_-]+(.[a-z0-9_-]+)*.[a-z]{2,6}$" }} onChange={inputHandler} />
                  </div>
                  <div className="mb-3">
                    <TextField id="outlined-basic" label="Таска" variant="outlined" type="text" name="text" value={values.text} required onChange={inputHandler} />
                  </div>
                  <button type="submit" className="btn btn-outline-dark">Изменить</button>
                </form>
              </Typography>
            </Box>
          </Modal>
          <DeleteIcon onClick={deleteHandler} />
        </td>
      </tr>
    </>
  );
}

export default PrivateTask;
