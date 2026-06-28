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

    const handle = (e: React.FormEvent) => {
        e.preventDefault();

        if (searchInput.trim() !== "") {
            onSearch(searchInput);
        }
    };

    return (
        
  <>
    {/* Wyszukiwarka na górze, wyśrodkowana */}
    <form
      onSubmit={handle}
      className="absolute top-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3"
    >
      <input
        type="text"
        className="w-80 rounded-lg bg-white px-4 py-1"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Wyszukaj satelitę..."
      />

      <button
        type="submit"
        className="rounded-lg bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
      >
        Wyszukaj
      </button>
    </form>

    {/* Lista tylko po lewej */}
    <div className="absolute top-20 left-0 z-10 w-80 overflow-hidden rounded-r-lg bg-gray-900/25 shadow-md">
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