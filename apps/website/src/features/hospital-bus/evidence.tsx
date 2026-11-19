import { data } from './story';

export function Evidence() {
    return (
        <footer id="references" className="night-evidence" aria-labelledby="reference-title">
            <div>
                <h2 id="reference-title">Methods and sources</h2>
                <h3>The London map</h3>
                <p>
                    We timed journeys from 4,994 neighbourhood centres to the quickest of four major
                    trauma hospitals on Thursday 19 November 2026. Each trip starts at noon or 2
                    a.m. and can include walking, waiting and up to two buses. Grey means we found
                    no journey within two hours under these rules.{' '}
                    <a href={`${import.meta.env.BASE_URL}data/hospital-journeys.csv`} download>
                        Download the neighbourhood results (CSV)
                    </a>
                    .
                </p>
                <p>
                    We allowed 400 metres at either end, or a direct walk of up to 400 metres.
                    Walking times use straight-line distances at 1.2 metres per second. A change
                    allows up to 150 metres between stops, plus two minutes to board. Nearby bus
                    stops represent each hospital entrance.{' '}
                    <a href="https://data.london.gov.uk/information-sharing-to-tackle-violence/istv-wider-resources">
                        London’s four major trauma centres
                    </a>{' '}
                    ·{' '}
                    <a href="https://www.arcgis.com/home/item.html?id=c60141d49a384a4c8b506ebb25e5159a">
                        TfL neighbourhood boundaries
                    </a>{' '}
                    ·{' '}
                    <a href="https://data.london.gov.uk/dataset/london-boroughs-e55pw">
                        Borough boundaries
                    </a>{' '}
                    ·{' '}
                    <a href="https://gis.london.gov.uk/arcgis/rest/services/apps/webmap_context_layer/MapServer/1?f=json">
                        River Thames outline
                    </a>
                    .
                </p>
                <h3>The Goose Green connection</h3>
                <p>
                    In TfL’s 15 November timetable release, the 37 is due at stop J at 02:35:27 and
                    the 176 leaves at 02:36:00. Both times match the Department for Transport’s
                    London feed for 19 November. The 33 seconds are a scheduled gap. Measuring how
                    often people miss the connection would require actual arrivals and departures.
                    Both download links serve the latest feed.{' '}
                    <a href="https://tfl.gov.uk/tfl/syndication/feeds/journey-planner-timetables.zip">
                        TfL timetable (ZIP)
                    </a>{' '}
                    ·{' '}
                    <a href="https://data.bus-data.dft.gov.uk/timetable/download/gtfs-file/london/">
                        DfT timetable (ZIP)
                    </a>{' '}
                    ·{' '}
                    <a href="https://tfl.gov.uk/bus/stop/490012417L/goose-green">
                        Goose Green stop J
                    </a>
                    .
                </p>
                <h3>Who loses a direct bus?</h3>
                <p>
                    We compared the noon–2 p.m. and 2–4 a.m. windows in TfL’s 2025–26 weekday
                    profiles. We selected areas more than 800 metres from all four hospitals with a
                    direct lunchtime bus and a night bus nearby. Of 212 areas that lost a direct
                    service, 187 had a timed trip to the same hospital at both departures. Each area
                    counts once in the median. Household figures come from the 2021 Census.{' '}
                    <a href="https://crowding.data.tfl.gov.uk/#!BUSTO%2F">TfL bus profiles</a> ·{' '}
                    <a href="https://crowding.data.tfl.gov.uk/BUSTO/BUSTO%20User%20Guide%20and%20Data%20Dictionary%20v1.2.pdf">
                        BUSTO data guide
                    </a>{' '}
                    ·{' '}
                    <a href="https://ibus.data.tfl.gov.uk/Base_Version_20260117/Stop_Point_20260117.zip">
                        TfL stop locations (ZIP)
                    </a>{' '}
                    ·{' '}
                    <a href="https://www.nomisweb.co.uk/datasets/c2021ts045">
                        ONS table TS045, car or van availability
                    </a>
                    .
                </p>
                <h3>What a timetable change affects</h3>
                <p>
                    We simulated {data.network.scenarios} changes against{' '}
                    {data.network.runs.toLocaleString('en-GB')} scheduled bus runs. Each test moved
                    one bus and carried the change forward along its route. We counted pairs of
                    buses on different routes that allowed 2–30 minutes to change after walking. Six
                    lost connections means six pairs of scheduled buses. Passenger numbers and
                    actual delays are unknown.
                </p>
                <p className="night-sources">
                    Powered by TfL Open Data. Contains OS data © Crown copyright and database rights
                    2016. Geomni UK Map data © and database rights [2019]. Neighbourhood boundaries
                    contain OS data © Crown copyright and database right 2022. Contains ONS and
                    Greater London Authority data licensed under the Open Government Licence v3.0.
                </p>
            </div>
        </footer>
    );
}
