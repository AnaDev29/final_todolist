import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import TaskList from "../components/TaskList";
import { useRef } from "react";
import ToDoItem from "../components/ToDoItem";
import SearchInput from "../components/SearchInput";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const editInputRef = useRef();
  const navigate = useNavigate();
  
  // Borrar tarea
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
      toast.success("Tarea borrada");
    } catch (err) {
      console.error("Error al borrar tarea:", err);
      toast.error("Error al borrar tarea");
    }
  };

  // Iniciar edición
  const startEditTask = (task) => {
    setEditingTask(task);
  };

  // Guardar edición
  const saveEditTask = async () => {
    if (!editingTask) return;
    const newText = editInputRef.current.value.trim();
    if (!newText) return;
    try {
      const res = await api.put(`/tasks/${editingTask.id}`, { text: newText });
      setTasks(tasks.map((t) => (t.id === editingTask.id ? res.data.data : t)));
      setEditingTask(null);
      toast.success("Tarea editada");
    } catch (err) {
      console.error("Error al editar tarea:", err);
      toast.error("Error al editar tarea");
    }
  };

  // Cancelar edición
  const cancelEditTask = () => {
    setEditingTask(null);
  };
  const { logout, user } = useAuth();

  useEffect(() => {
    // Obtener tareas desde la API
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks");
        setTasks(res.data.data || []);
      } catch (err) {
        console.error("Error al cargar tareas:", err);
        toast.error("Error al cargar tareas");
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (task) => {
    try {
      const res = await api.post("/tasks", { text: task.text });
      setTasks([res.data.data, ...tasks]);
      toast.success("Tarea agregada");
    } catch (err) {
      console.error("Error al agregar tarea:", err);
      toast.error("Error al agregar tarea");
    }
  };

  const toggleTask = async (id) => {
    const taskToUpdate = tasks.find((t) => t.id === id);
    if (!taskToUpdate) return;
    try {
      const updated = { completed: !taskToUpdate.completed };
      const res = await api.put(`/tasks/${id}`, updated);
      setTasks(tasks.map((t) => (t.id === id ? res.data.data : t)));
      toast.success(updated.completed ? "Tarea completada" : "Tarea reactivada");
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
      toast.error("Error al actualizar tarea");
    }
  };

  const filteredTasks = tasks.filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-100 p-4 py-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              {user?.foto && (
                <img
                  src={user.foto}
                  alt="Perfil"
                  className="w-14 h-14 rounded-full object-cover border-4 border-cyan-300 cursor-pointer hover:border-cyan-500 transition-all shadow-md"
                  onClick={() => navigate("/profile")}
                />
              )}
              <div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                  Mi Rutina Diaria
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  ¡Hola, <span className="font-bold text-cyan-600">{user?.nombre}</span>! 👋
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate("/profile")}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold px-4 py-2 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 transition-all"
              >
                👤 Perfil
              </button>
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-700 text-sm font-semibold px-4 py-2 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 transition-all"
              >
                🚪 Salir
              </button>
            </div>
          </div>

          {/* Agregar tarea */}
          <div className="mb-4">
            <ToDoItem addTask={addTask} />
          </div>

          {/* Buscar */}
          <div>
            <SearchInput search={search} setSearch={setSearch} />
          </div>
        </div>

        {/* Edición de tarea */}
        {editingTask && (
          <div className="mb-6 w-full p-4 border-4 border-yellow-400 rounded-2xl bg-gradient-to-r from-yellow-50 to-amber-50 flex gap-3 items-center shadow-lg">
            <span className="text-2xl">✏️</span>
            <input
              ref={editInputRef}
              defaultValue={editingTask.text}
              className="flex-grow p-3 border-2 border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-medium"
              type="text"
            />
            <button
              className="bg-green-500 text-white px-5 py-2 rounded-xl hover:bg-green-600 font-bold shadow-md transition-all hover:scale-105"
              onClick={saveEditTask}
            >
              ✓ Guardar
            </button>
            <button
              className="bg-gray-400 text-white px-5 py-2 rounded-xl hover:bg-gray-500 font-bold shadow-md transition-all hover:scale-105"
              onClick={cancelEditTask}
            >
              ✕ Cancelar
            </button>
          </div>
        )}

        {/* Lista de tareas */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">📝</span>
            <h2 className="text-2xl font-bold text-gray-800">Mis Tareas</h2>
            <span className="ml-auto bg-cyan-100 text-cyan-700 px-4 py-1 rounded-full text-sm font-bold">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'tarea' : 'tareas'}
            </span>
          </div>
          <TaskList
            tasks={filteredTasks}
            toggleTask={toggleTask}
            onEdit={startEditTask}
            onDelete={deleteTask}
          />
        </div>

        {/* Footer con tu nombre */}
        <div className="mt-4 text-left">
          <p className="text-xs text-gray-400">Creado por Ana Sanchez</p>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
