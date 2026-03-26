import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BriefcaseIcon,
  CameraIcon,
  CompassIcon,
  HomeIcon,
  ImageIcon,
  LockIcon,
  MessageIcon,
  SearchIcon,
  SparkIcon,
  UsersIcon,
} from '../components/ui/Icons';

const coreFeatures = [
  { id: 'feed', title: 'News Feed', detail: 'Posts, reactions, comments, and media', path: '/', Icon: HomeIcon },
  { id: 'stories', title: 'Stories', detail: 'Create and watch full-screen story moments', path: '/', Icon: ImageIcon },
  { id: 'profile', title: 'Profile', detail: 'Edit profile, cover, and your post stream', path: 'profile', Icon: CompassIcon },
  { id: 'friends', title: 'Friends & Follow', detail: 'Requests, mutuals, and social graph', path: '/friends', Icon: UsersIcon },
  { id: 'messenger', title: 'Messenger', detail: 'Real-time chat and conversation history', path: '/messenger', Icon: MessageIcon },
  { id: 'search', title: 'Search', detail: 'People discovery and quick lookup', path: '/search', Icon: SearchIcon },
];

const starterGroups = [
  { id: 'pulse-lab', name: 'Pulse Lab', detail: 'Product builders and feature feedback', members: '14.2K', cadence: 'Weekly critique' },
  { id: 'north-yard', name: 'North Yard', detail: 'Local meetups and creator hangouts', members: '8.7K', cadence: 'Friday meetup' },
  { id: 'frame-room', name: 'Frame Room', detail: 'Short-form video experiments and edits', members: '21.4K', cadence: 'Daily prompt' },
];

const starterPages = [
  { id: 'atelier-one', name: 'Atelier One', sector: 'Design studio', detail: 'Drops, behind the scenes, and bookings' },
  { id: 'harbor-supply', name: 'Harbor Supply', sector: 'Retail brand', detail: 'Launches, offers, and local pickup' },
  { id: 'signal-house', name: 'Signal House', sector: 'Media page', detail: 'Interviews, clips, and event promos' },
];

const starterEvents = [
  { id: 'ev-1', name: 'Creator Q&A Night', date: 'Apr 04', venue: 'Riverside Loft', type: 'In person' },
  { id: 'ev-2', name: 'Launch Room Live', date: 'Apr 10', venue: 'Facebook Live', type: 'Live stream' },
  { id: 'ev-3', name: 'Marketplace Flip Day', date: 'Apr 17', venue: 'Downtown Hall', type: 'Community sale' },
];

const starterListings = [
  { id: 'mk-1', title: 'Walnut desk lamp', price: '48', category: 'Home', location: 'Andheri', condition: 'Like new' },
  { id: 'mk-2', title: 'Creator tripod kit', price: '72', category: 'Tech', location: 'Powai', condition: 'Used' },
  { id: 'mk-3', title: 'Vinyl accent chair', price: '115', category: 'Furniture', location: 'Bandra', condition: 'Refinished' },
];

const reelDeck = [
  { id: 'reel-1', creator: 'Nyla Hart', title: '3-shot cafe b-roll formula', duration: '0:24', vibe: 'Editing' },
  { id: 'reel-2', creator: 'Milo Park', title: 'Hook ideas for local brands', duration: '0:31', vibe: 'Marketing' },
  { id: 'reel-3', creator: 'Tessa Vale', title: 'One-room product lighting setup', duration: '0:18', vibe: 'Studio' },
];

const liveLineup = [
  { id: 'live-1', title: 'Behind the launch room', time: 'Starts in 18 min', host: 'Signal House' },
  { id: 'live-2', title: 'Friday product teardown', time: 'Tomorrow at 7:30 PM', host: 'Pulse Lab' },
];

const watchSeries = [
  { id: 'watch-1', title: 'Inside the Build', episodes: '12 episodes', format: 'Interview series' },
  { id: 'watch-2', title: 'Market Runs', episodes: '8 episodes', format: 'Local commerce stories' },
  { id: 'watch-3', title: 'Short Form Clinic', episodes: '16 episodes', format: 'Weekly creator review' },
];

