import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState(user?.nombre || "");
  const [email, setEmail] = useState(user?.email || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/users/profile", { nombre, email });
      if (response.data.success) {
        updateUser(response.data.data);
        setIsEditing(false);
        toast.success("Perfil actualizado exitosamente");
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error("Error al actualizar perfil");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar 5MB");
      return;
    }

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await api.post("/users/upload-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // Actualizar el usuario con la nueva foto
        const updatedUser = { ...user, foto: response.data.data.foto };
        updateUser(updatedUser);
        toast.success("Foto actualizada exitosamente");
      }
    } catch (error) {
      console.error("Error al subir foto:", error);
      toast.error("Error al subir foto");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      const response = await api.delete("/users/photo");
      if (response.data.success) {
        const updatedUser = { ...user, foto: null };
        updateUser(updatedUser);
        toast.success("Foto eliminada exitosamente");
      }
    } catch (error) {
      console.error("Error al eliminar foto:", error);
      toast.error("Error al eliminar foto");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-100 p-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                👤 Mi Perfil
              </h1>
              <p className="text-gray-600 text-sm mt-1">Gestiona tu información personal</p>
            </div>
            <button
              onClick={() => navigate("/tasks")}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              ← Volver a Tareas
            </button>
          </div>
        </div>

        {/* Tarjeta de perfil */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
          {/* Foto de perfil */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              {user?.foto ? (
                <img
                  src={user.foto}
                  alt="Foto de perfil"
                  className="w-40 h-40 rounded-full object-cover border-4 border-cyan-300 shadow-xl"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-6xl font-bold border-4 border-cyan-300 shadow-xl">
                  {user?.nombre?.charAt(0).toUpperCase()}
                </div>
              )}
              
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-1">{user?.nombre}</h2>
            <p className="text-cyan-600 font-semibold mb-4">@{user?.alias}</p>

            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-5 py-2 rounded-xl hover:from-blue-500 hover:to-cyan-600 disabled:bg-gray-400 font-bold transition-all shadow-md hover:shadow-lg hover:scale-105"
              >
                📸 {user?.foto ? "Cambiar foto" : "Subir foto"}
              </button>
              {user?.foto && (
                <button
                  onClick={handleDeletePhoto}
                  disabled={uploading}
                  className="bg-gradient-to-r from-red-400 to-rose-500 text-white px-5 py-2 rounded-xl hover:from-red-500 hover:to-rose-600 disabled:bg-gray-400 font-bold transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  🗑️ Eliminar
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Información del perfil */}
          <div className="space-y-4">
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-2xl border-2 border-blue-200">
                  <label className="flex items-center gap-2 text-gray-700 font-bold mb-3">
                    ✍️ Nombre:
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent font-medium"
                    required
                  />
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-2xl border-2 border-blue-200">
                  <label className="flex items-center gap-2 text-gray-700 font-bold mb-3">
                    📧 Email:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent font-medium"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white py-4 rounded-xl hover:from-green-500 hover:to-emerald-600 font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    ✅ Guardar Cambios
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setNombre(user?.nombre || "");
                      setEmail(user?.email || "");
                    }}
                    className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-4 rounded-xl hover:from-gray-500 hover:to-gray-600 font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    ✕ Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-2xl border-2 border-blue-200">
                  <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-2">
                    ✍️ Nombre
                  </p>
                  <p className="text-xl font-bold text-gray-800">{user?.nombre}</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-2xl border-2 border-blue-200">
                  <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-2">
                    👤 Usuario
                  </p>
                  <p className="text-xl font-bold text-gray-800">@{user?.alias}</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-2xl border-2 border-blue-200">
                  <p className="text-sm text-gray-500 font-semibold mb-1 flex items-center gap-2">
                    📧 Email
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {user?.email || "No configurado"}
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-4 rounded-xl hover:from-blue-600 hover:to-cyan-700 font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 mt-2"
                >
                  ✏️ Editar Perfil
                </button>
              </>
            )}

            <button
              onClick={logout}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 rounded-xl hover:from-red-600 hover:to-rose-700 font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 mt-4"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
