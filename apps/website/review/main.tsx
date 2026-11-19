import { createRoot } from 'react-dom/client';

import '../src/style.css';
import { ScrollStory } from '../src/features/hospital-bus/scroll-story';

createRoot(document.getElementById('root')!).render(<ScrollStory />);
