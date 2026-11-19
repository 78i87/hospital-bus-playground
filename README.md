# The hospital bus after midnight

A scroll-led Data Observatory demo built from [Imperial’s Developer Playground](https://github.com/dsi-icl/do-starter-playground). It follows a scheduled 2 a.m. trip to King’s College Hospital and tests what an 87-second hold would change elsewhere on the bus network.

## Run locally

Requirements are Node 22.12 or newer and the pinned pnpm version in `package.json`.

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Open `http://localhost:5780/` and scroll. The wall simulator is at `http://localhost:5780/simulator`. Scroll inside its controller to move all six screens together.

## Data Observatory routes

- `/` is a self-guided version for a laptop or phone.
- `/control` is the tablet controller for scrolling and switching map times. When a section becomes active it sends a chapter number to the starter’s WebSocket bus.
- `/screen?c=0&r=0` renders one tile of the wall. The default wall is 16 columns by 4 rows of 1920 × 1080 screens. Use zero-based `c` and `r`. The local simulator explicitly requests a 3 × 2 layout. Each tile renders only to a canvas the size of its own display.
- `/simulator` loads the controller and six independent wall tiles in frames. A tile that joins late receives the current chapter through the starter’s initial state message. Keep scrolling after chapter six to show the findings and references on the wall.

```sh
corepack pnpm --filter website build
```

The first two chapters share a London map and a noon/2 a.m. switch. The following four chapters use route diagrams. The map and selected time stay in place between the first two chapters. The narrative uses ordinary document scrolling. The header, route diagram and progress marker sit independently of the scrolling text. A travelling marker tracks scroll distance and the chapter label updates just past each midpoint, with an eight-pixel margin to absorb small scroll reversals. The diagram updates only when the route changes.

## Evidence

The references at the end of the demo explain the data, assumptions and map credits. The [neighbourhood results](apps/website/public/data/hospital-journeys.csv) give scheduled seconds, hospital and bus routes for each departure. Empty time fields mean no trip was found under the stated rules.

The demo includes a compact snapshot in `apps/website/src/features/hospital-bus/timetable.json`. It stores scheduled times in seconds after midnight, route references, stop coordinates in British National Grid and the scenario results shown in the story. The schematic follows the order of the published stops. Distances are illustrative.

The citywide map starts each trip at a census neighbourhood centre at 12:00 or 02:00 on Thursday 19 November 2026. It chooses the earliest arrival at any of the four major trauma campuses, allowing up to two buses and 120 minutes. Walking legs use straight-line distance at 1.2 m/s, with a 400 m limit at each end and 150 m plus two minutes at a change. Direct walking is allowed within 400 m. Grey means the search found no qualifying journey.

The Southwark comparison uses the timetable for Thursday 19 November 2026. The 2 a.m. and noon journeys start from the same Southwark neighbourhood and finish at King’s College Hospital. They include modeled walks and waits. Transfers need two minutes on top of any walk. Each scenario changes one bus while keeping its running times fixed. The wider check covers 46 changes against 9,277 scheduled runs. The model expresses connections the timetable allows under those assumptions. Actual bus performance and passenger flows would require separate evidence.

- [TfL Journey Planner timetables](https://tfl.gov.uk/tfl/syndication/feeds/journey-planner-timetables.zip), archive dated 15 November 2026. Powered by TfL Open Data.
- [Department for Transport London timetable feed](https://data.bus-data.dft.gov.uk/timetable/download/gtfs-file/london/), used to verify key departures and arrivals.
- [TfL BUSTO](https://crowding.data.tfl.gov.uk/#!BUSTO%2F), [TfL iBus locations](https://ibus.data.tfl.gov.uk/Base_Version_20260117/Stop_Point_20260117.zip), [London Datastore trauma centre list](https://data.london.gov.uk/information-sharing-to-tackle-violence/istv-wider-resources), [Census vehicle access](https://www.nomisweb.co.uk/datasets/c2021ts045), [TfL PTAL](https://www.arcgis.com/home/item.html?id=c60141d49a384a4c8b506ebb25e5159a) informed the wider neighbourhood study from which this example was selected.
- Map geometry uses [Greater London Authority open data](https://data.london.gov.uk/dataset/london-boroughs-e55pw). Contains OS data © Crown copyright and database rights 2016. Geomni UK Map data © and database rights [2019]. WebCAT boundaries contain OS data © Crown copyright and database right 2022. Contains ONS and Greater London Authority data under the Open Government Licence v3.0.

The project preserves the starter’s Apache 2.0 licence. The starter commit was `f8b4690`.
