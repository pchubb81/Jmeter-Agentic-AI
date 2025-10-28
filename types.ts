export enum AgentType {
  LoadRunner,
  JMeter,
  CustomAI,
  Claude,
}

export enum TestStatus {
  Idle = 'Idle',
  Running = 'Running',
  Completed = 'Completed',
  Failed = 'Failed',
}