import * as satellite from "satellite.js";

interface SatelliteData {
    id: number;
    satelliteName: string;
    tle1: string;
    tle2: string;
}

interface SatellitePoint {
    latitude: number;
    longitude: number;
    altitudeKilometers: number;
    timestamp: string;
}

export interface SatelliteRouteResponse {
    id: number;
    satelliteName: string;
    points: SatellitePoint[];
}

interface MultipleSatelliteDataResponse {
    satellites: SatelliteData[];
}

interface MultipleSatellitesResponse {
    satellites: SatelliteRouteResponse[];
}

export function calculateOrbits(data: MultipleSatelliteDataResponse): MultipleSatellitesResponse {
    const results: SatelliteRouteResponse[] = [];

    data.satellites.forEach((sat) => {
        const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);

        const periodMinutes = (2 * Math.PI) / satrec.no;
        const periodSeconds = periodMinutes * 60;
        const totalPoints = 200;
        const step = periodSeconds / totalPoints;
        const startTime = new Date();
        const pointsList: SatellitePoint[] = [];

        for (let i = 0; i < totalPoints; i++) {
            const currentOffsetSeconds = i * step;
            const targetTime = new Date(startTime.getTime() + currentOffsetSeconds * 1000);

            const positionAndVelocity = satellite.propagate(satrec, targetTime);

            if (positionAndVelocity && positionAndVelocity.position && typeof positionAndVelocity.position !== 'boolean') {
                const positionEci = positionAndVelocity.position as satellite.EciVec3<number>;
                const gmst = satellite.gstime(targetTime);
                const geo = satellite.eciToGeodetic(positionEci, gmst);

                pointsList.push({
                    latitude: satellite.degreesLat(geo.latitude),
                    longitude: satellite.degreesLong(geo.longitude),
                    altitudeKilometers: geo.height,
                    timestamp: targetTime.toISOString()
                });
            }
        }

        results.push({
            id: sat.id,
            satelliteName: sat.satelliteName,
            points: pointsList
        });
    });

    return { satellites: results };
}