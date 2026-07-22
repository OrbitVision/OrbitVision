import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import SearchBar from "./SearchBar";
import { AddSatelliteFromTrajectory } from "../Utils/AddSatellite";
import { useAuth } from "../Context/AuthContext";
import LocationPanel from "./LocationPanel";
import { useLocationContext } from "../Context/LocationContext";

const HOME_ICON = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="30" fill="#2563eb" stroke="white" stroke-width="3"/>
        <path
            d="M16 31L32 17L48 31V49H37V37H27V49H16V31Z"
            fill="white"
            stroke="white"
            stroke-linejoin="round"
        />
    </svg>
`)}`;

export default function CesiumMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const [isViewerReady, setIsViewerReady] = useState(false);
    const { satellites, isLoadingSatellites } = useAuth();
    const { location } = useLocationContext();

    // Wyszukiwanie satelity

    useEffect(() => {
        const viewer = viewerRef.current;

        if (!viewer || !isViewerReady) {
            return;
        }

        viewer.entities.removeAll();

        satellites.forEach((satellite) => {
            console.log("TSTSTS")
            AddSatelliteFromTrajectory(
                viewer,
                satellite.points,
                satellite.satelliteName
            );
        });

        if (location) {
            viewer.entities.add({
                id: "user-location",
                name: location.label,
                position: Cesium.Cartesian3.fromDegrees(
                    location.longitude,
                    location.latitude,
                    Math.max(location.altitudeMeters, 20)
                ),
                billboard: {
                    image: HOME_ICON,
                    width: 48,
                    height: 48,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                },
                label: {
                    text: location.label,
                    font: "14px sans-serif",
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 3,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    pixelOffset: new Cesium.Cartesian2(0, 12),
                    verticalOrigin: Cesium.VerticalOrigin.TOP,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    distanceDisplayCondition:
                        new Cesium.DistanceDisplayCondition(
                            0,
                            5_000_000
                        )
                }
            });
        }

        viewer.scene.requestRender();
    }, [satellites, location, isViewerReady]);

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

        setIsViewerReady(true);

        return () => {
            setIsViewerReady(false);
            if (!viewer.isDestroyed()) {
                viewer.destroy();
            }

            viewerRef.current = null;
        };
    }, []);

    return (
        <div className="relative w-full h-full">
            <div className="absolute top-4 left-0 w-full z-10">
                <SearchBar />
            </div>

            {isLoadingSatellites && (
                <p className="absolute top-4 right-4 z-20 rounded bg-slate-900 px-3 py-2 text-white">
                    Ładowanie satelitów...
                </p>
            )}

            <LocationPanel />
            <div ref={containerRef} className="w-full h-full" />
        </div>
    )
}