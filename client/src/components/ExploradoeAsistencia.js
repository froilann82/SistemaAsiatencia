import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { getPersonas } from "../api/personaApi";
import Spinner from "react-bootstrap/Spinner";
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { alertConfirm } from "../utilis/alerts";

const ExploradoeAsistencia = () => {
  
  const [loading, setLoading] = useState(true); 
  const [personas, setPersonas] = useState([]); 
  const [error, setError] = useState(null); 
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
  
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        setLoading(true);
        const data = await getPersonas();
        console.log("Datos obtenidos:", data); 
        setPersonas(data);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError("Error al obtener los datos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchPersonas();
  }, []);

  
  return (
    <div className="vh-100 d-flex flex-column">
      
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
                <span className="fw-bold fs-5 text-dark">Inicio</span>
              </Link>
            </div>
            <div className="d-flex align-items-center custom-bg text-white rounded-3 px-3 py-2 me-3">
              <span className="fw-bold fs-5">Asistencia</span>
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

 
  <div className="d-flex justify-content-between align-items-center px-4 py-2">
  
  <div className="d-flex align-items-center">
    <img
      src="/user.png"
      alt="Perfil"
      className="rounded-circle me-3"
      width="40"
    />
    <h2 className="fw-bold mb-0">Relación de Asistencia Registradas</h2>
  </div>

  
  <div className="d-flex">
    <input
      type="text"
      placeholder="Buscar..."
      className="form-control me-2"
      style={{ maxWidth: "250px" }}
    />
    <button className="btn btn-outline-secondary">
      <img
        src="https://cdn-icons-png.flaticon.com/512/54/54481.png"
        alt="Buscar"
        width="20"
      />
    </button>
  </div>
</div>

        <div className="container mt-4">
          <div className="d-flex">
         
            <div className="flex-grow-1 border border-1 border-dark rounded p-3">
              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                </div>
              ) : error ? (
                <div className="text-danger text-center">{error}</div>
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>No Documento</th>
                      <th>Nombre</th>
                      <th>Fecha</th>
                      <th>Dia</th>
                      <th>Hora Ingreso</th>
                      <th>Trade</th>
                      <th>Hora Salida</th>
                      <th>Adelanto s/</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                   
                  </tbody>
                </table>
              )}
            </div>
          </div>
         
        </div>
     
    </div>
  );
};

export default ExploradoeAsistencia;
