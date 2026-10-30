import { EventData } from '../types';
import { weddingEvent } from './weddingEvent';
import { birthdayEvent } from './birthdayEvent';
import { galaEvent } from './galaEvent';

export const INITIAL_EVENTS: EventData[] = [
  weddingEvent,
  birthdayEvent,
  galaEvent,
];

export { weddingEvent, birthdayEvent, galaEvent };
