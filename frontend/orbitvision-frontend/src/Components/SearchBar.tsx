import { useEffect, useState } from "react";
import { axiosGetNames } from "../api/axios";

interface Satellite {
  satelliteName: string;
}

interface SearchBarProps {
  onSearch: (satelliteName: string) => void;
  satellites: Satellite[];
}

//tempfix for new satelliteNames responses
interface Sattellites {
  satelliteName: string,
  tle1: string,
  tle2: string,
  expDate: string
}

export default function SearchBar({
  onSearch
}: SearchBarProps) {
  const [searchInput, setSearchInput] = useState("");
  const [sattelliteNames, setSatellitesNames] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);


  const filteredSatellitesNames = sattelliteNames.filter((satellite) =>
    typeof satellite === "string" &&
    satellite.toLowerCase().includes((searchInput || "").trim().toLowerCase())
  );
  const handle = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchInput.trim() !== "") {
      onSearch(searchInput);
    }
  };

  useEffect(() => {
    async function getData() {
      const names = await axiosGetNames();
      //satelity maja name, tle1, tle2, expDate
      const extractedNames = names.data.map((item: Sattellites) => item.satelliteName);
      setSatellitesNames(extractedNames);
      //setSatellitesNames(names.data);
    };

    getData();
  }, []);

  useEffect(() => {
    if (sattelliteNames != null) {
      console.log("Satelity: ", sattelliteNames)
    }
  }, [sattelliteNames]);
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

      {/* Lista satelit ze stopka akcji */}
      <div
        className={`absolute left-0 z-10
        w-80 max-w-[90vw]
        overflow-hidden rounded-r-xl border border-l-0 border-white/15
        bg-gray-950/70 shadow-2xl backdrop-blur-md
        max-h-[60vh]
        lg:top-20
        top-32
        ${isOpen ? "block" : "hidden"}
        lg:block
      `}
      >
        {filteredSatellitesNames.length > 0 ? (
          <div className="max-h-[calc(60vh-4.75rem)] overflow-y-auto overflow-x-hidden">
            {filteredSatellitesNames.map((satellite, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-white/20 text-white transition-colors hover:bg-white/10 last:border-b-0"
              >
                <span className="px-4 py-2">
                  {satellite}
                </span>

                <input
                  type="checkbox"
                  className="m-3 h-6 w-6 cursor-pointer accent-blue-500"
                />
              </div>
            ))}
          </div>) : (
          <p className="px-4 py-5 text-center text-sm text-gray-300">
            Nie znaleziono satelitów
          </p>
        )}

        <div className="shrink-0 bg-gray-900 p-3">
          <button type="button" className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Wyświetl
          </button>
        </div>

      </div>
    </>

  );
}
