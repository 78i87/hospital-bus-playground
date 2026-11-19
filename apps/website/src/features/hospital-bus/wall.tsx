import { useCallback, useEffect, useRef, useState } from 'react';

import { useWallChapter } from './chapter-bus';
import { Evidence } from './evidence';
import { Findings } from './findings';
import { palette, drawMap, mapScenes } from './map';
import { authorName, chapters, findingsView, openingTitle } from './story';
import { bands, departures, mapURL, type Departure } from './travel-map';
import { useCanvas } from './use-canvas';

import './story.css';

const TILE_WIDTH = 1920;
const TILE_HEIGHT = 1080;

export type Tile = { c: number; r: number; cols: number; rows: number };

function wrap(
    ctx: CanvasRenderingContext2D,
    content: string,
    x: number,
    y: number,
    width: number,
    lineHeight: number
): number {
    let text = '';
    for (const word of content.split(' ')) {
        const joined = text ? `${text} ${word}` : word;
        if (text && ctx.measureText(joined).width > width) {
            ctx.fillText(text, x, y);
            y += lineHeight;
            text = word;
        } else {
            text = joined;
        }
    }
    if (text) ctx.fillText(text, x, y);
    return y + lineHeight;
}

function drawWall(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    chapter: number,
    redrawMap: boolean,
    time: Departure,
    mapImage?: HTMLImageElement
) {
    const item = chapters[chapter];
    const inner = Math.min(w * 0.9, h * 2.65);
    const left = (w - inner) / 2;
    const mapX = left + inner * 0.52;
    const mapY = h * 0.23,
        mapW = inner * 0.48,
        mapH = h * 0.56;
    // Keep the route in place while the words change.
    ctx.fillStyle = palette.paper;
    ctx.fillRect(0, 0, w, mapY);
    ctx.fillRect(0, mapY, mapX, mapH);
    ctx.fillRect(mapX + mapW, mapY, w - mapX - mapW, mapH);
    ctx.fillRect(0, mapY + mapH, w, h - mapY - mapH);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = palette.ink;
    ctx.font = `${h * 0.03}px Georgia, serif`;
    ctx.fillText(authorName, left, h * 0.055);
    ctx.fillStyle = palette.rule;
    ctx.fillRect(left, h * 0.11, inner, h * 0.0015);
    const copyWidth = inner * 0.49;
    let bodyY = h * 0.24;
    if (chapter === 0) {
        const titleSize = Math.min(h * 0.083, inner * 0.042);
        ctx.fillStyle = palette.ink;
        ctx.font = `${titleSize}px Georgia, serif`;
        const y = wrap(ctx, openingTitle.lead, left, h * 0.19, copyWidth, titleSize * 1.04);
        ctx.fillStyle = palette.red;
        ctx.font = `italic ${titleSize}px Georgia, serif`;
        bodyY = wrap(ctx, openingTitle.emphasis, left, y, copyWidth, titleSize * 1.04) + h * 0.045;
    }
    ctx.fillStyle = palette.ink;
    const bodySize = h * (chapter === 0 ? 0.03 : 0.034);
    ctx.font = `${bodySize}px Arial, sans-serif`;
    for (const paragraph of item.paragraphs) {
        bodyY =
            wrap(ctx, paragraph, left, bodyY, copyWidth * 0.95, bodySize * 1.38) + bodySize * 0.63;
    }
    if (redrawMap) {
        ctx.save();
        ctx.translate(mapX, mapY);
        if (chapter < 2) {
            ctx.fillStyle = palette.paper;
            ctx.fillRect(0, 0, mapW, mapH);
            ctx.fillStyle = palette.ink;
            ctx.font = `${h * 0.029}px Georgia, serif`;
            ctx.fillText(`Time to a major trauma hospital · ${departures[time]}`, 0, 0);
            if (mapImage) {
                const scale = Math.min(mapW / mapImage.width, (mapH - h * 0.105) / mapImage.height);
                const imageW = mapImage.width * scale;
                ctx.drawImage(
                    mapImage,
                    (mapW - imageW) / 2,
                    h * 0.05,
                    imageW,
                    mapImage.height * scale
                );
            }
            ctx.font = `${h * 0.018}px Arial, sans-serif`;
            let x = 0;
            for (const [colour, label] of bands) {
                ctx.fillStyle = colour;
                ctx.fillRect(x, mapH - h * 0.029, h * 0.016, h * 0.016);
                ctx.fillStyle = palette.ink;
                ctx.fillText(label, x + h * 0.022, mapH - h * 0.032);
                x += ctx.measureText(label).width + h * 0.042;
            }
        } else {
            drawMap(ctx, mapW, mapH, mapScenes[chapter - 1]);
        }
        ctx.restore();
    }
    ctx.fillStyle = palette.rule;
    ctx.fillRect(left, h * 0.925, inner, h * 0.0015);
    ctx.font = `${h * 0.022}px Arial, sans-serif`;
    ctx.fillStyle = palette.muted;
    ctx.fillText(
        `Chapter ${chapter + 1} of ${chapters.length}  ·  TfL timetable simulation  ·  19 November 2026`,
        left,
        h * 0.946
    );
}

