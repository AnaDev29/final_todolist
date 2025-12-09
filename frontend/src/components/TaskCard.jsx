const TaskCard = ({ task, toggleTask, onEdit, onDelete }) => {
  return (
    <div className={`group relative flex items-center gap-4 p-4 rounded-2xl mb-3 transition-all duration-300 hover:scale-[1.02] ${
      task.completed 
        ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-700' 
        : 'bg-gradient-to-r from-slate-700 to-slate-600 border-2 border-slate-500 shadow-md hover:shadow-lg'
    }`}>
      {/* Checkbox personalizado */}
      <div className="flex-shrink-0">
        <input
          type="checkbox"
          checked={task.completed === true}
          onChange={() => toggleTask(task.id)}
          className="w-6 h-6 rounded-lg cursor-pointer accent-cyan-500 hover:scale-110 transition-transform"
        />
      </div>

      {/* Texto de la tarea */}
      <div className="flex-grow">
        <p
          className={`text-base font-medium transition-all ${
            task.completed 
              ? "line-through text-gray-500" 
              : "text-gray-100"
          }`}
        >
          {task.text}
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1.5 rounded-lg hover:from-amber-500 hover:to-yellow-600 font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105"
          onClick={() => onEdit(task)}
          title="Editar tarea"
        >
          ✏️
        </button>
        <button
          className="bg-gradient-to-r from-red-400 to-rose-500 text-white px-3 py-1.5 rounded-lg hover:from-red-500 hover:to-rose-600 font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105"
          onClick={() => onDelete(task.id)}
          title="Eliminar tarea"
        >
          🗑️
        </button>
      </div>

      {/* Indicador de completado */}
      {task.completed && (
        <div className="absolute -right-2 -top-2 bg-green-500 text-white rounded-full p-1 shadow-lg animate-bounce">
          <span className="text-sm">✓</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
