import { Store, useStore } from '@tanstack/react-store';
import { useEffect } from 'react';

import { BusEngine } from '../../lib/realtime/engines/bus-engine';
import {
    createInitialEngineStoreState,
    type BusMessage,
    type EngineRole,
    type HelloBusMessage
} from '../../lib/realtime/types';
import { validChapter } from './story';
import type { Departure } from './travel-map';

function chapterStore(role: EngineRole) {
    return new Store({ ...createInitialEngineStoreState(role), chapter: 0, night: false });
}

const screenStore = chapterStore('screen');

class ChapterEngine extends BusEngine<ReturnType<typeof chapterStore>['state']> {
    private pending: { chapter: number; time: Departure } | null = null;

    constructor(role: EngineRole) {
        super(role, role === 'screen' ? screenStore : chapterStore(role));
    }

    publish(chapter: number, time: Departure) {
        if (this.store.state.connection !== 'open') {
            this.pending = { chapter, time };
            return;
        }
        this.send({ type: 'story/chapter', chapter, night: time === 'night' });
    }

    protected override onMessage(message: BusMessage) {
        if (message.type === 'story/chapter' && validChapter(message.chapter)) {
            this.setChapter(message.chapter, message.night === true);
        }
    }

    protected override onHello(message: HelloBusMessage) {
        const chapter = message.state?.chapter;
        if (validChapter(chapter)) this.setChapter(chapter, message.state?.night === true);
        if (this.pending !== null) {
            const pending = this.pending;
            this.pending = null;
            this.publish(pending.chapter, pending.time);
        }
    }

    private setChapter(chapter: number, night: boolean) {
        this.store.setState((state) =>
            state.chapter === chapter && state.night === night
                ? state
                : { ...state, chapter, night }
        );
    }
}

const engines: Partial<Record<EngineRole, ChapterEngine>> = {};

export function chapterEngine(role: EngineRole) {
    return (engines[role] ??= new ChapterEngine(role));
}

export function useWallChapter() {
    useEffect(() => {
        chapterEngine('screen');
    }, []);
    const chapter = useStore(screenStore, (state) => state.chapter);
    const night = useStore(screenStore, (state) => state.night);
    return { chapter, night };
}
