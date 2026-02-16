import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../schemas/loginSchema";
import { useFormik } from "formik";
import { loginRequest } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

export default function Login() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (username === "admin" && password === "admin123") {
  //     localStorage.setItem("isAuthenticated", "true"); // simple flag local
  //     navigate("/"); // redirection vers dashboard
  //   } else {
  //     setError("Nom d'utilisateur ou mot de passe incorrect");
  //   }
  // };

  const formik = useFormik({
    initialValues: {
      login: "",
      mot_de_passe: "",
    },

    validationSchema: loginSchema,

    onSubmit: async (values, { setSubmitting }) => {
      setServerError("");

      try {
        const data = await loginRequest(values);
        setUser(data.user);
        navigate("/ventes");
      } catch (error) {
        console.log(error);
      }

      setSubmitting(false);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
          Connexion
        </h2>

        {serverError && (
          <div className="mb-4 text-red-600 dark:text-red-400 text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              name="login"
              value={formik.values.login}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre login"
              required
            />
            {formik.touched.login && formik.errors.login && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.login}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200">
              Mot de passe
            </label>
            <input
              type="password"
              name="mot_de_passe"
              value={formik.values.mot_de_passe}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre mot de passe"
              required
            />
            {formik.touched.mot_de_passe && formik.errors.mot_de_passe && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.mot_de_passe}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          >
            {formik.isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
