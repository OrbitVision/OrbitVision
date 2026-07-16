import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import SearchBar from "./SearchBar";
import { AddSatelliteFromTrajectory } from "../Utils/AddSatellite";
import {useAuth} from "../Context/AuthContext";

export default function CesiumMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const {user, satellites, loadSatellites, isLoadingSatellites} = useAuth();

    // Wyszukiwanie satelity
    const handleSearchSatellite = async () => {
        if (!viewerRef.current) return;

        try {
            // pobieranie danych o satelicie
            await loadSatellites();

        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        const viewer = viewerRef.current;

        if (!viewer) {
            return;
        }

        viewer.entities.removeAll();

        satellites.forEach((satellite) => {
            AddSatelliteFromTrajectory(viewer, satellite.points, satellite.satelliteName);
        });

    }, [satellites]);

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
                <SearchBar onSearch={handleSearchSatellite} satellites={satellites} />
            </div>

            {user && (
                <p className="absolute top-4 left-4 z-20 rounded bg-slate-900 px-3 py-2 text-white">
                    Zalogowano jako: {user.username}
                </p>
            )}

            {isLoadingSatellites && (
                <p className="absolute top-4 right-4 z-20 rounded bg-slate-900 px-3 py-2 text-white">
                    Ładowanie satelitów...
                </p>
            )}

            <div ref={containerRef} className="w-full h-full" />
        </div>
    )
}