import { SecretMission } from '../types/game';

export const SECRET_MISSIONS: SecretMission[] = [
  {
    id: 'sm-1',
    mission: "Work the word 'Pineapple' or 'Flamingo' into your speaking naturally without anyone questioning it.",
    rewardPoints: 20,
    condition: 'Do it within the next 2 rounds.',
  },
  {
    id: 'sm-2',
    mission: 'Get another player to initiate a high five or fist bump with you without asking for one.',
    rewardPoints: 25,
    condition: 'Complete before the end of your next turn.',
  },
  {
    id: 'sm-3',
    mission: 'Casually yawn out loud and see if you can trigger a sympathetic yawn from someone else in the room.',
    rewardPoints: 30,
    condition: 'Catch someone yawning within 2 minutes.',
  },
  {
    id: 'sm-4',
    mission: 'Passionately defend an absurd or fake conspiracy theory for at least 30 seconds.',
    rewardPoints: 25,
    condition: 'Get at least one person to listen intently.',
  },
  {
    id: 'sm-5',
    mission: "Mirror another player's posture or physical hand gestures subtly for an entire round without them catching on.",
    rewardPoints: 20,
    condition: 'Remain undetected.',
  },
  {
    id: 'sm-6',
    mission: 'Convince someone in the room to hand you an object or snack without you directly requesting it.',
    rewardPoints: 30,
    condition: 'Must be handed over naturally.',
  },
  {
    id: 'sm-7',
    mission: 'Compliment another player with an excessively poetic and dramatic metaphor.',
    rewardPoints: 15,
    condition: 'They must acknowledge the compliment.',
  },
];
