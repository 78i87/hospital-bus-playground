import timetable from './timetable.json';

export const data = timetable;
const { goose, oxford, aldgate } = data;

function clock(seconds: number, exact = false) {
    const parts = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60];
    return parts
        .slice(0, exact ? 3 : 2)
        .map((part) => String(part).padStart(2, '0'))
        .join(':');
}

const gap = goose.receiving.departure - goose.feeder.arrival;

export const authorName = 'Siu Mo (Morgan) Ye';
export const openingTitle = { lead: 'Could 87 seconds', emphasis: 'save half an hour?' };

const transferBeforeHold = oxford.departures[0] - oxford.feederArrival - oxford.walk;

export const chapters = [
    {
        id: 'question',
        location: 'Southwark',
        paragraphs: [
            'At noon, the 42 runs straight from the black dot in Southwark to King’s College Hospital. At 2 a.m., you take the 37 and change to the 176 at Goose Green.',
            `If you miss that 176, the next one is due half an hour later. What would happen if the driver waited for passengers coming off the 37?`
        ],
        alt: 'A London travel-time map marks the starting point in Southwark and King’s College Hospital.'
    },
    {
        id: 'travel-map',
        location: 'Greater London',
        paragraphs: [
            'At 2 a.m., fewer neighbourhoods have a route to a major trauma hospital within two hours. The count falls from 3,630 at noon to 3,191. Among the places with a route at both times, most have a quicker trip at 2 a.m.',
            'For 54 neighbourhoods, the trip takes at least 20 minutes longer. The black dot marks one of them. From here, reaching King’s takes 22 minutes at noon and 73 minutes at 2 a.m.'
        ],
        alt: 'London neighbourhoods coloured by scheduled travel time to the quickest of four major trauma hospitals.'
    },
    {
        id: 'connection',
        location: 'Goose Green',
        paragraphs: [
            'You leave Southwark at 2 a.m. for King’s College Hospital. The first bus, the 37, takes you to Goose Green. There, you need to get off at stop J and catch the 176 from the same stop.',
            `TfL schedules the 37 to arrive at ${clock(goose.feeder.arrival, true)} and the 176 to leave at ${clock(goose.receiving.departure, true)}. That leaves ${gap} seconds to change. If the 37 is even a minute late and the 176 leaves on time, you miss it.`
        ],
        alt: 'The 37 arrives and the 176 departs at Goose Green stop J. Both buses use the same boarding point.'
    },
    {
        id: 'hold',
        location: 'Goose Green',
        paragraphs: [
            `Suppose your 37 reaches Goose Green just after the 176 pulls away. You’d have to wait until ${clock(goose.nextDeparture)} for the next one, about half an hour.`,
            `We tested holding the ${clock(goose.receiving.departure)} bus for ${goose.holdSeconds} seconds. That puts its departure two minutes after the 37’s scheduled arrival. If you catch it, you get off at King’s College Hospital. Your trip ends there. In the simulation, the hold cuts your journey from ${(goose.nightSeconds / 60).toFixed(1)} to ${((goose.nightSeconds - goose.saveSeconds) / 60).toFixed(1)} minutes.`
        ],
        alt: 'The route stays the same. In the simulation, the 176 waits at Goose Green before continuing to King’s College Hospital.'
    },
    {
        id: 'downstream',
        location: 'Lancaster Place',
        paragraphs: [
            `However, the same ${goose.holdSeconds}-second hold that gets you to King’s sooner could make another passenger miss their connection. They stay on the 176 past the hospital and get off at Lancaster Place to catch the N15 to Oxford Circus.`,
            `After walking to the N15 stop, they now have ${transferBeforeHold - goose.holdSeconds} seconds to board. They had just over two minutes before. With our two-minute allowance, they miss that N15 and reach Oxford Circus at ${clock(oxford.arrivals[1])} instead of ${clock(oxford.arrivals[0])}. This is one of ${oxford.missedPairs} transfers affected.`
        ],
        alt: 'Follow the 176 past the hospital to Lancaster Place. A different passenger walks to the N15 for Oxford Circus.'
    },
    {
        id: 'conclusion',
        location: 'Aldgate',
        paragraphs: [
            `At Aldgate, holding the N15 for ${aldgate.holdSeconds} seconds gives riders on the N551 two minutes to change. From two Tower Hamlets neighbourhoods, catching that bus gets them to the Royal London Hospital ${Math.floor(aldgate.saveSeconds / 60)} minute ${aldgate.saveSeconds % 60} seconds earlier.`,
            `Every other connection we tested still works. Riders already on the N15 would wait the extra ${aldgate.holdSeconds} seconds.`
        ],
        alt: 'One of the two journeys starts at Wellclose Street. Take the N551 to Aldgate, change to the N15 for New Road, then walk to the Royal London Hospital.'
    }
] as const;

export const findingsView = chapters.length;
export const referencesView = findingsView + 1;

export function validChapter(value: unknown): value is number {
    return (
        typeof value === 'number' &&
        Number.isInteger(value) &&
        value >= 0 &&
        value <= referencesView
    );
}
