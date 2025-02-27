import React from 'react'
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { alertConfirm } from "../utilis/alerts";
function FormConfig() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();  

  const handleLogout = async () => {
     
      const confirmed = await alertConfirm('¿Deseas realmente cerrar sesión en el sistema?');
      
      if (!confirmed) {
          
          return;
      }

      if (!user) {
          console.log('No hay usuario autenticado');
          navigate('/');  
          return;
      }

      try {
        
          await logout();
          console.log('Sesión cerrada exitosamente');
          navigate('/', { replace: true }); 
      } catch (error) {
          console.error('Error al cerrar sesión', error);
      }
  };
  return (
    <>
       <header className="d-flex justify-content-between align-items-center bg-light px-4 py-3 border-bottom shadow-lg border border-warning">
        <div className="left-section d-flex flex-column align-items-start">
          <h1>MicroFDV © 2025</h1>
          
          <div className="d-flex align-items-center mt-2">
           
            <div className="d-flex align-items-center bg-white text-dark rounded-3 px-3 py-2 me-3">
  <Link to="/PaginaInicio" className="text-decoration-none d-flex align-items-center">
    <img
      src="https://cdn-icons-png.flaticon.com/512/1946/1946488.png"
      alt="Inicio"
      className="me-2"
      width="30"
    />
    <span  className="fw-bold fs-5 text-dark">Inicio</span>
  </Link>
</div>
        
  <div className="d-flex align-items-center custom-bg text-white rounded-3 px-3 py-2 me-3">
    <img
      src="/confi.png"
      alt="Personal"
      className="me-2 d-none"  
      width="30"
    />
    <span className="fw-bold fs-5">Configuracion</span>
  </div>


          </div>
        </div>

     
        <div className="right-section d-flex align-items-center">
          <span className="me-3">Admin</span>
          <img
            src="/user.png"
            alt="Perfil"
            className="rounded-circle"
            width="40"
          />

  
          <img
            src="/swich.jpg"
            alt="Power Off"
            className="ms-3 rounded-3"
            width="50"
            height="50"
            onClick={handleLogout}
          />
        </div>
      </header>
    </>
  )
}

export default FormConfig