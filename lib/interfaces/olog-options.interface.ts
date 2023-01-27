import { LOG_LEVEL } from './../enums/log-level.enum';

export interface DecoratorOptions {
    level: LOG_LEVEL
}

export interface LogOptions {
    functionName?: string;
}