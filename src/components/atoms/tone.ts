/**
 * Semantic colour tones available to presentational components.
 * Each tone maps 1:1 onto a key of `theme.palette.signal`, so components never
 * name a colour — only its meaning.
 */
export type SignalTone = 'online' | 'offline' | 'warning' | 'danger' | 'idle' | 'active';
