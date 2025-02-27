import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getPersonas } from "../api/personaApi";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
const PaginaPrincipal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [personas, setPersonas] = useState([]);
  const [error, setError] = useState(null);


  const handleAddClick = () => {
    navigate("/registerpersona");
  };
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        setLoading(true);
        const data = await getPersonas();
        setPersonas(data);
      } catch (err) {
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
    <span className="fw-bold fs text-dark">Inicio</span>
  </Link>
</div>
           

           
           
  <div className="d-flex align-items-center custom-bg text-white rounded-3 px-3 py-2 me-3">
    <img
      src="/confi.png"
      alt="Personal"
      className="me-2 d-none" 
      width="30"
    />
    <span className="fw-bold fs-5">Personal</span>
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
          <h2 className="fw-bold">Listado de Personal Registrado</h2>
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

      
      <main className="flex-grow-1 d-flex flex-column align-items-center mt-4">
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
                      <th>Cédula</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Número Celular</th>
                      <th>Cargo</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personas.length > 0 ? (
                      personas.map((persona) => (
                        <tr key={persona.Id_Personal}>
                          <td>{persona.DNICC}</td>
                          <td>{persona.Nombre_Completo}</td>
                          <td>{persona.Correo}</td>
                          <td>{persona.Celular}</td>
                          <td>{persona.NomRol}</td>
                          <td>{persona.Estado_Personal}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No hay datos disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            
            <div className="ms-3 d-flex flex-column align-items-start">
              <button className="btn btn-outline-success btn-sm mb-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828817.png"
                  alt="Añadir"
                  width="20"
                  className="me-1"
                  onClick={handleAddClick}
                />
              
              </button>

              <button className="btn btn-outline-primary btn-sm mb-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1827/1827933.png"
                  alt="Editar"
                  width="20"
                  className="me-1"
                />
                
              </button>

              <button className="btn btn-outline-warning btn-sm">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1828/1828859.png"
                  alt="Recargar"
                  width="20"
                  className="me-1"
                />
                
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaginaPrincipal;
