const SearchInput = ({ search, setSearch }) => {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🔍</span>
      <input
        type="text"
        placeholder="Buscar tareas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-12 pr-4 py-3 border-2 border-slate-600 bg-slate-700 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium placeholder-gray-400"
      />
      {search && (
        <button
          onClick={() => setSearch('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 font-bold"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchInput;
