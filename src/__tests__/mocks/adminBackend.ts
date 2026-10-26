import { vi } from 'vitest';

const backend = vi.hoisted(() => ({ documents: new Map<string, any>() }));

vi.mock('../../services/authService', () => ({ authService: { requireAdmin: vi.fn().mockResolvedValue(undefined) } }));
vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...actual,
    setDoc: vi.fn(async (ref, data) => {
      backend.documents.set(ref.path, structuredClone(data));
    }),
    updateDoc: vi.fn(async (ref, data) => {
      backend.documents.set(ref.path, { ...backend.documents.get(ref.path), ...structuredClone(data) });
    }),
    deleteDoc: vi.fn(async (ref) => {
      backend.documents.delete(ref.path);
    }),
    getDoc: vi.fn(async (ref) => ({
      exists: () => backend.documents.has(ref.path),
      data: () => backend.documents.get(ref.path),
      id: ref.id,
    })),
    getDocs: vi.fn(async (ref) => {
      const path = ref.path || ref._query.path.canonicalString();
      const filters = ref._query?.filters || [];
      const docs = [...backend.documents]
        .filter(
          ([key, data]) =>
            key.slice(0, key.lastIndexOf('/')) === path &&
            filters.every((filter: any) => data[filter.field.canonicalString()] === filter.value.stringValue)
        )
        .map(([key, data]) => ({ id: key.split('/').at(-1), data: () => structuredClone(data) }));
      return { docs, size: docs.length, forEach: (callback: (doc: any) => void) => docs.forEach(callback) };
    }),
  };
});

export function resetAdminBackend() {
  backend.documents.clear();
}
export function seedPromptOverrides(prompts: { id: string }[]) {
  prompts.forEach((p) => backend.documents.set(`official_prompts/${p.id}`, p));
}
export function seedDocument(path: string, data: any) {
  backend.documents.set(path, data);
}
export function storedDocument(path: string) {
  return backend.documents.get(path);
}
