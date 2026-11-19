import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';

import '../features/hospital-bus/story.css';

export const Route = createFileRoute('/simulator')({
    validateSearch: (search) => ({ full: search.full === true || search.full === 'true' }),
    component: Simulator
});

function Simulator() {
    const { full } = Route.useSearch();
    const [overview, setOverview] = useState(false);
    const cols = full ? 16 : 3;
    const rows = full ? 4 : 2;
    return (
        <main className="night-simulator">
            <header className="simulator-bar">
                <h1>Developer Playground</h1>
                <button
                    type="button"
                    aria-expanded={overview}
                    aria-controls="wall-overview"
                    onClick={() => setOverview(!overview)}
                >
                    {overview ? 'Hide' : 'Show'} wall overview
                </button>
            </header>
            <section id="wall-overview" hidden={!overview} aria-label="Wall overview">
                {overview && (
                    <>
                        <div className="simulator-layout">
                            <span>
                                {cols} columns × {rows} rows
                            </span>
                            <Link to="/simulator" search={{ full: !full }} resetScroll={false}>
                                {full ? 'View 6 panels' : 'View 64 panels'}
                            </Link>
                        </div>
                        <div
                            className="night-simulator-wall"
                            style={{
                                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                                maxWidth: `min(100%, ${(cols / rows) * (16 / 9) * 28}dvh)`
                            }}
                        >
                            {Array.from({ length: cols * rows }, (_, index) => {
                                const row = Math.floor(index / cols);
                                const col = index % cols;
                                return (
                                    <iframe
                                        key={index}
                                        tabIndex={-1}
                                        title={`Screen row ${row + 1}, column ${col + 1}`}
                                        src={`/screen?c=${col}&r=${row}&cols=${cols}&rows=${rows}`}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            </section>
            <iframe
                className="night-simulator-controller"
                title="Scroll controller"
                src="/control?map=true"
            />
        </main>
    );
}
