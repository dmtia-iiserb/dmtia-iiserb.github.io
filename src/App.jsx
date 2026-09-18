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
  GraduationCap,
  ChevronDown
} from 'lucide-react';

// Reads the current page id from the URL hash (e.g. "#/schedule" -> "schedule").
function getTabFromHash() {
  const hash = window.location.hash || '';
  const cleaned = hash.replace(/^#\/?/, '');
  return cleaned === '' ? 'home' : cleaned;
}

// --- LaTeX rendering support (KaTeX loaded from CDN) -----------------------
// Loads the KaTeX stylesheet, core script, and auto-render extension once,
// and resolves when all three are ready so abstracts with LaTeX (inline $...$
// and display $$...$$) render as proper math, as is standard in math-community
// event pages.
let katexLoadPromise = null;
function loadKatex() {
  if (katexLoadPromise) return katexLoadPromise;
  katexLoadPromise = new Promise((resolve, reject) => {
    if (window.katex && window.renderMathInElement) {
      resolve();
      return;
    }
    if (!document.getElementById('katex-css')) {
      const link = document.createElement('link');
      link.id = 'katex-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css';
      document.head.appendChild(link);
    }
    const loadScript = (id, src) =>
      new Promise((res, rej) => {
        if (document.getElementById(id)) {
          res();
          return;
        }
        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.async = true;
        script.onload = res;
        script.onerror = rej;
        document.body.appendChild(script);
      });

    loadScript('katex-core', 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js')
      .then(() => loadScript('katex-auto-render', 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js'))
      .then(resolve)
      .catch(reject);
  });
  return katexLoadPromise;
}

// Renders a string that mixes plain text with LaTeX ($inline$ and $$display$$)
// as properly typeset math, falling back to plain text before KaTeX loads.
function MathText({ text, className, style }) {
  const ref = React.useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadKatex().then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (ready && ref.current && window.renderMathInElement) {
      window.renderMathInElement(ref.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true },
        ],
        throwOnError: false,
      });
    }
  }, [ready, text]);

  return (
    <span ref={ref} className={className} style={style}>
      {text}
    </span>
  );
}

