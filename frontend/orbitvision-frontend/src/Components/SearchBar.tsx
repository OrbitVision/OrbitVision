import { useEffect, useState } from "react";
import { axiosGetNames , axiosGetWatchlist, type SatelliteData} from "../api/axios";
import {useAuth} from "../Context/AuthContext";


export default function SearchBar() {
  const { syncWatchlist, isLoadingSatellites } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [availableSatellites, setAvailableSatellites] = useState<SatelliteData[]>([]);
  const [selectedSatelliteIds, setSelectedSatelliteIds] = useState<number[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  console.log(error);

  const filteredSatellites = availableSatellites.filter(
    (satellite) => satellite.satelliteName.toLowerCase().includes(searchInput.trim().toLowerCase())
  );

  const handleSatelliteSelection = (sateliteId: number, checked: boolean) => {
    setSelectedSatelliteIds((currentIds) => {
      if(checked)
      {
        return currentIds.includes(sateliteId) ? currentIds : [...currentIds, sateliteId];
      }

      return currentIds.filter((id) => id !== sateliteId);
    });
  };

  const handleDisplaySatellites = async() => {
    setError("");

    try {
      await syncWatchlist(selectedSatelliteIds);
    }catch
    {
      setError("Nie udało się zaktualizować watchlisty!");
    }
  }

  useEffect(() => {
    async function loadData() {
      setIsLoadingList(true);
      setError("");

      try{
        const [allSatellites, watchListSatellites] = await Promise.all([axiosGetNames(), axiosGetWatchlist()]);

        setAvailableSatellites(allSatellites);

        setSelectedSatelliteIds(watchListSatellites.map((satellite) => satellite.id));
      }catch(error)
      {
        console.error("Error loading satellites: ", error);
        setError("Nie udało się pobrać satelitów.");
      }finally{
        setIsLoadingList(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (availableSatellites != null) {
      console.log("Satelity: ", availableSatellites)
    }
  }, [availableSatellites]);
  return (
    <>
      {/* Wyszukiwarka */}
      <form
        onSubmit={(event) => event.preventDefault()}
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
        {filteredSatellites.length > 0 ? (
          <div className="max-h-[calc(60vh-4.75rem)] overflow-y-auto overflow-x-hidden">
            {filteredSatellites.map((satellite) => (
              <div
                key={satellite.id}
                className="flex items-center justify-between border-b border-white/20 text-white transition-colors hover:bg-white/10 last:border-b-0"
              >
                <span className="px-4 py-2">
                  {satellite.satelliteName}
                </span>

                <input type="checkbox"
                  checked={selectedSatelliteIds.includes(
                      satellite.id
                  )}
                  onChange={(event) =>
                      handleSatelliteSelection(
                          satellite.id,
                          event.target.checked
                      )
                  }
                  disabled={
                      isLoadingList || isLoadingSatellites
                  }
                  aria-label={`Wybierz satelitę ${satellite.satelliteName}`}
                  className="m-3 h-6 w-6 cursor-pointer accent-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            ))}
          </div>) : (
          <p className="px-4 py-5 text-center text-sm text-gray-300">
            Nie znaleziono satelitów
          </p>
        )}

        <div className="shrink-0 bg-gray-900 p-3">
          <button type="button" onClick={handleDisplaySatellites} disabled={isLoadingList || isLoadingSatellites} className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:opacity-60">
          {isLoadingSatellites ? "Aktualizowanie..." : `Wyświetl (${selectedSatelliteIds.length})`}
          </button>
        </div>

      </div>
    </>

  );
}
