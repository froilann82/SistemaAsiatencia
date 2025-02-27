import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { 
  faIdCard, 
  faAddressCard, 
  faUser, 
  faHome, 
  faEnvelope, 
  faPhone, 
  faBirthdayCake, 
  faMale,
  faFemale,
  faUserTie,
  faMapMarkerAlt,
  faCheckCircle, 
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { getRoles, getNextIdPersona, getDistrictos, createPersona , handleImageChange} from '../api/authApi';
import defaultProfileImage from '../imagenes/profile.png';
import { uploadImage } from '../api/imageApi';

function Register() {
  
  const [roles, setRoles] = useState([]);
  const [districtos, setDistrictos] = useState([]);
  const [idPersonal, setIdPersonal] = useState('');
  const [dni, setDni] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState(''); 
  const [idRol, setIdRol] = useState('');
  const [idDistrito, setIdDistrito] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [domicilio , setDomicilio] = useState('');
  const [sexo , setSexo] = useState('');
  const [image, setImage] = useState(null);
  const [foto, setFoto] = useState(null);
   const [rutaImagen, setRutaImagen] = useState('');
   const [alert, setAlert] = useState({ message: '', type: '' });

  const [file, setFile] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [photoPath, setPhotoPath] = useState('');
  const [refresh, setRefresh] = useState(false); 
  const navigate = useNavigate();
  

  
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await getRoles();  
        setRoles(rolesData);  
      } catch (error) {
        console.error('Error al cargar los roles', error);
      }
    };

    fetchRoles();  
  }, [refresh]);

 
  useEffect(() => {
    const fetchDistrictos = async () => {
      try {
        const distritosData = await getDistrictos();  
        console.log(distritosData);  
        setDistrictos(distritosData); 
      } catch (error) {
        console.error('Error al cargar los distritos', error);
      }
    };
  
    fetchDistrictos();  
  }, []);
  

  useEffect(() => {
    const fetchNextId = async () => {
      try {
        const response = await getNextIdPersona();  
        console.log('Respuesta de getNextIdPersona:', response);
        
        if (response && response.nextIdPersona) {
          setIdPersonal(response.nextIdPersona);  
        } else {
          console.warn('La respuesta no contiene nextIdPersona');
        }
      } catch (error) {
        console.error('Error al obtener el siguiente ID', error);
      }
    };

    fetchNextId();  
  }, []);
 
  const limpiarFormulario = () => {
     setDni('');
    setNombreCompleto('');
   
   

  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const idPersonalSinCeros = Number(idPersonal).toString();
    
    const personaData = {
      Id_Personal: idPersonalSinCeros, 
      DNICC: dni,
      Nombre_Completo: nombreCompleto,
      Id_Rol: idRol,
      Correo: correo,
      Celular: celular,
      Domicilio: domicilio,
      Id_Distrito: idDistrito,
      Sexo: sexo,
      Fecha_Nacimiento: fechaNacimiento,
      Foto: rutaImagen,
      FingerPrint: '-',
      Estado_Personal: 'ACTIVO'
    };
  
    try {
      
      const response = await createPersona(personaData);
      
      
      
        setAlert({ message: '¡Persona creada con éxito!', type: 'success' });
  
        
        setTimeout(() => {
          setAlert({ message: '', type: '' });
        }, 3000);
         
        if (response) {
        
         navigate('/PaginaPersonal')
       
        }
       
  
    } catch (error) {
      
      setAlert({ message: '¡Error al Guardar!', type: 'danger' });
  
      
      setTimeout(() => {
        setAlert({ message: '', type: '' });
      }, 3000);

      
    }

    
  };
  
  
  const handleCancel = () => {
    navigate('/PaginaPersonal');  
  };

    
    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const fileType = file.type.split('/')[0];
        if (fileType !== 'image') {
          alert('Por favor, selecciona un archivo de imagen.');
          return;
        }
    
      
        setSelectedImage(file);
    
        
        setPreview(URL.createObjectURL(file));
    
       
        const imageName = file.name;
        const temporaryPath = `/uploads/temp/${imageName}`;
        setRutaImagen(temporaryPath); 
      }
    };
    
    
    

    const handleUpload = async () => {
      if (!selectedImage) {
        setMessage('Por favor, selecciona una imagen primero.');
        return;
      }
    
      try {
        
        const imagePath = await uploadImage(selectedImage);
        
        
        setRutaImagen(imagePath); 
    
      
      } catch (error) {
       
      }
    };
    
  
  
  
  return (
    
    <Container className="p-4" style={{ maxWidth: '800px', marginTop: '10px', border: '1px solid #FFA500', borderRadius: '8px' }}>
      <div id="alert-container"></div>
    
    
      <h4 className="text-center mb-4">REGISTRO DE PERSONAL</h4>

      
      <Row>
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
         <Form.Group as={Row} className="mb-3" controlId="idPersonal">
  <Form.Label column sm={2} className="text-start">
    <OverlayTrigger 
      placement="top" 
      overlay={<Tooltip id="tooltip-id">Ingrese el ID del personal</Tooltip>}
    >
      <FontAwesomeIcon icon={faIdCard} className="me-1" />
    </OverlayTrigger>
  </Form.Label>
  <Col sm={10}>
    <Form.Control 
      type="text" 
      value={idPersonal || 0} 
      readOnly  
      className="form-control-sm border-orange" 
      onChange={(e) => setIdPersonal(e.target.value)}
    />
  </Col>
</Form.Group>

<Form.Group as={Row} className="mb-3" controlId="dni">
  <Form.Label column sm={2} className="text-start">
    <OverlayTrigger 
      placement="top" 
      overlay={<Tooltip id="tooltip-dni">Ingrese el DNI del personal</Tooltip>}
    >
      <FontAwesomeIcon icon={faAddressCard} className="me-1" />
    </OverlayTrigger>
  </Form.Label>
  <Col sm={10}>
 
    <Form.Control
      type="text"
      placeholder="Ingrese el DNI" 
      
      value={dni}
      onChange={(e) => setDni(e.target.value)}
    />
       
       <p id="error-dni" class="text-danger"></p>


  </Col>
</Form.Group>


<Form.Group as={Row} className="mb-3" controlId="nombreCompleto">
  <Form.Label column sm={2} className="text-start">
    <OverlayTrigger 
      placement="top" 
      overlay={<Tooltip id="tooltip-nombre">Ingrese el nombre completo</Tooltip>}
    >
      <FontAwesomeIcon icon={faUser} className="me-1" />
    </OverlayTrigger>
  </Form.Label>
  <Col sm={10}>
    <Form.Control 
      type="text" 
      placeholder="Ingrese el nombre completo" 
      className="form-control-sm border-orange" 
      value={nombreCompleto}
      onChange={(e) => setNombreCompleto(e.target.value)} 
    />
    <p id="error-nombre" className="text-danger mt-2"></p> {/* Alineación de error */}
  </Col>
</Form.Group>


            <Form.Group as={Row} className="mb-3" controlId="direccion">
              <Form.Label column sm={2} className="text-start">
                <OverlayTrigger 
                  placement="top" 
                  overlay={<Tooltip id="tooltip-direccion">Ingrese la dirección</Tooltip>}
                >
                  <FontAwesomeIcon icon={faHome} className="me-1" />
                </OverlayTrigger>
              </Form.Label>
              <Col sm={10}>
                <Form.Control type="text" placeholder="Ingrese la dirección" className="form-control-sm border-orange" onChange={(e) => setDomicilio(e.target.value)}/>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="correo">
              <Form.Label column sm={2} className="text-start">
                <OverlayTrigger 
                  placement="top" 
                  overlay={<Tooltip id="tooltip-correo">Ingrese el correo electrónico</Tooltip>}
                >
                  <FontAwesomeIcon icon={faEnvelope} className="me-1" />
                </OverlayTrigger>
              </Form.Label>
              <Col sm={10}>
                <Form.Control type="email" placeholder="Ingrese el correo" className="form-control-sm border-orange" onChange={(e) => setCorreo(e.target.value)} />
                <p id="error-email" className="text-danger mt-2"></p>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="celular">
              <Form.Label column sm={2} className="text-start">
                <OverlayTrigger 
                  placement="top" 
                  overlay={<Tooltip id="tooltip-celular">Ingrese el número de celular</Tooltip>}
                >
                  <FontAwesomeIcon icon={faPhone} className="me-1" />
                </OverlayTrigger>
              </Form.Label>
              <Col sm={5}>
                <Form.Control type="text" placeholder="Ingrese el número de celular" className="form-control-sm border-orange"
                onChange={(e) => setCelular(e.target.value)} />
              </Col>
              <Form.Label column sm={1} className="text-start" style={{ paddingRight: '0', paddingLeft: '0.5rem' }}>
                <OverlayTrigger 
                  placement="top" 
                  overlay={<Tooltip id="tooltip-fecha">Seleccione fecha nacimiento</Tooltip>}
                >
                  <FontAwesomeIcon icon={faBirthdayCake} />
                </OverlayTrigger>
              </Form.Label>
              <Col sm={4}>
                <Form.Control type="date" className="form-control-sm" onChange={(e) => setFechaNacimiento(e.target.value)} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="selectSexo">
              <Form.Label column sm={2} className="text-start">
                <OverlayTrigger 
                  placement="top" 
                  overlay={<Tooltip id="tooltip-sexo">Seleccione el sexo</Tooltip>}
                >
                  <span>
                    <FontAwesomeIcon icon={faMale} className="me-1" />
                    <FontAwesomeIcon icon={faFemale} className="me-1" />
                  </span>
                </OverlayTrigger>
              </Form.Label>
              <Col sm={5}>
                <Form.Select className="form-select form-select-sm" value={sexo} onChange={(e) => setSexo(e.target.value)}>
                  <option>Seleccionar sexo...</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="selectRol">
              <Form.Label column sm={2} className="text-start">
                <OverlayTrigger 
                  placement="top" 
                  overlay={<Tooltip id="tooltip-rol">Seleccione el rol</Tooltip>}
                >
                  <FontAwesomeIcon icon={faUserTie} className="me-1" />
                </OverlayTrigger>
              </Form.Label>
              <Col sm={5}>
                <Form.Select className="form-select form-select-sm" value={idRol} onChange={(e) => setIdRol(e.target.value)}>
                  <option>Seleccionar rol...</option>
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <option key={role.Id_Rol} value={role.Id_Rol}>
                        {role.NomRol}  
                      </option>
                    ))
                  ) : (
                    <option>No hay roles disponibles</option>
                  )}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="selectUbicacion">
              <Form.Label column sm={2} className="text-start">
                <OverlayTrigger 
                  placement="top" 
                  overlay={<Tooltip id="tooltip-ubicacion">Seleccione la cuidad</Tooltip>}
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
                </OverlayTrigger>
              </Form.Label>
              <Col sm={5}>
              <Form.Select className="form-select form-select-sm"  value={idDistrito}
        onChange={(e) => setIdDistrito(e.target.value)} >
  <option>Seleccionar cuidad...</option>
  {districtos.length > 0 ? (
    districtos.map((distrito) => (
      <option key={distrito.Id_Distrito} value={distrito.Id_Distrito}>
        {distrito. Distrito}
      </option>
    ))
  ) : (
    <option>No hay distritos disponibles</option>
  )}
