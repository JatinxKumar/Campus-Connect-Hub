import ClubCard from "@/components/ClubCard";
import EventCard from "@/components/EventCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowRight,
  Calendar,
  Search,
  Sparkles,
  Star,
  Trophy,
  Users,
  Zap,
  Moon,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const categories = [
  "Tech",
  "Music",
  "Sports",
  "Robotics",
  "Dance",
  "Photography",
];

const trendingSearches = [
  "Hackathon",
  "AI Club",
  "Dance Workshop",
  "Robotics",
  "Music Fest",
];

export default function Home() {
  const { clubs, events, recommendedClubs, userProfile } = useAppContext();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const featuredClubs = clubs.filter((club) => club.featured).slice(0, 3);
  const upcomingEvents = events.slice(0, 3);

  const [searchQuery, setSearchQuery] = useState("");
  const [showTrending, setShowTrending] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);

  const words = ["Discover", "Connect", "Lead", "Innovate"];

  useEffect(() => {
    const current = words[wordIndex];
    let index = 0;

    const interval = setInterval(() => {
      setTypedText(current.slice(0, index));
      index++;

      if (index > current.length) {
        clearInterval(interval);
        setTimeout(() => {
          setWordIndex((prev) => (prev + 1) % words.length);
        }, 1500);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [wordIndex]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/clubs?search=${searchQuery}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-28 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_25%),radial-gradient(circle_at_80%_30%,rgba(129,140,248,0.20),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(244,114,182,0.15),transparent_25%)]" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <Badge className="mb-8 border-sky-400/30 bg-sky-500/10 px-6 py-2 text-sky-300 backdrop-blur-xl">
            <Sparkles className="mr-2 h-4 w-4" />
            The Future of Campus Communities
          </Badge>

          <h3 className="mx-auto max-w-4xl text-5xl font-black leading-tight md:text-6xl lg:text-7xl">
            <span className="block text-foreground">{typedText}</span>
            <span className="block bg-gradient-to-r from-sky-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">
              Connect.
            </span>
            <span className="block text-foreground">Lead.</span>
          </h3>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
            Join elite communities, attend unforgettable events, and build
            experiences that shape your future.
          </p>

          {/* Search */}
          <motion.form
            onSubmit={handleSearch}
            className="relative mx-auto mt-14 max-w-4xl"
          >
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-500 opacity-30 blur-xl" />

            <div className="relative flex items-center rounded-3xl border border-border bg-background/90 backdrop-blur-2xl p-2">
              <Search className="ml-5 h-6 w-6 text-muted-foreground" />

              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowTrending(true)}
                onBlur={() => setTimeout(() => setShowTrending(false), 200)}
                placeholder="Search clubs, events, communities..."
                className="h-16 border-0 bg-transparent text-lg text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
              />

              <Button
                type="submit"
                className="h-14 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-8 text-lg shadow-xl shadow-sky-500/30"
              >
                Explore Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {showTrending && (
              <div className="absolute left-0 right-0 top-full z-50 mt-4 rounded-3xl border border-border bg-background/95 p-6 backdrop-blur-2xl">
                <p className="mb-4 text-left text-sm text-muted-foreground">
                  Trending Searches
                </p>

                <div className="flex flex-wrap gap-3">
                  {trendingSearches.map((trend) => (
                    <button
                      key={trend}
                      type="button"
                      onClick={() => {
                        setSearchQuery(trend);
                        navigate(`/clubs?search=${trend}`);
                      }}
                      className="rounded-full border border-border bg-secondary px-5 py-2 text-sm transition hover:border-sky-400 hover:text-sky-400"
                    >
                      #{trend}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.form>

          {/* Category Chips */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => navigate(`/clubs?category=${category}`)}
                className="rounded-full border border-border bg-card/80 px-5 py-2 text-sm text-muted-foreground backdrop-blur-xl transition-all hover:scale-105 hover:border-sky-400 hover:text-sky-400"
              >
                #{category}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/clubs">
              <Button className="h-14 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 px-10 text-lg shadow-2xl shadow-sky-500/25">
                Browse Clubs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link to="/events">
              <Button
                variant="outline"
                className="h-14 rounded-2xl border-border bg-card/60 px-10 text-lg backdrop-blur-xl"
              >
                <Calendar className="mr-2 h-5 w-5" />
                View Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - Reimagined */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Glows for Depth */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Users,
                value: clubs.length,
                suffix: "+",
                label: "Active Clubs",
                description: "Vibrant student communities across all technical and cultural domains.",
                color: "text-sky-400",
                bg: "bg-sky-500/5",
                border: "border-sky-500/20",
              },
              {
                icon: Calendar,
                value: events.length,
                suffix: "+",
                label: "Live Events",
                description: "Workshops, hackathons, and cultural fests happening every week.",
                color: "text-purple-400",
                bg: "bg-purple-500/5",
                border: "border-purple-500/20",
              },
              {
                icon: Trophy,
                value: 10,
                suffix: "K+",
                label: "Active Students",
                description: "Collaborative learners building their professional portfolios through campus life.",
                color: "text-pink-400",
                bg: "bg-pink-500/5",
                border: "border-pink-500/20",
              },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`group relative rounded-3xl border ${stat.border} ${stat.bg} p-8 backdrop-blur-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10`}
              >
                {/* Decorative Icon Glow */}
                <div className={`absolute top-8 right-8 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl ${stat.color}`}>
                  <stat.icon className="h-16 w-16" />
                </div>

                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} border ${stat.border}`}>
                  <stat.icon className="h-7 w-7" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-5xl font-black tracking-tight flex items-baseline">
                    <span className="text-white">{stat.value}</span>
                    <span className={`${stat.color} ml-1`}>{stat.suffix}</span>
                  </h3>
                  <p className="text-lg font-semibold text-foreground">{stat.label}</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                {/* Subtle Progress Bar Decoration */}
                <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className={`h-full bg-gradient-to-r from-transparent via-${stat.color.split('-')[1]}-500/40 to-transparent`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {isAuthenticated && userProfile?.interests.length ? (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="mb-14 flex items-end justify-between">
              <div>
                <p className="mb-3 text-emerald-400">FOR YOUR INTERESTS</p>
                <h2 className="text-5xl font-black">Suggested Communities</h2>
              </div>
            </div>

            {recommendedClubs.length ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {recommendedClubs.map((club) => (
                  <div
                    key={club.id}
                    className="rounded-3xl border border-border bg-card/40 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-3 hover:border-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-500/10"
                  >
                    <ClubCard club={club} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-card/40 p-10 text-muted-foreground backdrop-blur-2xl">
                Your interest tags are saved. Join a few clubs to unlock sharper recommendations here.
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* Featured Clubs */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="mb-3 text-sky-400">FEATURED CLUBS</p>
              <h2 className="text-5xl font-black">Popular Communities</h2>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredClubs.map((club) => (
              <div
                key={club.id}
                className="rounded-3xl border border-border bg-card/40 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-3 hover:border-sky-400/40 hover:shadow-2xl hover:shadow-sky-500/10"
              >
                <ClubCard club={club} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="mb-3 text-pink-400">UPCOMING EVENTS</p>
              <h2 className="text-5xl font-black">Don't Miss Out</h2>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-3xl border border-border bg-card/40 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-3 hover:border-pink-400/40 hover:shadow-2xl hover:shadow-pink-500/10"
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// import { motion } from "framer-motion";
// import { ArrowRight, Rocket, Sparkles, Trophy, Users } from "lucide-react";

// const Home = () => {
//   const features = [
//     {
//       icon: <Rocket size={42} />,
//       title: "Hackathons",
//       desc: "Build futuristic solutions with brilliant minds and win exciting prizes.",
//     },
//     {
//       icon: <Trophy size={42} />,
//       title: "Pro Shows",
//       desc: "Experience electrifying performances and unforgettable nights.",
//     },
//     {
//       icon: <Users size={42} />,
//       title: "Workshops",
//       desc: "Learn from industry experts and master cutting-edge technologies.",
//     },
//   ];

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background:
//           "radial-gradient(circle at 20% 20%, rgba(0,149,255,0.25), transparent 20%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.12), transparent 12%), radial-gradient(circle at 50% 80%, rgba(0,89,255,0.18), transparent 30%), linear-gradient(180deg, #020617 0%, #07152f 35%, #081f45 65%, #020617 100%)",
//         color: "white",
//         overflow: "hidden",
//         position: "relative",
//         fontFamily: "'Poppins', sans-serif",
//       }}
//     >
//       {/* Stars */}
//       <div
//         style={{
//           position: "absolute",
//           inset: 0,
//           backgroundImage: `
//             radial-gradient(2px 2px at 20px 30px, white, transparent),
//             radial-gradient(2px 2px at 150px 120px, white, transparent),
//             radial-gradient(1.5px 1.5px at 300px 80px, white, transparent),
//             radial-gradient(2px 2px at 500px 200px, white, transparent),
//             radial-gradient(2px 2px at 700px 100px, white, transparent),
//             radial-gradient(1.5px 1.5px at 900px 250px, white, transparent),
//             radial-gradient(2px 2px at 1200px 150px, white, transparent)
//           `,
//           opacity: 0.8,
//           zIndex: 0,
//         }}
//       />

//       {/* Navbar */}
//       <nav
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "30px 80px",
//           position: "relative",
//           zIndex: 10,
//         }}
//       >
//         <h1
//           style={{
//             fontSize: "2rem",
//             fontWeight: "800",
//             letterSpacing: "1px",
//           }}
//         >
//           incridea
//         </h1>

//         <div
//           style={{
//             display: "flex",
//             gap: "40px",
//             fontSize: "1.1rem",
//           }}
//         >
//           {["Home", "Events", "Proshow", "Contact"].map((item) => (
//             <a
//               key={item}
//               href="/"
//               style={{
//                 color: "white",
//                 textDecoration: "none",
//               }}
//             >
//               {item}
//             </a>
//           ))}
//         </div>

//         <button
//           style={{
//             padding: "14px 35px",
//             borderRadius: "50px",
//             border: "2px solid rgba(255,255,255,0.4)",
//             background: "transparent",
//             color: "white",
//             cursor: "pointer",
//             fontSize: "1rem",
//           }}
//         >
//           Login
//         </button>
//       </nav>

//       {/* Hero Section */}
//       <section
//         style={{
//           minHeight: "90vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "0 80px",
//           position: "relative",
//           zIndex: 2,
//         }}
//       >
//         {/* Left Content */}
//         <motion.div
//           initial={{ opacity: 0, x: -80 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 1 }}
//           style={{ flex: 1 }}
//         >
//           <div
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: "10px",
//               padding: "12px 24px",
//               borderRadius: "50px",
//               background: "rgba(255,255,255,0.1)",
//               backdropFilter: "blur(10px)",
//               marginBottom: "30px",
//             }}
//           >
//             <Sparkles size={20} />
//             Annual Tech Fest 2025
//           </div>

//           <h1
//             style={{
//               fontSize: "8rem",
//               fontWeight: "900",
//               lineHeight: "0.9",
//               marginBottom: "20px",
//               letterSpacing: "-5px",
//             }}
//           >
//             INCRI<span style={{ color: "#60a5fa" }}>DEA</span>
//           </h1>

//           <p
//             style={{
//               fontSize: "2rem",
//               marginBottom: "50px",
//               color: "#d1d5db",
//             }}
//           >
//             Explore the Infinite.
//           </p>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "15px",
//               padding: "22px 45px",
//               borderRadius: "70px",
//               border: "none",
//               background: "linear-gradient(135deg, #2563eb, #60a5fa)",
//               color: "white",
//               fontSize: "1.4rem",
//               cursor: "pointer",
//               boxShadow: "0 20px 40px rgba(37,99,235,0.4)",
//             }}
//           >
//             See Events <ArrowRight size={28} />
//           </motion.button>
//         </motion.div>

//         {/* Astronaut */}
//         <motion.img
//           src=""
//           alt="astronaut"
//           initial={{ opacity: 0, x: 100 }}
//           animate={{
//             opacity: 1,
//             x: 0,
//             y: [0, -20, 0],
//           }}
//           transition={{
//             duration: 1.5,
//             y: {
//               repeat: Infinity,
//               duration: 4,
//             },
//           }}
//           style={{
//             width: "700px",
//             maxWidth: "50%",
//             objectFit: "contain",
//             filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.5))",
//           }}
//         />
//       </section>

//       {/* Earth */}
//       <div
//         style={{
//           position: "absolute",
//           bottom: "-400px",
//           left: "50%",
//           transform: "translateX(-50%)",
//           width: "1000px",
//           height: "1000px",
//           borderRadius: "50%",
//           background:
//             "radial-gradient(circle at 30% 30%, #93c5fd, #2563eb 40%, #0f172a 80%)",
//           boxShadow:
//             "0 0 100px rgba(59,130,246,0.6), inset -50px -50px 100px rgba(0,0,0,0.6)",
//         }}
//       />

//       {/* Features */}
//       <section
//         style={{
//           padding: "150px 80px",
//           position: "relative",
//           zIndex: 5,
//         }}
//       >
//         <motion.h2
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           style={{
//             textAlign: "center",
//             fontSize: "4rem",
//             marginBottom: "80px",
//           }}
//         >
//           Why Join Incridea?
//         </motion.h2>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
//             gap: "40px",
//           }}
//         >
//           {features.map((item, index) => (
//             <motion.div
//               key={index}
//               whileHover={{ y: -15 }}
//               initial={{ opacity: 0, y: 80 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.2 }}
//               style={{
//                 padding: "50px 35px",
//                 borderRadius: "30px",
//                 background: "rgba(255,255,255,0.08)",
//                 backdropFilter: "blur(20px)",
//                 border: "1px solid rgba(255,255,255,0.1)",
//                 textAlign: "center",
//               }}
//             >
//               <div
//                 style={{
//                   color: "#60a5fa",
//                   marginBottom: "25px",
//                 }}
//               >
//                 {item.icon}
//               </div>

//               <h3
//                 style={{
//                   fontSize: "2rem",
//                   marginBottom: "20px",
//                 }}
//               >
//                 {item.title}
//               </h3>

//               <p
//                 style={{
//                   color: "#d1d5db",
//                   lineHeight: "1.8",
//                   fontSize: "1.1rem",
//                 }}
//               >
//                 {item.desc}
//               </p>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* CTA */}
//       <section
//         style={{
//           padding: "100px 80px 150px",
//           textAlign: "center",
//           position: "relative",
//           zIndex: 5,
//         }}
//       >
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           whileInView={{ opacity: 1, scale: 1 }}
//           style={{
//             maxWidth: "900px",
//             margin: "0 auto",
//             padding: "80px",
//             borderRadius: "40px",
//             background: "rgba(255,255,255,0.08)",
//             backdropFilter: "blur(25px)",
//             border: "1px solid rgba(255,255,255,0.15)",
//           }}
//         >
//           <h2
//             style={{
//               fontSize: "4rem",
//               marginBottom: "20px",
//             }}
//           >
//             Ready To Launch?
//           </h2>

//           <p
//             style={{
//               fontSize: "1.5rem",
//               color: "#d1d5db",
//               marginBottom: "40px",
//             }}
//           >
//             Join the biggest technical festival of the year.
//           </p>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             style={{
//               padding: "22px 50px",
//               fontSize: "1.3rem",
//               borderRadius: "60px",
//               border: "none",
//               background: "linear-gradient(135deg, #2563eb, #60a5fa)",
//               color: "white",
//               cursor: "pointer",
//               display: "inline-flex",
//               alignItems: "center",
//               gap: "15px",
//             }}
//           >
//             Register Now <ArrowRight size={26} />
//           </motion.button>
//         </motion.div>
//       </section>
//     </div>
//   );
// };

// export default Home;
