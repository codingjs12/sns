import { Route, Routes, useLocation } from 'react-router-dom';
import Join from './components/Join'
import Login from './components/Login';
import Feed from './components/Feed';
import Register from './components/Register';

function App() {


  return (
    <Routes>
      <Route path='/join' element={<Join/>}/>
      <Route path='/' element={<Login/>}/>
      <Route path='/feed' element={<Feed/>}/>
      <Route path='/feed/add' element={<Register/>}/>
    </Routes>
  );
}

export default App;
