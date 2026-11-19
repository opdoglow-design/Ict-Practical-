// ICT Topics data
window.TOPICS = [
  {
    id: "hardware",
    icon: "🖥️",
    color: "linear-gradient(135deg,#7c5cff,#a78bfa)",
    title: "Computer Hardware",
    desc: "CPU, memory, storage, I/O devices, motherboard and how components work together.",
    lessons: 8,
    level: "Beginner",
    content: [
      "A computer's hardware consists of physical components you can touch.",
      "CPU (Central Processing Unit) is the brain — it executes instructions.",
      "RAM is volatile memory used while programs run; ROM stores firmware.",
      "Storage: HDD (magnetic, slower) vs SSD (flash, faster).",
      "Motherboard connects CPU, RAM, storage and peripherals via buses.",
      "Input devices: keyboard, mouse, scanner. Output: monitor, printer, speakers.",
      "Power supply converts AC to DC and protects components.",
      "Cooling (fans/heat sinks) prevents thermal damage."
    ]
  },
  {
    id: "software",
    icon: "💿",
    color: "linear-gradient(135deg,#22d3ee,#06b6d4)",
    title: "Software & OS",
    desc: "System vs application software, operating systems, and software lifecycle.",
    lessons: 7,
    level: "Beginner",
    content: [
      "Software = programs + data that tell hardware what to do.",
      "System software: OS, drivers, utilities (manage hardware).",
      "Application software: word processors, browsers, games.",
      "Popular OS: Windows, macOS, Linux, Android, iOS.",
      "OS functions: process, memory, file and device management.",
      "Software development lifecycle: analysis, design, coding, testing, maintenance.",
      "Open-source vs proprietary licensing."
    ]
  },
  {
    id: "networking",
    icon: "🌐",
    color: "linear-gradient(135deg,#f472b6,#ec4899)",
    title: "Computer Networks",
    desc: "LAN/WAN, topologies, protocols, IP addressing and the Internet.",
    lessons: 9,
    level: "Intermediate",
    content: [
      "A network connects computers to share resources and data.",
      "LAN (local) vs WAN (wide, e.g. Internet).",
      "Topologies: bus, star, ring, mesh.",
      "Devices: hub, switch, router, modem, access point.",
      "Protocols: TCP/IP, HTTP, FTP, SMTP, DNS.",
      "IP address (IPv4 32-bit, IPv6 128-bit) identifies a device.",
      "Subnetting and CIDR divide networks.",
      "Bandwidth vs latency; throughput.",
      "Client-server vs peer-to-peer models."
    ]
  },
  {
    id: "cyber",
    icon: "🛡️",
    color: "linear-gradient(135deg,#34d399,#10b981)",
    title: "Cybersecurity",
    desc: "Threats, attacks, encryption, firewalls and safe online habits.",
    lessons: 8,
    level: "Intermediate",
    content: [
      "Cybersecurity protects systems, networks and data from attacks.",
      "Malware: virus, worm, trojan, ransomware, spyware.",
      "Phishing tricks users into revealing credentials.",
      "Encryption: symmetric (AES) vs asymmetric (RSA).",
      "Hashing (SHA-256) ensures data integrity.",
      "Firewalls filter traffic; IDS/IPS detect/prevent intrusions.",
      "Authentication: passwords, MFA, biometrics.",
      "Best practices: updates, backups, least privilege, awareness."
    ]
  },
  {
    id: "web",
    icon: "🧩",
    color: "linear-gradient(135deg,#fbbf24,#f59e0b)",
    title: "Web Design & HTML",
    desc: "HTML5, CSS3, responsive design and accessibility basics.",
    lessons: 10,
    level: "Beginner",
    content: [
      "HTML structures content; CSS styles it; JS adds behavior.",
      "Semantic tags: header, nav, main, article, footer.",
      "CSS Box Model: content, padding, border, margin.",
      "Flexbox and Grid for layouts.",
      "Responsive design with media queries.",
      "Accessibility: alt text, ARIA, contrast, keyboard nav.",
      "Forms and validation.",
      "SEO basics: meta tags, headings, semantic HTML.",
      "Version control with Git & GitHub.",
      "Deploying with GitHub Pages."
    ]
  },
  {
    id: "db",
    icon: "🗄️",
    color: "linear-gradient(135deg,#a78bfa,#7c5cff)",
    title: "Databases",
    desc: "Relational vs NoSQL, SQL basics, keys and normalization.",
    lessons: 6,
    level: "Intermediate",
    content: [
      "A database stores structured data efficiently.",
      "Relational DB (SQL): tables, rows, columns.",
      "NoSQL: document, key-value, graph, column stores.",
      "Primary key uniquely identifies a row; foreign key links tables.",
      "Basic SQL: SELECT, INSERT, UPDATE, DELETE, JOIN.",
      "Normalization reduces redundancy (1NF, 2NF, 3NF).",
      "Indexes speed up queries."
    ]
  },
  {
    id: "programming",
    icon: "⌨️",
    color: "linear-gradient(135deg,#60a5fa,#3b82f6)",
    title: "Programming Basics",
    desc: "Variables, loops, functions, OOP and problem solving.",
    lessons: 9,
    level: "Beginner",
    content: [
      "Programming = giving precise instructions to a computer.",
      "Variables store data; data types: int, float, string, bool.",
      "Control flow: if/else, switch.",
      "Loops: for, while, do-while.",
      "Functions organize reusable code; parameters & return values.",
      "Arrays and lists store collections.",
      "OOP: classes, objects, inheritance, polymorphism.",
      "Debugging and testing improve reliability.",
      "Algorithm complexity: O(n), O(log n), etc."
    ]
  },
  {
    id: "ai",
    icon: "🤖",
    color: "linear-gradient(135deg,#f472b6,#7c5cff)",
    title: "AI & Emerging Tech",
    desc: "Machine learning, cloud, IoT and the future of computing.",
    lessons: 5,
    level: "Advanced",
    content: [
      "AI enables machines to learn from data.",
      "ML types: supervised, unsupervised, reinforcement.",
      "Neural networks and deep learning.",
      "Cloud computing: IaaS, PaaS, SaaS.",
      "IoT connects everyday devices to the Internet.",
      "Big data and analytics drive decisions.",
      "Ethics, bias and responsible AI."
    ]
  }
];

