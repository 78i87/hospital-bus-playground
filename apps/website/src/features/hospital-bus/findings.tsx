import impact from './impact.json';

const number = (value: number) => value.toLocaleString('en-GB');
const duration = (seconds: number) => `${Math.floor(seconds / 60)} min ${seconds % 60} sec`;

function Bars({ caption, rows }: { caption: string; rows: { label: string; value: number }[] }) {
    const max = Math.max(...rows.map((row) => row.value));
    return (
        <figure className="impact-chart">
            <figcaption>{caption}</figcaption>
            <ul>
                {rows.map(({ label, value }) => (
                    <li key={label}>
                        <span>{label}</span>
                        <strong>{number(value)}</strong>
                        <div className="impact-track" aria-hidden="true">
                            <i style={{ width: `${(value / max) * 100}%` }} />
                        </div>
                    </li>
                ))}
            </ul>
        </figure>
    );
}

export function Findings() {
    const labels = [
        'No increase',
        'Increase under 10 min',
        'Increase of 10 to under 20 min',
        'Increase of 20 min or more'
    ];
    return (
        <section id="impact" className="night-impact" aria-labelledby="impact-title">
            <div className="impact-inner">
                <h2 id="impact-title">Hospital access at 2 a.m.</h2>
                <p>
                    Across London, 2,896 neighbourhoods had a scheduled trip to one of the four
                    hospitals within two hours at both times. At 2 a.m., 1,902 had a quicker trip,
                    976 had a longer trip and 18 took the same time. A further 734 had a trip only
                    at noon and 295 only at 2 a.m.
                </p>
                <div className="impact-columns">
                    <div>
                        <h3>Who loses a direct bus?</h3>
                        <p>
                            We compared {number(impact.eligible)} London neighbourhoods with a
                            direct lunchtime bus to one of four major trauma centres and a night bus
                            nearby. In <strong>{impact.areas} neighbourhoods</strong>, none of the
                            nearby night buses went directly to any of the four hospitals.
                        </p>
                        <p>
                            The 2021 Census counted{' '}
                            <strong>
                                {number(impact.households)} households without a car or van
                            </strong>{' '}
                            in those {impact.areas} areas. Southwark had the largest number.
                        </p>
                        <Bars
                            caption="Households without a car or van in affected neighbourhoods · top three boroughs"
                            rows={impact.boroughs}
                        />
                    </div>
                    <div>
                        <h3>How much longer at 2 a.m.?</h3>
                        <p>
                            For {impact.paired} of those areas, we could time a trip to the same
                            hospital at noon and at 2 a.m. on Thursday 19 November. The{' '}
                            <strong>
                                median increase was {(impact.medianExtraSeconds / 60).toFixed(1)}{' '}
                                minutes
                            </strong>
                            . For {impact.journeyCounts[3]} areas, the night trip took at least 20
                            minutes longer.
                        </p>
                        <Bars
                            caption={`Change in journey time from noon to 2 a.m., by number of neighbourhoods (${impact.paired} total)`}
                            rows={labels.map((label, i) => ({
                                label,
                                value: impact.journeyCounts[i]
                            }))}
                        />
                    </div>
                </div>
                <div className="impact-wait">
                    <h3>The longest wait between buses</h3>
                    <p>
                        The median wait to change buses was{' '}
                        <strong>{duration(impact.medianTransferSeconds)}</strong> across the{' '}
                        {impact.paired} night journeys. The longest was{' '}
                        <strong>
                            {duration(impact.longestTransferSeconds)} at {impact.longestWaitStop}
                        </strong>{' '}
                        for the 176 to King’s. With another {duration(impact.firstWaitSeconds)}{' '}
                        waiting for the first bus, that is almost an hour of the trip spent waiting.
                    </p>
                </div>
            </div>
        </section>
    );
}
