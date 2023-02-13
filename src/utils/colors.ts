import { COLOR, LOG_LEVEL } from './../enums';

export const LOG_LEVEL_COLORS = {
  [LOG_LEVEL.DEBUG]: COLOR.BLUE,
  [LOG_LEVEL.INFO]: COLOR.GREEN,
  [LOG_LEVEL.WARN]: COLOR.YELLOW,
  [LOG_LEVEL.ERROR]: COLOR.RED,
  [LOG_LEVEL.FATAL]: COLOR.WHITE
};

export const colorize = (color: COLOR, text: string) => `${color}${text}${COLOR.RESET}`;
