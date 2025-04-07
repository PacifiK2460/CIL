import { object, string } from "zod";

export const signInSchema = object({
  username: string({
    required_error: "El nombre de usuario es requerido",
  })
    .min(1, "El nombre de usuario es requerido")
    .max(100, "El nombre de usuario no puede tener más de 100 caracteres"),
  password: string({
    required_error: "La contraseña es requerida",
  })
    .min(1, "La contraseña es requerida")
    .max(100, "La contraseña no puede tener más de 100 caracteres"),
});
