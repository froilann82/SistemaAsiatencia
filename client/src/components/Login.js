import { useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';  // Contexto de autenticación
import { useNavigate } from 'react-router-dom';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { singin, isAuthenticathed, errors: singinErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticathed) navigate('/PaginaInicio');  
  }, [isAuthenticathed, navigate]);

  const onSubmited = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    try {
      await singin(data);  
    } catch (error) {
      console.error("Error al iniciar sesión:", error);  
    }
  };

  const handleLogout = () => {
    console.log('Saliendo de la aplicación');
    window.location.href = 'https://www.google.com'; 
  };

  

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#f3f4f6' }}>
      
      

      <div className="card login-card d-flex flex-row shadow-lg" style={{ width: '800px', borderRadius: '12px', overflow: 'hidden' }}>
        <div className="login-form w-50 p-4" style={{ position: 'relative', backgroundColor: '#ffffff' }}>
          
          <div style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} onClick={handleLogout}>
            <i className="bi bi-power" style={{ fontSize: '1.5rem', color: '#f58220' }}></i>
          </div>

          <div className="text-center mb-4">
            <div className="brand-logo" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>
             AsisControl FDV
            </div>
            <p style={{ color: '#64748b' }}>Hecho <span style={{ color: '#10b981' }}>con Amor</span> Todo es Posible</p>
          </div>

          <Form onSubmit={onSubmited}>
          {singinErrors && singinErrors.length > 0 && (
          <div className='text-danger mb-3'>
            {singinErrors.map((error, i) => (
              <p key={i}>{error}</p> 
            ))}
          </div>
      )}
            <Form.Group className="mb-3" controlId="user">
              <Form.Label><i className="bi bi-person"></i> Usuario</Form.Label>
              <Form.Control
                type="text"
                {...register('email', { required: true })}
                placeholder="Nombre de Usuario"
                name="Nombre_Usuario"
                style={{ borderColor: '#cbd5e1', borderRadius: '6px' }}
              />
              {errors.user && <p className='text-red-500'>User is required</p>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label><i className="bi bi-lock"></i> Contraseña</Form.Label>
              <Form.Control
                type="password"
                {...register('password', { required: true })}
                placeholder="Contraseña"
                name="Passwords"
                style={{ borderColor: '#cbd5e1', borderRadius: '6px' }}
              />
               {errors.password && <p className='text-red-500'>Password is required</p>}

            </Form.Group>

            <Button type="submit" className="w-100" style={{ backgroundColor: '#f58220', border: 'none', fontWeight: 'bold', borderRadius: '6px' }}>
              Iniciar Sesión
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small style={{ color: '#94a3b8' }}>MicroFDV © 2025 | Revisión</small>
          </div>
        </div>

        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp" alt="Empleado" className="w-50" style={{ objectFit: 'cover' }} />
      </div>
    </Container>
  );
}

export default Login;