export function WallTile({ c, r, cols, rows }: Tile) {
    const { chapter, night } = useWallChapter();
    const time = night ? 'night' : 'day';
    const [images, setImages] = useState<Partial<Record<Departure, HTMLImageElement>>>({});
    useEffect(() => {
        let active = true;
        for (const period of ['day', 'night'] as const) {
            const image = new Image();
            image.onload = () => {
                if (active) setImages((previous) => ({ ...previous, [period]: image }));
            };
            image.src = mapURL(period);
        }
        return () => {
            active = false;
        };
    }, []);
    const mapImage = images[time];
    const paintedMap = useRef<string | null>(null);
    const render = useCallback(
        (ctx: CanvasRenderingContext2D, width: number, height: number, resized: boolean) => {
            if (chapter >= chapters.length) {
                paintedMap.current = null;
                return;
            }
            const key = `${c},${r},${cols},${rows},${chapter < 2 ? time + Boolean(mapImage) : mapScenes.indexOf(mapScenes[chapter - 1])}`;
            ctx.save();
            // Global coordinates are identical across tiles. The canvas allocation stays local.
            ctx.scale(width / TILE_WIDTH, height / TILE_HEIGHT);
            ctx.translate(-c * TILE_WIDTH, -r * TILE_HEIGHT);
            drawWall(
                ctx,
                cols * TILE_WIDTH,
                rows * TILE_HEIGHT,
                chapter,
                resized || paintedMap.current !== key,
                time,
                mapImage
            );
            ctx.restore();
            paintedMap.current = key;
        },
        [c, r, cols, rows, chapter, time, mapImage]
    );
    const canvas = useCanvas(render);
    const item = chapters[chapter];
    return (
        <main className="night-wall" data-chapter={chapter} data-time={time}>
            <canvas
                ref={canvas}
                style={{ visibility: item ? 'visible' : 'hidden' }}
                role="img"
                aria-label={
                    item &&
                    `${authorName}. ${chapter === 0 ? openingTitle.lead + ' ' + openingTitle.emphasis + ' ' : ''}${item.paragraphs.join(' ')} ${item.alt}`
                }
            />
            {!item && (
                <svg
                    className="wall-notes"
                    viewBox={`${c * TILE_WIDTH} ${r * TILE_HEIGHT} ${TILE_WIDTH} ${TILE_HEIGHT}`}
                    preserveAspectRatio="none"
                >
                    <svg
                        width={cols * TILE_WIDTH}
                        height={rows * TILE_HEIGHT}
                        viewBox="0 0 1240 820"
                    >
                        <foreignObject x="28" y="18" width="1184" height="790">
                            {chapter === findingsView ? <Findings /> : <Evidence />}
                        </foreignObject>
                    </svg>
                </svg>
            )}
        </main>
    );
}
