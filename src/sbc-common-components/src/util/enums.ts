export enum OutageMessages {
  maintenance = 'serviceMaintenanceMessage',
  outage = 'serviceScheduledOutageMessage',
  emergence = 'serviceEmergenceMessage'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  REJECTED = 'REJECTED',
  PENDING_STAFF_REVIEW = 'PENDING_STAFF_REVIEW',
  PENDING_ACTIVATION = 'PENDING_ACTIVATION',
  NSF_SUSPENDED = 'NSF_SUSPENDED',
  SUSPENDED = 'SUSPENDED'
}

export enum LDFlags {
  WhatsNew = 'whats-new',
  DisableBCEIDMultipleAccount ='disable-bceid-multiple-account'
}