</Form.Select>


              </Col>
            </Form.Group>

            <div className="d-flex justify-content-center mt-4">
              <Button 
                variant="secondary" 
                className="me-2 rounded" 
               
                onMouseOver={(e) => e.currentTarget.classList.add('btn-danger')} 
                onMouseOut={(e) => e.currentTarget.classList.remove('btn-danger')}
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button 
  variant="primary" 
  className="rounded" 
  onMouseOver={(e) => e.currentTarget.classList.add('btn-warning')} 
  onMouseOut={(e) => e.currentTarget.classList.remove('btn-warning')} 
  onClick={async (e) => {
   
    await handleSubmit(e);
    await handleUpload(e);
   
   
  }}
>
  Registrar
</Button>

            </div>
          </Form>
        </Col>

        <Col md={4} className="d-flex justify-content-center">
  <div className="image-container">
   
    <img
      src={preview || defaultProfileImage} 
      alt="Foto de perfil"
      className="img-fluid"
      style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
    />
    <div className="mt-2">
     
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange} 
        style={{ display: 'none' }} 
        id="fileInput"
      />
    
      <Button
        variant="outline-secondary"
        onClick={() => document.getElementById('fileInput').click()}
      >
        Subir Foto
      </Button>
    </div>
  
  
  </div>
</Col>

      </Row>
    </Container>
  );
}

export default Register;
