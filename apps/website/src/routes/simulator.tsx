import { createFileRoute } from '@tanstack/react-router';

import '../features/hospital-bus/story.css';

export const Route = createFileRoute('/simulator')({
    component: Simulator
});

function Simulator() {
    return (
        <main className="night-simulator">
            <h1>Data Observatory wall preview</h1>
            <p>
                Scroll the chapter text in the controller. The six screens together show the same
                chapter, findings or references.
            </p>
            <div className="night-simulator-workspace">
                <iframe
                    className="night-simulator-controller"
                    title="Scroll controller"
                    src="/control"
                />
                <div className="night-simulator-wall" aria-label="Three-by-two wall preview">
                    {Array.from({ length: 6 }, (_, index) => {
                        const row = Math.floor(index / 3);
                        const col = index % 3;
                        return (
                            <iframe
                                key={index}
                                title={`Screen row ${row + 1}, column ${col + 1}`}
                                src={`/screen?c=${col}&r=${row}&cols=3&rows=2`}
                            />
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
