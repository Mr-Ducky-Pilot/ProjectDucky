/**
 * Motion presets used across Ducky. Centralized so the whole app feels
 * cohesively bouncy/friendly without each component reinventing easing curves.
 */
export const SPRING_BOUNCY = { stiffness: 0.18, damping: 0.45 } as const;
export const SPRING_GENTLE = { stiffness: 0.08, damping: 0.6 } as const;
export const SPRING_POP = { stiffness: 0.32, damping: 0.55 } as const;

export const TWEEN_FAST = 180;
export const TWEEN_NORMAL = 320;
export const TWEEN_SLOW = 600;
