

import { z } from "zod";



export const registerSchema = z.object ({

    Nombre_Usuario : z.string({
        required_error: "Username is a required fields"
    }),

    

    Passwords : z.string({
        required_error: "Password is a required fields"
    }).min(6, {
        message: 'Password must be at least 6 characters long. '
    }),

});

export const loginSchema = z.object({
    Nombre_Usuario: z.string({
      required_error: "El Nombre de Usuario es un Campo Obligatorio."
    })
    .min(4, {
      message: "El Nombre de Usuario debe tener al menos 6 Caracteres."
    })
    .max(20, {
      message: "El Nombre de Usuario no debe exceder los 20 Caracteres."
    }),
  
    Passwords: z.string({
      required_error: "La Contraseña es un campo Obligatorio."
    })
    .min(6, {
      message: "La Contraseña debe tener al menos 6 Caracteres."
    })
  });