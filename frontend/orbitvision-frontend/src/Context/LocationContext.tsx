import {createContext, useContext, useState, type ReactNode} from 'react';

const LOCATION_STORAGE_KEY = 'orbitvision_location';

export interface UserLocation
{
    latitude: number;
    longitude: number;
    altitudeMeters: number;
    label: string;
    source: "automatic" | "manual";
}

interface GeocodingResult
{
    lat: number;
    lon: number;
    display_name: string;
}

interface LocationContextValue
{
    location: UserLocation | null;
    isLoadingLocation: boolean;
    locationError: string | null;
    fetchAutomaticLocation: () => Promise<void>;
    fetchLocationByCity: (city: string) => Promise<void>;
    clearLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

function readStoredLocation(): UserLocation | null
{
    try
    {
        const storedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);

        if(!storedLocation)
        {
            return null;0
        }

        return JSON.parse(storedLocation) as UserLocation;
    }catch
    {
        localStorage.removeItem(LOCATION_STORAGE_KEY);
        return null;
    }
}

export function LocationProvider({children}: {children: ReactNode})
{
    const [location, setLocation] = useState<UserLocation | null>(readStoredLocation());
    const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    const saveLocation = (newLocation: UserLocation) =>
    {
        setLocation(newLocation);
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(newLocation));
    };

    const fetchAutomaticLocation = async (): Promise<void> =>
    {
        setLocationError(null);

        if(!navigator.geolocation)
        {
            setLocationError("Geolokalizacja nie jest obsługiwana przez Twoją przeglądarkę.");
            return;
        }

        setIsLoadingLocation(true);

        try{
            const position = await new Promise<GeolocationPosition>((resolve, reject) =>
            {
                navigator.geolocation.getCurrentPosition(resolve, reject, {enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000});
            });
            saveLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                altitudeMeters: position.coords.altitude ?? 0,
                label: "Twoja lokalizacja",
                source: "automatic"
            });
        }catch(error)
        {
            const geolocationError = error as GeolocationPositionError;

            switch(geolocationError.code)
            {
                case geolocationError.PERMISSION_DENIED:
                    setLocationError("Odmowa dostępu do lokalizacji. Włącz geolokalizację w ustawieniach przeglądarki.");
                    break;
                case geolocationError.POSITION_UNAVAILABLE:
                    setLocationError("Nie można określić lokalizacji. Spróbuj ponownie później.");
                    break;
                case geolocationError.TIMEOUT:
                    setLocationError("Przekroczono limit czasu oczekiwania na lokalizację. Spróbuj ponownie.");
                    break;
                default:
                    setLocationError("Wystąpił nieznany błąd podczas pobierania lokalizacji.");
                    break;
            }
        }finally
        {
            setIsLoadingLocation(false);
        }
    };

    const fetchLocationByCity = async (city: string): Promise<void> =>
    {
        const normalizedCity = city.trim();

        if(!normalizedCity)
        {
            setLocationError("Nazwa miasta nie może być pusta.");
            return;
        }

        setLocationError(null);
        setIsLoadingLocation(true);

        try{
            const params = new URLSearchParams({
                q: normalizedCity,
                format: "jsonv2",
                limit: "1",
                addressdetails: "1"
            });

            const baseUrl = import.meta.env.VITE_GEOCODING_URL ?? "https://nominatim.openstreetmap.org";

            const response = await fetch(`${baseUrl}/search?${params.toString()}`, {
                headers: {
                    "Accept-Language": "pl"
                }
            });

            if(!response.ok){
                throw new Error(`Błąd podczas pobierania danych geokodowania: ${response.status}`);
            }
            
            const results = (await response.json()) as GeocodingResult[];

            if(results.length === 0)
            {
                setLocationError("Nie znaleziono lokalizacji dla podanego miasta.");
                return;
            }
            
            const result = results[0];
            const latitude = Number(result.lat);
            const longitude = Number(result.lon);

            if(!Number.isFinite(latitude) || !Number.isFinite(longitude))
            {
                throw new Error("Nieprawidłowe dane geokodowania otrzymane z serwera.");
            }

            saveLocation({
                latitude,
                longitude,
                altitudeMeters: 0,
                label: result.display_name,
                source: "manual"
            });
        }catch(error)
        {
            console.error("Błąd podczas pobierania lokalizacji:", error);

            setLocationError("Nie udało się pobrać współrzędnych miasta. ");
        }finally {
            setIsLoadingLocation(false);
        }
    };

    const clearLocation = () => {
        setLocation(null);
        setLocationError(null);
        localStorage.removeItem(LOCATION_STORAGE_KEY);
    };

    return (
        <LocationContext.Provider value={{location, isLoadingLocation, locationError, fetchAutomaticLocation, fetchLocationByCity, clearLocation}}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocationContext(){
    const context = useContext(LocationContext);

    if(!context)
    {
        throw new Error("useLocationContext must be used within a LocationProvider");
    }

    return context;
}