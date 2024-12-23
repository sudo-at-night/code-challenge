// This could be generated from the database with TypeScript,

import { createEvent } from '@src/database/data/events/events'

export const registerEvent = createEvent

// but I'd rather not complicate the code that much here.
export const EVENT_TYPES = ['consent'] as const

type EVENT_DATA_CONSENT = {
  type: 'consent'
  consentId: 'email_notifications' | 'sms_notifications'
  enabled: boolean
}

// Here we can add more event types we want to support.
export type EVENT_DATA = EVENT_DATA_CONSENT

export class EventValidationError extends Error {
  constructor(message: Error['message']) {
    super(message)
    this.name = 'EventValidationError'
  }
}

const validateConsentEvent = (event: EVENT_DATA_CONSENT) => {
  // This could use some tool like Yup to validate against
  if (!event.consentId || typeof event.enabled === undefined) {
    throw new EventValidationError('Incorret consent event data')
  }
}

export const validateEvent = (event: EVENT_DATA) => {
  if (!EVENT_TYPES.includes(event.type)) {
    throw new EventValidationError('Incorrect event type')
  }

  if (event.type === 'consent') {
    validateConsentEvent(event)
  }
}