window.GLOSSARY = [
  { term: "Algorithm", def: "A step-by-step procedure to solve a problem." },
  { term: "Bandwidth", def: "Maximum data transfer rate of a network." },
  { term: "Cache", def: "Fast storage for frequently used data." },
  { term: "DNS", def: "Domain Name System — translates names to IP addresses." },
  { term: "Encryption", def: "Scrambling data so only authorized parties can read it." },
  { term: "Firewall", def: "Network security system that filters traffic." },
  { term: "GUI", def: "Graphical User Interface." },
  { term: "HTML", def: "HyperText Markup Language — structure of web pages." },
  { term: "IP Address", def: "Unique numeric label for a device on a network." },
  { term: "JavaScript", def: "Programming language of the web for interactivity." },
  { term: "Kernel", def: "Core of an operating system." },
  { term: "Latency", def: "Delay before data transfer begins." },
  { term: "Malware", def: "Malicious software designed to harm." },
  { term: "Normalization", def: "Organizing database to reduce redundancy." },
  { term: "OS", def: "Operating System — manages hardware and software." },
  { term: "Phishing", def: "Fraudulent attempt to steal sensitive info." },
  { term: "Query", def: "Request for data from a database." },
  { term: "RAM", def: "Random Access Memory — volatile working memory." },
  { term: "SQL", def: "Structured Query Language for relational DBs." },
  { term: "TCP/IP", def: "Core protocol suite of the Internet." },
  { term: "URL", def: "Uniform Resource Locator — web address." },
  { term: "VPN", def: "Virtual Private Network — secure tunnel over public net." },
  { term: "Wi-Fi", def: "Wireless networking technology." },
  { term: "XML", def: "Extensible Markup Language for data exchange." },
  { term: "Zero-day", def: "Unknown vulnerability exploited before a fix." }
];