// A smoothly-animated, accessible "click to see abstract" dropdown.
function AbstractDropdown({ abstract }) {
  const [open, setOpen] = useState(false);
  const contentRef = React.useRef(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(open ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [open, abstract]);

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="inline-flex items-center space-x-1.5 text-sm font-semibold sans"
        style={{
          color: '#3C4A3E',
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <span>{open ? 'Hide abstract' : 'Click to see abstract'}</span>
        <ChevronDown
          size={16}
          style={{
            transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      <div
        style={{
          overflow: 'hidden',
          maxHeight,
          opacity: open ? 1 : 0,
          transition: 'max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease',
        }}
      >
        <div ref={contentRef}>
          <p className="text-sm leading-relaxed pt-3" style={{ color: '#6B6A5F', whiteSpace: 'pre-line' }}>
            <MathText text={abstract} />
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTabState] = useState(getTabFromHash());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navRefs = React.useRef({});
  const navContainerRef = React.useRef(null);
  const [bubbleStyle, setBubbleStyle] = useState({ opacity: 0 });

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

  // Slide the nav "bubble" to sit behind whichever tab is active.
  const updateBubble = useCallback(() => {
    const activeEl = navRefs.current[activeTab];
    const containerEl = navContainerRef.current;
    if (activeEl && containerEl) {
      const containerRect = containerEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      setBubbleStyle({
        opacity: 1,
        transform: `translateX(${activeRect.left - containerRect.left}px)`,
        width: `${activeRect.width}px`,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    updateBubble();
    window.addEventListener('resize', updateBubble);
    return () => window.removeEventListener('resize', updateBubble);
  }, [updateBubble]);

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
    { id: 'participants', label: 'Participants' },
    { id: 'poster', label: 'Poster' },
    { id: 'registration', label: 'Registration' },
    { id: 'contact', label: 'Contact' },
  ];

  // Single source of truth for the day-by-day schedule of talks and recess breaks.
  const sessionsData = [
    { type: 'talk', name: 'Dr. Ananthnarayan H', affiliation: 'IIT Bombay', institution: 'IIT Bombay', website: 'https://www.math.iitb.ac.in/~ananth/', talkTitle: 'Free resolutions and Betti numbers', abstract: `We begin with a quick introduction to the notion of Betti numbers over local or graded rings, and some problems related to them. In particular, we will discuss the motivation behind the Boij–Söderberg conjectures (2008), their resolution by Eisenbud–Schreyer (2009), and if time permits, try to see what works more generally.`, day: 'Thursday, September 17, 2026', time: '2:15 – 3:00 PM', venue: 'AB1 316 (Third Floor)' },
    { type: 'talk', name: 'Dr. Rahul Gupta', affiliation: 'IMSc, Chennai', institution: 'IMSc, Chennai', website: 'https://sites.google.com/view/rahul-gupta-math/welcome?authuser=0', talkTitle: `The \u00e9tale fundamental group and its torsion`, abstract: `The \u00e9tale fundamental group is a generalization of the topological fundamental group and that of the Galois group. We begin the talk with a brief recollection of this generalization. In the talk, we focus on the abelianized \u00e9tale fundamental group of a variety $X$ and denote it by $\\pi_1^{\\mathrm{ab}}(X)$. One advantage of working with the abelianized \u00e9tale fundamental group is that, just as in topology, it is the dual of a cohomology group $H^1(X, \\mathbb{Q}/\\mathbb{Z})$, which makes it a bit easier to do calculations. It is known that the torsion subgroup of $\\pi_1^{\\mathrm{ab}}(X)$ is finite when $X$ is a smooth projective variety over a finite field or a local field. In the talk, we sketch a proof of the finiteness of the torsion subgroup of $\\pi_1^{\\mathrm{ab}}(X)$ when $X$ is a regular (not necessarily smooth) geometrically integral projective variety over a positive characteristic local field. The talk is based on joint work with Dr. Jitendra Rathore.`, day: 'Thursday, September 17, 2026', time: '3:05 – 3:50 PM', venue: 'AB1 316 (Third Floor)' },
    { type: 'recess', day: 'Thursday, September 17, 2026', time: '3:50 – 4:10 PM', venue: 'AB1 316 (Third Floor)' },
    { type: 'talk', name: 'Dr. Ajay Kumar', affiliation: 'IIT Jammu', institution: 'IIT Jammu', website: 'https://iitjammu.ac.in/faculty/~ajaykumar', talkTitle: 'Symbolic Powers of Monomial Ideals and Simis Ideals', abstract: `Characterizing monomial ideals for which symbolic and ordinary powers coincide is a fundamental problem in commutative algebra. Monomial ideals satisfying this property are known as Simis ideals. A recent conjecture of M\u00e9ndez, Pinto, and Villarreal asserts that every Simis monomial ideal with a minimal irreducible decomposition and no embedded primes can be obtained from a square-free Simis monomial ideal by assigning suitable weights to its variables. In this talk, we introduce the conjecture and discuss its motivation, along with its connections to combinatorial structures arising from graphs and simplicial complexes. We then present some recent results that establish the conjecture for several important classes of monomial ideals.`, day: 'Thursday, September 17, 2026', time: '4:10 – 4:55 PM', venue: 'AB1 316 (Third Floor)' },
    { type: 'talk', name: 'Dr. Deblina Dey', affiliation: 'IISER Bhopal', institution: 'IISER Bhopal', talkTitle: `Analytic Spread of Binomial Edge Ideals`, abstract: `Let $G$ be a finite simple graph and $J_G$ its binomial edge ideal. We study the analytic spread $\\ell(J_G)$, an invariant defined as the Krull dimension of the fiber cone of $J_G$. Since $J_G$ is equigenerated, its fiber cone can be identified with the algebra generated by the edge binomials, allowing us to interpret $\\ell(J_G)$ as a transcendence degree. For a connected graph on $n$ vertices, we prove the sharp bounds $n-1 \\leq \\ell(J_G) \\leq 2n-3$. We study the change in analytic spread under the graph operation of adding a leaf, leading to the computation of analytic spread for several families of graphs, including trees, cycles, and pseudoforests. I will discuss some of the main ideas behind these results.`, day: 'Thursday, September 17, 2026', time: '5:00 – 5:25 PM', venue: 'AB1 316 (Third Floor)' },
    { type: 'talk', name: 'Divyasree CR', affiliation: 'IISER Pune', institution: 'IISER Pune', website: 'https://sites.google.com/view/divyasreecr/home', talkTitle: 'Zero-Cycles on Twisted Grassmannians', abstract: `The first systematic study of zero-cycles on projective homogeneous varieties was carried out by Krashen in 2010, where he proved the triviality of the group $A_0(X)$ of degree-zero zero-cycles for many projective homogeneous varieties of the classical groups, with subsequent generalizations by Chernousov and Merkurjev. In this talk, we study zero-cycles on generalized Severi–Brauer varieties, which are twisted forms of Grassmannians. Let $A$ be a central simple algebra over a field $F$ of index $n$, and let $SB_r(A)$ be the $r$-th generalized Severi–Brauer variety. We prove that $A_0(SB_r(A))$ is $(d,n/d)$-torsion, where $d=(r,n)$, and obtain new cases in which $A_0(SB_r(A))=0$. We also show that $A_0(SB_r(A))=0$ when $F$ is a local or global field. This talk is based on joint work with Amit Hogadi.`, day: 'Thursday, September 17, 2026', time: '5:30 – 6:00 PM', venue: 'AB1 316 (Third Floor)' },
    { type: 'talk', name: 'Prof. Om Prakash', affiliation: 'IIT Patna', institution: 'IIT Patna', website: 'https://www.iitp.ac.in/departments/mathematics/faculty/profile?id=116', talkTitle: 'Hulls over a Non-Unital Ring', abstract: `In this talk, we discuss the hulls of linear codes over a non-unital ring $E = \\langle \\kappa, \\tau \\mid 2\\kappa = 2\\tau = 0,\\ \\kappa^2 = \\kappa,\\ \\tau^2 = \\tau,\\ \\kappa\\tau = \\kappa,\\ \\tau\\kappa = \\tau \\rangle$. Initially, we examine the residue and torsion codes of various hulls of $E$-linear codes. Then, we propose four build-up construction methods to construct codes with a larger length and hull-rank from codes with a smaller length and hull-rank. We also give some examples to support our build-up construction methods. Subsequently, we discuss the permutation equivalence of two free $E$-linear codes and the hull-variation problems. This is joint work with Anup Kushwaha.`, day: 'Friday, September 18, 2026', time: '10:00 – 10:45 AM', venue: 'Visitor Hostel, First Floor' },
    { type: 'recess', day: 'Friday, September 18, 2026', time: '10:45 – 11:00 AM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Varsha Vasudevan', affiliation: 'IISER Bhopal', institution: 'IISER Bhopal', talkTitle: 'Correlation coefficient of the Symmetric group', abstract: `Let $G$ be a finite group and $H, K$ be subgroups of $G$ such that $(G, H)$ and $(G, K)$ are Gelfand pairs. Given an irreducible complex representation $\\pi$ of $G$, we can attach a non-negative real number $c(\\pi; H, K)$ called the correlation coefficient. In this talk, we shall discuss the problem of determining the correlation coefficient $c(\\pi; H, K)$ for any pair $(H, K)$ of strong Gelfand subgroups of $G = S_n$. This is based on a joint work with Kumar Balasubramanian, Sanjeev Kumar Pandey and Nandini Parkhi.`, day: 'Friday, September 18, 2026', time: '11:00 – 11:25 AM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Dr. Ekta Tiwari', affiliation: 'IISER Pune', institution: 'IISER Pune', website: 'https://sites.google.com/view/ektatiwari/', talkTitle: 'Branching laws for p-adic groups', abstract: `A classical problem in representation theory is to understand how an irreducible representation of a group decomposes when restricted to its subgroups. Such questions are commonly referred to as branching problems. In this talk, we will explore the restriction of irreducible smooth representations of the quasi-split unramified unitary group $U(1,1)$ to its hyperspecial maximal compact subgroup $K$. We will present explicit branching rules in this setting and discuss several applications that arise from having a concrete description of these restrictions.\n\n$\\textbf{Note:}$ This talk assumes familiarity with basic notions in representation theory.`, day: 'Friday, September 18, 2026', time: '11:30 – 11:55 AM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Dr. Sanjeev Kumar Pandey', affiliation: 'IISER Bhopal', institution: 'IISER Bhopal', talkTitle: 'Self-dual representations of metaplectic $SL(2,F)$', abstract: `Given an irreducible admissible self-dual complex representation $(\\pi, V)$ of an $\\ell$-group $G$, there is a non-degenerate $G$-invariant bilinear form $B$ on $V$. By Schur's lemma, it follows that $B$ is unique (up to scalars) and it is either symmetric or skew-symmetric. The sign of $(\\pi, V)$ is defined to be $1$ in the symmetric case and $-1$ in the skew-symmetric case. Accordingly, the representation is called orthogonal or symplectic. Let $F$ be a non-Archimedean local field of characteristic zero. Let $G = SL(2, F)$ and let $\\widetilde{G}$ be the metaplectic double cover of $G$. In this talk, we present our recent work on the sign of a representation in the context of $\\widetilde{G}$. In particular, we prove an analogue of a result of Dipendra Prasad to determine the sign for certain classes of representations of $\\widetilde{G}$. This is a joint work with Ila Ahmad, Kumar Balasubramanian and Varsha Vasudevan.`, day: 'Friday, September 18, 2026', time: '12:00 – 12:25 PM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Ila Ahmad', affiliation: 'IISER Bhopal', institution: 'IISER Bhopal', talkTitle: 'Twisted sign for representations of metaplectic $GL(2)$', abstract: `Let $F$ be a non-Archimedean local field of characteristic zero and $G = GL(n, F)$. Let $\\pi$ be an irreducible admissible representation of $G$ and let $\\tau$ be the standard involution. It is known that $\\tau$ is a dualizing involution. Hence the notion of the twisted sign of $\\pi$ is well defined and we can determine the twisted sign. Let $\\widetilde{G}$ denote the metaplectic double cover of $GL(2, F)$. Let $\\sigma$ be any lift of $\\tau$ to $\\widetilde{G}$. A recent result establishes that $\\sigma$ is a dualizing involution. In this talk, we discuss the twisted sign problem in the context of representations of $\\widetilde{G}$. This is based on a joint work with Kumar Balasubramanian, Sanjeev Kumar Pandey and Varsha Vasudevan.`, day: 'Friday, September 18, 2026', time: '12:30 – 12:55 PM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Prof. A. V. Jayanthan', affiliation: 'IIT Madras', institution: 'IIT Madras', website: 'https://home.iitm.ac.in/jayanav/', talkTitle: 'Partial Betti splittings', abstract: `We introduce the notion of a partial Betti splitting of a homogeneous ideal, generalizing the notion of a Betti splitting first given by Francisco, Ha, and Van Tuyl. Given a homogeneous ideal $I$ and two ideals $J$ and $K$ such that $I = J + K$, a partial Betti splitting of $I$ relates some of the graded Betti numbers of $I$ with those of $J$, $K$, and $J \\cap K$. As an application, we focus on the partial Betti splittings of binomial edge ideals. Using this new technique, we generalize results of Saeedi Madani and Kiani related to binomial edge ideals with cut edges, we describe a partial Betti splitting for all binomial edge ideals, and we compute the total second Betti number of binomial edge ideals of trees.`, day: 'Friday, September 18, 2026', time: '2:30 – 3:15 PM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Dr. Vaibhav Pandey', affiliation: 'IIT Madras', institution: 'IIT Madras', website: 'https://vaibhav-pandey1.github.io/', talkTitle: 'Symbolic powers of maximal minors under general linkage', abstract: `The symbolic powers of the minors of a generic matrix are well understood as determinantal rings are Algebras with Straightening Laws (ASLs). In particular, the ASL structure readily yields the fact that the symbolic powers of maximal minors agree with the ordinary powers. We prove that the equality of the symbolic and ordinary powers holds for \u2018the most general link\u2019 of maximal minors as well. Better still, the blowup algebras of the general link have precisely the same homological properties as those of the ideal of maximal minors. The key point is that these facts do not follow from standard techniques in liaison theory; we develop the novel tool of Gr\u00f6bner degeneration of links in order to attack the problem. This is joint work with Matteo Varbaro.`, day: 'Friday, September 18, 2026', time: '3:20 – 4:05 PM', venue: 'Visitor Hostel, First Floor' },
    { type: 'recess', day: 'Friday, September 18, 2026', time: '4:05 – 4:25 PM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Dr. Arpan Dutta', affiliation: 'IIT Bhubaneswar', institution: 'IIT Bhubaneswar', website: 'https://sites.google.com/view/arpan-dutta/about-me?authuser=0', talkTitle: 'On the henselian rationality problem', abstract: `The problem of local uniformization is one of the central problems in algebraic geometry and valuation theory. Closely connected is the problem of henselian rationality, which asks whether an immediate extension of valued function fields $(F|K, w)$ of transcendence degree one becomes rational after henselization, that is, if there exists some $X$ in the henselization $F^h$ of $F$ such that $F^h = K(X)^h$. Over tame fields, the problem was answered in the affirmative by Kuhlmann. However, the problem remains open if we remove the tameness hypothesis. In this talk, we will discuss some recent developments over perfect fields. We will first explain the key ideas behind Kuhlmann's proof over tame fields and the obstacles that arise when one attempts to extend these ideas to the perfect-field setting. We will then discuss alternative approaches toward henselian rationality over perfect fields.`, day: 'Friday, September 18, 2026', time: '4:25 – 5:10 PM', venue: 'Visitor Hostel, First Floor' },
    { type: 'talk', name: 'Dr. Sudipta Das', affiliation: 'TIFR Mumbai', institution: 'TIFR Mumbai', website: 'https://sites.google.com/asu.edu/sudipta-das/home', talkTitle: 'Transcendental Epsilon multiplicity via Divisor volumes', abstract: `In this talk we will show that epsilon multiplicity can take transcendental values. The main structural result is a one ideal formula for section rings: under natural positivity hypotheses, the epsilon multiplicity of an ideal generated in one degree is equal to an integral of a divisor volume function. This formula transports an asymptotic colength invariant of ideals to the geometry and arithmetic of divisor volumes. To produce a transcendental value, we combine the formula with a shifted projective-bundle construction inspired by Borntr\u00e4ger and Nickel. The shift places the construction in the positivity range required by the one-ideal formula while preserving the underlying disk geometry of the volume computation. Reversing the order of integration reduces the resulting integral to three integrals of rational functions. Their arctangent terms cancel exactly, whereas the remaining real logarithms form an explicit algebraic linear combination whose value is positive. Baker's theorem then implies transcendence. Consequently, there exists a homogeneous ideal in a normal standard graded domain whose epsilon multiplicity is transcendental. This is a joint work with Stephen Landsittel and Vinh Pham.`, day: 'Friday, September 18, 2026', time: '5:15 – 5:40 PM', venue: 'Visitor Hostel, First Floor' },
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
            ? 'linear-gradient(90deg, rgba(251,250,247,0) 0%, rgba(251,250,247,0.05) 45%, rgba(251,250,247,0.18) 100%)'
            : 'rgba(251,250,247,0.55)',
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600&display=swap');

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
          position: relative;
          transition: color 0.2s ease, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .nav-link:hover {
          transform: translateY(-2px);
        }
        .nav-bubble {
          position: absolute;
          top: 0;
          bottom: 0;
          border-radius: 0.375rem;
          background: rgba(239,234,224,0.85);
          border: 1px solid #DAD3C0;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), width 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease;
          z-index: 0;
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
        .underline-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding-bottom: 2px;
          border-bottom: 1px solid currentColor;
          opacity: 0.85;
          transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease;
        }
        .underline-link:hover {
          transform: translateY(-2px);
          opacity: 1;
        }
        .hero-title {
          font-family: 'Playfair Display', 'Fraunces', 'Georgia', serif;
          font-style: italic;
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
          background: 'transparent',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: 'none',
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
                style={{ background: 'rgba(60,74,62,0.88)', color: '#FBFAF7' }}
              >
                ⊆
              </div>
              <div className="min-w-0">
                <span
                  className="hidden sm:block text-lg font-medium tracking-tight leading-tight"
                  style={{
                    color: activeTab === 'home' ? '#12181A' : '#2B2B2E',
                    fontFamily: "'Fraunces', 'Georgia', serif",
                    fontOpticalSizing: 'auto',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Discussion Meeting on Topics in Algebra
                </span>
                <span
                  className="block sm:hidden text-sm font-medium tracking-tight leading-tight truncate"
                  style={{
                    color: activeTab === 'home' ? '#12181A' : '#2B2B2E',
                    fontFamily: "'Fraunces', 'Georgia', serif",
                  }}
                >
                  Discussion Meeting on Algebra
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav ref={navContainerRef} className="hidden md:flex space-x-1 relative">
              <div className="nav-bubble" style={bubbleStyle} aria-hidden="true" />
              {navigation.map((item) => (
                <button
                  key={item.id}
                  ref={(el) => { navRefs.current[item.id] = el; }}
                  onClick={() => setActiveTab(item.id)}
                  className="nav-link px-4 py-2 rounded-md text-sm font-medium relative"
                  style={{
                    color: activeTab === item.id
                      ? '#3C4A3E'
                      : (activeTab === 'home' ? '#1D2327' : '#5C5A52'),
                    zIndex: 1,
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
                style={{ color: activeTab === 'home' && !mobileMenuOpen ? '#12181A' : '#5C5A52' }}
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
            style={{ background: 'rgba(251,250,247,0.85)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(223,218,205,0.6)' }}
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
                  background: activeTab === item.id ? 'rgba(239,234,224,0.85)' : 'transparent',
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
            {/* Hero Section — content flows over the sky, no boxed backgrounds, text sits directly on the image */}
            <section
              className="relative overflow-hidden flex flex-col items-end justify-start px-5 sm:px-8 lg:px-16"
              style={{
                minHeight: 'calc(100vh - 64px)',
                paddingTop: 'clamp(1.25rem, 5vh, 3.5rem)',
              }}
            >
              <div className="relative w-full max-w-xl text-right">
                <h1
                  className="hero-title fade-in fade-in-2 tracking-tight mb-3 sm:mb-4"
                  style={{
                    color: '#0E1416',
                    letterSpacing: '-0.01em',
                    fontSize: 'clamp(1.6rem, 4.6vw, 3.3rem)',
                    lineHeight: 1.15,
                    fontWeight: 600,
                  }}
                >
                  Discussion Meeting on <br />
                  Topics in Algebra <br />
                  <span style={{ color: '#233A30' }}>IISER Bhopal</span>
                </h1>

                <p
                  className="fade-in fade-in-3 ml-auto mb-6 sm:mb-7 leading-relaxed sans"
                  style={{
                    color: '#171B1D',
                    fontSize: 'clamp(0.8rem, 1.5vw, 1.05rem)',
                    maxWidth: '32rem',
                    fontWeight: 400,
                  }}
                >
                  Bringing together researchers, academicians, and students to discuss ongoing research in Commutative Algebra, Algebraic Geometry, and Representation Theory.
                </p>

                {/* Event Highlights — plain text with a subtle underline instead of bubble badges */}
                <div className="fade-in fade-in-4 flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-xs sm:text-sm font-medium mb-6 sm:mb-8 sans">
                  <span className="underline-link" style={{ color: '#171B1D' }}>
                    <Calendar size={14} style={{ color: '#3C4A3E' }} />
                    <span>September 17–18, 2026</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="underline-link cursor-pointer"
                    style={{ color: '#171B1D', background: 'none', border: 'none', borderBottom: '1px solid currentColor', padding: 0, paddingBottom: '2px' }}
                  >
                    <MapPin size={14} style={{ color: '#8C5A5A' }} />
                    <span>IISER Bhopal, Madhya Pradesh</span>
                  </button>
                </div>

                {/* Primary actions — subtle underline links on mobile, no large button pills */}
                <div className="fade-in fade-in-4 flex flex-row justify-end items-center gap-6 sm:gap-8 sans">
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className="underline-link font-semibold cursor-pointer"
                    style={{ color: '#233A30', background: 'none', border: 'none', borderBottom: '1.5px solid currentColor', padding: 0, paddingBottom: '2px', fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)' }}
                  >
                    <span>View Schedule</span>
                    <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => setActiveTab('registration')}
                    className="underline-link font-semibold cursor-pointer"
                    style={{ color: '#242220', background: 'none', border: 'none', borderBottom: '1.5px solid currentColor', padding: 0, paddingBottom: '2px', fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)' }}
                  >
                    <Users size={16} />
                    <span>Register</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==================== ABOUT US ==================== */}
        {activeTab === 'about' && (
          <div key="about" className="page-enter py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#2B2B2E' }}>About the Meeting</h1>

            <div className="space-y-6 leading-relaxed" style={{ color: '#3F3D38' }}>
              <div className="p-6 sm:p-8 rounded-lg" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}>
                <h2 className="text-xl font-semibold mb-3" style={{ color: '#2B2B2E' }}>Overview & Vision</h2>
                <p className="mb-4">
                  The <strong>Discussion Meeting on Topics in Algebra</strong> is organized (and supported) by the{' '}
                  <a href="https://maths.iiserb.ac.in/" target="_blank" rel="noopener noreferrer" className="link-hover" style={{ color: '#3C4A3E', textDecoration: 'underline' }}>
                    Department of Mathematics
                  </a>{' '}
                  at the Indian Institute of Science Education and Research (IISER) Bhopal. This meeting takes place on <strong>September 17 and September 18, 2026</strong>, and it aims to create a learning environment for researchers in the fields, and students with aligning interests.
                </p>
                <p>
                  This two-day event includes addresses from various researchers in these areas, coming from different parts of this country.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-lg" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}>
                <h2 className="text-xl font-semibold mb-3" style={{ color: '#2B2B2E' }}>
                  About{' '}
                  <a href="https://www.iiserb.ac.in/" target="_blank" rel="noopener noreferrer" className="link-hover" style={{ color: '#3C4A3E', textDecoration: 'underline' }}>
                    IISER Bhopal
                  </a>
                </h2>
                <p>
                  IISER Bhopal was established in 2008 by the Ministry of Education, Government of India, and is dedicated to fostering the highest quality of scientific research and education. The Department of Mathematics at IISER Bhopal actively engages in research which spans across Algebra, Number Theory, Geometry, Topology, and Analysis.
                </p>
              </div>

              <div className="pt-4">
                <div className="p-5 rounded-lg" style={{ background: 'rgba(246,242,234,0.88)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}>
                  <h3 className="font-semibold mb-2" style={{ color: '#2B2B2E' }}>Venue & Dates</h3>
                  <p className="text-sm" style={{ color: '#6B6A5F' }}>
                    Thursday, September 17, 2026 - AB1-316, Third Floor (Seminar Hall)<br />
                    Friday, September 18, 2026 - Visitor Hostel, First Floor<br />
                    IISER Bhopal Campus, Bhauri,<br />
                    Bhopal 462066, Madhya Pradesh, India
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-lg" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}>
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
                  <li>Adeetya Choubey - Website</li>
                  <li>Kritika Pahilajani - Poster</li>
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
                <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#2B2B2E' }}>Schedule</h1>
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
                  style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)', color: '#2B2B2E' }}
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
                  <div key={dayIdx} className="stagger-card rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)', animationDelay: `${dayIdx * 0.1}s` }}>
                    <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2" style={{ background: 'rgba(239,234,224,0.88)', borderBottom: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}>
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
                            style={{ background: 'rgba(251,250,247,0.6)' }}
                          >
                            <div className="flex items-center space-x-4">
                              <div
                                className="flex items-center space-x-1.5 text-sm font-semibold mono px-2.5 py-1 rounded-md whitespace-nowrap"
                                style={{ color: '#8A8577', background: 'rgba(246,242,234,0.88)', border: '1px solid #E9E4D6', backdropFilter: 'blur(6px)' }}
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
                              style={{ background: 'rgba(239,234,224,0.9)', color: '#3C4A3E' }}
                            >
                              <GraduationCap size={20} />
                            </div>
                            <div className="flex-1">
                              <p className="text-base sm:text-lg font-bold mb-1" style={{ color: '#2B2B2E' }}>
                                <MathText text={event.talkTitle} />
                              </p>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                                <h3 className="text-base font-semibold" style={{ color: '#3F3D38' }}>{event.name}</h3>
                                <div
                                  className="flex items-center space-x-1.5 text-sm font-semibold mono px-2.5 py-1 rounded-md whitespace-nowrap self-start"
                                  style={{ color: '#3C4A3E', background: 'rgba(239,234,224,0.9)', border: '1px solid #DAD3C0' }}
                                >
                                  <Clock size={14} />
                                  <span>{event.time}</span>
                                </div>
                              </div>
                              <p className="text-sm sans mb-3" style={{ color: '#6B6A5F' }}>{event.affiliation}</p>

                              {event.abstract && event.abstract !== 'TBA' ? (
                                <AbstractDropdown abstract={event.abstract} />
                              ) : (
                                <p className="text-sm leading-relaxed" style={{ color: '#6B6A5F' }}>
                                  <span className="font-semibold sans" style={{ color: '#5C5A52' }}>Abstract: </span>
                                  {event.abstract}
                                </p>
                              )}
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
                <div className="text-center py-12 rounded-lg sans" style={{ background: 'rgba(246,242,234,0.88)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}>
                  <p style={{ color: '#8A8577' }}>No speakers match your query.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== SPEAKERS ==================== */}
        {activeTab === 'speakers' && (
          <div key="speakers" className="page-enter py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#2B2B2E' }}>Speakers</h1>
            <p className="mb-8 sans" style={{ color: '#6B6A5F' }}>
              Speakers for the Discussion Meeting on Topics in Algebra.
            </p>

            <div className="soft-card rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}>
              <ul>
                {sessionsData
                  .filter((event) => event.type === 'talk')
                  .slice()
                  .sort((a, b) => {
                    const lastName = (fullName) => {
                      const parts = fullName.trim().split(/\s+/);
                      return parts[parts.length - 1].toLowerCase();
                    };
                    return lastName(a.name).localeCompare(lastName(b.name));
                  })
                  .map((speaker, idx) => (
                    <li
                      key={`${speaker.name}-${idx}`}
                      className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4"
                      style={{ borderTop: idx === 0 ? 'none' : '1px solid rgba(223,218,205,0.6)' }}
                    >
                      <div>
                        {speaker.website ? (
                          <a
                            href={speaker.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-hover font-semibold sans block"
                            style={{ color: '#2B2B2E', textDecoration: 'underline' }}
                          >
                            {speaker.name}
                          </a>
                        ) : (
                          <span className="font-semibold sans block" style={{ color: '#2B2B2E' }}>{speaker.name}</span>
                        )}
                      </div>
                      <span className="text-sm sans text-right" style={{ color: '#6B6A5F' }}>{speaker.affiliation}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        {/* ==================== PARTICIPANTS ==================== */}
        {activeTab === 'participants' && (
          <div key="participants" className="page-enter py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#2B2B2E' }}>List of Participants</h1>
            <p className="mb-8 sans" style={{ color: '#6B6A5F' }}>
              Organizers and participants of the Discussion Meeting on Topics in Algebra.
            </p>

            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-lg" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}>
                <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2" style={{ color: '#2B2B2E' }}>
                  <Users size={20} style={{ color: '#3C4A3E' }} />
                  <span>Organizers</span>
                </h2>
                <ul className="space-y-2 text-sm sans" style={{ color: '#3F3D38' }}>
                  <li>Dr. Vivek Sadhu</li>
                  <li>Dr. Anjan Gupta</li>
                  <li>Dr. Sankhaneel Bisui</li>
                </ul>
              </div>

              <div className="p-6 sm:p-8 rounded-lg" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}>
                <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2" style={{ color: '#2B2B2E' }}>
                  <Users size={20} style={{ color: '#3C4A3E' }} />
                  <span>Participants</span>
                </h2>
                <p className="text-xs sans mb-4" style={{ color: '#8A8577' }}>Listed alphabetically by last name.</p>
                <ol className="space-y-2 text-sm sans list-decimal list-inside" style={{ color: '#3F3D38' }}>
                  <li>Kader Ali</li>
                  <li>Swasti Arya</li>
                  <li>Dhrubajyoti Chakraborty</li>
                  <li>Akshay Chauhan</li>
                  <li>Adeetya Choubey</li>
                  <li>Niloy Kumar Dutta</li>
                  <li>Dev Krishna</li>
                  <li>Dewesh Kumar</li>
                  <li>Lalniropuia</li>
                  <li>Manushi</li>
                  <li>K Sreeram Menon</li>
                  <li>Sangsuddha Mukherjee</li>
                  <li>Kritika Pahilajani</li>
                  <li>Mahadeb Pal</li>
                  <li>Anshika Patel</li>
                  <li>Mugdha Mahesh Pokharanakar</li>
                  <li>Priya</li>
                  <li>Dr. Praveen Roy</li>
                  <li>Yash Sharma</li>
                  <li>Kritin Kumar Singh</li>
                  <li>Sandesh Srivastava</li>
                </ol>
              </div>
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
              className="soft-card p-4 sm:p-6 rounded-lg flex flex-col items-center justify-center text-center"
              style={{ background: 'rgba(246,242,234,0.88)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}
            >
              <img
                src="/poster.png"
                alt="Discussion Meeting on Topics in Algebra — event poster"
                className="w-full h-auto rounded-md"
                style={{ maxWidth: '640px' }}
              />
            </div>
          </div>
        )}

        {/* ==================== REGISTRATION ==================== */}
        {activeTab === 'registration' && (
          <div key="registration" className="page-enter py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8" style={{ color: '#2B2B2E' }}>Registration</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {/* Eligibility */}
              <div className="soft-card p-6 rounded-lg" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}>
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
              <div className="soft-card p-6 rounded-lg" style={{ background: 'rgba(246,242,234,0.88)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}>
                <h2 className="text-lg font-semibold mb-3" style={{ color: '#2B2B2E' }}>Notes</h2>
                <ul className="space-y-2 text-sm sans leading-relaxed" style={{ color: '#6B6A5F' }}>
                  <li>• <strong>Registration deadline: 15th September 2026, 11:59 PM.</strong></li>
                  <li>• All talks are open to be attended by everyone. No registration is needed to attend the talks.</li>
                  <li>• Confirmation will be sent by email from the organizing committee.</li>
                  <li>• For queries, write to any one of the organizers or student volunteers.</li>
                </ul>
              </div>
            </div>

            {/* Registration Form */}
            <div className="soft-card p-6 sm:p-8 rounded-lg" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}>
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
                <div className="soft-card p-6 rounded-lg" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}>
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

                <div className="soft-card p-6 rounded-lg" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}>
                  <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2" style={{ color: '#2B2B2E' }}>
                    <Mail size={20} style={{ color: '#3C4A3E' }} />
                    <span>Queries</span>
                  </h2>
                  <p className="text-sm mb-3" style={{ color: '#3F3D38' }}>For queries, contact:</p>
                  <ul className="space-y-3 text-sm" style={{ color: '#3F3D38' }}>
                    <li>
                      <span className="font-semibold">Adeetya</span> -{' '}
                      <a href="mailto:adeetya22@iiserb.ac.in" className="link-hover" style={{ color: '#3C4A3E' }}>
                        adeetya22@iiserb.ac.in
                      </a>
                    </li>
                    <li>
                      <span className="font-semibold">Kritika</span> -{' '}
                      <a href="mailto:kritika22@iiserb.ac.in" className="link-hover" style={{ color: '#3C4A3E' }}>
                        kritika22@iiserb.ac.in
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Location & Travel */}
              <div className="soft-card p-6 rounded-lg flex flex-col justify-between" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(223,218,205,0.7)', backdropFilter: 'blur(8px)' }}>
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
      <footer className="sans" style={{ borderTop: '1px solid rgba(223,218,205,0.6)', background: 'rgba(246,242,234,0.72)', backdropFilter: 'blur(6px)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] sm:text-xs text-center sm:text-left" style={{ color: '#8A8577' }}>
          <span>© 2026 Discussion Meeting on Topics in Algebra, IISER Bhopal</span>
          <span>Website by Adeetya Choubey · Photo by Kritika Pahilajani</span>
        </div>
      </footer>
    </div>
  );
}
