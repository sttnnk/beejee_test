import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index';
import Main from './components/Main';
import Layout from './components/Layout';
import Private from './components/Private';

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path='private' element={<Private />} />
        </Route>
      </Routes>
    </Provider>
  );
}

export default App;
