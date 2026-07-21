import { useState, type FormEvent } from "react";
import { useLocationContext } from "../Context/LocationContext";

export default function LocationPanel() {
    const [city, setCity] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const {
        location,
        isLoadingLocation,
        locationError,
        fetchAutomaticLocation,
        fetchLocationByCity,
        clearLocation
    } = useLocationContext();

    const handleCitySubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        await fetchLocationByCity(city);
    };

    return (
    <>
        {!isOpen && (
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="
                    fixed bottom-4 right-4 z-30
                    rounded-full bg-blue-600 px-5 py-3
                    font-semibold text-white shadow-2xl
                    hover:bg-blue-500
                    active:scale-95
                    sm:hidden
                "
            >
                Ustaw lokalizację
            </button>
        )}

        <section
            className={`
                fixed bottom-3 left-3 right-3 z-30
                max-h-[calc(100dvh-1.5rem)] overflow-y-auto
                rounded-xl border border-white/15
                bg-gray-950/90 p-3 text-white
                shadow-2xl backdrop-blur-md

                sm:bottom-5 sm:left-auto sm:right-5
                sm:block sm:w-80 sm:p-4

                ${isOpen ? "block" : "hidden"}
            `}
        >
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Lokalizacja obserwatora
                </h2>

                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Zamknij panel lokalizacji"
                    className="
                        flex h-8 w-8 items-center justify-center
                        rounded-full bg-white/10 text-xl
                        hover:bg-white/20
                        sm:hidden
                    "
                >
                    ×
                </button>
            </div>

            <button
                type="button"
                onClick={fetchAutomaticLocation}
                disabled={isLoadingLocation}
                className="
                    mb-3 w-full rounded-lg bg-blue-600
                    px-4 py-2 hover:bg-blue-500
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >
                Użyj mojej lokalizacji
            </button>

            <div className="mb-3 flex items-center gap-2 text-xs text-gray-400">
                <span className="h-px flex-1 bg-gray-700" />
                albo wpisz miasto
                <span className="h-px flex-1 bg-gray-700" />
            </div>

            <form
                onSubmit={handleCitySubmit}
                className="flex flex-col gap-2 sm:flex-row"
            >
                <input
                    type="text"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    disabled={isLoadingLocation}
                    placeholder="np. Warszawa"
                    className="
                        min-w-0 flex-1 rounded-lg bg-white
                        px-3 py-2 text-black outline-none
                        focus:ring-2 focus:ring-blue-500
                        disabled:opacity-50
                    "
                />

                <button
                    type="submit"
                    disabled={
                        isLoadingLocation || city.trim() === ""
                    }
                    className="
                        rounded-lg bg-blue-600 px-4 py-2
                        hover:bg-blue-500
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    Szukaj
                </button>
            </form>

            {isLoadingLocation && (
                <p className="mt-3 text-sm text-blue-300">
                    Pobieranie lokalizacji...
                </p>
            )}

            {locationError && (
                <p className="mt-3 rounded-lg bg-red-500/15 p-2 text-sm text-red-300">
                    {locationError}
                </p>
            )}

            {location && (
                <div className="mt-3 rounded-lg bg-white/10 p-3 text-sm">
                    <p className="font-medium">
                        {location.label}
                    </p>

                    <p className="mt-1 text-gray-300">
                        {location.latitude.toFixed(5)},{" "}
                        {location.longitude.toFixed(5)}
                    </p>

                    <button
                        type="button"
                        onClick={clearLocation}
                        className="mt-2 text-xs text-red-300 hover:text-red-200"
                    >
                        Usuń lokalizację
                    </button>
                </div>
            )}

            <p className="mt-3 text-xs text-gray-400">
                Wyszukiwanie miast:{" "}
                <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-white"
                >
                    © OpenStreetMap contributors
                </a>
            </p>
        </section>
    </>
    );
}