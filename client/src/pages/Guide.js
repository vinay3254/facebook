import React, { useState } from 'react';
import { guideMetadata, guideSources, guideTopics } from '../data/facebookGuideContent';
import { CompassIcon, GlobeIcon, SearchIcon, SparkIcon } from '../components/ui/Icons';

const guideSourceList = Object.entries(guideSources).map(([id, value]) => ({ id, ...value }));
const guideSourceMap = Object.fromEntries(guideSourceList.map((source) => [source.id, source]));

const Guide = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(guideTopics.map((topic) => topic.category))];
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredTopics = guideTopics.filter((topic) => {
    if (activeCategory !== 'All' && topic.category !== activeCategory) {
      return false;
    }

    const searchable = [
      topic.title,
      topic.category,
      topic.status,
      topic.summary,
      ...topic.keywords,
      ...topic.sections.flatMap((section) => [section.title, ...section.bullets]),
    ]
      .join(' ')
      .toLowerCase();

    return !normalizedSearch || searchable.includes(normalizedSearch);
  });

  const visibleSourceIds = [...new Set(filteredTopics.flatMap((topic) => topic.sources))];
  const visibleSources = guideSourceList.filter((source) => visibleSourceIds.includes(source.id));

  const highlights = [
    { label: 'Topics', value: String(guideTopics.length).padStart(2, '0') },
    { label: 'Categories', value: String(categories.length - 1).padStart(2, '0') },
    { label: 'Sources', value: String(guideSourceList.length).padStart(2, '0') },
    { label: 'Visible', value: String(filteredTopics.length).padStart(2, '0') },
  ];

  return (
    <div className="page-stack guide-page">
      <section className="card guide-hero">
        <div className="guide-hero-copy">
          <span className="guide-kicker">
            <CompassIcon size={15} />
            <span>{guideMetadata.title}</span>
          </span>
          <h1>All the Facebook 2026 topics in one place</h1>
          <p>{guideMetadata.description}</p>
        </div>

        <div className="guide-hero-meta">
          <div className="guide-verified">
            <GlobeIcon size={16} />
            <span>Verified against current public docs and announcements on {guideMetadata.verifiedOn}</span>
          </div>

          <div className="guide-highlights">
            {highlights.map((item) => (
              <div key={item.label} className="guide-highlight">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card guide-toolbar">
        <div className="guide-toolbar-copy">
          <span className="guide-toolbar-label">Search and filter</span>
          <h2>Find the surface you want fast</h2>
          <p>Search by feature, use case, audience, or tactic.</p>
        </div>

        <div className="guide-toolbar-controls">
          <label className="guide-search-field">
            <SearchIcon size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search topics like passkeys, reach, groups, or Messenger"
            />
          </label>

          <div className="guide-filter-strip">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`guide-filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {filteredTopics.length === 0 ? (
        <div className="card empty-state guide-empty-state">
          <div className="empty-state-icon">
            <SearchIcon size={24} />
          </div>
          <h3>No topics match this search</h3>
          <p>Try a broader keyword or switch back to All categories.</p>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('All');
            }}
          >
            Reset guide
          </button>
        </div>
      ) : (
        <section className="guide-topic-list">
          {filteredTopics.map((topic, index) => (
            <details
              key={topic.id}
              className="guide-topic-card"
              open={Boolean(normalizedSearch) || index === 0}
            >
              <summary className="guide-topic-summary">
                <div className="guide-topic-head">
                  <div>
                    <div className="guide-topic-badges">
                      <span className="guide-topic-badge guide-topic-badge-category">{topic.category}</span>
                      <span className="guide-topic-badge">{topic.status}</span>
                    </div>
                    <h2>{topic.title}</h2>
                  </div>

                  <div className="guide-topic-toggle">
                    <SparkIcon size={16} />
                  </div>
                </div>

                <p>{topic.summary}</p>

                <div className="guide-topic-keywords">
                  {topic.keywords.slice(0, 4).map((keyword) => (
                    <span key={keyword}>{keyword}</span>
                  ))}
                </div>
              </summary>

              <div className="guide-topic-body">
                <div className="guide-section-grid">
                  {topic.sections.map((section) => (
                    <section key={section.title} className="guide-section-card">
                      <h3>{section.title}</h3>
                      <ul>
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>

                <div className="guide-topic-sources">
                  <span>Official references</span>

                  <div className="guide-source-chip-list">
                    {topic.sources.map((sourceId) => {
                      const source = guideSourceMap[sourceId];

                      if (!source) return null;

                      return (
                        <a
                          key={source.id}
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="guide-source-chip"
                        >
                          {source.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </details>
          ))}
        </section>
      )}

      <section className="card guide-reference-card">
        <div className="guide-reference-head">
          <div>
            <span className="guide-toolbar-label">Reference deck</span>
            <h2>Official links behind this guide</h2>
          </div>
          <p>{visibleSources.length} references shown for the topics currently in view.</p>
        </div>

        <div className="guide-reference-list">
          {visibleSources.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="guide-reference-link"
            >
              {source.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Guide;
