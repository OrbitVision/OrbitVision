import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import SearchBar from "./SearchBar";
import { axiosGetData } from "../api/axios";

interface SatellitePoint {
    latitude: number;
    longitude: number;
    altitudeKilometers: number;
    timestamp: string;
}

export default function CesiumMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const [points, setPoints] = useState<SatellitePoint[]>([]);
    

    

    const handleSearchSatellite = async () => {
        if (!viewerRef.current) return;

        try {
            const res = await axiosGetData();
            console.log(res);

            if (res && res.data && res.data.points) {
                setPoints(res.data.points);
                console.log("Chyba git:", res.data.points);

                console.log("Chuj");
                dodajSateliteZTrajektoria(viewerRef.current, points, "ISS");
                console.log(viewerRef.current.entities.values);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    
    function dodajSateliteZTrajektoria(
            viewer: Cesium.Viewer,
            points: {
              latitude: number;
              longitude: number;
              altitudeKilometers: number;
              timestamp: string;
            }[],
            nazwa = "Satelita"
        ) {
            if (points.length === 0) {
            console.error("Brak punktów");
            return;
        }

        const positionProperty = new Cesium.SampledPositionProperty();

        points.forEach((point) => {
        const time = Cesium.JulianDate.fromIso8601(point.timestamp);

        const position = Cesium.Cartesian3.fromDegrees(
            point.longitude,
            point.latitude,
            point.altitudeKilometers * 1000
        );

        positionProperty.addSample(time, position);
        });

        const startTime = Cesium.JulianDate.fromIso8601(points[0].timestamp);

        const stopTime = Cesium.JulianDate.fromIso8601(
            points[points.length - 1].timestamp
        );

        const satelliteEntity = viewer.entities.add({
            name: nazwa,

            // Bardzo ważne — określa kiedy encja ma istnieć
            availability: new Cesium.TimeIntervalCollection([
                new Cesium.TimeInterval({
                    start: startTime,
                    stop: stopTime
                })
            ]),

            position: positionProperty,

            point: {
                pixelSize: 14,
                color: Cesium.Color.YELLOW,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2
            },

            path: {
                show: true,
                width: 3,
                material: Cesium.Color.CYAN,
                leadTime: 3600,
                trailTime: 3600
            }
        });

        viewer.clock.startTime = startTime.clone();
        viewer.clock.stopTime = stopTime.clone();
        viewer.clock.currentTime = startTime.clone();

        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        viewer.clock.multiplier = 20;
        viewer.clock.shouldAnimate = true;

        // Kamera leci do satelity
        viewer.zoomTo(satelliteEntity);

        return satelliteEntity;
    }
       

    const handle = () => {
        const viewer = viewerRef.current;

        if (!viewer) return;

        const satellite = viewer.entities.add({
            name: "Testowa satelita",

            position: Cesium.Cartesian3.fromDegrees(
                19.94,
                50.06,
                400000
            ),

            point: {
                pixelSize: 12,
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
            },

            label: {
                text: "SAT-1",
                font: "14px sans-serif",
                pixelOffset: new Cesium.Cartesian2(0, -25),
                fillColor: Cesium.Color.WHITE,
            },
        });

        viewer.flyTo(satellite);
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

        // Tymczasowo dodaj satelitę od razu po uruchomieniu mapy.
        handle();

        return () => {
            if (!viewer.isDestroyed()) {
                viewer.destroy();
            }

            viewerRef.current = null;
        };
    }, []);

    return (
        <div className="relative w-full h-full">
            <div className="absolute top-4 left-4 z-10">
                <SearchBar onSearch={handleSearchSatellite} />
            </div>
            <div ref={containerRef} className="w-full h-full" />
        </div>
    )
}