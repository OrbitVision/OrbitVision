import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import SearchBar from "./SearchBar";
import { axiosGetData, axiosGetMultiple } from "../api/axios";


interface SatellitePoint {
    latitude: number;
    longitude: number;
    altitudeKilometers: number;
    timestamp: string;
}

interface Satellite
{
    name: string;
    satellitePoints: SatellitePoint[];
}

interface Sattellites
{
    satellites: Satellite[];
}

export default function CesiumMap() {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const [points, setPoints] = useState<SatellitePoint[]>([]);
    

    // Wyszukiwanie satelity
    const handleSearchSatellite = async () => {
        if (!viewerRef.current) return;

        try {
            // pobieranie danych o satelicie
            const res = await axiosGetMultiple();
            console.log(res);

            if (res && res.data && res.data.points) {
                // Ustawianie punktów 

                
                // setPoints(res.data.points);
                // console.log("Chyba git:", res.data.points);

                // dodajSateliteZTrajektoria(viewerRef.current, res.data.points, res.data.satelliteName);
                // console.log(viewerRef.current.entities.values);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    //Obliczanie promienia, w jakim okręgu jest widoczna satelita
    function getVisibilityRadius(sateliteHeight: number)
    {
        let minElevetionDeegrees: number = 10;

        const earthRadius = 6_357_000;

        const elevation = Cesium.Math.toRadians(minElevetionDeegrees);

        const centralAngle = Math.acos((earthRadius/ (earthRadius + sateliteHeight)) * Math.cos(elevation)) - elevation;

        return earthRadius * centralAngle;
    }

    

    function AddSatelliteFromTrajectory(
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

        console.log(viewer)
        const positionProperty = new Cesium.SampledPositionProperty();


        //Ustawianie czasu dla poszczególnych punktów
        points.forEach((point) => {
        const time = Cesium.JulianDate.fromIso8601(point.timestamp);

        //ustawianie pozycji satelity
        const position = Cesium.Cartesian3.fromDegrees(
            point.longitude,
            point.latitude,
            point.altitudeKilometers * 1000
        );

        // Dodaje kolejne próbki pozycji satelity do właściwości pozycji
        positionProperty.addSample(time, position);
        });

        // Pobiera czas pierwszego punktu trajektorii.
        const startTime = Cesium.JulianDate.fromIso8601(points[0].timestamp);
        
        // Pobiera czas ostatniego punktu trajektorii.
        const stopTime = Cesium.JulianDate.fromIso8601(
            points[points.length - 1].timestamp
        );

        // Oblicza różnicę czasu między pierwszym a ostatnim punktem trajektorii, wynik w sekundach
        const diffInTime = (new Date(points[points.length - 1].timestamp).getTime() - new Date(points[0].timestamp).getTime()) / 1000;


        
        // Dodawanie satelity
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
                width: 2,
                material: Cesium.Color.CYAN,
                leadTime: diffInTime,
                trailTime: diffInTime
            },
            label: 
            {
                text: nazwa,
                pixelOffset: new Cesium.Cartesian2(0, 20),
                scaleByDistance: new Cesium.NearFarScalar(0.39, 0.39, 0.50, 0.50)
            },
            
        });


        // Okrąg pokazujący obszar Ziemi, z którego satelita jest widoczna
        const coverageCircle = viewer.entities.add({
            name: `${nazwa} - obszar widoczności`,

            // Pozycja środka okręgu: punkt na powierzchni Ziemi pod satelitą
            position: new Cesium.CallbackPositionProperty((time) => {
            const satellitePosition = positionProperty.getValue(time);
        
            if (!satellitePosition) {
              return undefined;
            }
        
            const cartographic =
              Cesium.Cartographic.fromCartesian(satellitePosition);
        
            return Cesium.Cartesian3.fromRadians(
              cartographic.longitude,
              cartographic.latitude,
              0
            );
          }, false),
      
          ellipse: {
            // Promień okręgu obliczany na podstawie aktualnej wysokości satelity
            semiMajorAxis: new Cesium.CallbackProperty((time) => {
              const satellitePosition = positionProperty.getValue(time);
            
              if (!satellitePosition) {
                return 1;
              }
          
              const cartographic =
                Cesium.Cartographic.fromCartesian(satellitePosition);
          
              return getVisibilityRadius(cartographic.height);
            }, false),
        
            semiMinorAxis: new Cesium.CallbackProperty((time) => {
              const satellitePosition = positionProperty.getValue(time);
            
              if (!satellitePosition) {
                return 1;
              }
          
              const cartographic =
                Cesium.Cartographic.fromCartesian(satellitePosition);
          
              return getVisibilityRadius(cartographic.height);
            }, false),
        
            // Okrąg leży na powierzchni elipsoidy Ziemi
            height: 0,
            heightReference: Cesium.HeightReference.NONE,
        
            material: Cesium.Color.CYAN.withAlpha(0.18),
            outline: true,
            outlineColor: Cesium.Color.CYAN
          }
        });
        

        viewer.clock.startTime = startTime.clone();
        viewer.clock.stopTime = stopTime.clone();
        viewer.clock.currentTime = startTime.clone();

        viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
        viewer.clock.multiplier = 1;
        viewer.clock.shouldAnimate = true;

        // Kamera leci do satelity
        // viewer.zoomTo(satelliteEntity);

        return satelliteEntity;
    }
       
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
                <SearchBar onSearch={handleSearchSatellite} />
            </div>
            <div ref={containerRef} className="w-full h-full" />
        </div>
    )
}