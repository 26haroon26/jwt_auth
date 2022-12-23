import './App.css';
import SignIn from './components/signin'
import WithMaterialUI from './components/login'
import Dashboard from './components/dashboard'
import { BrowserRouter as Router,
  Routes,
 Route,
 Link} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <div className='ForLinks'>
      <Link to='/'>Sign In</Link>
      <Link to='/login'>Login</Link>
      <Link to='/dashboard'>Dashboard</Link>
        </div>
     <Routes>
      <Route index element={<SignIn/>}/>
      <Route exact path='/login' element={<WithMaterialUI/>}/>
      <Route exact path='/dashboard' element={<Dashboard/>}/>
     </Routes>
     {/* formik yup */}
     
      </Router>
    </div>
  );
}

export default App;