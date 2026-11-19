import { createFileRoute } from '@tanstack/react-router';

import { ScrollStory } from '../features/hospital-bus/scroll-story';

export const Route = createFileRoute('/')({
    component: ScrollStory
});
