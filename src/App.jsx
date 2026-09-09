import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  BookOpen,
  Mail,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Users,
  Search,
  GraduationCap
} from 'lucide-react';

// Reads the current page id from the URL hash (e.g. "#/schedule" -> "schedule").
function getTabFromHash() {
  const hash = window.location.hash || '';
  const cleaned = hash.replace(/^#\/?/, '');
  return cleaned === '' ? 'home' : cleaned;
}

export default function App() {
  const [activeTab, setActiveTabState] = useState(getTabFromHash());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Keep activeTab in sync if the user uses browser back/forward.
  useEffect(() => {
    const onHashChange = () => setActiveTabState(getTabFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Every time the page changes, scroll to the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const setActiveTab = useCallback((id) => {
    const path = id === 'home' ? '#/' : `#/${id}`;
    if (window.location.hash !== path) {
      window.location.hash = path;
    }
    setActiveTabState(id);
    window.scrollTo(0, 0);
  }, []);

  const navigation = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'speakers', label: 'Speakers' },
    { id: 'registration', label: 'Registration' },
    { id: 'contact', label: 'Contact' },
  ];

  const scheduleData = [
    {
      date: 'Day 1, September 17, 2026',
      events: [
        { time: '13:00 – 14:00', title: 'TBA', speaker: 'TBA', venue: 'AB1 316' },
      ],
    },
    {
      date: 'Day 2, September 18, 2026',
      events: [
        { time: 'TBA', title: 'TBA', speaker: 'TBA', venue: 'Visitor Hostel, First Floor' },
      ],
    },
  ];

  const speakersData = [
    { name: 'Prof. AV Jayanthan', affiliation: 'Professor, Department of Mathematics, IIT Madras', institution: 'IIT Madras', talkTitle: 'TBA', abstract: 'TBA', time: 'TBA', venue: 'TBA' },
    { name: 'Dr. Ajay Kumar', affiliation: 'IIT Jammu', institution: 'IIT Jammu', talkTitle: 'TBA', abstract: 'TBA', time: 'TBA', venue: 'TBA' },
    { name: 'Dr. Amith Tripathi', affiliation: 'IIT Hyderabad', institution: 'IIT Hyderabad', talkTitle: 'TBA', abstract: 'TBA', time: 'TBA', venue: 'TBA' },
    { name: 'Dr. Arpan Dutta', affiliation: 'IIT Bhubaneswar', institution: 'IIT Bhubaneswar', talkTitle: 'TBA', abstract: 'TBA', time: 'TBA', venue: 'TBA' },
    { name: 'Prof. Om Prakash', affiliation: 'IIT Patna', institution: 'IIT Patna', talkTitle: 'TBA', abstract: 'TBA', time: 'TBA', venue: 'TBA' },
    { name: 'Dr. Ananthnarayan Hariharan', affiliation: 'IIT Bombay', institution: 'IIT Bombay', talkTitle: 'TBA', abstract: 'TBA', time: 'TBA', venue: 'TBA' },
    { name: 'Dr. Vaibhab Pandey', affiliation: 'IIT Madras', institution: 'IIT Madras', talkTitle: 'TBA', abstract: 'TBA', time: 'TBA', venue: 'TBA' },
    { name: 'Dr. Rahul Gupta', affiliation: 'IMSc', institution: 'IMSc', talkTitle: 'TBA', abstract: 'TBA', time: 'TBA', venue: 'TBA' },
    { name: 'Dr. Sudipta Das', affiliation: 'TIFR Mumbai', institution: 'TIFR Mumbai', talkTitle: 'TBA', abstract: 'TBA', time: 'TBA', venue: 'TBA' },
    { name: 'Dr. Divyasree', affiliation: 'IISER Pune', institution: 'IISER Pune', talkTitle: 'TBA', abstract: 'TBA', time: 'TBA', venue: 'TBA' },
    { name: 'Deblina Dey', affiliation: 'IISER Bhopal', institution: 'IISER Bhopal', talkTitle: 'TBA', abstract: 'TBA', time: 'TBA', venue: 'TBA' },
    { name: 'Ekta Tiwari', affiliation: 'IISER Pune', institution: 'IISER Pune', talkTitle: 'TBA', abstract: 'TBA', time: 'TBA', venue: 'TBA' },
    { name: 'Dr. Sanjeev Kumar Pandey', affiliation: 'IISER Bhopal', institution: 'IISER Bhopal', talkTitle: 'TBA', abstract: 'TBA', time: 'TBA', venue: 'TBA' },
    { name: 'Varsha Vasudevan', affiliation: 'IISER Bhopal', institution: 'IISER Bhopal', talkTitle: 'TBA', abstract: 'TBA', time: 'TBA', venue: 'TBA' },
    { name: 'Illa Ahmad', affiliation: 'IISER Bhopal', institution: 'IISER Bhopal', talkTitle: 'TBA', abstract: 'TBA', time: 'TBA', venue: 'TBA' },
  ];

  const filteredSpeakers = speakersData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: '#FBFAF7',
        color: '#242422',
        fontFamily: "'Fraunces', 'Georgia', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        html {
          scroll-behavior: smooth;
        }

        * {
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fadeSlideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .fade-in-1 { animation-delay: 0.05s; }
        .fade-in-2 { animation-delay: 0.15s; }
        .fade-in-3 { animation-delay: 0.25s; }
        .fade-in-4 { animation-delay: 0.35s; }

        .stagger-card {
          animation: fadeSlideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .link-hover {
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), color 0.28s ease;
          display: inline-block;
        }
        .link-hover:hover {
          transform: translateY(-2px);
          color: #B23A48 !important;
        }
        .nav-link {
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), color 0.28s ease, background-color 0.28s ease;
        }
        .nav-link:hover {
          transform: translateY(-1px);
          color: #B23A48 !important;
        }
        .soft-card {
          transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.32s ease, border-color 0.32s ease;
        }
        .soft-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -12px rgba(60, 74, 62, 0.18);
          border-color: #C9C4B4 !important;
        }
        .cta-button {
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease, background-color 0.28s ease;
        }
        .cta-button:hover {
          transform: translateY(-2px) scale(1.015);
          box-shadow: 0 10px 24px -10px rgba(60, 74, 62, 0.32);
        }
        .sans {
          font-family: 'Inter', 'Helvetica Neue', sans-serif;
        }
        .mono {
          font-family: 'IBM Plex Mono', monospace;
        }
      `}</style>

      {/* Navigation Bar */}
      <header
        className="sticky top-0 z-50 sans"
        style={{
          background: 'rgba(251, 250, 247, 0.92)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #DFDACD',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-16 py-2 gap-2">
            <div
              className="flex items-center space-x-3 cursor-pointer min-w-0"
              onClick={() => setActiveTab('home')}
            >
              <div
                className="h-9 w-9 shrink-0 rounded-md flex items-center justify-center font-bold text-lg mono"
                style={{ background: '#3C4A3E', color: '#FBFAF7' }}
              >
                ∑
              </div>
              <div className="min-w-0">
                <span className="hidden sm:block text-lg font-semibold tracking-tight leading-tight" style={{ color: '#2B2B2E' }}>
                  Discussion Meeting on Topics in Algebra
                </span>
                <span className="block sm:hidden text-sm font-semibold tracking-tight leading-tight truncate" style={{ color: '#2B2B2E' }}>
                  Discussion Meeting on Algebra
                </span>
                <span className="block mono" style={{ color: '#8A8577', fontSize: '0.65rem' }}>IISER Bhopal</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="nav-link px-4 py-2 rounded-md text-sm font-medium"
                  style={{
                    color: activeTab === item.id ? '#3C4A3E' : '#5C5A52',
                    background: activeTab === item.id ? '#EFEAE0' : 'transparent',
                    border: activeTab === item.id ? '1px solid #DAD3C0' : '1px solid transparent',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md focus:outline-none"
                style={{ color: '#5C5A52' }}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div
            className="md:hidden px-4 pt-2 pb-4 space-y-1"
            style={{ background: '#FBFAF7', borderBottom: '1px solid #DFDACD' }}
          >
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className="nav-link block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                style={{
                  color: activeTab === item.id ? '#3C4A3E' : '#5C5A52',
                  background: activeTab === item.id ? '#EFEAE0' : 'transparent',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* ==================== HOME / LANDING PAGE ==================== */}
        {activeTab === 'home' && (
          <div>
            {/* Hero Section */}
            <section
              className="relative overflow-hidden py-24 md:py-32"
              style={{ borderBottom: '1px solid #DFDACD' }}
            >
              <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="fade-in fade-in-2 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-3" style={{ color: '#2B2B2E' }}>
                  Discussion Meeting on <br />
                  Topics in Algebra <br />
                  <span style={{ color: '#3C4A3E' }}>IISERB</span>
                </h1>

                <p className="fade-in fade-in-2 text-base sm:text-lg font-medium mb-6 sans" style={{ color: '#6B6A5F' }}>
                  IISER Bhopal
                </p>

                <p className="fade-in fade-in-3 max-w-2xl mx-auto text-base sm:text-lg mb-8 leading-relaxed" style={{ color: '#5C5A52' }}>
                  Bringing together researchers, academicians, and students to discuss ongoing research in Commutative Algebra, Algebraic Geometry,  and Representation Theory.
                </p>

                {/* Event Highlights Badges */}
                <div className="fade-in fade-in-4 flex flex-wrap items-center justify-center gap-4 text-sm font-medium mb-10 sans">
                  <div
                    className="soft-card flex items-center space-x-2 px-4 py-2 rounded-lg"
                    style={{ background: '#FFFFFF', border: '1px solid #DFDACD', color: '#3F3D38' }}
                  >
                    <Calendar size={18} style={{ color: '#3C4A3E' }} />
                    <span>September 17–18, 2026</span>
                  </div>
                  <div
                    className="soft-card flex items-center space-x-2 px-4 py-2 rounded-lg"
                    style={{ background: '#FFFFFF', border: '1px solid #DFDACD', color: '#3F3D38' }}
                  >
                    <MapPin size={18} style={{ color: '#8C5A5A' }} />
                    <span>IISER Bhopal, Madhya Pradesh, India</span>
                  </div>
                </div>

                <div className="fade-in fade-in-4 flex flex-col sm:flex-row justify-center items-center gap-4 sans">
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className="cta-button w-full sm:w-auto px-7 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
                    style={{ background: '#3C4A3E', color: '#FBFAF7' }}
                  >
                    <span>View Schedule</span>
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={() => setActiveTab('speakers')}
                    className="cta-button w-full sm:w-auto px-7 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
                    style={{ background: '#FFFFFF', color: '#3F3D38', border: '1px solid #C9C4B4' }}
                  >
                    <BookOpen size={18} />
                    <span>Speakers</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('registration')}
                    className="cta-button w-full sm:w-auto px-7 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
                    style={{ background: '#FFFFFF', color: '#3F3D38', border: '1px solid #C9C4B4' }}
                  >
                    <Users size={18} />
                    <span>Register</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Focus Themes */}
            <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-center" style={{ color: '#2B2B2E' }}>
                Thematic Areas
              </h2>
              <p className="text-center mb-12 max-w-xl mx-auto sans" style={{ color: '#6B6A5F' }}>
                Key areas of focus
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Commutative Algebra' },
                  { title: 'Algebraic Geometry' },
                  { title: 'Representation Theory' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="soft-card stagger-card p-6 rounded-lg text-center"
                    style={{ background: '#FFFFFF', border: '1px solid #DFDACD', animationDelay: `${0.1 + idx * 0.08}s` }}
                  >
                    <h3 className="text-lg font-semibold" style={{ color: '#2B2B2E' }}>{item.title}</h3>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ==================== ABOUT US ==================== */}
        {activeTab === 'about' && (
          <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#2B2B2E' }}>About the Meeting</h1>
            <p className="font-medium mb-8 sans" style={{ color: '#3C4A3E' }}>Department of Mathematics, IISER Bhopal</p>

            <div className="space-y-6 leading-relaxed" style={{ color: '#3F3D38' }}>
              <div className="p-6 sm:p-8 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #DFDACD' }}>
                <h2 className="text-xl font-semibold mb-3" style={{ color: '#2B2B2E' }}>Overview & Vision</h2>
                <p className="mb-4">
                  The <strong>Discussion Meeting on Topics in Algebra</strong> is organized by the Department of Mathematics at the Indian Institute of Science Education and Research (IISER) Bhopal. Scheduled from <strong>September 17 to September 18, 2026</strong>, this meeting aims to create a learning environment for researchers, faculty members, postdocs, and students specializing in abstract algebra.
                </p>
                <p>
                  This two-day event includes keynote addresses, presentations, and poster sessions to facilitate academic exchange and foster potential collaborations.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #DFDACD' }}>
                <h2 className="text-xl font-semibold mb-3" style={{ color: '#2B2B2E' }}>About IISER Bhopal</h2>
                <p>
                  IISER Bhopal was established in 2008 by the Ministry of Education, Government of India, and is dedicated to fostering the highest quality of scientific research and education. The Department of Mathematics at IISER Bhopal actively engages in research spanning diverse pure and applied disciplines, including Algebra, Number Theory, Geometry, Topology, and Analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 sans">
                <div className="p-5 rounded-lg" style={{ background: '#F6F2EA', border: '1px solid #DFDACD' }}>
                  <h3 className="font-semibold mb-2" style={{ color: '#2B2B2E' }}>Venue</h3>
                  <p className="text-sm" style={{ color: '#6B6A5F' }}>
                    Day 1: AB1 316 (Seminar Hall)<br />
                    Day 2: Visitor Hostel, First Floor<br />
                    IISER Bhopal Campus, Bhauri,<br />
                    Bhopal 462066, Madhya Pradesh, India
                  </p>
                </div>
                <div className="p-5 rounded-lg" style={{ background: '#F6F2EA', border: '1px solid #DFDACD' }}>
                  <h3 className="font-semibold mb-2" style={{ color: '#2B2B2E' }}>Dates</h3>
                  <p className="text-sm" style={{ color: '#6B6A5F' }}>
                    Thursday, September 17, 2026<br />
                    Friday, September 18, 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SCHEDULE ==================== */}
        {activeTab === 'schedule' && (
          <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#2B2B2E' }}>Meeting Schedule</h1>
              <p className="sans" style={{ color: '#6B6A5F' }}>Schedule of technical talks, keynotes, and poster sessions (September 17–18, 2026).</p>
            </div>

            <div className="space-y-12">
              {scheduleData.map((day, idx) => (
                <div key={idx} className="stagger-card rounded-lg overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #DFDACD', animationDelay: `${idx * 0.1}s` }}>
                  <div className="px-6 py-4" style={{ background: '#EFEAE0', borderBottom: '1px solid #DFDACD' }}>
                    <h2 className="text-xl font-semibold" style={{ color: '#3C4A3E' }}>{day.date}</h2>
                  </div>
                  <div className="divide-y" style={{ borderColor: '#E9E4D6' }}>
                    {day.events.map((event, eventIdx) => (
                      <div
                        key={eventIdx}
                        className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        style={{ borderBottom: '1px solid #EDEAE0' }}
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className="flex items-center space-x-1.5 text-xs font-semibold mono px-2.5 py-1 rounded-md whitespace-nowrap"
                            style={{ color: '#3C4A3E', background: '#EFEAE0', border: '1px solid #DAD3C0' }}
                          >
                            <Clock size={13} />
                            <span>{event.time}</span>
                          </div>
                          <div>
                            <h3 className="text-base font-semibold" style={{ color: '#2B2B2E' }}>{event.title}</h3>
                            {event.speaker && (
                              <p className="text-sm mt-0.5 sans" style={{ color: '#8A8577' }}>{event.speaker}</p>
                            )}
                          </div>
                        </div>
                        <div
                          className="text-xs mono px-3 py-1 rounded-full self-start sm:self-center"
                          style={{ background: '#F6F2EA', color: '#6B6A5F', border: '1px solid #E9E4D6' }}
                        >
                          {event.venue}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== SPEAKERS ==================== */}
        {activeTab === 'speakers' && (
          <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#2B2B2E' }}>Speakers</h1>
                <p className="sans" style={{ color: '#6B6A5F' }}>Faculty and postdoctoral speakers presenting at the meeting.</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72 sans">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: '#8A8577' }} />
                <input
                  type="text"
                  placeholder="Search speakers or institutions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none transition-colors"
                  style={{ background: '#FFFFFF', border: '1px solid #DFDACD', color: '#2B2B2E' }}
                />
              </div>
            </div>

            <div className="space-y-5">
              {filteredSpeakers.length > 0 ? (
                filteredSpeakers.map((item, idx) => (
                  <div
                    key={idx}
                    className="soft-card stagger-card p-6 rounded-lg flex items-start space-x-4"
                    style={{ background: '#FFFFFF', border: '1px solid #DFDACD', animationDelay: `${idx * 0.05}s` }}
                  >
                    <div
                      className="h-11 w-11 shrink-0 rounded-full flex items-center justify-center"
                      style={{ background: '#EFEAE0', color: '#3C4A3E' }}
                    >
                      <GraduationCap size={20} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold mb-0.5" style={{ color: '#2B2B2E' }}>{item.name}</h2>
                      <p className="text-sm sans mb-3" style={{ color: '#6B6A5F' }}>{item.affiliation}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs mono mb-3">
                        <span
                          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md"
                          style={{ color: '#3C4A3E', background: '#EFEAE0', border: '1px solid #DAD3C0' }}
                        >
                          <Clock size={13} />
                          <span>Time: {item.time}</span>
                        </span>
                        <span
                          className="px-3 py-1 rounded-full"
                          style={{ background: '#F6F2EA', color: '#6B6A5F', border: '1px solid #E9E4D6' }}
                        >
                          Venue: {item.venue}
                        </span>
                      </div>

                      <p className="text-sm font-semibold mb-1 sans" style={{ color: '#3F3D38' }}>
                        <span className="font-semibold sans" style={{ color: '#5C5A52' }}>Talk Title: </span>
                        {item.talkTitle}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: '#6B6A5F' }}>
                        <span className="font-semibold sans" style={{ color: '#5C5A52' }}>Abstract: </span>
                        {item.abstract}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 rounded-lg sans" style={{ background: '#F6F2EA', border: '1px solid #DFDACD' }}>
                  <p style={{ color: '#8A8577' }}>No speakers match your query.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== REGISTRATION ==================== */}
        {activeTab === 'registration' && (
          <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#2B2B2E' }}>Registration</h1>
            <p className="mb-8 sans" style={{ color: '#6B6A5F' }}>
              All talks at the Discussion Meeting on Topics in Algebra (September 17–18, 2026) are open to everyone. Registration below is for a more personalised interaction with the visiting speakers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Eligibility */}
              <div className="soft-card p-6 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #DFDACD' }}>
                <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2" style={{ color: '#2B2B2E' }}>
                  <GraduationCap size={20} style={{ color: '#3C4A3E' }} />
                  <span>Eligibility to Register</span>
                </h2>
                <ul className="space-y-3 text-sm sans leading-relaxed" style={{ color: '#3F3D38' }}>
                  <li className="flex items-start space-x-2">
                    <span style={{ color: '#3C4A3E' }}>•</span>
                    <span>Registration is open only to students of IISER Bhopal.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span style={{ color: '#3C4A3E' }}>•</span>
                    <span>Postdocs, PhD, and BS-MS students may be accommodated on a case-to-case basis, depending on how closely their research interests align with the meeting's themes.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span style={{ color: '#3C4A3E' }}>•</span>
                    <span>Since spots for this interaction are very limited, we kindly request that only those with a genuine interest in Algebra, Algebraic Geometry, Commutative Algebra, or Representation Theory register; this helps us keep the group meaningful for everyone involved.</span>
                  </li>
                </ul>
              </div>

              {/* Notes */}
              <div className="soft-card p-6 rounded-lg" style={{ background: '#F6F2EA', border: '1px solid #DFDACD' }}>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#2B2B2E' }}>Notes</h2>
                <ul className="space-y-2 text-sm sans leading-relaxed" style={{ color: '#6B6A5F' }}>
                  <li>• All talks are open to be attended by everyone. No registration is needed to attend the talks.</li>
                  <li>• This registration is only for a more personalised interaction with the visitors, and approval will be determined on a case-to-case basis.</li>
                  <li>• No accommodation or travel support will be provided.</li>
                  <li>• Confirmation will be sent by email from the organizing committee.</li>
                </ul>
              </div>
            </div>

            {/* Registration Form */}
            <div className="soft-card p-6 sm:p-8 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #DFDACD' }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-lg font-semibold" style={{ color: '#2B2B2E' }}>Registration Form</h2>
                <a
                  href="https://forms.gle/Z1FK9HqBvnE5kniC6"
                  target="_blank"
                  rel="noreferrer"
                  className="cta-button inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm"
                  style={{ background: '#3C4A3E', color: '#FBFAF7' }}
                >
                  <span>Open Form in New Tab</span>
                  <ExternalLink size={16} />
                </a>
              </div>

              <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #DFDACD' }}>
                <iframe
                  src="https://forms.gle/Z1FK9HqBvnE5kniC6"
                  title="Registration Form"
                  width="100%"
                  height="900"
                  style={{ display: 'block', background: '#FBFAF7' }}
                >
                  Loading form…
                </iframe>
              </div>

              <p className="text-xs sans pt-4" style={{ color: '#8A8577' }}>
                Submitting this form does not guarantee a spot; approval depends on alignment with the meeting's themes and availability, and you will be notified by email either way. Having trouble with the embedded form above? Use the "Open Form in New Tab" button instead, which works well on mobile.
              </p>
            </div>
          </div>
        )}

        {/* ==================== CONTACT ==================== */}
        {activeTab === 'contact' && (
          <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#2B2B2E' }}>Contact & Venue</h1>
            <p className="mb-10 sans" style={{ color: '#6B6A5F' }}>Get in touch with the meeting's organizing committee.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sans">
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="soft-card p-6 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #DFDACD' }}>
                  <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2" style={{ color: '#2B2B2E' }}>
                    <Mail size={20} style={{ color: '#3C4A3E' }} />
                    <span>Correspondence</span>
                  </h2>
                  <div className="space-y-3 text-sm" style={{ color: '#3F3D38' }}>
                    <p>
                      <strong>Department Website:</strong>{' '}
                      <a
                        href="https://maths.iiserb.ac.in"
                        target="_blank"
                        rel="noreferrer"
                        className="link-hover inline-flex items-center space-x-1"
                        style={{ color: '#3C4A3E' }}
                      >
                        <span>maths.iiserb.ac.in</span>
                        <ExternalLink size={12} />
                      </a>
                    </p>
                  </div>
                </div>

                <div className="soft-card p-6 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #DFDACD' }}>
                  <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2" style={{ color: '#2B2B2E' }}>
                    <Users size={20} style={{ color: '#3C4A3E' }} />
                    <span>Organizing Committee</span>
                  </h2>
                  <ul className="space-y-3 text-sm" style={{ color: '#3F3D38' }}>
                    <li>
                      <span className="font-semibold">Dr. Sankhaneel Bisui</span>
                      <br />
                      <a href="mailto:sankhaneel@iiserb.ac.in" className="link-hover" style={{ color: '#3C4A3E' }}>
                        sankhaneel@iiserb.ac.in
                      </a>
                    </li>
                    <li>
                      <span className="font-semibold">Dr. Anjan Gupta</span>
                      <br />
                      <a href="mailto:anjan@iiserb.ac.in" className="link-hover" style={{ color: '#3C4A3E' }}>
                        anjan@iiserb.ac.in
                      </a>
                    </li>
                    <li>
                      <span className="font-semibold">Dr. Vivek Sadhu</span>
                      <br />
                      <a href="mailto:vsadhu@iiserb.ac.in" className="link-hover" style={{ color: '#3C4A3E' }}>
                        vsadhu@iiserb.ac.in
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Location & Travel */}
              <div className="soft-card p-6 rounded-lg flex flex-col justify-between" style={{ background: '#FFFFFF', border: '1px solid #DFDACD' }}>
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2" style={{ color: '#2B2B2E' }}>
                    <MapPin size={20} style={{ color: '#8C5A5A' }} />
                    <span>Getting to Campus</span>
                  </h2>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#3F3D38' }}>
                    <strong>Address:</strong><br />
                    Indian Institute of Science Education and Research Bhopal<br />
                    Bhopal Bypass Road, Bhauri,<br />
                    Bhopal 462066, Madhya Pradesh, India
                  </p>
                  <div className="space-y-2 text-xs" style={{ color: '#6B6A5F' }}>
                    <p>• <strong>By Air:</strong> Raja Bhoj Airport (BHO) is ~10 km from campus.</p>
                    <p>• <strong>By Train:</strong> Bhopal Junction (BPL) & Rani Kamlapati (RKMP) stations have regular connections.</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 text-xs mono" style={{ borderTop: '1px solid #E9E4D6', color: '#8A8577' }}>
                  GPS Coordinates: 23.286845° N, 77.275766° E
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="sans" style={{ borderTop: '1px solid #DFDACD', background: '#F6F2EA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-4 text-xs" style={{ color: '#8A8577' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              © 2026 Discussion Meeting on Topics in Algebra | Department of Mathematics, IISER Bhopal.
            </div>
            <div className="flex items-center space-x-4">
              <span>September 17–18, 2026</span>
              <span>•</span>
              <span>IISER Bhopal</span>
            </div>
          </div>
          <div className="text-center sm:text-left" style={{ borderTop: '1px solid #E9E4D6', paddingTop: '1rem' }}>
            Website by Adeetya Choubey
          </div>
        </div>
      </footer>
    </div>
  );
}
