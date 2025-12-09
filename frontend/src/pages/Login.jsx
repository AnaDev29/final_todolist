import { useState } from "react"
import { useAuth } from "../context/AuthContext.jsx"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  
  // Login fields
  const [alias, setAlias] = useState("")
  const [contraseña, setContraseña] = useState("")
  
  // Register fields
  const [nombre, setNombre] = useState("")
  const [emailReg, setEmailReg] = useState("")
  const [aliasReg, setAliasReg] = useState("")
  const [contraseñaReg, setContraseñaReg] = useState("")
  const [confirmarContraseña, setConfirmarContraseña] = useState("")
  
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    
    if (!alias || !contraseña) {
      toast.error("Por favor completa todos los campos", { position: "top-right" })
      return
    }
    
    const result = await login(alias, contraseña)
    if (result) {
      toast.success("Login exitoso! Redirigiendo...", { position: "top-right" })
      setTimeout(() => {
        navigate("/tasks")
      }, 1500)
    } else {
      toast.error("Usuario o contraseña incorrectos", { position: "top-right" })
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    
    // Validaciones
    if (!nombre || !aliasReg || !contraseñaReg || !confirmarContraseña) {
      toast.error("Por favor completa todos los campos obligatorios", { position: "top-right" })
      return
    }
    
    if (contraseñaReg !== confirmarContraseña) {
      toast.error("Las contraseñas no coinciden", { position: "top-right" })
      return
    }
    
    if (contraseñaReg.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres", { position: "top-right" })
      return
    }
    
    const result = await register(nombre, aliasReg, emailReg, contraseñaReg)
    
    if (result.success) {
      toast.success("¡Registro exitoso! Ahora puedes iniciar sesión", { position: "top-right" })
      
      // Limpiar campos del formulario
      setNombre("")
      setAliasReg("")
      setEmailReg("")
      setContraseñaReg("")
      setConfirmarContraseña("")
      
      // Cambiar a la pestaña de login después de 1.5 segundos
      setTimeout(() => {
        setIsLogin(true)
        // Pre-llenar el campo de usuario con el alias registrado
        setAlias(aliasReg)
      }, 1500)
    } else {
      toast.error(result.message || "Error al registrar usuario", { position: "top-right" })
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Título */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500 mb-2">
            Mi Rutina Diaria
          </h1>
          <p className="text-gray-300 text-sm">Organiza tu día, alcanza tus metas 🎯</p>
        </div>

        <div className="bg-slate-800/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-slate-700">
          {/* Pestañas */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-2xl font-bold text-lg transition-all ${
                isLogin
                  ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
            >
              🔐 Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-2xl font-bold text-lg transition-all ${
                !isLogin
                  ? "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
            >
              ✨ Registrarse
            </button>
          </div>

          {/* Formulario de Login */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">👋</div>
                <h2 className="text-3xl font-extrabold text-gray-100 mb-1">
                  ¡Bienvenido de nuevo!
                </h2>
                <p className="text-gray-400 text-sm">Ingresa para continuar con tus tareas</p>
              </div>
            
              <div>
                <label className="font-bold text-gray-200 mb-2 flex items-center gap-2" htmlFor="username">
                  👤 Usuario
                </label>
                <input
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  className="w-full border-2 border-slate-600 bg-slate-700 text-gray-100 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                  type="text"
                  id="username"
                  placeholder="Tu usuario"
                  autoComplete="username"
                  required
                />
              </div>
              
              <div>
                <label className="font-bold text-gray-200 mb-2 flex items-center gap-2" htmlFor="password">
                  🔒 Contraseña
                </label>
                <input
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  className="w-full border-2 border-slate-600 bg-slate-700 text-gray-100 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                  type="password"
                  id="password"
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  required
                />
              </div>
              
              <button
                className="bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-xl p-4 font-bold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 mt-2"
                type="submit"
              >
                ✅ Ingresar
              </button>
          </form>
        ) : (
          /* Formulario de Registro */
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-3xl font-extrabold text-gray-100 mb-1">
                ¡Crea tu cuenta!
              </h2>
              <p className="text-gray-400 text-sm">Únete y empieza a organizarte</p>
            </div>
            
            <div>
              <label className="font-bold text-gray-200 mb-2 flex items-center gap-2" htmlFor="nombre">
                ✍️ Nombre completo <span className="text-red-400">*</span>
              </label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border-2 border-slate-600 bg-slate-700 text-gray-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                type="text"
                id="nombre"
                placeholder="Tu nombre completo"
                required
              />
            </div>
            
            <div>
              <label className="font-bold text-gray-200 mb-2 flex items-center gap-2" htmlFor="aliasReg">
                👤 Usuario <span className="text-red-400">*</span>
              </label>
              <input
                value={aliasReg}
                onChange={(e) => setAliasReg(e.target.value)}
                className="w-full border-2 border-slate-600 bg-slate-700 text-gray-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                type="text"
                id="aliasReg"
                placeholder="Elige un usuario"
                required
              />
            </div>
            
            <div>
              <label className="font-bold text-gray-200 mb-2 flex items-center gap-2" htmlFor="emailReg">
                📧 Email (opcional)
              </label>
              <input
                value={emailReg}
                onChange={(e) => setEmailReg(e.target.value)}
                className="w-full border-2 border-slate-600 bg-slate-700 text-gray-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                type="email"
                id="emailReg"
                placeholder="tu@email.com"
              />
            </div>
            
            <div>
              <label className="font-bold text-gray-200 mb-2 flex items-center gap-2" htmlFor="passwordReg">
                🔒 Contraseña <span className="text-red-400">*</span>
              </label>
              <input
                value={contraseñaReg}
                onChange={(e) => setContraseñaReg(e.target.value)}
                className="w-full border-2 border-slate-600 bg-slate-700 text-gray-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                type="password"
                id="passwordReg"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
            
            <div>
              <label className="font-bold text-gray-200 mb-2 flex items-center gap-2" htmlFor="confirmPassword">
                🔐 Confirmar contraseña <span className="text-red-400">*</span>
              </label>
              <input
                value={confirmarContraseña}
                onChange={(e) => setConfirmarContraseña(e.target.value)}
                className="w-full border-2 border-slate-600 bg-slate-700 text-gray-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-400"
                type="password"
                id="confirmPassword"
                placeholder="Repite tu contraseña"
                required
              />
            </div>
            
            <button
              className="bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 mt-2"
              type="submit"
            >
              🎉 Crear Cuenta
            </button>
          </form>
        )}
        </div>
      </div>
    </div>
  )
}