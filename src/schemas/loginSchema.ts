import * as Yup from "yup";

export const loginSchema = Yup.object({
  login: Yup.string()
    .required("Le login obligatoire")
    .min(3, "Minimum 3 caractères"),

  mot_de_passe: Yup.string()
    .required("Le mot de passe obligatoire")
    .min(5, "Minimum 6 caractères"),
});
