import { createFileRoute } from '@tanstack/react-router';

import { WallTile, type Tile } from '../features/hospital-bus/wall';

function bounded(value: unknown, fallback: number, low: number, high: number) {
    const coordinate = typeof value === 'string' || typeof value === 'number' ? Number(value) : NaN;
    return Number.isInteger(coordinate) ? Math.min(high, Math.max(low, coordinate)) : fallback;
}

export const Route = createFileRoute('/screen')({
    validateSearch: (search): Tile => {
        const cols = bounded(search.cols, 16, 1, 16);
        const rows = bounded(search.rows, 4, 1, 4);
        return {
            cols,
            rows,
            c: bounded(search.c, 0, 0, cols - 1),
            r: bounded(search.r, 0, 0, rows - 1)
        };
    },
    component: WallScreen
});

function WallScreen() {
    return <WallTile {...Route.useSearch()} />;
}
