import { loadFont as loadBebas } from '@remotion/google-fonts/BebasNeue';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';

export const { fontFamily: bebas } = loadBebas();
export const { fontFamily: montserrat } = loadMontserrat('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});
