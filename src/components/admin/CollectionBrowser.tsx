import React, { useEffect, useRef, useState } from 'react';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { adminService } from '../../services/adminService';

export function CollectionBrowser() {
  const [names, setNames] = useState<string[]>([]);
  const [path, setPath] = useState('official_prompts');
  const [loadedPath, setLoadedPath] = useState('');
  const [documents, setDocuments] = useState<{ id: string; data: DocumentData }[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot>();
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(0);
  const load = async (collectionPath: string, more = false) => {
    const id = ++requestId.current;
    setLoading(true);
    setError('');
    try {
      const page = await adminService.getCollectionPage(collectionPath, more ? cursor : undefined);
      if (id !== requestId.current) return;
      setDocuments((current) => (more ? [...current, ...page.documents] : page.documents));
      setCursor(page.cursor);
      setHasMore(page.hasMore);
      setLoadedPath(collectionPath);
    } catch (e) {
      if (id === requestId.current) setError(e instanceof Error ? e.message : 'Could not load this collection.');
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };
  useEffect(() => {
    void adminService
      .getCollectionNames()
      .then(setNames)
      .catch((e) => setError(e.message));
    void load('official_prompts');
    return () => {
      requestId.current += 1;
    };
  }, []);
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-white">Database collections</h3>
        <p className="text-sm text-zinc-400">
          Browse collection records. Use Game Content Manager and All decks to change cards.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {names.map((name) => (
          <button
            key={name}
            disabled={loading}
            onClick={() => {
              setPath(name);
              void load(name);
            }}
            className={`px-3 py-2 text-xs rounded-xl border ${loadedPath === name ? 'border-brand-pink text-white' : 'border-white/10 text-zinc-400'}`}
          >
            {name}
          </button>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void load(path.trim());
        }}
        className="flex flex-wrap gap-3"
      >
        <input
          aria-label="Collection path"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="rooms/ROOMCODE/players"
          className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-white"
        />
        <button disabled={loading} className="px-4 py-2 rounded-xl bg-brand-pink text-white font-bold">
          Open collection
        </button>
      </form>
      {error && (
        <p role="alert" className="text-red-300">
          {error}
        </p>
      )}
      {loading && <p className="text-zinc-400">Loading records…</p>}
      <p className="text-sm text-zinc-400">
        {loadedPath} · {documents.length} records loaded
      </p>
      {documents.map((document) => (
        <details key={document.id} className="rounded-xl border border-white/10 p-4 bg-zinc-900/60">
          <summary className="cursor-pointer text-sm text-white break-all">{document.id}</summary>
          <pre className="text-xs text-zinc-300 overflow-x-auto mt-3 whitespace-pre-wrap break-words">
            {JSON.stringify(document.data, null, 2)}
          </pre>
          {loadedPath === 'rooms' && (
            <div className="flex gap-4 mt-3">
              {['players', 'submissions'].map((child) => (
                <button
                  key={child}
                  disabled={loading}
                  className="text-xs text-brand-pink"
                  onClick={() => {
                    const next = `${loadedPath}/${document.id}/${child}`;
                    setPath(next);
                    void load(next);
                  }}
                >
                  Open {child}
                </button>
              ))}
            </div>
          )}
        </details>
      ))}
      {!loading && !documents.length && <p className="text-zinc-400">This collection is empty.</p>}
      {hasMore && (
        <button
          disabled={loading}
          onClick={() => void load(loadedPath, true)}
          className="px-4 py-2 rounded-xl border border-white/15 text-white"
        >
          Load next 50 records
        </button>
      )}
    </div>
  );
}
