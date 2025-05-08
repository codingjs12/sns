import { Route, Routes, useLocation } from 'react-router-dom';
import Join from './components/Join'
function App() {


  return (
    <Routes>
      <Route path='/join' element={<Join/>}>
      
      </Route>
    </Routes>
  );
}

export default App;
