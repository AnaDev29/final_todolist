import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const ToDoItem = ({ addTask }) => {
  const [text, setText] = useState("");
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTask({
        author: user.nombre,
        text,
        completed: false,
      });
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="grow relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">✨</span>
        <input
          type="text"
          placeholder="Agregar nueva tarea..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-slate-600 bg-slate-700 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-medium placeholder-gray-400"
        />
      </div>
      <button
        type="submit"
        className="bg-linear-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold text-lg shadow-md hover:shadow-lg transition-all hover:scale-105 shrink-0"
      >
        + Agregar
      </button>
    </form>
  );
};

export default ToDoItem;
