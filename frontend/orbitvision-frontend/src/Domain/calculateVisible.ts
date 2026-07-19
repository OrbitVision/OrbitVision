import * as satellite from 'satellite.js';

export class CalculateVisible {
    public checkIfVisible(l1: string, l2: string, obsLat: number, obsLon: number, obsAlt: number): void {
        const satrec = satellite.twoline2satrec(l1, l2);
        const observerGd = {
            latitude: obsLat * (Math.PI / 180),
            longitude: obsLon * (Math.PI / 180),
            height: obsAlt / 1000
        };

        let time = new Date();
        const end = new Date(time.getTime() + 12 * 60 * 60 * 1000);

        while (time <= end) {
            const positionAndVelocity = satellite.propagate(satrec, time);

            if (typeof positionAndVelocity.position !== 'boolean') {
                const positionEci = positionAndVelocity.position as satellite.EciVec3<number>;

                const gmst = satellite.gstime(time);
                const lookAngles = satellite.ecfToLookAngles(
                    observerGd,
                    satellite.eciToEcf(positionEci, gmst)
                );
                const elevationDeg = lookAngles.elevation * (180 / Math.PI);

                if (elevationDeg > 10) {
                    console.log(`Satellite is visible at ${time.toString()} UTC.`);
                }
            }
            time = new Date(time.getTime() + 60 * 1000);
        }
    }
}