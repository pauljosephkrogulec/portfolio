// Live state written by the 3D scene every frame and read by the HTML overlay.
// Plain objects (not React state) so the overlay can follow without re-rendering the app.
export const playerState = { x: 0, z: 0, angle: 0 };

// Screen position (CSS pixels) of each room's name tag
export const labelState: Record<string, { x: number; y: number; visible: boolean }> = {};
