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
        <div className="w-full bg-transparent py-4">
            <form
                onSubmit={handle}
                className="flex items-center justify-center gap-3"
            >
                <input
                    type="text"
                    className="w-80 rounded-lg bg-white px-4 py-1"
                    name="searchBarInput"
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

            {/* Lista satelitów */}
            <div className=" mt-2 w-80 overflow-hidden rounded-lg bg-gray-900/25 shadow-md">
                {satellites.map((satellite) => (
                    <div key={satellite.satelliteName} className="border-b text-white last:border-b-0 flex justify-between">
                        <div  className=" bg-transparent  px-4 py-2 text-white ">
                        {satellite.satelliteName}
                        </div> 
                        <div>
                            <input type="checkbox" id={satellite.satelliteName} className=" m-3 h-6 w-6 accent-gray-900 appearance-auto "  ></input>
                        </div>
                    </div>  
                ))}
            </div>
        </div>
    );
}