const aiModes = [
  { id: 'rewrite', label: 'Rewrite post' },
  { id: 'caption', label: 'Caption ideas' },
  { id: 'launch', label: 'Launch plan' },
];

const noteThreads = [
  { id: 'note-1', subject: 'Viral price-drop claim', context: 'Needs source context before people reshare it.' },
  { id: 'note-2', subject: 'Event location rumor', context: 'People need the official venue update attached.' },
];

const restyleStyles = ['Studio Glow', 'Film Grain', 'Soft Editorial', 'Sunset Wash'];
const backgroundStyles = ['Aurora', 'Amber Fade', 'Ocean Loop', 'Midnight Ink'];

const buildAiResponse = (mode, prompt, userName) => {
  const cleanedPrompt = prompt.trim() || 'your latest update';

  if (mode === 'caption') {
    return `Caption set for ${cleanedPrompt}: one clear line, one proof point, and one CTA for ${userName || 'your audience'}.`;
  }

  if (mode === 'launch') {
    return `Launch flow for ${cleanedPrompt}: teaser story, timed feed post, short Reel cut, Messenger follow-up, then event reminder.`;
  }

  return `Rewrite ready for ${cleanedPrompt}: stronger opening hook, cleaner middle, and a sharper ending line that invites replies.`;
};

