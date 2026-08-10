import React from 'react'
import '../style/SourcesSelector.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faLayerGroup } from '@fortawesome/free-solid-svg-icons'

const GAMESYSTEM_LABELS = {
  '5e-2014': '5e 2014',
  '5e-2024': '5e 2024',
  'a5e': 'Level Up A5e',
};

function systemLabel(gamesystem) {
  if (!gamesystem) return '';
  return GAMESYSTEM_LABELS[gamesystem.key] || gamesystem.name;
}

function groupByPublisher(documents) {
  const groups = [];
  const byName = new Map();
  for (const doc of documents) {
    const publisher = (doc.publisher && doc.publisher.name) || 'Other';
    let group = byName.get(publisher);
    if (!group) {
      group = { publisher, docs: [] };
      byName.set(publisher, group);
      groups.push(group);
    }
    group.docs.push(doc);
  }
  return groups;
}

export function SourcesSelector({ documents, selected, loading, error, onChange, onClose }) {
  const allKeys = documents.map(d => d.key);
  const allSelected = allKeys.length > 0 && allKeys.every(k => selected.has(k));
  const noneSelected = selected.size === 0;
  const groups = groupByPublisher(documents);

  function toggle(key) {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key); else next.add(key);
    onChange(next);
  }

  function toggleGroup(keys, everyOn) {
    const next = new Set(selected);
    if (everyOn) keys.forEach(k => next.delete(k));
    else keys.forEach(k => next.add(k));
    onChange(next);
  }

  return (
    <div className="sourcesOverlay" onClick={onClose}>
      <div className="sourcesPanel" onClick={(e) => e.stopPropagation()}>
        <div className="sourcesHeader">
          <FontAwesomeIcon className="sourcesHeaderIcon" icon={faLayerGroup} />
          <span className="sourcesTitle">Sources</span>
          <button className="sourcesCloseBtn" onClick={onClose} title="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <p className="sourcesDesc">
          Open5e hosts content from many freely-licensed sources. Choose which
          appear when browsing the beastiary.
        </p>

        <div className="sourcesActions">
          <button className="btn-secondary btn-sm" onClick={() => onChange(new Set(allKeys))} disabled={allSelected || loading}>
            Select all
          </button>
          <button className="btn-secondary btn-sm" onClick={() => onChange(new Set())} disabled={noneSelected || loading}>
            Clear all
          </button>
          <span className="sourcesSelectedCount">{selected.size}/{allKeys.length} selected</span>
        </div>

        <div className="sourcesList">
          {loading && <div className="sourcesStatus">Loading sources...</div>}
          {error && <div className="sourcesStatus sourcesStatus--error">Failed to load sources.</div>}

          {!loading && !error && groups.map(group => {
            const keys = group.docs.map(d => d.key);
            const onCount = keys.filter(k => selected.has(k)).length;
            const everyOn = onCount === keys.length;
            return (
              <div className="sourceGroup" key={group.publisher}>
                <button
                  className="sourceGroupHeader"
                  onClick={() => toggleGroup(keys, everyOn)}
                  title={everyOn ? 'Deselect all in group' : 'Select all in group'}
                >
                  <span className="sourceGroupName">{group.publisher}</span>
                  <span className="sourceGroupCount">{onCount}/{keys.length}</span>
                </button>
                {group.docs.map(doc => (
                  <label className="sourceRow" key={doc.key}>
                    <input
                      type="checkbox"
                      className="sourceCheckbox"
                      checked={selected.has(doc.key)}
                      onChange={() => toggle(doc.key)}
                    />
                    <span className="sourceName">{doc.name}</span>
                    <span className="sourceKeyBadge">{doc.key}</span>
                    <span className="sourceSystemBadge">{systemLabel(doc.gamesystem)}</span>
                  </label>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
