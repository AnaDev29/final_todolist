import TaskCard from "./TaskCard";

const TaskList = ({ tasks, toggleTask, onEdit, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-xl font-semibold text-gray-400 mb-2">No hay tareas</p>
        <p className="text-sm text-gray-400">¡Agrega tu primera tarea para comenzar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          toggleTask={toggleTask}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
