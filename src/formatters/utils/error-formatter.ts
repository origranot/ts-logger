import { COLOR } from '../../enums';
import { colorize } from '../../utils';

export const formatError = (error: Error): string => {
  const stackWithoutHeader = error.stack ? error.stack.split('\n').slice(1).join('\n') : '';
  let errorString = `${colorize(COLOR.BG_RED, error.name)} ${error.message}`;
  errorString += error.stack ? `\n${colorizeBulletsInStack(stackWithoutHeader)}` : '';

  return errorString;
};

const colorizeBulletsInStack = (stack: string) => {
  return stack.replace(/at/g, colorize(COLOR.YELLOW, 'at'));
};
