import React from 'react';

function Task({ task }) {
  return (
    <>
      <tr>
        <th scope="row"><input class="form-check-input" type="checkbox" value="" id="flexCheckDisabled" disabled checked={task.isDone ? 'checked' : ''} /></th>
        <td>{task.name}</td>
        <td>{task.email}</td>
        <td>{task.text}</td>
      </tr>
    </>
  );
}

export default Task;
