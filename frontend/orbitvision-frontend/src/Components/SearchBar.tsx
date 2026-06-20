import { useState } from 'react';

export default function SearchBar(){

    const [searchInput, setSearchInput] = useState("");

    const handle = () => {
        
    }

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