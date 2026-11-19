import { data } from './story';

export const palette = {
    paper: '#f8f5ec',
    ink: '#20231f',
    red: '#a92f25',
    muted: '#555950',
    line: '#7a7d70',
    rule: '#c6c4b7'
};
type Diagram = {
    stops: [string[], string[], string[]];
    lines: [string, string];
    change: string;
};
const south: Diagram = {
    stops: [['Tessa Jowell', 'Health Centre'], ['Goose Green'], ['King’s College', 'Hospital']],
    lines: [data.goose.feeder.line, data.goose.receiving.line],
    change: 'Same stop'
};
const downstream: Diagram = {
    stops: [['King’s College', 'Hospital'], ['Lancaster', 'Place'], ['Oxford Circus']],
    lines: ['176', 'N15'],
    change: 'Walk to N15'
};
const east: Diagram = {
    stops: [['Wellclose', 'Street'], ['Aldgate', 'Bus Station'], ['New Road']],
    lines: [data.aldgate.feeder.line, data.aldgate.receiving.line],
    change: 'Change to N15'
};
export const mapScenes = [south, south, south, downstream, east] as const;
export type MapScene = (typeof mapScenes)[number];

type Pen = CanvasRenderingContext2D;
function disc(ctx: Pen, x: number, y: number, radius: number, fill: string) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
}

// Side elevation of a London double-decker. The number identifies the second bus.
function bus(ctx: Pen, centre: number, ground: number, scale: number, route: string) {
    ctx.save();
    ctx.translate(centre - 74 * scale, ground - 61 * scale);
    ctx.scale(scale, scale);
    const box = (
        x: number,
        y: number,
        w: number,
        h: number,
        radius: number | number[],
        colour: string
    ) => {
        ctx.fillStyle = colour;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, radius);
        ctx.fill();
    };
    box(2, 3, 144, 52, [8, 15, 4, 4], palette.red);
    box(5, 7, 135, 17, 4, palette.ink);
    box(8, 29, 130, 19, 2, palette.ink);
    for (const x of [9, 27, 45, 63, 81, 99, 117]) {
        box(x, 9, 14, 12, 1.3, '#e2d8ba');
        box(x + 1, 10, 3, 10, 0.5, '#f4ecd8');
    }
    for (const x of [10, 29, 48, 67]) {
        box(x, 31, 15, 12, 1, '#d8ceb4');
    }
    box(87, 29, 20, 23, 1.5, '#343a34');
    box(90, 31, 6, 17, 1, '#c9bfa4');
    box(99, 31, 5, 17, 1, '#c9bfa4');
    box(110, 28, 32, 19, 2, palette.ink);
    ctx.fillStyle = '#fff4d0';
    ctx.font = 'bold 13px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(route, 126, 38);
    box(2, 51, 143, 4, 2, '#78251e');
    box(139, 48, 6, 2.5, 1, '#fbe7b0');
    for (const x of [30, 119]) {
        disc(ctx, x, 53, 8, palette.ink);
        disc(ctx, x, 53, 3.6, '#b3ad99');
        disc(ctx, x, 53, 1.6, palette.ink);
    }
    ctx.restore();
}

function badge(ctx: Pen, x: number, y: number, value: string, unit: number, colour: string) {
    ctx.font = `bold ${unit * 0.78}px Arial, sans-serif`;
    const w = ctx.measureText(value).width + unit * 0.82;
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - unit * 0.63, w, unit * 1.26, unit * 0.26);
    ctx.fill();
    ctx.fillStyle = palette.paper;
    ctx.fillText(value, x, y + unit * 0.055);
}

export function drawMap(ctx: Pen, width: number, height: number, scene: MapScene) {
    ctx.save();
    ctx.fillStyle = palette.paper;
    ctx.fillRect(0, 0, width, height);
    const u = Math.min(width / (width < 520 ? 26 : 39), height / 9.4);
    const x = [width * 0.123, width * 0.5, width * 0.877];
    const base = height * 0.53;
    const rise = u * 1.08;
    const y = [base + rise, base, base - rise];
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const side of [0, 1]) {
        const start = x[side],
            end = x[side + 1];
        ctx.strokeStyle = side === 0 ? palette.line : palette.red;
        ctx.lineWidth = u * 0.27;
        const bend = start + (end - start) * 0.39;
        ctx.beginPath();
        ctx.moveTo(start, y[side]);
        ctx.lineTo(bend, y[side]);
        ctx.lineTo(bend + rise, y[side + 1]);
        ctx.lineTo(end, y[side + 1]);
        ctx.stroke();
        const bx = start + (end - start) * 0.7;
        badge(ctx, bx, y[side + 1], scene.lines[side], u, side === 0 ? '#585e53' : palette.red);
        if (side === 1) bus(ctx, bx, y[2] - u * 0.8, u * 0.071, scene.lines[1]);
    }
    for (let i = 0; i < 3; i++) {
        disc(ctx, x[i], y[i], u * (i === 1 ? 0.63 : 0.35), i === 0 ? palette.line : palette.red);
        disc(ctx, x[i], y[i], u * (i === 1 ? 0.44 : 0.17), palette.paper);
        if (i === 1) disc(ctx, x[i], y[i], u * 0.21, palette.red);
        const labels = scene.stops[i];
        const labelY = y[i] + u * 1.2;
        ctx.font = `${i === 1 ? 'bold' : '500'} ${u * 0.95}px Arial, sans-serif`;
        ctx.fillStyle = palette.ink;
        labels.forEach((label, n) => ctx.fillText(label, x[i], labelY + n * u * 1.03));
        if (i === 1 || (i === 2 && scene === east)) {
            ctx.font = `italic ${u * 0.83}px Georgia, serif`;
            ctx.fillStyle = palette.red;
            ctx.fillText(
                i === 1 ? scene.change : 'Walk to hospital',
                x[i],
                labelY + labels.length * u * 1.05
            );
        }
    }
    ctx.restore();
}