const Explore = () => {
  const { user } = useAuth();
  const [joinedGroups, setJoinedGroups] = useState(new Set(['pulse-lab']));
  const [followedPages, setFollowedPages] = useState(new Set(['atelier-one']));
  const [eventPlans, setEventPlans] = useState({ 'ev-1': 'Going', 'ev-2': 'Interested' });
  const [events, setEvents] = useState(starterEvents);
  const [eventForm, setEventForm] = useState({ name: '', date: '', venue: '' });
  const [eventError, setEventError] = useState('');
  const [listings, setListings] = useState(starterListings);
  const [listingForm, setListingForm] = useState({ title: '', price: '', location: '', category: 'Home' });
  const [listingError, setListingError] = useState('');
  const [marketFilter, setMarketFilter] = useState('All');
  const [savedReels, setSavedReels] = useState(new Set());
  const [liveReminders, setLiveReminders] = useState(new Set());
  const [savedShows, setSavedShows] = useState(new Set(['watch-2']));
  const [professionalMode, setProfessionalMode] = useState(true);
  const [followersOpen, setFollowersOpen] = useState(true);
  const [animatedProfile, setAnimatedProfile] = useState(true);
  const [aiMode, setAiMode] = useState('rewrite');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState(buildAiResponse('rewrite', 'today’s announcement', user?.name));
  const [noteVotes, setNoteVotes] = useState({});
  const [passkeysEnabled, setPasskeysEnabled] = useState(false);
  const [selectedRestyle, setSelectedRestyle] = useState(restyleStyles[0]);
  const [selectedBackground, setSelectedBackground] = useState(backgroundStyles[0]);
  const [memoryMode, setMemoryMode] = useState('Then');

  const marketCategories = ['All', ...new Set(starterListings.map((listing) => listing.category))];
  const visibleListings = listings.filter((listing) => marketFilter === 'All' || listing.category === marketFilter);

  const handleEventCreate = (event) => {
    event.preventDefault();

    if (!eventForm.name.trim() || !eventForm.date.trim() || !eventForm.venue.trim()) {
      setEventError('Add name, date, and venue.');
      return;
    }

    setEvents((current) => [
      {
        id: `ev-${Date.now()}`,
        name: eventForm.name.trim(),
        date: eventForm.date.trim(),
        venue: eventForm.venue.trim(),
        type: 'Custom',
      },
      ...current,
    ]);
    setEventForm({ name: '', date: '', venue: '' });
    setEventError('');
  };

  const handleListingCreate = (event) => {
    event.preventDefault();

    if (!listingForm.title.trim() || !listingForm.price.trim() || !listingForm.location.trim()) {
      setListingError('Add title, price, and location.');
      return;
    }

    setListings((current) => [
      {
        id: `mk-${Date.now()}`,
        title: listingForm.title.trim(),
        price: listingForm.price.trim(),
        location: listingForm.location.trim(),
        category: listingForm.category,
        condition: 'Fresh draft',
      },
      ...current,
    ]);
    setListingForm({ title: '', price: '', location: '', category: listingForm.category });
    setListingError('');
  };

  return (
    <div className="page-stack explore-page">
      <section className="card explore-hero">
        <div className="explore-hero-copy">
          <span className="explore-kicker">Explore Surface</span>
          <h1>Actual feature space, not just text</h1>
          <p>
            The app already had Feed, Stories, Messenger, Search, Friends, and Profile. This screen
            adds the missing Facebook-style surfaces as interactive modules so we can keep building the
            real product, not just describing it.
          </p>
        </div>

        <div className="explore-hero-metrics">
          <div className="explore-hero-stat">
            <strong>06</strong>
            <span>existing live routes</span>
          </div>
          <div className="explore-hero-stat">
            <strong>14</strong>
            <span>new feature modules</span>
          </div>
          <div className="explore-hero-stat">
            <strong>01</strong>
            <span>single place to extend next</span>
          </div>
        </div>
      </section>

      <section className="explore-grid">
        <article className="card explore-panel explore-panel-wide">
          <div className="surface-title-row">
            <div>
              <span className="panel-kicker">Core surfaces</span>
              <h2>Already working in the app</h2>
            </div>
            <span className="mini-stat">{coreFeatures.length} live routes</span>
          </div>

          <div className="explore-link-grid">
            {coreFeatures.map(({ id, title, detail, path, Icon }) => (
              <Link
                key={id}
                to={path === 'profile' ? `/profile/${user?._id}` : path}
                className="explore-link-card"
              >
                <div className="explore-link-icon">
                  <Icon size={18} />
                </div>
                <div>
                  <strong>{title}</strong>
                  <span>{detail}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="profile-network-strip">
            <div className="profile-network-card">
              <div className="surface-title-row compact">
                <strong>Profile mode</strong>
                <button type="button" className={`surface-btn ${professionalMode ? 'active' : ''}`} onClick={() => setProfessionalMode((value) => !value)}>
                  {professionalMode ? 'Professional on' : 'Professional off'}
                </button>
              </div>
              <p>Keep personal sharing private while opening your profile to followers and public discovery.</p>
            </div>

            <div className="profile-network-card">
              <div className="surface-title-row compact">
                <strong>Followers</strong>
                <button type="button" className={`surface-btn ${followersOpen ? 'active' : ''}`} onClick={() => setFollowersOpen((value) => !value)}>
                  {followersOpen ? 'Following enabled' : 'Friends only'}
                </button>
              </div>
              <p>Switch between one-way following and a mostly friend-only network.</p>
            </div>

            <div className="profile-network-card">
              <div className="surface-title-row compact">
                <strong>Animated profile</strong>
                <button type="button" className={`surface-btn ${animatedProfile ? 'active' : ''}`} onClick={() => setAnimatedProfile((value) => !value)}>
                  {animatedProfile ? 'Animation live' : 'Static photo'}
                </button>
              </div>
              <p>Use an AI animated profile picture feel instead of a still avatar only.</p>
            </div>
          </div>
        </article>

        <article className="card explore-panel">
          <div className="surface-title-row">
            <div>
              <span className="panel-kicker">Communities</span>
              <h2>Groups and Pages</h2>
            </div>
            <UsersIcon size={18} />
          </div>

          <div className="surface-stack">
            {starterGroups.map((group) => (
              <div key={group.id} className="surface-row-card">
                <div>
                  <strong>{group.name}</strong>
                  <span>{group.detail}</span>
                  <small>{group.members} members · {group.cadence}</small>
                </div>
                <button
                  type="button"
                  className={`surface-btn ${joinedGroups.has(group.id) ? 'active' : ''}`}
                  onClick={() =>
                    setJoinedGroups((current) => {
                      const next = new Set(current);
                      if (next.has(group.id)) next.delete(group.id);
                      else next.add(group.id);
                      return next;
                    })
                  }
                >
                  {joinedGroups.has(group.id) ? 'Joined' : 'Join'}
                </button>
              </div>
            ))}
          </div>

          <div className="surface-divider" />

          <div className="surface-stack">
            {starterPages.map((page) => (
              <div key={page.id} className="surface-row-card">
                <div>
                  <strong>{page.name}</strong>
                  <span>{page.sector}</span>
                  <small>{page.detail}</small>
                </div>
                <button
                  type="button"
                  className={`surface-btn ${followedPages.has(page.id) ? 'active' : ''}`}
                  onClick={() =>
                    setFollowedPages((current) => {
                      const next = new Set(current);
                      if (next.has(page.id)) next.delete(page.id);
                      else next.add(page.id);
                      return next;
                    })
                  }
                >
                  {followedPages.has(page.id) ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </article>

        <article className="card explore-panel explore-panel-wide">
          <div className="surface-title-row">
            <div>
              <span className="panel-kicker">Commerce and planning</span>
              <h2>Events and Marketplace</h2>
            </div>
            <BriefcaseIcon size={18} />
          </div>

          <div className="explore-dual-grid">
            <div className="feature-block">
              <div className="surface-title-row compact">
                <strong>Event builder</strong>
                <span className="mini-stat">{events.length} planned</span>
              </div>

              <form className="inline-form" onSubmit={handleEventCreate}>
                <label>
                  <span>Name</span>
                  <input value={eventForm.name} onChange={(event) => setEventForm((current) => ({ ...current, name: event.target.value }))} placeholder="Launch room meetup" />
                </label>
                <label>
                  <span>Date</span>
                  <input value={eventForm.date} onChange={(event) => setEventForm((current) => ({ ...current, date: event.target.value }))} placeholder="Apr 22" />
                </label>
                <label>
                  <span>Venue</span>
                  <input value={eventForm.venue} onChange={(event) => setEventForm((current) => ({ ...current, venue: event.target.value }))} placeholder="Main studio or Facebook Live" />
                </label>
                {eventError ? <p className="inline-error">{eventError}</p> : null}
                <button type="submit" className="btn-primary">Add event</button>
              </form>

              <div className="surface-stack">
                {events.map((item) => (
                  <div key={item.id} className="surface-row-card">
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.date} · {item.venue}</span>
                      <small>{item.type}</small>
                    </div>
                    <div className="pill-row">
                      {['Going', 'Interested'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`surface-pill ${eventPlans[item.id] === option ? 'active' : ''}`}
                          onClick={() => setEventPlans((current) => ({ ...current, [item.id]: option }))}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="feature-block">
              <div className="surface-title-row compact">
                <strong>Marketplace board</strong>
                <select value={marketFilter} onChange={(event) => setMarketFilter(event.target.value)} className="surface-select">
                  {marketCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <form className="inline-form" onSubmit={handleListingCreate}>
                <label>
                  <span>Item</span>
                  <input value={listingForm.title} onChange={(event) => setListingForm((current) => ({ ...current, title: event.target.value }))} placeholder="Wooden coffee table" />
                </label>
                <label>
                  <span>Price</span>
                  <input value={listingForm.price} onChange={(event) => setListingForm((current) => ({ ...current, price: event.target.value }))} placeholder="90" />
                </label>
                <label>
                  <span>Location</span>
                  <input value={listingForm.location} onChange={(event) => setListingForm((current) => ({ ...current, location: event.target.value }))} placeholder="Bandra" />
                </label>
                <label>
                  <span>Category</span>
                  <select value={listingForm.category} onChange={(event) => setListingForm((current) => ({ ...current, category: event.target.value }))}>
                    {marketCategories.filter((category) => category !== 'All').map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
                {listingError ? <p className="inline-error">{listingError}</p> : null}
                <button type="submit" className="btn-primary">List item</button>
              </form>

              <div className="surface-stack">
                {visibleListings.map((listing) => (
                  <div key={listing.id} className="surface-row-card">
                    <div>
                      <strong>{listing.title}</strong>
                      <span>{listing.category} · {listing.condition}</span>
                      <small>{listing.location}</small>
                    </div>
                    <div className="market-price-tag">₹{listing.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="card explore-panel">
          <div className="surface-title-row">
            <div>
              <span className="panel-kicker">Video lanes</span>
              <h2>Reels, Live, and Watch</h2>
            </div>
            <CameraIcon size={18} />
          </div>

          <div className="surface-stack">
            {reelDeck.map((reel) => (
              <div key={reel.id} className="video-card">
                <div className="video-thumb">
                  <span>{reel.duration}</span>
                </div>
                <div className="video-card-copy">
                  <strong>{reel.title}</strong>
                  <span>{reel.creator} · {reel.vibe}</span>
                </div>
                <button
                  type="button"
                  className={`surface-btn ${savedReels.has(reel.id) ? 'active' : ''}`}
                  onClick={() =>
                    setSavedReels((current) => {
                      const next = new Set(current);
                      if (next.has(reel.id)) next.delete(reel.id);
                      else next.add(reel.id);
                      return next;
                    })
                  }
                >
                  {savedReels.has(reel.id) ? 'Saved' : 'Save'}
                </button>
              </div>
            ))}
          </div>

          <div className="surface-divider" />

          <div className="surface-stack compact-stack">
            {liveLineup.map((session) => (
              <div key={session.id} className="surface-row-card">
                <div>
                  <strong>{session.title}</strong>
                  <span>{session.host}</span>
                  <small>{session.time}</small>
                </div>
                <button
                  type="button"
                  className={`surface-btn ${liveReminders.has(session.id) ? 'active' : ''}`}
                  onClick={() =>
                    setLiveReminders((current) => {
                      const next = new Set(current);
                      if (next.has(session.id)) next.delete(session.id);
                      else next.add(session.id);
                      return next;
                    })
                  }
                >
                  {liveReminders.has(session.id) ? 'Reminder set' : 'Remind me'}
                </button>
              </div>
            ))}
          </div>

          <div className="surface-divider" />

          <div className="pill-row">
            {watchSeries.map((show) => (
              <button
                key={show.id}
                type="button"
                className={`surface-pill ${savedShows.has(show.id) ? 'active' : ''}`}
                onClick={() =>
                  setSavedShows((current) => {
                    const next = new Set(current);
                    if (next.has(show.id)) next.delete(show.id);
                    else next.add(show.id);
                    return next;
                  })
                }
              >
                {savedShows.has(show.id) ? `Watching ${show.title}` : `${show.title} · ${show.episodes}`}
              </button>
            ))}
          </div>
        </article>

        <article className="card explore-panel explore-panel-wide">
          <div className="surface-title-row">
            <div>
              <span className="panel-kicker">Creative studio</span>
              <h2>Stories, Memories, backgrounds, and Restyle</h2>
            </div>
            <SparkIcon size={18} />
          </div>

          <div className="explore-dual-grid">
            <div className="feature-block">
              <strong className="block-title">Restyle AI</strong>
              <div className="pill-row">
                {restyleStyles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={`surface-pill ${selectedRestyle === style ? 'active' : ''}`}
                    onClick={() => setSelectedRestyle(style)}
                  >
                    {style}
                  </button>
                ))}
              </div>
              <div className={`preview-card preview-style-${selectedRestyle.toLowerCase().replace(/\s+/g, '-')}`}>
                <span className="preview-label">Restyle preview</span>
                <strong>{selectedRestyle}</strong>
                <p>Travel memory, story frame, or profile motion card.</p>
              </div>

              <strong className="block-title">Animated backgrounds</strong>
              <div className="pill-row">
                {backgroundStyles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    className={`surface-pill ${selectedBackground === style ? 'active' : ''}`}
                    onClick={() => setSelectedBackground(style)}
                  >
                    {style}
                  </button>
                ))}
              </div>
              <div className={`background-preview background-${selectedBackground.toLowerCase().replace(/\s+/g, '-')}`}>
                <span>New drop at 7 PM</span>
              </div>
            </div>

            <div className="feature-block">
              <strong className="block-title">Memories</strong>
              <div className="surface-title-row compact">
                <span className="memory-year-tag">2019</span>
                <div className="pill-row">
                  {['Then', 'Now'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className={`surface-pill ${memoryMode === mode ? 'active' : ''}`}
                      onClick={() => setMemoryMode(mode)}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              <div className="memory-card">
                <strong>{memoryMode === 'Then' ? 'Studio opening night' : 'Shared as a refreshed memory story'}</strong>
                <p>{memoryMode === 'Then' ? 'Original crowd photo and opening caption.' : 'Reframed with a fresh caption, Restyle look, and Story share.'}</p>
                <button type="button" className="btn-ghost">Share memory</button>
              </div>

              <strong className="block-title">Story lane</strong>
              <div className="story-stack-preview">
                <div className="story-chip active">Behind the scenes</div>
                <div className="story-chip">Poll sticker</div>
                <div className="story-chip">Launch countdown</div>
              </div>
            </div>
          </div>
        </article>

        <article className="card explore-panel explore-panel-wide">
          <div className="surface-title-row">
            <div>
              <span className="panel-kicker">AI and safety</span>
              <h2>Meta AI, Community Notes, and Passkeys</h2>
            </div>
            <LockIcon size={18} />
          </div>

          <div className="explore-dual-grid">
            <div className="feature-block">
              <strong className="block-title">Meta AI prompt box</strong>
              <div className="pill-row">
                {aiModes.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    className={`surface-pill ${aiMode === mode.id ? 'active' : ''}`}
                    onClick={() => {
                      setAiMode(mode.id);
                      setAiOutput(buildAiResponse(mode.id, aiPrompt, user?.name));
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              <label className="text-area-field">
                <span>Your prompt</span>
                <textarea
                  value={aiPrompt}
                  onChange={(event) => setAiPrompt(event.target.value)}
                  placeholder="Launch a new Friday creator meetup"
                  rows={4}
                />
              </label>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setAiOutput(buildAiResponse(aiMode, aiPrompt, user?.name))}
              >
                Generate
              </button>
              <div className="ai-output-card">
                <span>Meta AI output</span>
                <p>{aiOutput}</p>
              </div>
            </div>

            <div className="feature-block">
              <strong className="block-title">Community Notes</strong>
              <div className="surface-stack">
                {noteThreads.map((note) => (
                  <div key={note.id} className="note-card">
                    <div>
                      <strong>{note.subject}</strong>
                      <p>{note.context}</p>
                    </div>
                    <button
                      type="button"
                      className={`surface-btn ${noteVotes[note.id] ? 'active' : ''}`}
                      onClick={() => setNoteVotes((current) => ({ ...current, [note.id]: !current[note.id] }))}
                    >
                      {noteVotes[note.id] ? 'Helpful' : 'Mark helpful'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="surface-divider" />

              <strong className="block-title">Passkeys</strong>
              <div className="passkey-card">
                <div>
                  <strong>{passkeysEnabled ? 'Passkeys enabled' : 'Passkeys not set up'}</strong>
                  <p>Use face, fingerprint, or device PIN instead of typing a password every time.</p>
                </div>
                <button
                  type="button"
                  className={`surface-btn ${passkeysEnabled ? 'active' : ''}`}
                  onClick={() => setPasskeysEnabled((value) => !value)}
                >
                  {passkeysEnabled ? 'Disable passkey' : 'Enable passkey'}
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default Explore;
