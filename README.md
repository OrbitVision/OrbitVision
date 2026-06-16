Real-Time Satellite Tracking and Pass
Prediction Platform (OrbitVision)
1.	Główne funkcje:
•	Pobieranie danych orbitalnych TLE z CelesTrak lub Space-Track.
•	Propagacja orbit przy użyciu algorytmu SGP4.
•	Obliczanie aktualnej pozycji satelitów.
•	Wyznaczanie przyszłych pozycji i trajektorii.
•	Wizualizacja satelitów i orbit na globie 3D, np. CesiumJS.
•	Wyszukiwanie satelitów po nazwie, numerze NORAD lub typie orbity.
•	Obliczanie widocznych przelotów dla dowolnej lokalizacji użytkownika.
•	Predykcja okien komunikacyjnych dla stacji naziemnych.
•	Obliczanie, czy satelita jest aktualnie oświetlony przez Słońce.
2.	Przykładowy scenariusz działania:
Użytkownik wpisuje swoją lokalizację, na przykład Łódź. System na podstawie danych orbitalnych oraz współrzędnych lokalizacji oblicza najbliższe widoczne przeloty wybranego satelity.
System oblicza:
•	pozycję satelity,
•	pozycję Słońca,
•	warunki oświetlenia,
•	wysokość satelity nad horyzontem,
•	czas rozpoczęcia i zakończenia przelotu.
Wynik:
„ISS pojawi się o 21:14 na zachodzie, osiągnie maksymalną wysokość 72° i zniknie o 21:20 na wschodzie.”
3.	Zaawansowane funkcje:
•	Powiadomienia o przelotach:
◦	e-mail,
◦	push notification,
◦	webhook.
•	Wizualizacja konstelacji satelitarnych:
◦	Starlink,
◦	OneWeb,
◦	inne konstelacje.
•	Obsługa stacji naziemnych:
◦	okna komunikacyjne,
◦	czas widoczności,
◦	harmonogram transmisji.
•	Ostrzeżenia kolizyjne:
◦	analiza odległości między satelitami,
◦	wykrywanie potencjalnych zbliżeń,
◦	alarmy o możliwych kolizjach.
4.	Proponowany podział pracy dla dwóch osób:
5.	Możliwe technologie:
•	Backend: C#, ASP.NET
•	Algorytmy orbitalne: biblioteka SGP4.
•	Frontend i wizualizacja: CesiumJS, JavaScript, HTML, TAILWIND, REACT.
•	Baza danych: PostgreSQL
•	Powiadomienia: e-mail, webhook, Firebase Cloud Messaging.
