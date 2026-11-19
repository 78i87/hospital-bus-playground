import { useEffect, useRef } from 'react';

type Renderer = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    resized: boolean
) => void;

/** Keep the previous frame visible until its replacement has been painted. */
export function useCanvas(render: Renderer) {
    const ref = useRef<HTMLCanvasElement>(null);
    const renderer = useRef(render);
    const requestPaint = useRef<(() => void) | null>(null);

    useEffect(() => {
        renderer.current = render;
        requestPaint.current?.();
    }, [render]);

    useEffect(() => {
        const canvas = ref.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return;
        let frame = 0;
        let previous: { width: number; height: number; pixelRatio: number } | null = null;
        let painted: Renderer | null = null;

        const paint = () => {
            frame = 0;
            const bounds = canvas.getBoundingClientRect();
            const width = Math.max(1, bounds.width);
            const height = Math.max(1, bounds.height);
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
            const resized =
                !previous ||
                previous.width !== width ||
                previous.height !== height ||
                previous.pixelRatio !== pixelRatio;
            if (!resized && painted === renderer.current) return;

            const pixelsWide = Math.max(1, Math.round(width * pixelRatio));
            const pixelsHigh = Math.max(1, Math.round(height * pixelRatio));
            // Setting either attribute clears the canvas, even if its value is unchanged.
            if (canvas.width !== pixelsWide) canvas.width = pixelsWide;
            if (canvas.height !== pixelsHigh) canvas.height = pixelsHigh;
            context.setTransform(pixelsWide / width, 0, 0, pixelsHigh / height, 0, 0);
            renderer.current(context, width, height, resized);
            previous = { width, height, pixelRatio };
            painted = renderer.current;
        };

        const queue = () => {
            if (!frame) frame = requestAnimationFrame(paint);
        };
        requestPaint.current = queue;
        const observer = new ResizeObserver(queue);
        observer.observe(canvas);
        window.addEventListener('resize', queue);
        queue();
        return () => {
            requestPaint.current = null;
            observer.disconnect();
            window.removeEventListener('resize', queue);
            cancelAnimationFrame(frame);
        };
    }, []);

    return ref;
}
