import { describe, it, expect, beforeEach } from 'vitest';
import { SubmissionService } from '../services/submissionService';
import { AdminService } from '../services/adminService';
import { getPromptsForGame } from '../data/prompts';

describe('Community Submissions & Moderation Workflow', () => {
  let submissionService: SubmissionService;
  let adminService: AdminService;

  beforeEach(() => {
    localStorage.clear();
    submissionService = new SubmissionService();
    adminService = new AdminService();
  });

  it('saves submissions with pending status initially', async () => {
    const sub = await submissionService.submitPrompt(
      'truth-or-dare',
      'medium',
      'What is the most awkward lie you ever told a colleague?',
      'user_123',
      'CreativePlayer',
      { type: 'truth' }
    );

    expect(sub.status).toBe('pending');
    expect(sub.submitterUsername).toBe('CreativePlayer');

    // Confirm it is in pending list
    const all = await adminService.getAllSubmissions();
    expect(all.find(s => s.id === sub.id)?.status).toBe('pending');
  });

  it('publishes approved submissions directly into the official game prompt pool', async () => {
    const sub = await submissionService.submitPrompt(
      'hot-takes',
      'medium',
      'Pineapple on burgers is a criminal offense in any civilized kitchen.',
      'user_999',
      'FoodieCritic'
    );

    await adminService.approveSubmission(sub.id);

    // Verify submission is approved
    const all = await adminService.getAllSubmissions();
    expect(all.find(s => s.id === sub.id)?.status).toBe('approved');

    // Verify prompt appears in the official game pool for Hot Takes
    const gamePrompts = await adminService.getAllPromptsForManager('hot-takes', 'medium');
    const published = gamePrompts.find(p => p.id === 'approved_' + sub.id);
    expect(published).toBeDefined();
    expect(published?.text).toBe(sub.text);
    expect(published?.authorUsername).toBe('FoodieCritic');
  });

  it('records reason when rejected and does not publish to official games', async () => {
    const sub = await submissionService.submitPrompt(
      'never-have-i-ever',
      'easy',
      'Never have I ever worn socks that did not match by accident.',
      'user_bad',
      'SpamUser'
    );

    await adminService.rejectSubmission(sub.id, 'Too generic');

    const all = await adminService.getAllSubmissions();
    const rejected = all.find(s => s.id === sub.id);
    expect(rejected?.status).toBe('rejected');
    expect(rejected?.moderationReason).toBe('Too generic');

    // Verify it is NOT published to official prompts
    const gamePrompts = await adminService.getAllPromptsForManager('never-have-i-ever', 'easy');
    expect(gamePrompts.find(p => p.id === 'approved_' + sub.id)).toBeUndefined();
  });

  it('detects duplicates when prompt already exists in library', async () => {
    await expect(
      submissionService.submitPrompt(
        'truth-or-dare',
        'easy',
        getPromptsForGame('truth-or-dare', 'easy')[0].text,
        'user_1',
        'User1'
      )
    ).rejects.toThrow('A very similar prompt already exists in the official library.');
  });
});

