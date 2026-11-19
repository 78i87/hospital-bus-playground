import { createFileRoute } from '@tanstack/react-router';

import '../features/hospital-bus/story.css';

export const Route = createFileRoute('/simulator')({
    validateSearch: (search) => ({ full: search.full === true || search.full === 'true' }),
    component: Simulator
});

function Simulator() {
    const { full } = Route.useSearch();
    const cols = full ? 16 : 3;
    const rows = full ? 4 : 2;
    return (
        <main className="night-simulator">
            <h1>Data Observatory wall preview</h1>
            <p>
                Scroll inside the controller to move the wall. Showing {cols} columns × {rows} rows.{' '}
                <a href={full ? '/simulator' : '/simulator?full=true'}>
                    {full ? 'View six-screen preview' : 'View full 16 × 4 wall'}
                </a>
            </p>
            <div className="night-simulator-workspace">
                <iframe
                    className="night-simulator-controller"
                    title="Scroll controller"
                    src="/control"
                />
                <div
                    className="night-simulator-wall"
                    style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
                    aria-label={`${cols} by ${rows} wall preview`}
                >
                    {Array.from({ length: cols * rows }, (_, index) => {
                        const row = Math.floor(index / cols);
                        const col = index % cols;
                        return (
                            <iframe
                                key={index}
                                title={`Screen row ${row + 1}, column ${col + 1}`}
                                src={`/screen?c=${col}&r=${row}&cols=${cols}&rows=${rows}`}
                            />
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
