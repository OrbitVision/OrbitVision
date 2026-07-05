import * as satellite from 'satellite.js';

interface SatellitePoint {
    latitude: number;
    longitude: number;
    altitudeKilometers: number;
    timestamp: string;
}

interface SatelliteRouteResponse {
    satelliteName: string;
    points: SatellitePoint[];
}

interface MultipleSatellitesResponse {
    satellites: SatelliteRouteResponse[];
}

export function calculateOrbits(data: any): MultipleSatellitesResponse {
    const results: SatelliteRouteResponse[] = [];

    data.satellites.forEach((sat: any) => {
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
            satelliteName: sat.satelliteName,
            points: pointsList
        });
    });

    return { satellites: results };
}