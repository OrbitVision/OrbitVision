import { useState } from 'react';

interface SearchBarProps {
    onSearch: (satelliteName: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [searchInput, setSearchInput] = useState("");

    const handle = (e: React.FormEvent) => {
        e.preventDefault();

        if (searchInput.trim() !== "") {
            onSearch(searchInput);
        }
    };

    return (
        <>
            <div className="bg-black">
                <form>
                    {/* Wyszukiwanie input */}
                    <input
                        type="text"
                        className="bg-white "
                        name="searchBarInput"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Wyszukaj satelitę"></input>

                    {/* Wyszukiwanie button */}
                    <input
                        type="button"
                        className="w-auto
                 bg-white "
                        value={"Wyszukaj"}
                        name="searchBarButton"
                        onClick={handle}></input>
                </form>
            </div>
        </>
    )
}