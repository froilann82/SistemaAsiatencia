import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaginaPersonal from './components/PaginaPesonal';
import ExploradorPersonal from './components/ExploradorPersonal';
import Inicio from './components/Inicio';
import ProtectedRoute from "./ProtectedRoute";
import FormJustificacion from './components/FormJustificacion';
import FormConfig from './components/FormConfig';
import ExploradoeAsistencia from './components/ExploradoeAsistencia';
import RegistroPersona from './components/Register';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext'; 




function App() {
  return (
    // El TaskProvider envuelve a AuthProvider y BrowserRouter
   
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/PaginaInicio" element={<Inicio />} />
              <Route path="/PaginaPersonal" element={<PaginaPersonal />} />
              <Route path="/PaginaAsistencia" element={<ExploradoeAsistencia />} />
              <Route path="/registerpersona" element={<RegistroPersona />} />
              <Route path="/exploradorPresonal" element={<ExploradorPersonal />} />
              <Route path="/formJustificacion" element={<FormJustificacion />} />
              <Route path="/formConfig" element={<FormConfig />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    
  );
}

export default App;
