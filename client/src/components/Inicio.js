import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';
import { alertConfirm } from "../utilis/alerts";
import { Link } from "react-router-dom";

const Inicio = () => {
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
        <div className="vh-100 d-flex flex-column">
            <header className="d-flex justify-content-between align-items-center bg-light px-4 py-3 border-bottom shadow-lg border border-warning">
                <div className="left-section d-flex flex-column align-items-start">
                    <h1>MicroFDV © 2025</h1> 
                    <div className="d-flex align-items-center mt-2">
                        <div className="d-flex align-items-center custom-bg text-dark rounded-3 px-3 py-2 me-3">
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

            <main className="flex-grow-1 d-flex flex-column align-items-center mt-4">
                <h2 className="fw-bold mt-10">Sistema Control de Asistencia</h2>

                <div className="row w-75 text-center mt-5">
                    <div className="col-md-3 mb-4">
                        <a href="/PaginaPersonal" className="text-decoration-none text-dark">
                            <img
                                src="/personal.png"
                                alt="Explorador de Personal"
                                className="img-fluid mb-2"
                                style={{ width: "90px" }}
                            />
                            <h5>Explorador de Personal</h5>
                        </a>
                    </div>

                    <div className="col-md-3 mb-4">
                        <a href="/PaginaAsistencia" className="text-decoration-none text-dark">
                            <img
                                src="/huella.png"
                                alt="Explorador de Asistencia"
                                className="img-fluid mb-2"
                                style={{ width: "90px" }}
                            />
                            <h5>Explorador de Asistencia</h5>
                        </a>
                    </div>

                    <div className="col-md-3 mb-4">
                        <a href="/formJustificacion" className="text-decoration-none text-dark">
                            <img
                                src="/justifi2.png"
                                alt="Justificaciones"
                                className="img-fluid mb-2"
                                style={{ width: "90px" }}
                            />
                            <h5>Justificaciones</h5>
                        </a>
                    </div>

                    <div className="col-md-3 mb-4">
                        <a href="/formConfig" className="text-decoration-none text-dark">
                            <img
                                src="/confi.png"
                                alt="Configuración"
                                className="img-fluid mb-2"
                                style={{ width: "90px" }}
                            />
                            <h5>Configuración</h5>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Inicio;