window.QUIZ = [
  { q: "Which component is called the 'brain' of the computer?", opts: ["RAM","CPU","Hard Disk","GPU"], ans: 1, topic: "hardware" },
  { q: "What type of memory is volatile?", opts: ["ROM","RAM","SSD","Cache permanent"], ans: 1, topic: "hardware" },
  { q: "Which is an operating system?", opts: ["MS Word","Windows 11","Google Chrome","Python"], ans: 1, topic: "software" },
  { q: "LAN stands for?", opts: ["Large Area Network","Local Area Network","Long Access Network","Linked Area Node"], ans: 1, topic: "networking" },
  { q: "Which device connects different networks?", opts: ["Hub","Switch","Router","Repeater"], ans: 2, topic: "networking" },
  { q: "IPv4 address size?", opts: ["16-bit","32-bit","64-bit","128-bit"], ans: 1, topic: "networking" },
  { q: "Which is NOT malware?", opts: ["Virus","Worm","Firewall","Trojan"], ans: 2, topic: "cyber" },
  { q: "Symmetric encryption example?", opts: ["RSA","AES","ECC","Diffie-Hellman"], ans: 1, topic: "cyber" },
  { q: "Semantic HTML tag for navigation?", opts: ["<div>","<nav>","<span>","<b>"], ans: 1, topic: "web" },
  { q: "CSS property for flexible box layout?", opts: ["display:grid","display:flex","position:absolute","float:left"], ans: 1, topic: "web" },
  { q: "Primary key in a database?", opts: ["Any column","Unique identifier","Foreign reference","Index only"], ans: 1, topic: "db" },
  { q: "SQL command to retrieve data?", opts: ["INSERT","UPDATE","SELECT","DELETE"], ans: 2, topic: "db" },
  { q: "Which is a loop?", opts: ["if","switch","for","function"], ans: 2, topic: "programming" },
  { q: "OOP stands for?", opts: ["Object Oriented Programming","Open Online Protocol","Optimal Output Process","Object Operation Plan"], ans: 0, topic: "programming" },
  { q: "ML type with labeled data?", opts: ["Unsupervised","Supervised","Reinforcement","None"], ans: 1, topic: "ai" }
];

window.FLASHCARDS = [
  { front: "CPU", back: "Central Processing Unit — executes program instructions." },
  { front: "RAM", back: "Random Access Memory — volatile, fast working memory." },
  { front: "SSD", back: "Solid State Drive — fast flash-based storage." },
  { front: "HTTP", back: "HyperText Transfer Protocol — web communication." },
  { front: "DNS", back: "Domain Name System — name to IP resolution." },
  { front: "IP", back: "Internet Protocol — addressing & routing." },
  { front: "Firewall", back: "Filters network traffic for security." },
  { front: "Phishing", back: "Fake messages to steal credentials." },
  { front: "HTML", back: "HyperText Markup Language." },
  { front: "CSS", back: "Cascading Style Sheets — styling." },
  { front: "JS", back: "JavaScript — web interactivity." },
  { front: "SQL", back: "Structured Query Language." },
  { front: "API", back: "Application Programming Interface." },
  { front: "OS", back: "Operating System." },
  { front: "LAN", back: "Local Area Network." },
  { front: "WAN", back: "Wide Area Network." },
  { front: "GPU", back: "Graphics Processing Unit." },
  { front: "BIOS", back: "Basic Input/Output System." },
  { front: "MFA", back: "Multi-Factor Authentication." },
  { front: "IoT", back: "Internet of Things." }
];
