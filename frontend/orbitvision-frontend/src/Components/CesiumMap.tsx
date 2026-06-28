import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import SearchBar from "./SearchBar";
import { axiosGetMultiple } from "../api/axios";
import {AddSatelliteFromTrajectory} from "../Utils/AddSatellite";


//---------Interfejsy do pobierania danych--------------
interface SatellitePoint {
    latitude: number;
    longitude: number;
    altitudeKilometers: number;
    timestamp: string;
}

interface Satellite
{
    satelliteName: string;
    points: SatellitePoint[];
}

export default function CesiumMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const [points, setPoints] = useState<SatellitePoint[]>([]);
    const [sattellites, setSatellites] = useState<Satellite[]>([]);

    // Wyszukiwanie satelity
    const handleSearchSatellite = async () => {
        if (!viewerRef.current) return;

        try {
            // pobieranie danych o satelicie
            const res = await axiosGetMultiple();
            setSatellites(res.data.satellites);
            setPoints(res.data.satellites[0].points);

            console.log(res.data.satellites);

            //Wyświetlanie każdej satelity
            res.data.satellites.forEach((satellite: Satellite) => {
                AddSatelliteFromTrajectory(viewerRef.current!, satellite.points, satellite.satelliteName);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        if (points.length > 0) {
            console.log("Punkty", points);
        }
    }, [points]);

    useEffect(() => {
        if (!containerRef.current) return;

        const viewer = new Cesium.Viewer(containerRef.current, {
            animation: false,
            timeline: false,
            baseLayerPicker: false,
            infoBox: false,
            selectionIndicator: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            fullscreenButton: false,
            creditContainer: document.createElement("div"),
            
            requestRenderMode: true,

            contextOptions: {
                webgl: {
                    alpha: false,
                    preserveDrawingBuffer: false,
                    failIfMajorPerformanceCaveat: false,
                    powerPreference: "high-performance",
                },
            },
        });

        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
                0, // długość geograficzna
                0, // szerokość geograficzna 
                20_000_000 // Wysokość kamery nad ziemią w metrach
            )
        });

        const scene = viewer.scene;

        scene.camera.moveEnd.addEventListener(() => {
            const height = scene.camera.positionCartographic.height;

            if (height > 500000) {
                scene.globe.maximumScreenSpaceError = 5;
            } else {
                scene.globe.maximumScreenSpaceError = 2;
            }
        });

        scene.skyBox = undefined;
        scene.skyAtmosphere = undefined;
        scene.sun = undefined;
        scene.moon = undefined;
        scene.backgroundColor = Cesium.Color.BLACK;

        scene.globe.enableLighting = false;
        scene.fog.enabled = false;
        scene.globe.maximumScreenSpaceError = 3;
        scene.shadowMap.enabled = false;

        scene.screenSpaceCameraController.enableCollisionDetection = false;

        viewer.resolutionScale = Math.min(window.devicePixelRatio, 1.5);

        viewerRef.current = viewer;

        handleSearchSatellite();

        return () => {
            if (!viewer.isDestroyed()) {
                viewer.destroy();
            }

            viewerRef.current = null;
        };
    }, []);

    return (
        <div className="relative w-full h-full">
            <div className="absolute top-4 left-0 w-full z-10">
                <SearchBar onSearch={handleSearchSatellite} satellites={sattellites} />
            </div>
            <div ref={containerRef} className="w-full h-full" />
        </div>
    )
}