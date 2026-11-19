import { createFileRoute } from '@tanstack/react-router';

import { ScrollStory } from '../features/hospital-bus/scroll-story';

export const Route = createFileRoute('/control')({
    validateSearch: (search) => ({ map: search.map === true || search.map === 'true' }),
    component: Control
});

function Control() {
    return <ScrollStory controller showMap={Route.useSearch().map} />;
}
