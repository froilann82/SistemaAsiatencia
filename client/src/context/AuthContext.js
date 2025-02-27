import { createContext, useState, useContext, useEffect } from "react";
import { loginRequest, registerRequest, verifyTokenRequest } from "../api/userApi";
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticathed, setIsAuthenticathed] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const singup = async (user) => {
        try {
            const res = await registerRequest(user);
            console.log(res);
            setUser(res.data); // Guardamos la data del usuario
            setIsAuthenticathed(true); // El usuario está autenticado
        } catch (error) {
            // Manejamos el error de forma segura
            if (error.response && error.response.data) {
                setErrors([error.response.data.message || "Error desconocido"]);
            } else {
                setErrors(["Error desconocido. Verifique su conexión"]);
            }
            console.log(error);
        }
    };

    const singin = async (user) => {
        try {
            const res = await loginRequest(user);
            console.log(res);
            setIsAuthenticathed(true);
            setUser(res.data);
        } catch (error) {
            console.log("Error al iniciar sesión:", error);
          
            if (error.response && error.response.data) {
                if (Array.isArray(error.response.data)) {
                    setErrors(error.response.data);
                } else {
                    setErrors([error.response.data.message || "Error desconocido"]);
                }
            } else {
                setErrors(["Error desconocido. Verifique su conexión"]);
            }
        }
    };

    // Nueva función logout
    const logout = () => {
        Cookies.remove('token');  // Eliminamos el token de las cookies
        setUser(null);  // Limpiamos el estado de usuario
        setIsAuthenticathed(false);  // Actualizamos el estado de autenticación
    };

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]); // Limpiamos los errores después de 5 segundos
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get();
            if (!cookies.token) {
                setIsAuthenticathed(false);
                setLoading(false);
                return setUser(null);
            }
            try {
                const res = await verifyTokenRequest(cookies.token);
                if (!res.data) {
                    setIsAuthenticathed(false);
                    setLoading(false);
                    setUser(null); // Si no hay usuario, limpiamos el estado
                } else {
                    setIsAuthenticathed(true);
                    setUser(res.data); // Guardamos los datos del usuario
                }
                setLoading(false);
            } catch (error) {
                console.log("Error de verificación de token:", error);
                setIsAuthenticathed(false);
                setUser(null); // Limpiamos el estado si la verificación falla
                setLoading(false);
            }
        }
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider value={{
            singup,
            singin,
            logout,  
            user,
            isAuthenticathed,
            errors,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
