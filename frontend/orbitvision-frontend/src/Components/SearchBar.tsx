import { useState } from "react";

interface Satellite {
  satelliteName: string;
}

interface SearchBarProps {
  onSearch: (satelliteName: string) => void;
  satellites: Satellite[];
}

export default function SearchBar({
  onSearch,
  satellites,
}: SearchBarProps) {
  const [searchInput, setSearchInput] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchInput.trim() !== "") {
      onSearch(searchInput);
    }
  };



  return (
    <>
      {/* Wyszukiwarka */}
      <form
        onSubmit={handle}
        className="absolute top-5 left-1/2 z-20 flex w-[95%] max-w-xl -translate-x-1/2 items-center gap-3"
      >
        <input
          type="text"
          className="flex-1 rounded-lg bg-white px-4 py-2"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Wyszukaj satelitę..."
        />

        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Wyszukaj
        </button>
      </form>

      {/* Przycisk na mobile */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-20 left-4 z-20 rounded-lg bg-gray-900/80 px-4 py-2 text-white shadow-md lg:hidden"
      >
        ☰ Lista satelitów
      </button>

      {/* Lista satelit */}
      <div
        className={`absolute left-0 z-10
        w-80 max-w-[90vw]
        rounded-r-lg bg-gray-900/25 shadow-md backdrop-blur
        overflow-y-auto overflow-x-hidden
        max-h-[60vh]
        lg:top-20
        top-32
        ${isOpen ? "block" : "hidden"}
        lg:block
      `}
      >
        {satellites.map((satellite) => (
          <div
            key={satellite.satelliteName}
            className="flex items-center justify-between border-b border-white/40 text-white last:border-b-0"
          >
            <span className="px-4 py-2">
              {satellite.satelliteName}
            </span>

            <input
              type="checkbox"
              className="m-3 h-6 w-6 cursor-pointer accent-blue-500"
            />
          </div>
        ))}
      </div>
    </>

  );
}