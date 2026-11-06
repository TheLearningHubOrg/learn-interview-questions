/**
 * Shared motion language from freshcart-landing:
 *  - Easing curves for smooth deceleration
 *  - Spring transitions for responsive micro-interactions
 */
export const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
export const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

export const motionVariants = {
  fadeUp: 'animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out',
  fadeIn: 'animate-in fade-in duration-300',
  slideRight: 'animate-in slide-in-from-right duration-300',
  scaleUp: 'transition-transform duration-200 active:scale-95',
};
