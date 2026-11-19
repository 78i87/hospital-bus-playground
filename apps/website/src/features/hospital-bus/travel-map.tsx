export type Departure = 'day' | 'night';
export const departures = { day: 'Noon', night: '2 a.m.' } as const;
export const bands = [
    ['#39856a', '≤30 min'],
    ['#99bd76', '30–45'],
    ['#e8ae54', '45–60'],
    ['#c45642', 'Over 60'],
    ['#d2d0c7', 'No route within 2 hr']
] as const;
export const mapURL = (time: Departure) => `${import.meta.env.BASE_URL}data/hospital-${time}.png`;

export function TimeSwitch({
    time,
    change
}: {
    time: Departure;
    change: (value: Departure) => void;
}) {
    return (
        <fieldset className="departure-switch">
            <legend className="night-transcript">Journey start time</legend>
            {(Object.keys(departures) as Departure[]).map((value) => (
                <label key={value}>
                    <input
                        type="radio"
                        name="departure"
                        value={value}
                        checked={time === value}
                        onChange={() => change(value)}
                    />
                    <span>{departures[value]}</span>
                </label>
            ))}
        </fieldset>
    );
}

export function TravelMap({
    time,
    change
}: {
    time: Departure;
    change: (value: Departure) => void;
}) {
    return (
        <figure className="access-map">
            <div className="access-map-bar">
                <figcaption>Time to a major trauma hospital</figcaption>
                <TimeSwitch time={time} change={change} />
            </div>
            <div
                className="access-map-images"
                role="img"
                aria-label={`London at ${departures[time].toLowerCase()}. ${time === 'day' ? '590' : '669'} of 4,994 neighbourhoods are within 30 minutes of a major trauma hospital. The black dot marks the Southwark starting point.`}
            >
                {(['day', 'night'] as const).map((value) => (
                    <img
                        key={value}
                        src={mapURL(value)}
                        alt=""
                        aria-hidden="true"
                        style={{ visibility: value === time ? 'visible' : 'hidden' }}
                    />
                ))}
            </div>
            <ul className="access-map-key" aria-label="Scheduled journey time">
                {bands.map(([colour, label]) => (
                    <li key={label}>
                        <i style={{ background: colour }} />
                        {label}
                    </li>
                ))}
            </ul>
        </figure>
    );
}
