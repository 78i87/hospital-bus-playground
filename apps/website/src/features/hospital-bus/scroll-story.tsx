import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { chapterEngine } from './chapter-bus';
import { Evidence } from './evidence';
import { Findings } from './findings';
import { drawMap, mapScenes, type MapScene } from './map';
import { authorName, chapters, findingsView, referencesView, openingTitle } from './story';
import { TravelMap, TimeSwitch, type Departure } from './travel-map';
import { useCanvas } from './use-canvas';

import './story.css';

const RouteDiagram = memo(function RouteDiagram({ scene }: { scene: MapScene }) {
    const paint = useCallback(
        (ctx: CanvasRenderingContext2D, w: number, h: number) => drawMap(ctx, w, h, scene),
        [scene]
    );
    const ref = useCanvas(paint);
    return <canvas ref={ref} className="route-diagram" />;
});

function Poster({
    chapter,
    showMap,
    progress,
    time,
    change
}: {
    time: Departure;
    change: (value: Departure) => void;
    chapter: number;
    showMap: boolean;
    progress: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <>
            <header className="night-byline">
                <span>{authorName}</span>
                {!showMap && chapter < 2 && <TimeSwitch time={time} change={change} />}
            </header>
            {showMap && chapter < 2 && (
                <div className="poster-map travel-poster">
                    <TravelMap time={time} change={change} />
                </div>
            )}
            {showMap && chapter >= 2 && (
                <div className="poster-map" role="img" aria-label={chapters[chapter].alt}>
                    <RouteDiagram scene={mapScenes[chapter - 1]} />
                </div>
            )}
            <div className="night-foot">
                <span className="night-scroll">
                    Chapter {chapter + 1} of {chapters.length}
                </span>
                <div ref={progress} className="night-progress">
                    <i className="night-progress-pin" />
                </div>
                <span className="night-cue">
                    {chapter === chapters.length - 1
                        ? 'Scroll for the findings ↓'
                        : 'Scroll to continue ↓'}
                </span>
            </div>
        </>
    );
}

export function ScrollStory({
    controller = false,
    showMap = !controller
}: {
    controller?: boolean;
    showMap?: boolean;
}) {
    const [chapter, setChapter] = useState(0);
    const [time, change] = useState<Departure>('day');
    useEffect(() => {
        if (controller) chapterEngine('control').publish(chapter, time);
    }, [controller, chapter, time]);
    const findings = useRef<HTMLDivElement>(null);
    const references = useRef<HTMLDivElement>(null);
    const progress = useRef<HTMLDivElement>(null);
    const sections = useRef<Array<HTMLElement | null>>([]);
    useEffect(() => {
        let latest = -1,
            frame = 0;
        const update = () => {
            frame = 0;
            const steps = sections.current;
            const first = steps[0];
            if (!first) return;
            const centreY = window.innerHeight / 2;
            const tail =
                references.current && references.current.getBoundingClientRect().top <= centreY
                    ? referencesView
                    : findings.current && findings.current.getBoundingClientRect().top <= centreY
                      ? findingsView
                      : undefined;
            if (tail !== undefined) {
                latest = tail;
                setChapter(tail);
                return;
            }
            const centre = (step: HTMLElement) => step.offsetTop + step.offsetHeight / 2;
            const focus = window.scrollY + centre(first);
            let position = 0;
            let distance = first.offsetHeight;
            for (let i = 1; i < steps.length; i++) {
                const previous = steps[i - 1],
                    next = steps[i];
                if (!previous || !next) continue;
                distance = centre(next) - centre(previous);
                position = i - 1 + Math.max(0, Math.min(1, (focus - centre(previous)) / distance));
                if (focus <= centre(next)) break;
            }
            progress.current?.style.setProperty(
                '--story-progress',
                `${(position / (chapters.length - 1)) * 100}%`
            );
            const current = Math.round(position);
            if (current === latest) return;
            // A trackpad can oscillate a few pixels around the midpoint after a gesture.
            // The copy and the progress marker still follow every pixel above.
            if (latest >= 0 && Math.abs(current - latest) === 1) {
                const midpoint = (latest + current) / 2;
                if (Math.abs(position - midpoint) * distance < 8) return;
            }
            latest = current;
            setChapter(current);
        };
        const queue = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        window.addEventListener('scroll', queue, { passive: true });
        window.addEventListener('resize', queue);
        queue();
        return () => {
            window.removeEventListener('scroll', queue);
            window.removeEventListener('resize', queue);
            cancelAnimationFrame(frame);
        };
    }, [controller]);

    return (
        <main className={`night-story ${showMap ? '' : 'night-controller'}`} data-chapter={chapter}>
            <div className="night-transcript" role="status" aria-atomic="true">
                {chapters[chapter]?.location ??
                    (chapter === findingsView ? 'Findings' : 'Methods and sources')}
            </div>
            <div hidden={chapter >= chapters.length}>
                <Poster
                    chapter={Math.min(chapter, chapters.length - 1)}
                    showMap={showMap}
                    progress={progress}
                    time={time}
                    change={change}
                />
            </div>
            <div className="night-roll">
                {chapters.map((item, index) => {
                    return (
                        <section
                            className="night-step"
                            key={item.id}
                            id={item.id}
                            ref={(el) => {
                                sections.current[index] = el;
                            }}
                        >
                            <div className="poster-heading">
                                {index === 0 && (
                                    <h1 className="poster-title">
                                        {openingTitle.lead} <em>{openingTitle.emphasis}</em>
                                    </h1>
                                )}
                                <div className="night-body">
                                    {item.paragraphs.map((paragraph, i) => (
                                        <p key={i}>
                                            {paragraph
                                                .split(
                                                    /(\d+(?:\.\d+)? to \d+(?:\.\d+)? minutes|\d{2}:\d{2} to \d{2}:\d{2}|\d+ minutes? \d+ seconds|\d+(?: minutes| seconds)|\d+ transfers)/g
                                                )
                                                .map((part, j) =>
                                                    j % 2 ? <strong key={j}>{part}</strong> : part
                                                )}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </section>
                    );
                })}
            </div>
            <div ref={findings}>
                <Findings />
            </div>
            <div ref={references}>
                <Evidence />
            </div>
        </main>
    );
}
