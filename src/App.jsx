import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
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
    { id: 'poster', label: 'Poster' },
    { id: 'registration', label: 'Registration' },
    { id: 'contact', label: 'Contact' },
  ];

  // Single source of truth for the day-by-day schedule of talks and recess breaks.
  const sessionsData = [
    { type: 'talk', name: 'Dr. Ananthnarayan H', affiliation: 'IIT Bombay', institution: 'IIT Bombay', talkTitle: 'TBA', abstract: 'TBA', day: 'Thursday, September 17, 2026', time: '2:15 – 3:00 PM', venue: 'AB1 316 (Third Floor)' },
    { type: 'talk', name: 'Dr. Rahul Gupta', affiliation: 'IMSc, Chennai', institution: 'IMSc, Chennai', talkTitle: 'TBA', abstract: 'TBA', day: 'Thursday, September 17, 2026', time: '3:05 – 3:50 PM', venue: 'AB1 316 (Third Floor)' },
    { type: 'recess', day: 'Thursday, September 17, 2026', time: '3:50 – 4:10 PM', venue: 'AB1 316 (Third Floor)' },
    { type: 'talk', name: 'Dr. Arpan Dutta', affiliation: 'IIT Bhubaneswar', institution: 'IIT Bhubaneswar', talkTitle: 'TBA', abstract: 'TBA', day: 'Thursday, September 17, 2026', time: '4:10 – 4:55 PM', venue: 'AB1 316 (Third Floor)' },
    { type: 'talk', name: 'Dr. Sudipta Das', affiliation: 'TIFR Mumbai', institution: 'TIFR Mumbai', talkTitle: 'TBA', abstract: 'TBA', day: 'Thursday, September 17, 2026', time: '5:00 – 5:25 PM', venue: 'AB1 316 (Third Floor)' },
    { type: 'talk', name: 'Dr. Divyasree', affiliation: 'IISER Pune', institution: 'IISER Pune', talkTitle: 'TBA', abstract: 'TBA', day: 'Thursday, September 17, 2026', time: '5:30 – 6:00 PM', venue: 'AB1 316 (Third Floor)' },
    { type: 'talk', name: 'Prof. Om Prakash', affiliation: 'IIT Patna', institution: 'IIT Patna', talkTitle: 'TBA', abstract: 'TBA', day: 'Friday, September 18, 2026', time: '10:00 – 10:45 AM', venue: 'Visitor Hostel, First Floor' },
    { type: 'recess', day: 'Friday, September 18, 2026', time: '10:45 – 11:00 AM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Ila Ahmad', affiliation: 'IISER Bhopal', institution: 'IISER Bhopal', talkTitle: 'TBA', abstract: 'TBA', day: 'Friday, September 18, 2026', time: '11:00 – 11:25 AM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Dr. Ekta Tiwari', affiliation: 'IISER Pune', institution: 'IISER Pune', talkTitle: 'TBA', abstract: 'TBA', day: 'Friday, September 18, 2026', time: '11:30 – 11:55 AM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Dr. Sanjeev Kumar Pandey', affiliation: 'IISER Bhopal', institution: 'IISER Bhopal', talkTitle: 'TBA', abstract: 'TBA', day: 'Friday, September 18, 2026', time: '12:00 – 12:25 PM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Varsha Vasudevan', affiliation: 'IISER Bhopal', institution: 'IISER Bhopal', talkTitle: 'TBA', abstract: 'TBA', day: 'Friday, September 18, 2026', time: '12:30 – 12:55 PM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Prof. A. V. Jayanthan', affiliation: 'IIT Madras', institution: 'IIT Madras', talkTitle: 'TBA', abstract: 'TBA', day: 'Friday, September 18, 2026', time: '2:30 – 3:15 PM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Dr. Vaibhav Pandey', affiliation: 'IIT Madras', institution: 'IIT Madras', talkTitle: 'TBA', abstract: 'TBA', day: 'Friday, September 18, 2026', time: '3:20 – 4:05 PM', venue: 'Visitor Hostel, First Floor' },
    { type: 'recess', day: 'Friday, September 18, 2026', time: '4:05 – 4:25 PM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Dr. Ajay Kumar', affiliation: 'IIT Jammu', institution: 'IIT Jammu', talkTitle: 'TBA', abstract: 'TBA', day: 'Friday, September 18, 2026', time: '4:25 – 5:10 PM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Dr. Deblina Dey', affiliation: 'IISER Bhopal', institution: 'IISER Bhopal', talkTitle: 'TBA', abstract: 'TBA', day: 'Friday, September 18, 2026', time: '5:15 – 5:40 PM', venue: 'Visitor Hostel, First Floor' },
  ];

  // Venue is fixed per day rather than per speaker.
  const venueByDay = {
    'Thursday, September 17, 2026': 'AB1 316',
    'Friday, September 18, 2026': "Visitor's Hostel, First Floor",
  };

  // Group sessions by day, in schedule order, for the day-by-day timeline view.
  const scheduleData = ['Thursday, September 17, 2026', 'Friday, September 18, 2026'].map((day) => ({
    date: day,
    venue: venueByDay[day],
    events: sessionsData.filter((s) => s.day === day),
  }));

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        color: '#242422',
        fontFamily: "'Fraunces', 'Georgia', serif",
      }}
    >
      {/* Campus background image — scrolls with the page so the whole background (sky + buildings) stays visible behind every page, not just the hero */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          minHeight: '100vh',
          zIndex: -2,
          backgroundImage: "url('/campus.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundColor: '#bcdcf5',
        }}
      />
      {/* Light veil for text contrast — subtle everywhere, never fades to a solid block */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          minHeight: '100vh',
          zIndex: -1,
          background: activeTab === 'home'
            ? 'linear-gradient(180deg, rgba(251,250,247,0) 0%, rgba(251,250,247,0.08) 55%, rgba(251,250,247,0.35) 100%)'
            : 'rgba(251,250,247,0.55)',
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

        html {
          scroll-behavior: smooth;
        }

        * {
          transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translate3d(0, 14px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        .fade-in {
          animation: fadeSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .fade-in-1 { animation-delay: 0.04s; }
        .fade-in-2 { animation-delay: 0.1s; }
        .fade-in-3 { animation-delay: 0.16s; }
        .fade-in-4 { animation-delay: 0.22s; }

        .page-enter {
          animation: fadeSlideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .stagger-card {
          animation: fadeSlideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        .link-hover {
          transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), color 0.2s ease;
          display: inline-block;
        }
        .link-hover:hover {
          transform: translateY(-2px);
          color: #B23A48 !important;
        }
        .nav-link {
          transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), color 0.2s ease, background-color 0.2s ease;
        }
        .nav-link:hover {
          transform: translateY(-1px);
          color: #B23A48 !important;
        }
        .soft-card {
          transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.22s ease, border-color 0.22s ease;
        }
        .soft-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -12px rgba(60, 74, 62, 0.18);
          border-color: #C9C4B4 !important;
        }
        .cta-button {
          transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease, background-color 0.2s ease;
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
          -webkit-font-smoothing: antialiased;
          text-rendering: geometricPrecision;
        }
      `}</style>

      {/* Navigation Bar */}
      <header
        className="sticky top-0 z-50 sans"
        style={{
          background: activeTab === 'home' ? 'rgba(251, 250, 247, 0.55)' : 'rgba(251, 250, 247, 0.92)',
          backdropFilter: 'blur(8px)',
          borderBottom: activeTab === 'home' ? '1px solid rgba(223,218,205,0.5)' : '1px solid #DFDACD',
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
                <span className="hidden sm:block text-lg font-medium tracking-tight leading-tight" style={{ color: '#2B2B2E', fontFamily: "'Fraunces', 'Georgia', serif", fontOpticalSizing: 'auto', letterSpacing: '-0.01em' }}>
                  Discussion Meeting on Topics in Algebra
                </span>
                <span className="block sm:hidden text-sm font-medium tracking-tight leading-tight truncate" style={{ color: '#2B2B2E', fontFamily: "'Fraunces', 'Georgia', serif" }}>
                  Discussion Meeting on Algebra
                </span>
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
          <div key="home" className="page-enter">
            {/* Hero Section — sized so headline + buttons land on the blue sky part of the background image, on phone, tablet and desktop */}
            <section
              className="relative overflow-hidden flex items-start justify-center px-4 sm:px-6 lg:px-8"
              style={{
                minHeight: 'min(88vh, 620px)',
                paddingTop: 'clamp(1.5rem, 6vh, 4rem)',
                paddingBottom: '2rem',
              }}
            >
              <div className="relative w-full max-w-5xl mx-auto text-center">
                <h1
                  className="fade-in fade-in-2 font-semibold tracking-tight mb-5"
                  style={{
                    color: '#20262A',
                    letterSpacing: '-0.015em',
                    fontSize: 'clamp(1.9rem, 6vw, 4.5rem)',
                    lineHeight: 1.08,
                    textShadow: '0 2px 18px rgba(255,255,255,0.55)',
                  }}
                >
                  Discussion Meeting on <br />
                  Topics in Algebra <br />
                  <span style={{ color: '#2E4A3F' }}>IISER Bhopal</span>
                </h1>

                <p
                  className="fade-in fade-in-3 max-w-2xl mx-auto mb-6 leading-relaxed sans"
                  style={{
                    color: '#33393D',
                    fontSize: 'clamp(0.9rem, 2vw, 1.125rem)',
                    textShadow: '0 1px 12px rgba(255,255,255,0.6)',
                  }}
                >
                  Bringing together researchers, academicians, and students to discuss ongoing research in Commutative Algebra, Algebraic Geometry, and Representation Theory.
                </p>

                {/* Event Highlights Badges */}
                <div className="fade-in fade-in-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium mb-8 sans">
                  <div
                    className="soft-card flex items-center space-x-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid #DFDACD', color: '#3F3D38', backdropFilter: 'blur(4px)' }}
                  >
                    <Calendar size={17} style={{ color: '#3C4A3E' }} />
                    <span>September 17–18, 2026</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="soft-card flex items-center space-x-2 px-3.5 py-2 sm:px-4 sm:py-2 rounded-lg cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid #DFDACD', color: '#3F3D38', backdropFilter: 'blur(4px)' }}
                  >
                    <MapPin size={17} style={{ color: '#8C5A5A' }} />
                    <span>IISER Bhopal, Madhya Pradesh, India</span>
                  </button>
                </div>

                <div className="fade-in fade-in-4 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 sans">
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className="cta-button w-full sm:w-auto px-7 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
                    style={{ background: '#3C4A3E', color: '#FBFAF7', boxShadow: '0 6px 20px -8px rgba(0,0,0,0.35)' }}
                  >
                    <span>View Schedule</span>
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={() => setActiveTab('registration')}
                    className="cta-button w-full sm:w-auto px-7 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
                    style={{ background: 'rgba(255,255,255,0.95)', color: '#3F3D38', border: '1px solid #C9C4B4', boxShadow: '0 6px 20px -8px rgba(0,0,0,0.2)' }}
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
          <div key="about" className="page-enter py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#2B2B2E' }}>About the Meeting</h1>

            <div className="space-y-6 leading-relaxed" style={{ color: '#3F3D38' }}>
              <div className="p-6 sm:p-8 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #DFDACD' }}>
                <h2 className="text-xl font-semibold mb-3" style={{ color: '#2B2B2E' }}>Overview & Vision</h2>
                <p className="mb-4">
                  The <strong>Discussion Meeting on Topics in Algebra</strong> is organized (and supported) by the Department of Mathematics at the Indian Institute of Science Education and Research (IISER) Bhopal. This meeting takes place on <strong>September 17 and September 18, 2026</strong>, and it aims to create a learning environment for researchers in the fields, and students with aligning interests.
                </p>
                <p>
                  This two-day event includes addresses from various researchers in these areas, coming from different parts of this country.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #DFDACD' }}>
                <h2 className="text-xl font-semibold mb-3" style={{ color: '#2B2B2E' }}>About IISER Bhopal</h2>
                <p>
                  IISER Bhopal was established in 2008 by the Ministry of Education, Government of India, and is dedicated to fostering the highest quality of scientific research and education. The Department of Mathematics at IISER Bhopal actively engages in research which spans across Algebra, Number Theory, Geometry, Topology, and Analysis.
                </p>
              </div>

              <div className="pt-4">
                <div className="p-5 rounded-lg" style={{ background: '#F6F2EA', border: '1px solid #DFDACD' }}>
                  <h3 className="font-semibold mb-2" style={{ color: '#2B2B2E' }}>Venue & Dates</h3>
                  <p className="text-sm" style={{ color: '#6B6A5F' }}>
                    Thursday, September 17, 2026 — AB1-316, Third Floor (Seminar Hall)<br />
                    Friday, September 18, 2026 — Visitor Hostel, First Floor<br />
                    IISER Bhopal Campus, Bhauri,<br />
                    Bhopal 462066, Madhya Pradesh, India
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #DFDACD' }}>
                <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2" style={{ color: '#2B2B2E' }}>
                  <Users size={20} style={{ color: '#3C4A3E' }} />
                  <span>Organizers</span>
                </h2>
                <ul className="space-y-2 text-sm sans mb-6" style={{ color: '#3F3D38' }}>
                  <li>Dr. Sankhaneel Bisui</li>
                  <li>Dr. Anjan Gupta</li>
                  <li>Dr. Vivek Sadhu</li>
                </ul>

                <h3 className="text-base font-semibold mb-3" style={{ color: '#2B2B2E' }}>Student Volunteers</h3>
                <ul className="space-y-2 text-sm sans" style={{ color: '#3F3D38' }}>
                  <li>Kader Ali</li>
                  <li>Adeetya Choubey — Website</li>
                  <li>Kritika Pahilajani — Poster</li>
                  <li>Mahadeb Pal</li>
                  <li>Anshika Patel</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SCHEDULE ==================== */}
        {activeTab === 'schedule' && (
          <div key="schedule" className="page-enter py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#2B2B2E' }}>Schedule & Speakers</h1>
                <p className="sans" style={{ color: '#6B6A5F' }}>Day-by-day schedule of talks, with speaker details (September 17–18, 2026).</p>
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

            <div className="space-y-12">
              {scheduleData.map((day, dayIdx) => {
                const visibleEvents = day.events.filter((event) => {
                  if (event.type === 'recess') return !searchQuery;
                  return (
                    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.institution.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                });
                if (visibleEvents.length === 0) return null;

                return (
                  <div key={dayIdx} className="stagger-card rounded-lg overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #DFDACD', animationDelay: `${dayIdx * 0.1}s` }}>
                    <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2" style={{ background: '#EFEAE0', borderBottom: '1px solid #DFDACD' }}>
                      <h2 className="text-xl font-semibold" style={{ color: '#3C4A3E' }}>{day.date}</h2>
                      <span
                        className="inline-flex items-center space-x-2 text-base sm:text-lg font-semibold self-start sm:self-auto"
                        style={{ color: '#3C4A3E' }}
                      >
                        <MapPin size={18} />
                        <span>{day.venue}</span>
                      </span>
                    </div>
                    <div className="divide-y" style={{ borderColor: '#E9E4D6' }}>
                      {visibleEvents.map((event, eventIdx) => (
                        event.type === 'recess' ? (
                          <div
                            key={eventIdx}
                            className="p-5 sm:p-6 flex items-center justify-between gap-4"
                            style={{ background: '#FBFAF7' }}
                          >
                            <div className="flex items-center space-x-4">
                              <div
                                className="flex items-center space-x-1.5 text-sm font-semibold mono px-2.5 py-1 rounded-md whitespace-nowrap"
                                style={{ color: '#8A8577', background: '#F6F2EA', border: '1px solid #E9E4D6' }}
                              >
                                <Clock size={14} />
                                <span>{event.time}</span>
                              </div>
                              <h3 className="text-sm font-medium sans" style={{ color: '#8A8577' }}>Recess</h3>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={eventIdx}
                            className="p-5 sm:p-6 flex items-start space-x-4"
                          >
                            <div
                              className="h-11 w-11 shrink-0 rounded-full flex items-center justify-center hidden sm:flex"
                              style={{ background: '#EFEAE0', color: '#3C4A3E' }}
                            >
                              <GraduationCap size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="text-base sm:text-lg font-bold mb-1" style={{ color: '#2B2B2E' }}>
                                {event.talkTitle}
                              </p>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                                <h3 className="text-base font-semibold" style={{ color: '#3F3D38' }}>{event.name}</h3>
                                <div
                                  className="flex items-center space-x-1.5 text-sm font-semibold mono px-2.5 py-1 rounded-md whitespace-nowrap self-start"
                                  style={{ color: '#3C4A3E', background: '#EFEAE0', border: '1px solid #DAD3C0' }}
                                >
                                  <Clock size={14} />
                                  <span>{event.time}</span>
                                </div>
                              </div>
                              <p className="text-sm sans mb-3" style={{ color: '#6B6A5F' }}>{event.affiliation}</p>

                              <p className="text-sm leading-relaxed" style={{ color: '#6B6A5F' }}>
                                <span className="font-semibold sans" style={{ color: '#5C5A52' }}>Abstract: </span>
                                {event.abstract}
                              </p>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                );
              })}

              {scheduleData.every((day) =>
                day.events.filter((event) => {
                  if (event.type === 'recess') return !searchQuery;
                  return (
                    event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    event.institution.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                }).length === 0
              ) && (
                <div className="text-center py-12 rounded-lg sans" style={{ background: '#F6F2EA', border: '1px solid #DFDACD' }}>
                  <p style={{ color: '#8A8577' }}>No speakers match your query.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== POSTER ==================== */}
        {activeTab === 'poster' && (
          <div key="poster" className="page-enter py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#2B2B2E' }}>Poster</h1>
            <p className="mb-8 sans" style={{ color: '#6B6A5F' }}>
              The event poster for the Discussion Meeting on Topics in Algebra.
            </p>

            <div
              className="soft-card p-12 sm:p-20 rounded-lg flex flex-col items-center justify-center text-center"
              style={{ background: '#F6F2EA', border: '1px dashed #C9C4B4' }}
            >
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mono mb-4"
                style={{ background: '#EFEAE0', color: '#8C5A5A', border: '1px solid #DAD3C0' }}
              >
                Under Construction
              </span>
              <p className="text-sm sans" style={{ color: '#8A8577' }}>
                The poster is being finalised and will be added here shortly.
              </p>
            </div>
          </div>
        )}

        {/* ==================== REGISTRATION ==================== */}
        {activeTab === 'registration' && (
          <div key="registration" className="page-enter py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8" style={{ color: '#2B2B2E' }}>Registration</h1>

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
                    <span>Only members of the IISER Bhopal Department of Mathematics are allowed to register.</span>
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
            </div>
          </div>
        )}

        {/* ==================== CONTACT ==================== */}
        {activeTab === 'contact' && (
          <div key="contact" className="page-enter py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#2B2B2E' }}>Contact & Venue</h1>
            <p className="mb-10 sans" style={{ color: '#6B6A5F' }}>Get in touch with the meeting's organizing committee.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sans">
              {/* Contact Information */}
              <div className="space-y-6">
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

                <div className="soft-card p-6 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #DFDACD' }}>
                  <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2" style={{ color: '#2B2B2E' }}>
                    <Mail size={20} style={{ color: '#3C4A3E' }} />
                    <span>Queries</span>
                  </h2>
                  <p className="text-sm mb-3" style={{ color: '#3F3D38' }}>For queries, contact:</p>
                  <ul className="space-y-3 text-sm" style={{ color: '#3F3D38' }}>
                    <li>
                      <span className="font-semibold">Adeetya</span> —{' '}
                      <a href="mailto:adeetya22@iiserb.ac.in" className="link-hover" style={{ color: '#3C4A3E' }}>
                        adeetya22@iiserb.ac.in
                      </a>
                    </li>
                    <li>
                      <span className="font-semibold">Kritika</span> —{' '}
                      <a href="mailto:kritika22@iiserb.ac.in" className="link-hover" style={{ color: '#3C4A3E' }}>
                        kritika22@iiserb.ac.in
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
