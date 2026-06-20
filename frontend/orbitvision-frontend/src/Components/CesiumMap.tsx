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

    const addMovingSatellite = () => {
        const viewer = viewerRef.current;

        if (!viewer) return;

        const start = Cesium.JulianDate.now();
        const stop = Cesium.JulianDate.addSeconds(
            start,
            360,
            new Cesium.JulianDate()
        );

        const position = new Cesium.SampledPositionProperty();

        // 360 punktów trajektorii, co 1 sekunda
        for (let i = 0; i <= 360; i++) {
            const time = Cesium.JulianDate.addSeconds(
                start,
                i,
                new Cesium.JulianDate()
            );

            // Testowa "orbita"
            const longitude = 19.94 + i * 2;
            const latitude = 20 * Math.sin(i * 0.08);
            const height = 400000;

            const satellitePosition = Cesium.Cartesian3.fromDegrees(
                longitude,
                latitude,
                height
            );

            position.addSample(time, satellitePosition);
        }

        const satellite = viewer.entities.add({
            name: "SAT-1",
            position: position,

            point: {
                pixelSize: 10,
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

            // Opcjonalne: kierunek obiektu zgodny z ruchem
            orientation: new Cesium.VelocityOrientationProperty(position),

            // Widoczna trajektoria
            path: {
                show: true,
                leadTime: 0,
                trailTime: 180,
                width: 2,
                material: Cesium.Color.CYAN,
            },
        });

        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();

        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        viewer.clock.multiplier = 10;
        viewer.clock.shouldAnimate = true;

        viewer.trackedEntity = satellite;
    };

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

    const handleSearchSatellite = async () => {
        if (!viewerRef.current) return;

        try {
            const res = await axiosGetData();
            console.log(res);

            if (res && res.data && res.data.points) {
                setPoints(res.data.points);
                console.log("Chyba git:", res.data.points);
                console.log(points)
            }
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

        addMovingSatellite();

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