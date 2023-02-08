import { COLOR } from './../enums';

export const colorize = (color: COLOR, text: string) => `${color}${text}${COLOR.RESET}`