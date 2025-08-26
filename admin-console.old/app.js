// CyberLearn Admin Console - Demo Mode
// This version works without Firebase for testing and demonstration

// Global variables
let isDemoMode = false;
let isFirebaseMode = false;
let currentUser = null;
let currentQuestions = [];
let currentInterviewQuestions = [];
let currentEditingId = null;
let currentEditingInterviewId = null;
let userProfiles = [];
let userAnalytics = {};

// Sample questions for demo
const sampleQuestions = [
    {
        id: "demo_1",
        question: "What is the primary goal of static malware analysis?",
        options: [
            "To execute the malware in a sandbox",
            "To examine malware without running it",
            "To monitor system behavior in real time",
            "To detect malware using network traffic"
        ],
        correctAnswer: "To examine malware without running it",
        explanation: "Static malware analysis involves examining the malware binary, strings, and structure without executing it, to identify indicators such as file names, registry keys, or suspicious strings.",
        category: "MALWARE_ANALYSIS",
        difficulty: "INTERMEDIATE",
        tags: ["malware", "static-analysis", "soc"],
        isActive: true
    },
    {
        id: "demo_2",
        question: "Which tool is commonly used for disassembling malware code?",
        options: [
            "Wireshark",
            "Ghidra",
            "Procmon",
            "Netcat"
        ],
        correctAnswer: "Ghidra",
        explanation: "Ghidra (or IDA Pro) is widely used for reverse engineering and disassembling malware binaries.",
        category: "MALWARE_ANALYSIS",
        difficulty: "INTERMEDIATE",
        tags: ["malware", "reverse-engineering", "static-analysis"],
        isActive: true
    },
    {
        id: "demo_3",
        question: "What is the main purpose of dynamic malware analysis?",
        options: [
            "To reverse engineer code",
            "To observe malware behavior while running",
            "To compress malware for distribution",
            "To remove malware from a system"
        ],
        correctAnswer: "To observe malware behavior while running",
        explanation: "Dynamic analysis runs the malware in a controlled environment (sandbox/VM) to observe behavior such as network connections, file creation, and registry modifications.",
        category: "MALWARE_ANALYSIS",
        difficulty: "INTERMEDIATE",
        tags: ["malware", "dynamic-analysis", "soc"],
        isActive: true
    },
    {
        id: "demo_4",
        question: "Which of the following is an indicator of malware persistence?",
        options: [
            "Creation of random temporary files",
            "Scheduled tasks or registry run keys",
            "Large file size",
            "High CPU usage"
        ],
        correctAnswer: "Scheduled tasks or registry run keys",
        explanation: "Malware often achieves persistence by creating scheduled tasks, registry Run/RunOnce keys, or services to ensure it runs after reboot.",
        category: "MALWARE_ANALYSIS",
        difficulty: "INTERMEDIATE",
        tags: ["malware", "persistence", "registry"],
        isActive: true
    },
    {
        id: "demo_5",
        question: "Why do malware authors use packing techniques?",
        options: [
            "To increase file size",
            "To make malware execution faster",
            "To evade detection by obfuscating code",
            "To simplify debugging"
        ],
        correctAnswer: "To evade detection by obfuscating code",
        explanation: "Packers compress or encrypt malware code to hide its real instructions and evade detection by antivirus or analysis tools.",
        category: "MALWARE_ANALYSIS",
        difficulty: "INTERMEDIATE",
        tags: ["malware", "packing", "evasion"],
        isActive: true
    },
    {
        id: "demo_6",
        question: "Which Windows tool can be used to monitor real-time process and registry changes by malware?",
        options: [
            "Ghidra",
            "Procmon",
            "Burp Suite",
            "OllyDbg"
        ],
        correctAnswer: "Procmon",
        explanation: "Procmon (Process Monitor) captures real-time file system, registry, and process/thread activity, making it useful in dynamic analysis.",
        category: "MALWARE_ANALYSIS",
        difficulty: "INTERMEDIATE",
        tags: ["malware", "process-monitoring", "windows"],
        isActive: true
    },
    {
        id: "demo_7",
        question: "What type of malware pretends to be legitimate software to trick users?",
        options: [
            "Rootkit",
            "Worm",
            "Trojan",
            "Ransomware"
        ],
        correctAnswer: "Trojan",
        explanation: "A Trojan disguises itself as a legitimate program to trick users into installing it, allowing attackers access or control.",
        category: "MALWARE_ANALYSIS",
        difficulty: "INTERMEDIATE",
        tags: ["malware", "trojan", "soc"],
        isActive: true
    },
    {
        id: "demo_8",
        question: "Which network behavior might indicate malware activity?",
        options: [
            "High bandwidth usage during office hours",
            "Frequent outbound connections to unknown IP addresses",
            "Occasional software updates",
            "Accessing intranet resources"
        ],
        correctAnswer: "Frequent outbound connections to unknown IP addresses",
        explanation: "Malware often connects to Command & Control (C2) servers via unusual outbound traffic patterns to unknown or suspicious IPs.",
        category: "MALWARE_ANALYSIS",
        difficulty: "INTERMEDIATE",
        tags: ["malware", "network", "c2"],
        isActive: true
    },
    {
        id: "demo_9",
        question: "What is the difference between a worm and a virus?",
        options: [
            "A worm requires user action; a virus spreads automatically",
            "A worm spreads automatically; a virus needs user action",
            "Both spread only via email",
            "Both require system restart to activate"
        ],
        correctAnswer: "A worm spreads automatically; a virus needs user action",
        explanation: "Worms self-propagate across systems without user action, while viruses usually require a host file or user execution.",
        category: "MALWARE_ANALYSIS",
        difficulty: "INTERMEDIATE",
        tags: ["malware", "worm", "virus"],
        isActive: true
    },
    {
        id: "demo_10",
        question: "What is the role of a sandbox in malware analysis?",
        options: [
            "To clean malware from infected systems",
            "To safely execute malware in an isolated environment",
            "To obfuscate malware code",
            "To scan malware signatures"
        ],
        correctAnswer: "To safely execute malware in an isolated environment",
        explanation: "A sandbox is an isolated virtual environment that allows analysts to safely run and observe malware without risk to the host system.",
        category: "MALWARE_ANALYSIS",
        difficulty: "INTERMEDIATE",
        tags: ["malware", "sandbox", "dynamic-analysis"],
        isActive: true
    },
    {
        id: "demo_11",
        question: "What is the primary function of a SIEM (Security Information and Event Management) system?",
        options: [
            "To collect, analyze, and correlate security events from multiple sources",
            "To encrypt network traffic",
            "To perform vulnerability scans",
            "To create network firewalls"
        ],
        correctAnswer: "To collect, analyze, and correlate security events from multiple sources",
        explanation: "SIEM systems are essential in Security Operations Centers (SOCs) for centralizing log data, detecting threats, and providing real-time analysis of security alerts.",
        category: "SECURITY_OPERATIONS",
        difficulty: "INTERMEDIATE",
        tags: ["siem", "soc", "monitoring", "correlation"],
        isActive: true
    },
    {
        id: "demo_2",
        question: "In cloud security, what does the Shared Responsibility Model define?",
        options: [
            "How costs are shared between cloud providers",
            "Security responsibilities between cloud provider and customer",
            "Data sharing agreements between organizations",
            "Network bandwidth allocation"
        ],
        correctAnswer: "Security responsibilities between cloud provider and customer",
        explanation: "The Shared Responsibility Model clearly delineates what security measures are the cloud provider's responsibility versus the customer's responsibility in cloud environments.",
        category: "CLOUD_SECURITY",
        difficulty: "INTERMEDIATE",
        tags: ["shared responsibility", "aws", "azure", "compliance"],
        isActive: true
    },
    {
        id: "demo_3",
        question: "What is the purpose of network segmentation in cybersecurity?",
        options: [
            "To increase network speed",
            "To isolate network traffic and limit attack spread",
            "To reduce hardware costs",
            "To simplify network management"
        ],
        correctAnswer: "To isolate network traffic and limit attack spread",
        explanation: "Network segmentation divides a network into smaller, isolated segments to prevent lateral movement of attackers and contain potential breaches.",
        category: "NETWORK_SECURITY",
        difficulty: "INTERMEDIATE",
        tags: ["segmentation", "isolation", "lateral movement", "vlans"],
        isActive: true
    },
    {
        id: "demo_4",
        question: "During a penetration test, what is the purpose of reconnaissance?",
        options: [
            "To exploit vulnerabilities immediately",
            "To gather information about the target system",
            "To install backdoors",
            "To perform denial of service attacks"
        ],
        correctAnswer: "To gather information about the target system",
        explanation: "Reconnaissance is the initial phase of penetration testing where testers collect information about the target to identify potential attack vectors and vulnerabilities.",
        category: "PENETRATION_TESTING",
        difficulty: "BEGINNER",
        tags: ["reconnaissance", "information gathering", "footprinting", "osint"],
        isActive: true
    },
    {
        id: "demo_5",
        question: "What is the difference between symmetric and asymmetric encryption?",
        options: [
            "Symmetric uses one key, asymmetric uses two keys",
            "Symmetric is slower than asymmetric",
            "Symmetric is less secure than asymmetric",
            "There is no difference"
        ],
        correctAnswer: "Symmetric uses one key, asymmetric uses two keys",
        explanation: "Symmetric encryption uses the same key for encryption and decryption, while asymmetric encryption uses a pair of keys (public and private) for the process.",
        category: "CRYPTOGRAPHY",
        difficulty: "BEGINNER",
        tags: ["encryption", "keys", "aes", "rsa"],
        isActive: true
    },
    {
        id: "demo_6",
        question: "What is the primary goal of malware analysis?",
        options: [
            "To create new malware",
            "To understand malware behavior and develop countermeasures",
            "To spread malware faster",
            "To hide malware from detection"
        ],
        correctAnswer: "To understand malware behavior and develop countermeasures",
        explanation: "Malware analysis involves examining malicious software to understand its functionality, behavior, and impact to develop effective detection and mitigation strategies.",
        category: "MALWARE_ANALYSIS",
        difficulty: "INTERMEDIATE",
        tags: ["malware", "reverse engineering", "sandbox", "behavior analysis"],
        isActive: true
    }
];

// Sample interview questions for demo
const sampleInterviewQuestions = [
    {
        id: "interview_1",
        question: "What are the key responsibilities of a SOC analyst and how do you prioritize security alerts?",
        answer: "A SOC analyst is responsible for monitoring security events, investigating alerts, and responding to incidents. Key responsibilities include: 1) Continuous monitoring of SIEM dashboards and security tools, 2) Analyzing and triaging security alerts based on severity and impact, 3) Conducting initial incident response and escalation procedures, 4) Documenting findings and maintaining incident records, 5) Threat hunting and proactive security monitoring. Alert prioritization follows a risk-based approach considering factors like asset criticality, threat severity, business impact, and regulatory requirements. Critical alerts affecting core business systems take precedence over low-severity alerts on non-critical assets.",
        keyPoints: [
            "24/7 security monitoring and alert analysis",
            "Risk-based alert prioritization and triage",
            "Initial incident response and escalation",
            "Threat hunting and proactive monitoring",
            "Documentation and compliance reporting",
            "Collaboration with other security teams"
        ],
        category: "SECURITY_OPERATIONS",
        experienceLevel: "MID",
        tags: ["soc", "monitoring", "incident response", "triage"],
        isActive: true
    },
    {
        id: "interview_2",
        question: "Explain the shared responsibility model in cloud security and provide examples for AWS.",
        answer: "The shared responsibility model divides security responsibilities between the cloud provider and customer. AWS is responsible for 'security OF the cloud' - physical infrastructure, hypervisor, network controls, and service security. Customers are responsible for 'security IN the cloud' - operating systems, applications, data encryption, network traffic protection, and identity management. For example: AWS secures the EC2 hypervisor and physical servers, while customers must patch the OS, configure security groups, manage SSH keys, and encrypt data. The model varies by service type - IaaS requires more customer responsibility than SaaS services.",
        keyPoints: [
            "Provider: Infrastructure, hypervisor, physical security",
            "Customer: OS, applications, data, identity management",
            "Responsibility varies by service type (IaaS vs PaaS vs SaaS)",
            "Encryption responsibilities are typically customer-owned",
            "Network security is a shared responsibility",
            "Compliance requirements affect both parties"
        ],
        category: "CLOUD_SECURITY",
        experienceLevel: "INTERMEDIATE",
        tags: ["shared responsibility", "aws", "cloud security", "compliance"],
        isActive: true
    },
    {
        id: "interview_3",
        question: "How would you design a secure network architecture for a medium-sized company?",
        answer: "A secure network architecture should implement defense in depth with multiple layers: 1) Perimeter Security - Next-generation firewalls, IPS/IDS, and DMZ for public services, 2) Network Segmentation - VLANs separating different business functions, guest networks, and critical systems, 3) Access Control - 802.1X for device authentication, NAC for device compliance, 4) Monitoring - Network monitoring tools, flow analysis, and anomaly detection, 5) Wireless Security - WPA3 encryption, separate SSIDs for different user types, 6) Remote Access - VPN with multi-factor authentication for remote workers. The design should follow zero-trust principles with least privilege access and continuous monitoring.",
        keyPoints: [
            "Multi-layered defense in depth approach",
            "Network segmentation with VLANs and firewalls",
            "Strong perimeter security with NGFWs and IPS",
            "Wireless security with WPA3 and network isolation",
            "Secure remote access with VPN and MFA",
            "Continuous monitoring and anomaly detection"
        ],
        category: "NETWORK_SECURITY",
        experienceLevel: "SENIOR",
        tags: ["network architecture", "segmentation", "defense in depth", "zero trust"],
        isActive: true
    },
    {
        id: "interview_4",
        question: "Walk me through your methodology for conducting a penetration test.",
        answer: "Penetration testing follows a structured methodology: 1) Pre-Engagement - Define scope, rules of engagement, and legal agreements, 2) Reconnaissance - Gather information using OSINT, social media, and public records, 3) Scanning - Identify live hosts, open ports, and services using tools like Nmap, 4) Enumeration - Extract detailed information about services, users, and configurations, 5) Vulnerability Assessment - Identify security weaknesses using automated and manual techniques, 6) Exploitation - Attempt to exploit vulnerabilities while maintaining detailed documentation, 7) Post-Exploitation - Assess impact, maintain persistence, and identify data access, 8) Reporting - Document findings with risk ratings, evidence, and remediation recommendations.",
        keyPoints: [
            "Structured approach from reconnaissance to reporting",
            "Proper scoping and legal agreements",
            "Combination of automated tools and manual testing",
            "Detailed documentation throughout the process",
            "Risk-based vulnerability prioritization",
            "Clear remediation recommendations"
        ],
        category: "PENETRATION_TESTING",
        experienceLevel: "MID",
        tags: ["penetration testing", "methodology", "vulnerability assessment", "reporting"],
        isActive: true
    },
    {
        id: "interview_5",
        question: "Explain the difference between symmetric and asymmetric encryption and when to use each.",
        answer: "Symmetric encryption uses the same key for both encryption and decryption, making it fast and efficient for large amounts of data. Examples include AES, DES, and ChaCha20. It's ideal for encrypting data at rest and bulk data transmission but requires secure key distribution. Asymmetric encryption uses a key pair (public and private keys) where data encrypted with one key can only be decrypted with the other. Examples include RSA, ECC, and Diffie-Hellman. It's slower but solves the key distribution problem and enables digital signatures. In practice, hybrid systems use asymmetric encryption to securely exchange symmetric keys, combining the security of asymmetric with the speed of symmetric encryption.",
        keyPoints: [
            "Symmetric: Same key for encryption/decryption, fast performance",
            "Asymmetric: Key pair system, solves key distribution",
            "Symmetric ideal for bulk data encryption",
            "Asymmetric enables secure key exchange and digital signatures",
            "Hybrid systems combine both for optimal security and performance",
            "Key management is critical for both approaches"
        ],
        category: "CRYPTOGRAPHY",
        experienceLevel: "MID",
        tags: ["encryption", "symmetric", "asymmetric", "key management"],
        isActive: true
    },
    {
        id: "interview_6",
        question: "Describe your approach to analyzing unknown malware in a safe environment.",
        answer: "Malware analysis requires a systematic approach in isolated environments: 1) Static Analysis - Examine file properties, strings, imports, and headers without executing the malware using tools like PEiD, strings, and hex editors, 2) Dynamic Analysis - Execute malware in a sandboxed environment while monitoring behavior using tools like Process Monitor, Wireshark, and virtual machines, 3) Code Analysis - Reverse engineer using disassemblers like IDA Pro or Ghidra to understand functionality, 4) Network Analysis - Monitor network communications to identify C&C servers and data exfiltration, 5) Behavioral Analysis - Document file system changes, registry modifications, and process creation, 6) Documentation - Create detailed reports with IOCs, YARA rules, and mitigation strategies.",
        keyPoints: [
            "Isolated sandbox environment for safe analysis",
            "Static analysis before dynamic execution",
            "Multiple analysis tools and techniques",
            "Network traffic monitoring and analysis",
            "Detailed documentation and IOC extraction",
            "Creation of detection rules and signatures"
        ],
        category: "MALWARE_ANALYSIS",
        experienceLevel: "SENIOR",
        tags: ["malware analysis", "reverse engineering", "sandbox", "static analysis", "dynamic analysis"],
        isActive: true
    }
];

// Sample user profiles for demo mode
const sampleUserProfiles = [
    {
        userId: "user_1",
        email: "alex@example.com",
        displayName: "Alex Johnson",
        avatarUrl: null,
        joinDate: "2024-01-15 10:30:00",
        lastActive: "2024-12-20 14:45:00",
        isActive: true,
        totalQuizzesTaken: 45,
        totalQuizzesPassed: 38,
        averageQuizScore: 0.84,
        totalFlashcardsStudied: 120,
        totalInterviewQuestionsPracticed: 25,
        totalLearningPathsStarted: 3,
        totalLearningPathsCompleted: 1,
        overallProgress: 0.72,
        currentStreak: 12,
        longestStreak: 18,
        totalStudyTime: 3600,
        totalXP: 2850,
        level: 3,
        learningPathProgress: [],
        quizHistory: [],
        flashcardProgress: [],
        interviewProgress: [],
        badges: [],
        achievements: [],
        recentActivity: [],
        preferredCategories: ["NETWORK_SECURITY", "CRYPTOGRAPHY"],
        difficultyPreference: "INTERMEDIATE",
        notificationSettings: {},
        lastSynced: "2024-12-20 14:45:00",
        syncVersion: 1,
        createdAt: "2024-01-15 10:30:00",
        updatedAt: "2024-12-20 14:45:00"
    },
    {
        userId: "user_2",
        email: "sarah@example.com",
        displayName: "Sarah Chen",
        avatarUrl: null,
        joinDate: "2024-02-20 09:15:00",
        lastActive: "2024-12-20 16:20:00",
        isActive: true,
        totalQuizzesTaken: 67,
        totalQuizzesPassed: 62,
        averageQuizScore: 0.93,
        totalFlashcardsStudied: 89,
        totalInterviewQuestionsPracticed: 42,
        totalLearningPathsStarted: 4,
        totalLearningPathsCompleted: 2,
        overallProgress: 0.85,
        currentStreak: 8,
        longestStreak: 25,
        totalStudyTime: 5400,
        totalXP: 4200,
        level: 4,
        learningPathProgress: [],
        quizHistory: [],
        flashcardProgress: [],
        interviewProgress: [],
        badges: [],
        achievements: [],
        recentActivity: [],
        preferredCategories: ["PENETRATION_TESTING", "INCIDENT_RESPONSE"],
        difficultyPreference: "ADVANCED",
        notificationSettings: {},
        lastSynced: "2024-12-20 16:20:00",
        syncVersion: 1,
        createdAt: "2024-02-20 09:15:00",
        updatedAt: "2024-12-20 16:20:00"
    },
    {
        userId: "user_3",
        email: "mike@example.com",
        displayName: "Mike Rodriguez",
        avatarUrl: null,
        joinDate: "2024-03-10 11:45:00",
        lastActive: "2024-12-20 12:30:00",
        isActive: true,
        totalQuizzesTaken: 23,
        totalQuizzesPassed: 18,
        averageQuizScore: 0.78,
        totalFlashcardsStudied: 56,
        totalInterviewQuestionsPracticed: 15,
        totalLearningPathsStarted: 2,
        totalLearningPathsCompleted: 0,
        overallProgress: 0.45,
        currentStreak: 3,
        longestStreak: 7,
        totalStudyTime: 1800,
        totalXP: 1200,
        level: 2,
        learningPathProgress: [],
        quizHistory: [],
        flashcardProgress: [],
        interviewProgress: [],
        badges: [],
        achievements: [],
        recentActivity: [],
        preferredCategories: ["FUNDAMENTALS", "NETWORK_SECURITY"],
        difficultyPreference: "BEGINNER",
        notificationSettings: {},
        lastSynced: "2024-12-20 12:30:00",
        syncVersion: 1,
        createdAt: "2024-03-10 11:45:00",
        updatedAt: "2024-12-20 12:30:00"
    }
];

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 === DOM CONTENT LOADED ===');
    console.log('🔍 Setting up event listeners...');
    setupEventListeners();
    
    // Load demo data
    currentQuestions = [...sampleQuestions];
    currentInterviewQuestions = [...sampleInterviewQuestions];
    userProfiles = [...sampleUserProfiles]; // Load sample user profiles
    
    console.log('🔍 Demo data loaded');
    console.log('🔍 Current questions:', currentQuestions.length);
    
    // Wait for Firebase to load, then check availability
    checkFirebaseAvailability();
});

function checkFirebaseAvailability() {
    console.log('🔍 === FIREBASE AVAILABILITY CHECK ===');
    console.log('window.db:', typeof window.db, window.db ? '✅' : '❌');
    console.log('window.db object:', window.db);
    console.log('window.auth:', typeof window.auth, window.auth ? '✅' : '❌');
    console.log('window.firebaseServices:', typeof window.firebaseServices, window.firebaseServices ? '✅' : '❌');
    
    // Test Firestore connection if available
    if (window.db) {
        console.log('🧪 Testing Firestore connection...');
        window.db.collection('test').doc('connection').set({
            test: true,
            timestamp: new Date().toISOString()
        }).then(() => {
            console.log('✅ Firestore connection test successful');
            // Clean up test document
            window.db.collection('test').doc('connection').delete();
        }).catch((error) => {
            console.error('❌ Firestore connection test failed:', error);
        });
    }
    
    if (typeof window.db !== 'undefined' && typeof window.auth !== 'undefined') {
        console.log('🔥 Firebase detected - Real mode available');
        console.log('Firebase Auth:', window.auth);
        console.log('Firebase DB:', window.db);
        isFirebaseMode = true;
        setupFirebaseAuth();
        showLoginScreen();
    } else {
        console.log('📝 Firebase not yet loaded, waiting...');
        // Wait a bit for Firebase to load
        setTimeout(() => {
            if (typeof window.db !== 'undefined' && typeof window.auth !== 'undefined') {
                console.log('🔥 Firebase detected after wait - Real mode available');
                isFirebaseMode = true;
                setupFirebaseAuth();
            } else {
                console.log('📝 Demo mode only - Firebase not detected after wait');
                isFirebaseMode = false;
            }
            showLoginScreen();
        }, 2000);
    }
    
    console.log('🔍 === FIREBASE AVAILABILITY CHECK COMPLETED ===');
}

// Setup event listeners
function setupEventListeners() {
    console.log('🔍 === SETTING UP EVENT LISTENERS ===');
    
    // Check if sidebar items exist
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    console.log('🔍 Found sidebar items:', sidebarItems.length);
    if (sidebarItems.length === 0) {
        console.error('❌ No sidebar items found! Check HTML structure.');
    } else {
        sidebarItems.forEach((item, index) => {
            console.log(`🔍 Sidebar item ${index + 1}:`, item.getAttribute('data-section'));
        });
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Demo mode button
    const demoModeBtn = document.getElementById('demoModeBtn');
    if (demoModeBtn) {
        demoModeBtn.addEventListener('click', () => {
            isDemoMode = true;
            showMainApp();
            loadDashboardData();
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Sidebar navigation
    document.addEventListener('click', (e) => {
        console.log('🔍 Click detected on:', e.target);
        console.log('🔍 Target classes:', e.target.className);
        console.log('🔍 Target tag:', e.target.tagName);
        
        if (e.target.classList.contains('sidebar-item') || e.target.closest('.sidebar-item')) {
            console.log('✅ Sidebar item detected');
            e.preventDefault();
            const item = e.target.closest('.sidebar-item');
            const section = item.getAttribute('data-section');
            console.log('🔍 Sidebar item clicked, section:', section);
            showSection(section);
            
            // Update active state
            document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('sidebar-active'));
            item.classList.add('sidebar-active');
        } else {
            console.log('❌ Not a sidebar item');
        }
    });

    // Add question button
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    if (addQuestionBtn) {
        addQuestionBtn.addEventListener('click', () => showQuestionModal());
    }

    // Add interview question button
    const addInterviewQuestionBtn = document.getElementById('addInterviewQuestionBtn');
    if (addInterviewQuestionBtn) {
        addInterviewQuestionBtn.addEventListener('click', () => showInterviewQuestionModal());
    }

    // Modal controls
    const closeModal = document.getElementById('closeModal');
    const cancelQuestion = document.getElementById('cancelQuestion');
    if (closeModal) closeModal.addEventListener('click', hideQuestionModal);
    if (cancelQuestion) cancelQuestion.addEventListener('click', hideQuestionModal);

    // Question form
    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
        questionForm.addEventListener('submit', handleQuestionSubmit);
    }

    // Export buttons
    const bulkExportBtn = document.getElementById('bulkExportBtn');
    if (bulkExportBtn) {
        bulkExportBtn.addEventListener('click', handleBulkExport);
    }

    const interviewExportBtn = document.getElementById('interviewExportBtn');
    if (interviewExportBtn) {
        interviewExportBtn.addEventListener('click', handleInterviewExport);
    }

    // CSV upload buttons
    const bulkImportBtn = document.getElementById('bulkImportBtn');
    if (bulkImportBtn) {
        bulkImportBtn.addEventListener('click', showCsvUploadModal);
    }

    const csvTemplateBtn = document.getElementById('csvTemplateBtn');
    if (csvTemplateBtn) {
        csvTemplateBtn.addEventListener('click', downloadCsvTemplate);
    }

    // CSV upload modal controls
    const closeCsvModal = document.getElementById('closeCsvModal');
    const cancelCsvUpload = document.getElementById('cancelCsvUpload');
    
    if (closeCsvModal) {
        console.log('✅ CSV Upload: closeCsvModal button found, adding event listener');
        closeCsvModal.addEventListener('click', () => {
            console.log('🔍 CSV Upload: Close button clicked');
            hideCsvUploadModal();
        });
    } else {
        console.error('❌ CSV Upload: closeCsvModal button not found');
    }
    
    if (cancelCsvUpload) {
        console.log('✅ CSV Upload: cancelCsvUpload button found, adding event listener');
        cancelCsvUpload.addEventListener('click', () => {
            console.log('🔍 CSV Upload: Cancel button clicked');
            hideCsvUploadModal();
        });
    } else {
        console.error('❌ CSV Upload: cancelCsvUpload button not found');
    }

    const csvFileInput = document.getElementById('csvFileInput');
    if (csvFileInput) {
        console.log('✅ CSV Upload: csvFileInput found, adding change event listener');
        csvFileInput.addEventListener('change', (event) => {
            console.log('🔍 CSV Upload: File input change event triggered');
            handleCsvFileSelect(event);
        });
    } else {
        console.error('❌ CSV Upload: csvFileInput not found');
    }

    const processCsvUpload = document.getElementById('processCsvUpload');
    if (processCsvUpload) {
        console.log('✅ CSV Upload: processCsvUpload button found, adding event listener');
        processCsvUpload.addEventListener('click', () => {
            console.log('🔍 CSV Upload: processCsvUpload button clicked!');
            processCsvFile();
        });
    } else {
        console.error('❌ CSV Upload: processCsvUpload button not found');
    }

    // Database verification button
    const verifyDatabaseBtn = document.getElementById('verifyDatabaseBtn');
    if (verifyDatabaseBtn) {
        verifyDatabaseBtn.addEventListener('click', verifyFirestoreDatabase);
    }

    // Interview question modal controls
    const closeInterviewModal = document.getElementById('closeInterviewModal');
    const cancelInterviewQuestion = document.getElementById('cancelInterviewQuestion');
    if (closeInterviewModal) closeInterviewModal.addEventListener('click', hideInterviewQuestionModal);
    if (cancelInterviewQuestion) cancelInterviewQuestion.addEventListener('click', hideInterviewQuestionModal);

    // Interview question form
    const interviewQuestionForm = document.getElementById('interviewQuestionForm');
    if (interviewQuestionForm) {
        interviewQuestionForm.addEventListener('submit', handleInterviewQuestionSubmit);
    }

    // User analytics section
    const userAnalyticsSection = document.getElementById('userAnalyticsSection');
    if (userAnalyticsSection) {
        userAnalyticsSection.addEventListener('click', showUserAnalytics);
    }
}

// Handle login (Firebase + demo version)
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    console.log('🔐 Login attempt:', email);
    console.log('🔍 isFirebaseMode:', isFirebaseMode);
    console.log('🔍 window.auth available:', typeof window.auth);
    
    // Try Firebase authentication first
    if (isFirebaseMode) {
        console.log('🔥 Attempting Firebase login...');
        try {
            await handleFirebaseLogin(email, password);
            console.log('✅ Firebase login successful!');
            isDemoMode = false;
            showMainApp();
            document.getElementById('userEmail').textContent = email;
            showNotification('🔥 Connected to Firebase!');
            return;
        } catch (error) {
            console.log('❌ Firebase login failed:', error.message);
            console.log('🔄 Falling back to demo mode...');
        }
    } else {
        console.log('📝 Firebase mode not available, using demo mode only');
    }
    
    // Fall back to demo authentication
    if (email === 'admin@cyberlearn.com' && password === 'admin123') {
        isDemoMode = true;
        showMainApp();
        loadDashboardData();
        document.getElementById('userEmail').textContent = 'Demo Mode';
        showNotification('📝 Running in Demo Mode');
    } else {
        errorDiv.textContent = isFirebaseMode ? 
            'Invalid credentials. Use your Firebase account or demo: admin@cyberlearn.com / admin123' :
            'Demo credentials: admin@cyberlearn.com / admin123';
        errorDiv.classList.remove('hidden');
    }
}

// Show login screen
function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

// Show main application
function showMainApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    if (isDemoMode) {
        document.getElementById('userEmail').textContent = 'Demo Mode';
    }
}

// Logout
async function logout() {
    if (isFirebaseMode && !isDemoMode) {
        await handleFirebaseLogout();
    }
    isDemoMode = false;
    currentUser = null;
    currentQuestions = [...sampleQuestions];
    currentInterviewQuestions = [...sampleInterviewQuestions];
    userProfiles = [...sampleUserProfiles]; // Clear user profiles on logout
    showLoginScreen();
}

// Show section
function showSection(sectionName) {
    console.log('🔍 showSection called with:', sectionName);
    
    // Hide all sections
    const allSections = document.querySelectorAll('.content-section');
    console.log('🔍 Found content sections:', allSections.length);
    allSections.forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show the target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    console.log('🔍 Target section element:', targetSection);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        console.log('✅ Section shown successfully');
    } else {
        console.error('❌ Target section not found:', `${sectionName}-section`);
    }

    if (sectionName === 'quiz-questions') {
        renderQuestionsTable();
    } else if (sectionName === 'interview-questions') {
        renderInterviewQuestionsTable();
    } else if (sectionName === 'user-management') {
        renderUserManagement();
    }
}

// Render user management
function renderUserManagement() {
    console.log('🔍 Rendering user management section');
    // This function will be implemented later
    // For now, just log that it was called
}

// Load dashboard data
function loadDashboardData() {
    const totalQuestions = currentQuestions.length;
    const activeQuestions = currentQuestions.filter(q => q.isActive !== false).length;
    const categories = new Set(currentQuestions.map(q => q.category)).size;
    const totalInterviewQuestions = currentInterviewQuestions.length;
    
    document.getElementById('totalQuestions').textContent = totalQuestions;
    document.getElementById('activeQuestions').textContent = activeQuestions;
    document.getElementById('totalCategories').textContent = categories || 6; // Show 6 as default for the new categories
    document.getElementById('totalInterviewQuestions').textContent = totalInterviewQuestions;
    
    // Add user analytics data
    updateDashboardWithUserAnalytics();
}

// Render questions table
function renderQuestionsTable() {
    const tbody = document.getElementById('questionsTableBody');
    
    const tableHtml = currentQuestions.map(question => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${truncateText(question.question, 60)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ${formatCategory(question.category)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}">
                    ${question.difficulty}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editQuestion('${question.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteQuestion('${question.id}')" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    tbody.innerHTML = tableHtml;
}

// Utility functions
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function formatCategory(category) {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getDifficultyColor(difficulty) {
    switch (difficulty) {
        case 'BEGINNER': return 'bg-green-100 text-green-800';
        case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800';
        case 'ADVANCED': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// Verify Firestore database connection and content
async function verifyFirestoreDatabase() {
    console.log('🔍 === FIRESTORE VERIFICATION STARTED ===');
    
    if (!isFirestoreAvailable || !window.db) {
        console.log('❌ Firestore not available for verification');
        return;
    }
    
    try {
        console.log('📊 Checking quiz_questions collection...');
        const quizSnapshot = await window.db.collection('quiz_questions').get();
        console.log('📊 Quiz questions snapshot:', quizSnapshot);
        console.log('📊 Quiz questions count:', quizSnapshot.size);
        
        quizSnapshot.forEach((doc) => {
            console.log('📝 Quiz question document:', doc.id, doc.data());
        });
        
        console.log('📊 Checking interview_questions collection...');
        const interviewSnapshot = await window.db.collection('interview_questions').get();
        console.log('📊 Interview questions snapshot:', interviewSnapshot);
        console.log('📊 Interview questions count:', interviewSnapshot.size);
        
        interviewSnapshot.forEach((doc) => {
            console.log('📝 Interview question document:', doc.id, doc.data());
        });
        
        console.log('📊 Checking api_data collection...');
        const apiSnapshot = await window.db.collection('api_data').get();
        console.log('📊 API data snapshot:', apiSnapshot);
        console.log('📊 API data count:', apiSnapshot.size);
        
        apiSnapshot.forEach((doc) => {
            console.log('📝 API data document:', doc.id, doc.data());
        });
        
        console.log('✅ === FIRESTORE VERIFICATION COMPLETED ===');
        
    } catch (error) {
        console.error('❌ === FIRESTORE VERIFICATION FAILED ===');
        console.error('❌ Error details:', error);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error code:', error.code);
    }
}

// Show question modal
function showQuestionModal(questionId = null) {
    currentEditingId = questionId;
    const modal = document.getElementById('questionModal');
    const title = document.getElementById('modalTitle');
    
    if (questionId) {
        title.textContent = 'Edit Question';
        loadQuestionData(questionId);
    } else {
        title.textContent = 'Add New Question';
        clearQuestionForm();
    }
    
    modal.classList.remove('hidden');
}

// Hide question modal
function hideQuestionModal() {
    document.getElementById('questionModal').classList.add('hidden');
    currentEditingId = null;
    clearQuestionForm();
}

// Clear question form
function clearQuestionForm() {
    document.getElementById('questionText').value = '';
    document.getElementById('questionCategory').value = 'SECURITY_OPERATIONS';
    document.getElementById('questionDifficulty').value = 'BEGINNER';
    document.getElementById('option0').value = '';
    document.getElementById('option1').value = '';
    document.getElementById('option2').value = '';
    document.getElementById('option3').value = '';
    document.getElementById('questionExplanation').value = '';
    document.getElementById('questionTags').value = '';
    document.getElementById('questionActive').checked = true;
    
    // Clear radio buttons
    document.querySelectorAll('input[name="correctAnswer"]').forEach(radio => {
        radio.checked = false;
    });
}

// Load question data for editing
function loadQuestionData(questionId) {
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;

    document.getElementById('questionText').value = question.question;
    document.getElementById('questionCategory').value = question.category;
    document.getElementById('questionDifficulty').value = question.difficulty;
    document.getElementById('option0').value = question.options[0] || '';
    document.getElementById('option1').value = question.options[1] || '';
    document.getElementById('option2').value = question.options[2] || '';
    document.getElementById('option3').value = question.options[3] || '';
    document.getElementById('questionExplanation').value = question.explanation;
    document.getElementById('questionTags').value = question.tags ? question.tags.join(', ') : '';
    document.getElementById('questionActive').checked = question.isActive !== false;

    // Set correct answer
    const correctIndex = question.options.indexOf(question.correctAnswer);
    if (correctIndex >= 0) {
        document.getElementById(`option${correctIndex}Radio`).checked = true;
    }
}

// Handle question form submission
function handleQuestionSubmit(e) {
    e.preventDefault();

    const formData = {
        question: document.getElementById('questionText').value,
        category: document.getElementById('questionCategory').value,
        difficulty: document.getElementById('questionDifficulty').value,
        options: [
            document.getElementById('option0').value,
            document.getElementById('option1').value,
            document.getElementById('option2').value,
            document.getElementById('option3').value
        ].filter(option => option.trim()),
        explanation: document.getElementById('questionExplanation').value,
        tags: document.getElementById('questionTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
        isActive: document.getElementById('questionActive').checked,
        updatedAt: new Date().toISOString()
    };

    // Get correct answer
    const correctAnswerIndex = document.querySelector('input[name="correctAnswer"]:checked')?.value;
    if (correctAnswerIndex !== undefined) {
        formData.correctAnswer = formData.options[parseInt(correctAnswerIndex)];
    }

    // Validate form
    if (!formData.question || formData.options.length < 2 || !formData.correctAnswer || !formData.explanation) {
        alert('Please fill in all required fields');
        return;
    }

    if (currentEditingId) {
        // Update existing question
        const index = currentQuestions.findIndex(q => q.id === currentEditingId);
        if (index >= 0) {
            currentQuestions[index] = { ...currentQuestions[index], ...formData };
            // Save to Firebase
            if (isFirebaseMode && !isDemoMode) {
                await saveQuestionToFirestore(currentQuestions[index]);
            }
        }
    } else {
        // Add new question
        formData.id = isDemoMode ? 'demo_' + Date.now() : 'new_' + Date.now();
        formData.createdAt = new Date().toISOString();
        currentQuestions.push(formData);
        // Save to Firebase
        if (isFirebaseMode && !isDemoMode) {
            await saveQuestionToFirestore(formData);
        }
    }

    hideQuestionModal();
    renderQuestionsTable();
    loadDashboardData();
    
    // Show success message
    const mode = isFirebaseMode && !isDemoMode ? 'Firebase' : 'demo';
    showNotification(currentEditingId ? `Question updated successfully! (${mode})` : `Question added successfully! (${mode})`);
}

// Edit question
window.editQuestion = function(questionId) {
    showQuestionModal(questionId);
};

// Delete question
window.deleteQuestion = async function(questionId) {
    if (!confirm('Are you sure you want to delete this question?')) return;

    // Delete from Firebase first
    if (isFirebaseMode && !isDemoMode) {
        await deleteQuestionFromFirestore(questionId);
    }

    currentQuestions = currentQuestions.filter(q => q.id !== questionId);
    renderQuestionsTable();
    loadDashboardData();
    
    const mode = isFirebaseMode && !isDemoMode ? 'Firebase' : 'demo';
    showNotification(`Question deleted successfully! (${mode})`);
};

// Bulk export
function handleBulkExport() {
    const dataStr = JSON.stringify(currentQuestions, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cyberlearn-questions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Questions exported successfully!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Generate questions for mobile app (copy to clipboard)
function generateMobileAppQuestions() {
    const kotlinCode = currentQuestions.map(q => `
        QuizQuestion(
            id = "${q.id}",
            question = "${q.question.replace(/"/g, '\\"')}",
            options = listOf(
                ${q.options.map(opt => `"${opt.replace(/"/g, '\\"')}"`).join(',\n                ')}
            ),
            correctAnswer = "${q.correctAnswer.replace(/"/g, '\\"')}",
            explanation = "${q.explanation.replace(/"/g, '\\"')}",
            category = QuizCategory.${q.category},
            difficulty = QuizDifficulty.${q.difficulty},
            tags = listOf(${q.tags.map(tag => `"${tag}"`).join(', ')}),
            isActive = ${q.isActive}
        )`).join(',\n\n');
    
    navigator.clipboard.writeText(kotlinCode).then(() => {
        showNotification('Kotlin code copied to clipboard!');
    });
}

//==============================
// INTERVIEW QUESTIONS FUNCTIONS
//==============================

// Render interview questions table
function renderInterviewQuestionsTable() {
    const tbody = document.getElementById('interviewQuestionsTableBody');
    
    const tableHtml = currentInterviewQuestions.map(question => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${truncateText(question.question, 60)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ${formatCategory(question.category)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExperienceLevelColor(question.experienceLevel)}">
                    ${formatExperienceLevel(question.experienceLevel)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editInterviewQuestion('${question.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteInterviewQuestion('${question.id}')" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    tbody.innerHTML = tableHtml;
}

// Format experience level
function formatExperienceLevel(level) {
    const levels = {
        'ENTRY': 'Entry Level',
        'MID': 'Mid Level',
        'SENIOR': 'Senior Level',
        'EXPERT': 'Expert Level'
    };
    return levels[level] || level;
}

// Get experience level color
function getExperienceLevelColor(level) {
    switch (level) {
        case 'ENTRY': return 'bg-green-100 text-green-800';
        case 'MID': return 'bg-blue-100 text-blue-800';
        case 'SENIOR': return 'bg-orange-100 text-orange-800';
        case 'EXPERT': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// Show interview question modal
function showInterviewQuestionModal(questionId = null) {
    currentEditingInterviewId = questionId;
    const modal = document.getElementById('interviewQuestionModal');
    const title = document.getElementById('interviewModalTitle');
    
    if (questionId) {
        title.textContent = 'Edit Interview Question';
        loadInterviewQuestionData(questionId);
    } else {
        title.textContent = 'Add New Interview Question';
        clearInterviewQuestionForm();
    }
    
    modal.classList.remove('hidden');
}

// Hide interview question modal
function hideInterviewQuestionModal() {
    document.getElementById('interviewQuestionModal').classList.add('hidden');
    currentEditingInterviewId = null;
    clearInterviewQuestionForm();
}

// Clear interview question form
function clearInterviewQuestionForm() {
    document.getElementById('interviewQuestionText').value = '';
    document.getElementById('interviewQuestionCategory').value = 'SECURITY_OPERATIONS';
    document.getElementById('interviewExperienceLevel').value = 'ENTRY';
    document.getElementById('interviewQuestionAnswer').value = '';
    document.getElementById('interviewKeyPoints').value = '';
    document.getElementById('interviewQuestionTags').value = '';
    document.getElementById('interviewQuestionActive').checked = true;
}

// Load interview question data for editing
function loadInterviewQuestionData(questionId) {
    const question = currentInterviewQuestions.find(q => q.id === questionId);
    if (!question) return;

    document.getElementById('interviewQuestionText').value = question.question;
    document.getElementById('interviewQuestionCategory').value = question.category;
    document.getElementById('interviewExperienceLevel').value = question.experienceLevel;
    document.getElementById('interviewQuestionAnswer').value = question.answer;
    document.getElementById('interviewKeyPoints').value = question.keyPoints ? question.keyPoints.join('\\n') : '';
    document.getElementById('interviewQuestionTags').value = question.tags ? question.tags.join(', ') : '';
    document.getElementById('interviewQuestionActive').checked = question.isActive !== false;
}

// Handle interview question form submission
function handleInterviewQuestionSubmit(e) {
    e.preventDefault();

    const formData = {
        question: document.getElementById('interviewQuestionText').value,
        category: document.getElementById('interviewQuestionCategory').value,
        experienceLevel: document.getElementById('interviewExperienceLevel').value,
        answer: document.getElementById('interviewQuestionAnswer').value,
        keyPoints: document.getElementById('interviewKeyPoints').value.split('\\n').map(point => point.trim()).filter(point => point),
        tags: document.getElementById('interviewQuestionTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
        isActive: document.getElementById('interviewQuestionActive').checked,
        updatedAt: new Date().toISOString()
    };

    // Validate form
    if (!formData.question || !formData.answer) {
        alert('Please fill in all required fields');
        return;
    }

    if (currentEditingInterviewId) {
        // Update existing question
        const index = currentInterviewQuestions.findIndex(q => q.id === currentEditingInterviewId);
        if (index >= 0) {
            currentInterviewQuestions[index] = { ...currentInterviewQuestions[index], ...formData };
            // Save to Firebase
            if (isFirebaseMode && !isDemoMode) {
                await saveQuestionToFirestore(currentInterviewQuestions[index], true);
            }
        }
    } else {
        // Add new question
        formData.id = isDemoMode ? 'interview_' + Date.now() : 'new_interview_' + Date.now();
        formData.createdAt = new Date().toISOString();
        currentInterviewQuestions.push(formData);
        // Save to Firebase
        if (isFirebaseMode && !isDemoMode) {
            await saveQuestionToFirestore(formData, true);
        }
    }

    hideInterviewQuestionModal();
    renderInterviewQuestionsTable();
    loadDashboardData();
    
    // Show success message
    const mode = isFirebaseMode && !isDemoMode ? 'Firebase' : 'demo';
    showNotification(currentEditingInterviewId ? `Interview question updated successfully! (${mode})` : `Interview question added successfully! (${mode})`);
}

// Edit interview question
window.editInterviewQuestion = function(questionId) {
    showInterviewQuestionModal(questionId);
};

// Delete interview question
window.deleteInterviewQuestion = async function(questionId) {
    if (!confirm('Are you sure you want to delete this interview question?')) return;

    // Delete from Firebase first
    if (isFirebaseMode && !isDemoMode) {
        await deleteQuestionFromFirestore(questionId, true);
    }

    currentInterviewQuestions = currentInterviewQuestions.filter(q => q.id !== questionId);
    renderInterviewQuestionsTable();
    loadDashboardData();
    
    const mode = isFirebaseMode && !isDemoMode ? 'Firebase' : 'demo';
    showNotification(`Interview question deleted successfully! (${mode})`);
};

// Export interview questions
function handleInterviewExport() {
    const dataStr = JSON.stringify(currentInterviewQuestions, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cyberlearn-interview-questions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Interview questions exported successfully!');
}

//==============================
// CSV UPLOAD FUNCTIONS
//==============================

let csvData = null;

// Show CSV upload modal
function showCsvUploadModal() {
    console.log('🔍 CSV Upload: showCsvUploadModal called');
    try {
        const modal = document.getElementById('csvUploadModal');
        if (modal) {
            modal.classList.remove('hidden');
            console.log('✅ CSV Upload: Modal shown successfully');
        } else {
            console.error('❌ CSV Upload: Modal element not found');
        }
        resetCsvUploadForm();
    } catch (error) {
        console.error('❌ CSV Upload: Error showing modal:', error);
    }
}

// Hide CSV upload modal
function hideCsvUploadModal() {
    console.log('🔍 CSV Upload: hideCsvUploadModal called');
    try {
        const modal = document.getElementById('csvUploadModal');
        if (modal) {
            modal.classList.add('hidden');
            console.log('✅ CSV Upload: Modal hidden successfully');
        } else {
            console.error('❌ CSV Upload: Modal element not found for hiding');
        }
        resetCsvUploadForm();
    } catch (error) {
        console.error('❌ CSV Upload: Error hiding modal:', error);
    }
}

// Reset CSV upload form
function resetCsvUploadForm() {
    console.log('🔍 CSV Upload: resetCsvUploadForm called');
    try {
        const fileInput = document.getElementById('csvFileInput');
        const preview = document.getElementById('csvPreview');
        const validation = document.getElementById('csvValidation');
        const uploadBtn = document.getElementById('processCsvUpload');
        
        if (fileInput) fileInput.value = '';
        if (preview) preview.classList.add('hidden');
        if (validation) validation.classList.add('hidden');
        if (uploadBtn) uploadBtn.disabled = true;
        
        csvData = null;
        console.log('✅ CSV Upload: Form reset successfully');
    } catch (error) {
        console.error('❌ CSV Upload: Error resetting form:', error);
    }
}

// Handle CSV file selection
function handleCsvFileSelect(event) {
    console.log('🔍 CSV Upload: handleCsvFileSelect called');
    const file = event.target.files[0];
    if (!file) {
        console.log('❌ CSV Upload: No file selected');
        return;
    }
    
    console.log('📁 CSV Upload: File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
        alert('Please select a CSV file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        console.log('📖 CSV Upload: File read successfully, length:', e.target.result.length);
        const csvText = e.target.result;
        
        // Show loading state
        const uploadBtn = document.getElementById('processCsvUpload');
        if (uploadBtn) {
            uploadBtn.disabled = true;
            uploadBtn.textContent = 'Processing...';
        }
        
        try {
            parseCsvData(csvText);
        } catch (error) {
            console.error('❌ CSV Upload: Error parsing CSV:', error);
            alert('Error parsing CSV file: ' + error.message);
        }
    };
    reader.onerror = function(error) {
        console.error('❌ CSV Upload: Error reading file:', error);
        alert('Error reading file: ' + error.message);
    };
    reader.readAsText(file);
}

// Parse CSV data
function parseCsvData(csvText) {
    console.log('🔍 CSV Upload: parseCsvData called with text length:', csvText.length);
    try {
        // Fix: Use proper line splitting and handle different line endings
        const lines = csvText.trim().split(/\r?\n/);
        console.log('📊 CSV Upload: Parsed lines:', lines.length);
        
        if (lines.length < 2) {
            throw new Error('CSV file must have at least a header row and one data row');
        }
        
        // Parse header row properly
        const headers = parseCsvRow(lines[0]).map(h => h.trim().replace(/"/g, ''));
        console.log('📋 CSV Upload: Headers found:', headers);
        
        // Expected headers
        const expectedHeaders = ['question', 'option1', 'option2', 'option3', 'option4', 'correctAnswer', 'explanation', 'category', 'difficulty', 'tags'];
        console.log('🎯 CSV Upload: Expected headers:', expectedHeaders);
        
        // Validate headers
        const validation = validateCsvHeaders(headers, expectedHeaders);
        console.log('✅ CSV Upload: Header validation result:', validation);
        
        if (!validation.isValid) {
            console.log('❌ CSV Upload: Header validation failed');
            showCsvValidation(validation);
            return;
        }

        // Parse data rows
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const row = parseCsvRow(lines[i]);
                console.log(`📝 CSV Upload: Row ${i} parsed:`, row);
                
                // Ensure we have enough columns
                if (row.length >= expectedHeaders.length) {
                    const questionData = {};
                    expectedHeaders.forEach((header, index) => {
                        questionData[header] = row[index] ? row[index].trim().replace(/"/g, '') : '';
                    });
                    data.push(questionData);
                } else {
                    console.warn(`⚠️ CSV Upload: Row ${i} has insufficient columns (${row.length}/${expectedHeaders.length})`);
                }
            }
        }

        console.log('📊 CSV Upload: Parsed data rows:', data.length);
        csvData = data;
        
        showCsvPreview(lines.slice(0, 4)); // Show first 3 data rows + header
        
        const dataValidation = validateCsvData(data);
        console.log('✅ CSV Upload: Data validation result:', dataValidation);
        showCsvValidation(dataValidation);
        
        if (dataValidation.isValid) {
            const uploadBtn = document.getElementById('processCsvUpload');
            if (uploadBtn) {
                uploadBtn.disabled = false;
                uploadBtn.textContent = 'Upload Questions';
                console.log('✅ CSV Upload: Upload button enabled');
            } else {
                console.error('❌ CSV Upload: Upload button not found');
            }
        } else {
            // Reset button if validation fails
            const uploadBtn = document.getElementById('processCsvUpload');
            if (uploadBtn) {
                uploadBtn.disabled = true;
                uploadBtn.textContent = 'Upload Questions';
            }
        }
        
    } catch (error) {
        console.error('❌ CSV Upload: Error parsing CSV:', error);
        showCsvValidation({
            isValid: false,
            errors: [`Error parsing CSV: ${error.message}`],
            warnings: [],
        });
    }
}

// Parse CSV row (handles quoted fields properly)
function parseCsvRow(row) {
    const result = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < row.length) {
        const char = row[i];
        
        if (char === '"') {
            if (inQuotes && i + 1 < row.length && row[i + 1] === '"') {
                // Handle escaped quotes (double quotes)
                current += '"';
                i += 2;
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
                i++;
            }
        } else if (char === ',' && !inQuotes) {
            // End of field
            result.push(current.trim());
            current = '';
            i++;
        } else {
            // Regular character
            current += char;
            i++;
        }
    }
    
    // Add the last field
    result.push(current.trim());
    return result;
}

// Validate CSV headers
function validateCsvHeaders(headers, expected) {
    const errors = [];
    const warnings = [];
    
    expected.forEach(expectedHeader => {
        if (!headers.some(h => h.toLowerCase() === expectedHeader.toLowerCase())) {
            errors.push(`Missing required column: ${expectedHeader}`);
        }
    });
    
    headers.forEach(header => {
        if (!expected.some(e => e.toLowerCase() === header.toLowerCase())) {
            warnings.push(`Unknown column: ${header} (will be ignored)`);
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}

// Validate CSV data
function validateCsvData(data) {
    const errors = [];
    const warnings = [];
    
    data.forEach((row, index) => {
        const rowNum = index + 2; // +2 because index is 0-based and we skip header
        
        if (!row.question || !row.question.trim()) {
            errors.push(`Row ${rowNum}: Question is required`);
        }
        
        if (!row.option1 || !row.option2) {
            errors.push(`Row ${rowNum}: At least 2 options are required`);
        }
        
        if (!row.correctAnswer || !row.correctAnswer.trim()) {
            errors.push(`Row ${rowNum}: Correct answer is required`);
        }
        
        if (!row.explanation || !row.explanation.trim()) {
            errors.push(`Row ${rowNum}: Explanation is required`);
        }
        
        const validCategories = ['SECURITY_OPERATIONS', 'CLOUD_SECURITY', 'NETWORK_SECURITY', 'PENETRATION_TESTING', 'CRYPTOGRAPHY', 'MALWARE_ANALYSIS'];
        if (row.category && !validCategories.includes(row.category.toUpperCase())) {
            warnings.push(`Row ${rowNum}: Unknown category '${row.category}', will default to SECURITY_OPERATIONS`);
        }
        
        const validDifficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
        if (row.difficulty && !validDifficulties.includes(row.difficulty.toUpperCase())) {
            warnings.push(`Row ${rowNum}: Unknown difficulty '${row.difficulty}', will default to BEGINNER`);
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        count: data.length
    };
}

// Show CSV preview
function showCsvPreview(lines) {
    console.log('🔍 CSV Upload: showCsvPreview called with lines:', lines.length);
    
    const preview = document.getElementById('csvPreview');
    const content = document.getElementById('csvPreviewContent');
    
    if (!preview) {
        console.error('❌ CSV Upload: csvPreview div not found');
        return;
    }
    
    if (!content) {
        console.error('❌ CSV Upload: csvPreviewContent div not found');
        return;
    }
    
    console.log('✅ CSV Upload: Preview elements found');
    
    // Fix: Use proper line joining
    content.textContent = lines.join('\n');
    preview.classList.remove('hidden');
    
    console.log('✅ CSV Upload: Preview displayed successfully');
}

// Show CSV validation results
function showCsvValidation(validation) {
    console.log('🔍 CSV Upload: showCsvValidation called with:', validation);
    
    const validationDiv = document.getElementById('csvValidation');
    const resultsDiv = document.getElementById('csvValidationResults');
    
    if (!validationDiv) {
        console.error('❌ CSV Upload: csvValidation div not found');
        return;
    }
    
    if (!resultsDiv) {
        console.error('❌ CSV Upload: csvValidationResults div not found');
        return;
    }
    
    console.log('✅ CSV Upload: Validation elements found');
    
    let html = '';
    
    if (validation.count !== undefined) {
        html += `<div class="mb-2"><span class="text-sm text-gray-600">Found ${validation.count} question(s) to import</span></div>`;
    }
    
    if (validation.errors && validation.errors.length > 0) {
        html += '<div class="mb-2"><strong class="text-red-600">Errors:</strong><ul class="list-disc list-inside text-sm text-red-600">';
        validation.errors.forEach(error => {
            html += `<li>${error}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (validation.warnings && validation.warnings.length > 0) {
        html += '<div class="mb-2"><strong class="text-yellow-600">Warnings:</strong><ul class="list-disc list-inside text-sm text-yellow-600">';
        validation.warnings.forEach(warning => {
            html += `<li>${warning}</li>`;
        });
        html += '</ul></div>';
    }
    
    if (validation.isValid) {
        html += '<div class="text-green-600 text-sm"><i class="fas fa-check-circle mr-1"></i>CSV is valid and ready to import!</div>';
    }
    
    console.log('📝 CSV Upload: Generated validation HTML:', html);
    resultsDiv.innerHTML = html;
    validationDiv.classList.remove('hidden');
    console.log('✅ CSV Upload: Validation display updated');
}

// Process CSV file upload
function processCsvFile() {
    console.log('🔍 CSV Upload: processCsvFile called');
    console.log('📊 CSV Upload: csvData available:', !!csvData, 'Length:', csvData ? csvData.length : 0);
    
    if (!csvData || csvData.length === 0) {
        console.log('❌ CSV Upload: No valid data to import');
        alert('No valid data to import');
        return;
    }
    
    console.log('✅ CSV Upload: Starting import process...');
    let importedCount = 0;
    let errors = [];
    
    csvData.forEach((row, index) => {
        console.log(`📝 CSV Upload: Processing row ${index + 1}:`, row);
        
        try {
            // Create options array, filtering out empty options
            const options = [
                row.option1,
                row.option2,
                row.option3,
                row.option4
            ].filter(opt => opt && opt.trim());
            
            // Ensure we have at least 2 options
            if (options.length < 2) {
                errors.push(`Row ${index + 2}: Need at least 2 options`);
                return;
            }
            
            // Ensure correct answer is in options
            if (!options.includes(row.correctAnswer)) {
                options.push(row.correctAnswer);
                console.log(`✅ CSV Upload: Added correct answer to options for row ${index + 1}`);
            }
            
            const questionData = {
                id: 'csv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                question: row.question.trim(),
                options: options,
                correctAnswer: row.correctAnswer.trim(),
                explanation: row.explanation.trim(),
                category: row.category ? row.category.toUpperCase() : 'SECURITY_OPERATIONS',
                difficulty: row.difficulty ? row.difficulty.toUpperCase() : 'BEGINNER',
                tags: row.tags ? row.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
                isActive: true,
                createdAt: new Date().toISOString()
            };
            
            console.log(`📋 CSV Upload: Created question data:`, questionData);
            
            currentQuestions.push(questionData);
            importedCount++;
            console.log(`✅ CSV Upload: Row ${index + 1} processed successfully`);
            
        } catch (error) {
            console.error(`❌ CSV Upload: Error processing row ${index + 1}:`, error);
            errors.push(`Row ${index + 2}: ${error.message}`);
        }
    });
    
    console.log(`🎉 CSV Upload: Import completed. Total imported: ${importedCount}`);
    
    if (errors.length > 0) {
        console.warn(`⚠️ CSV Upload: ${errors.length} errors occurred:`, errors);
        alert(`Import completed with ${errors.length} errors:\n${errors.join('\n')}`);
    }
    
    // Reset button text
    const uploadBtn = document.getElementById('processCsvUpload');
    if (uploadBtn) {
        uploadBtn.textContent = 'Upload Questions';
    }
    
    hideCsvUploadModal();
    renderQuestionsTable();
    loadDashboardData();
    showNotification(`Successfully imported ${importedCount} question(s) from CSV!`);
}

// Download CSV template
function downloadCsvTemplate() {
    const template = [
        'question,option1,option2,option3,option4,correctAnswer,explanation,category,difficulty,tags',
        '"What is the primary function of a SIEM system?","Collect and analyze security events","Encrypt network traffic","Perform vulnerability scans","Create firewalls","Collect and analyze security events","SIEM systems centralize security monitoring and analysis","SECURITY_OPERATIONS","INTERMEDIATE","siem,soc,monitoring"',
        '"What defines the shared responsibility model in cloud security?","Security responsibilities between provider and customer","Cost sharing agreements","Data sharing between organizations","Network bandwidth allocation","Security responsibilities between provider and customer","Model divides security duties between cloud provider and customer","CLOUD_SECURITY","INTERMEDIATE","cloud,shared responsibility,aws"',
        '"What is the purpose of network segmentation?","Isolate traffic and limit attack spread","Increase network speed","Reduce hardware costs","Simplify management","Isolate traffic and limit attack spread","Segmentation prevents lateral movement and contains breaches","NETWORK_SECURITY","INTERMEDIATE","segmentation,isolation,vlans"'
    ].join('\n');
    
    const dataBlob = new Blob([template], {type: 'text/csv'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cyberlearn-questions-template.csv';
    link.click();
    
    showNotification('CSV template downloaded!');
}

//==============================
// FIREBASE INTEGRATION FUNCTIONS
//==============================

// Setup Firebase Authentication
function setupFirebaseAuth() {
    if (!isFirebaseMode) return;
    
    window.auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            console.log('🔐 User authenticated:', user.email);
            // Load real data from Firestore
            loadDataFromFirestore();
        } else {
            currentUser = null;
            console.log('🔓 User logged out');
        }
    });
}

// Load data from Firestore
async function loadDataFromFirestore() {
    try {
        // Load existing data...
        
        // Load user profiles
        const userProfilesSnapshot = await window.db.collection('user_profiles').get();
        userProfiles = [];
        userProfilesSnapshot.forEach((doc) => {
            userProfiles.push({ userId: doc.id, ...doc.data() });
        });
        
        // Load user analytics
        const userAnalyticsSnapshot = await window.db.collection('user_analytics').get();
        userAnalytics = {};
        userAnalyticsSnapshot.forEach((doc) => {
            userAnalytics[doc.id] = { ...doc.data() };
        });
        
        console.log('📊 Loaded data from Firestore:', { 
            quiz: currentQuestions.length, 
            interview: currentInterviewQuestions.length, 
            users: userProfiles.length, 
            analytics: Object.keys(userAnalytics).length 
        });
        
    } catch (error) {
        console.error('❌ Error loading data from Firestore:', error);
        showNotification('Error loading data from Firebase');
    }
}

// Save question to Firestore
async function saveQuestionToFirestore(question, isInterview = false) {
    if (!isFirebaseMode) return false;
    
    try {
        const collectionName = isInterview ? 'interview_questions' : 'quiz_questions';
        
        if (question.id && question.id.startsWith('demo_') === false && question.id.startsWith('interview_') === false && question.id.startsWith('csv_') === false) {
            // Update existing
            await window.db.collection(collectionName).doc(question.id).update(question);
            console.log('✅ Updated question in Firestore:', question.id);
        } else {
            // Add new
            const docRef = await window.db.collection(collectionName).add(question);
            question.id = docRef.id;
            console.log('✅ Added question to Firestore:', question.id);
        }
        return true;
    } catch (error) {
        console.error('❌ Error saving to Firestore:', error);
        showNotification('Error saving to Firebase. Changes saved locally only.');
        return false;
    }
}

// Delete question from Firestore
async function deleteQuestionFromFirestore(questionId, isInterview = false) {
    if (!isFirebaseMode) return false;
    
    try {
        const collectionName = isInterview ? 'interview_questions' : 'quiz_questions';
        
        await window.db.collection(collectionName).doc(questionId).delete();
        console.log('✅ Deleted question from Firestore:', questionId);
        return true;
    } catch (error) {
        console.error('❌ Error deleting from Firestore:', error);
        showNotification('Error deleting from Firebase. Deleted locally only.');
        return false;
    }
}

// Firebase Authentication for login
async function handleFirebaseLogin(email, password) {
    if (!isFirebaseMode) return false;
    
    try {
        const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
        console.log('🔐 Firebase login successful:', userCredential.user.email);
        return true;
    } catch (error) {
        console.error('❌ Firebase login error:', error);
        throw new Error(error.message);
    }
}

// Firebase logout
async function handleFirebaseLogout() {
    if (!isFirebaseMode) return;
    
    try {
        await window.auth.signOut();
        console.log('🔓 Firebase logout successful');
    } catch (error) {
        console.error('❌ Firebase logout error:', error);
    }
}

// Add button to generate mobile code
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const exportBtn = document.getElementById('bulkExportBtn');
        if (exportBtn) {
            const generateBtn = document.createElement('button');
            generateBtn.className = 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition ml-2';
            generateBtn.innerHTML = '<i class="fas fa-code mr-2"></i>Copy Kotlin';
            generateBtn.onclick = generateMobileAppQuestions;
            exportBtn.parentNode.appendChild(generateBtn);
        }
    }, 1000);
});

//==============================
// USER PROFILES FUNCTIONS
//==============================

// Render user profiles table
function renderUserProfilesTable() {
    const tbody = document.getElementById('userProfilesTableBody');
    
    const tableHtml = userProfiles.map(profile => `
        <tr>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${profile.displayName || 'N/A'}</div>
                <div class="text-xs text-gray-500">${profile.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ${profile.isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${profile.joinDate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${profile.lastActive}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editUserProfile('${profile.userId}')" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteUserProfile('${profile.userId}')" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    tbody.innerHTML = tableHtml;
}

// Show user profile modal
function showUserProfileModal(userId = null) {
    const modal = document.getElementById('userProfileModal');
    const title = document.getElementById('userProfileModalTitle');
    
    if (userId) {
        title.textContent = 'Edit User Profile';
        loadUserProfileData(userId);
    } else {
        title.textContent = 'Add New User Profile';
        clearUserProfileForm();
    }
    
    modal.classList.remove('hidden');
}

// Hide user profile modal
function hideUserProfileModal() {
    document.getElementById('userProfileModal').classList.add('hidden');
}

// Clear user profile form
function clearUserProfileForm() {
    document.getElementById('userProfileEmail').value = '';
    document.getElementById('userProfileDisplayName').value = '';
    document.getElementById('userProfileAvatarUrl').value = '';
    document.getElementById('userProfileIsActive').checked = true;
    document.getElementById('userProfileJoinDate').value = '';
    document.getElementById('userProfileLastActive').value = '';
    document.getElementById('userProfileTotalQuizzesTaken').value = '';
    document.getElementById('userProfileTotalQuizzesPassed').value = '';
    document.getElementById('userProfileAverageQuizScore').value = '';
    document.getElementById('userProfileTotalFlashcardsStudied').value = '';
    document.getElementById('userProfileTotalInterviewQuestionsPracticed').value = '';
    document.getElementById('userProfileTotalLearningPathsStarted').value = '';
    document.getElementById('userProfileTotalLearningPathsCompleted').value = '';
    document.getElementById('userProfileOverallProgress').value = '';
    document.getElementById('userProfileCurrentStreak').value = '';
    document.getElementById('userProfileLongestStreak').value = '';
    document.getElementById('userProfileTotalStudyTime').value = '';
    document.getElementById('userProfileTotalXP').value = '';
    document.getElementById('userProfileLevel').value = '';
    document.getElementById('userProfileLearningPathProgress').value = '';
    document.getElementById('userProfileQuizHistory').value = '';
    document.getElementById('userProfileFlashcardProgress').value = '';
    document.getElementById('userProfileInterviewProgress').value = '';
    document.getElementById('userProfileBadges').value = '';
    document.getElementById('userProfileAchievements').value = '';
    document.getElementById('userProfileRecentActivity').value = '';
    document.getElementById('userProfilePreferredCategories').value = '';
    document.getElementById('userProfileDifficultyPreference').value = '';
    document.getElementById('userProfileNotificationSettings').value = '';
    document.getElementById('userProfileLastSynced').value = '';
    document.getElementById('userProfileSyncVersion').value = '';
}

// Load user profile data for editing
function loadUserProfileData(userId) {
    const profile = userProfiles.find(p => p.userId === userId);
    if (!profile) return;

    document.getElementById('userProfileEmail').value = profile.email;
    document.getElementById('userProfileDisplayName').value = profile.displayName;
    document.getElementById('userProfileAvatarUrl').value = profile.avatarUrl || '';
    document.getElementById('userProfileIsActive').checked = profile.isActive;
    document.getElementById('userProfileJoinDate').value = profile.joinDate;
    document.getElementById('userProfileLastActive').value = profile.lastActive;
    document.getElementById('userProfileTotalQuizzesTaken').value = profile.totalQuizzesTaken;
    document.getElementById('userProfileTotalQuizzesPassed').value = profile.totalQuizzesPassed;
    document.getElementById('userProfileAverageQuizScore').value = profile.averageQuizScore;
    document.getElementById('userProfileTotalFlashcardsStudied').value = profile.totalFlashcardsStudied;
    document.getElementById('userProfileTotalInterviewQuestionsPracticed').value = profile.totalInterviewQuestionsPracticed;
    document.getElementById('userProfileTotalLearningPathsStarted').value = profile.totalLearningPathsStarted;
    document.getElementById('userProfileTotalLearningPathsCompleted').value = profile.totalLearningPathsCompleted;
    document.getElementById('userProfileOverallProgress').value = profile.overallProgress;
    document.getElementById('userProfileCurrentStreak').value = profile.currentStreak;
    document.getElementById('userProfileLongestStreak').value = profile.longestStreak;
    document.getElementById('userProfileTotalStudyTime').value = profile.totalStudyTime;
    document.getElementById('userProfileTotalXP').value = profile.totalXP;
    document.getElementById('userProfileLevel').value = profile.level;
    document.getElementById('userProfileLearningPathProgress').value = profile.learningPathProgress ? JSON.stringify(profile.learningPathProgress) : '';
    document.getElementById('userProfileQuizHistory').value = profile.quizHistory ? JSON.stringify(profile.quizHistory) : '';
    document.getElementById('userProfileFlashcardProgress').value = profile.flashcardProgress ? JSON.stringify(profile.flashcardProgress) : '';
    document.getElementById('userProfileInterviewProgress').value = profile.interviewProgress ? JSON.stringify(profile.interviewProgress) : '';
    document.getElementById('userProfileBadges').value = profile.badges ? JSON.stringify(profile.badges) : '';
    document.getElementById('userProfileAchievements').value = profile.achievements ? JSON.stringify(profile.achievements) : '';
    document.getElementById('userProfileRecentActivity').value = profile.recentActivity ? JSON.stringify(profile.recentActivity) : '';
    document.getElementById('userProfilePreferredCategories').value = profile.preferredCategories ? profile.preferredCategories.join(', ') : '';
    document.getElementById('userProfileDifficultyPreference').value = profile.difficultyPreference;
    document.getElementById('userProfileNotificationSettings').value = profile.notificationSettings ? JSON.stringify(profile.notificationSettings) : '';
    document.getElementById('userProfileLastSynced').value = profile.lastSynced;
    document.getElementById('userProfileSyncVersion').value = profile.syncVersion;
}

// Handle user profile form submission
async function handleUserProfileSubmit(e) {
    e.preventDefault();

    const formData = {
        email: document.getElementById('userProfileEmail').value,
        displayName: document.getElementById('userProfileDisplayName').value,
        avatarUrl: document.getElementById('userProfileAvatarUrl').value,
        isActive: document.getElementById('userProfileIsActive').checked,
        joinDate: document.getElementById('userProfileJoinDate').value,
        lastActive: document.getElementById('userProfileLastActive').value,
        totalQuizzesTaken: document.getElementById('userProfileTotalQuizzesTaken').value,
        totalQuizzesPassed: document.getElementById('userProfileTotalQuizzesPassed').value,
        averageQuizScore: document.getElementById('userProfileAverageQuizScore').value,
        totalFlashcardsStudied: document.getElementById('userProfileTotalFlashcardsStudied').value,
        totalInterviewQuestionsPracticed: document.getElementById('userProfileTotalInterviewQuestionsPracticed').value,
        totalLearningPathsStarted: document.getElementById('userProfileTotalLearningPathsStarted').value,
        totalLearningPathsCompleted: document.getElementById('userProfileTotalLearningPathsCompleted').value,
        overallProgress: document.getElementById('userProfileOverallProgress').value,
        currentStreak: document.getElementById('userProfileCurrentStreak').value,
        longestStreak: document.getElementById('userProfileLongestStreak').value,
        totalStudyTime: document.getElementById('userProfileTotalStudyTime').value,
        totalXP: document.getElementById('userProfileTotalXP').value,
        level: document.getElementById('userProfileLevel').value,
        learningPathProgress: document.getElementById('userProfileLearningPathProgress').value ? JSON.parse(document.getElementById('userProfileLearningPathProgress').value) : [],
        quizHistory: document.getElementById('userProfileQuizHistory').value ? JSON.parse(document.getElementById('userProfileQuizHistory').value) : [],
        flashcardProgress: document.getElementById('userProfileFlashcardProgress').value ? JSON.parse(document.getElementById('userProfileFlashcardProgress').value) : [],
        interviewProgress: document.getElementById('userProfileInterviewProgress').value ? JSON.parse(document.getElementById('userProfileInterviewProgress').value) : [],
        badges: document.getElementById('userProfileBadges').value ? JSON.parse(document.getElementById('userProfileBadges').value) : [],
        achievements: document.getElementById('userProfileAchievements').value ? JSON.parse(document.getElementById('userProfileAchievements').value) : [],
        recentActivity: document.getElementById('userProfileRecentActivity').value ? JSON.parse(document.getElementById('userProfileRecentActivity').value) : [],
        preferredCategories: document.getElementById('userProfilePreferredCategories').value ? document.getElementById('userProfilePreferredCategories').value.split(',').map(cat => cat.trim()) : [],
        difficultyPreference: document.getElementById('userProfileDifficultyPreference').value,
        notificationSettings: document.getElementById('userProfileNotificationSettings').value ? JSON.parse(document.getElementById('userProfileNotificationSettings').value) : {},
        lastSynced: document.getElementById('userProfileLastSynced').value,
        syncVersion: document.getElementById('userProfileSyncVersion').value,
        updatedAt: new Date().toISOString()
    };

    // Validate form
    if (!formData.email || !formData.displayName) {
        alert('Please fill in email and display name');
        return;
    }

    if (formData.userId) {
        // Update existing profile
        const index = userProfiles.findIndex(p => p.userId === formData.userId);
        if (index >= 0) {
            userProfiles[index] = { ...userProfiles[index], ...formData };
            // Save to Firebase
            if (isFirebaseMode && !isDemoMode) {
                await saveUserProfileToFirestore(userProfiles[index]);
            }
        }
    } else {
        // Add new profile
        formData.userId = 'user_' + Date.now(); // Simple ID generation
        formData.createdAt = new Date().toISOString();
        userProfiles.push(formData);
        // Save to Firebase
        if (isFirebaseMode && !isDemoMode) {
            await saveUserProfileToFirestore(formData);
        }
    }

    hideUserProfileModal();
    renderUserProfilesTable();
    loadDashboardData();
    
    // Show success message
    const mode = isFirebaseMode && !isDemoMode ? 'Firebase' : 'demo';
    showNotification(formData.userId ? `User profile updated successfully! (${mode})` : `User profile added successfully! (${mode})`);
}

// Edit user profile
window.editUserProfile = function(userId) {
    showUserProfileModal(userId);
};

// Delete user profile
window.deleteUserProfile = async function(userId) {
    if (!confirm('Are you sure you want to delete this user profile?')) return;

    // Delete from Firebase first
    if (isFirebaseMode && !isDemoMode) {
        await deleteUserProfileFromFirestore(userId);
    }

    userProfiles = userProfiles.filter(p => p.userId !== userId);
    renderUserProfilesTable();
    loadDashboardData();
    
    const mode = isFirebaseMode && !isDemoMode ? 'Firebase' : 'demo';
    showNotification(`User profile deleted successfully! (${mode})`);
};

// Save user profile to Firestore
async function saveUserProfileToFirestore(profile) {
    if (!isFirebaseMode) return false;
    
    try {
        if (profile.userId && profile.userId.startsWith('demo_') === false && profile.userId.startsWith('user_') === false && profile.userId.startsWith('csv_') === false) {
            // Update existing
            await window.db.collection('user_profiles').doc(profile.userId).update(profile);
            console.log('✅ Updated user profile in Firestore:', profile.userId);
        } else {
            // Add new
            const docRef = await window.db.collection('user_profiles').add(profile);
            profile.userId = docRef.id;
            console.log('✅ Added user profile to Firestore:', profile.userId);
        }
        return true;
    } catch (error) {
        console.error('❌ Error saving user profile to Firestore:', error);
        showNotification('Error saving user profile to Firebase. Changes saved locally only.');
        return false;
    }
}

// Delete user profile from Firestore
async function deleteUserProfileFromFirestore(userId) {
    if (!isFirebaseMode) return false;
    
    try {
        await window.db.collection('user_profiles').doc(userId).delete();
        console.log('✅ Deleted user profile from Firestore:', userId);
        return true;
    } catch (error) {
        console.error('❌ Error deleting user profile from Firestore:', error);
        showNotification('Error deleting user profile from Firebase. Deleted locally only.');
        return false;
    }
}

//==============================
// USER ANALYTICS FUNCTIONS
//==============================

// User insights and recommendations functionality
function populateUserInsightsSelector() {
    const selector = document.getElementById('userInsightsSelect');
    if (!selector) return;
    
    // Clear existing options
    selector.innerHTML = '<option value="">Choose a user...</option>';
    
    // Add user options
    userProfiles.forEach(user => {
        const option = document.createElement('option');
        option.value = user.userId;
        option.textContent = `${user.displayName} (${user.email})`;
        selector.appendChild(option);
    });
}

function showUserInsights() {
    const selector = document.getElementById('userInsightsSelect');
    const display = document.getElementById('userInsightsDisplay');
    
    if (!selector || !display) return;
    
    const selectedUserId = selector.value;
    if (!selectedUserId) {
        display.innerHTML = '<p class="text-gray-500">Select a user to view insights and recommendations.</p>';
        return;
    }
    
    const user = userProfiles.find(u => u.userId === selectedUserId);
    if (!user) {
        display.innerHTML = '<p class="text-red-500">User not found.</p>';
        return;
    }
    
    const insights = generateUserInsights(user);
    const engagementScore = calculateUserEngagementScore(user);
    
    let insightsHtml = `
        <div class="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 class="font-medium text-gray-900 mb-2">User Overview</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <span class="text-gray-600">Engagement Score:</span>
                    <span class="font-medium ml-1">${engagementScore}/100</span>
                </div>
                <div>
                    <span class="text-gray-600">Quiz Score:</span>
                    <span class="font-medium ml-1">${(user.averageQuizScore * 100).toFixed(1)}%</span>
                </div>
                <div>
                    <span class="text-gray-600">Current Streak:</span>
                    <span class="font-medium ml-1">${user.currentStreak || 0} days</span>
                </div>
                <div>
                    <span class="text-gray-600">Study Time:</span>
                    <span class="font-medium ml-1">${Math.round((user.totalStudyTime || 0) / 3600)}h</span>
                </div>
            </div>
        </div>
    `;
    
    if (insights.length === 0) {
        insightsHtml += '<p class="text-gray-500">No specific insights available for this user.</p>';
    } else {
        insights.forEach(insight => {
            const colorClass = insight.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                              insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                              'bg-blue-50 border-blue-200 text-blue-800';
            
            insightsHtml += `
                <div class="border-l-4 ${colorClass} p-4 rounded-r-lg">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <i class="fas ${insight.type === 'success' ? 'fa-check-circle' : 
                                           insight.type === 'warning' ? 'fa-exclamation-triangle' : 
                                           'fa-info-circle'} text-lg"></i>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium">${insight.message}</p>
                            <p class="text-sm mt-1">
                                <span class="font-medium">Recommendation:</span> ${insight.action}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    display.innerHTML = insightsHtml;
}

// Update the renderUserAnalytics function to populate user selector
function renderUserAnalytics() {
    console.log('🔄 Starting renderUserAnalytics...');
    
    try {
        // Calculate analytics from user profiles
        console.log('📊 Calculating analytics...');
        const analytics = calculateUserAnalytics();
        console.log('✅ Analytics calculated:', analytics);
        
        // Update dashboard stats
        console.log('📈 Updating dashboard stats...');
        const totalUsersEl = document.getElementById('totalUsers');
        const activeUsersEl = document.getElementById('activeUsers');
        const avgScoreEl = document.getElementById('avgScore');
        const avgStreakEl = document.getElementById('avgStreak');
        
        if (totalUsersEl) totalUsersEl.textContent = analytics.totalUsers;
        if (activeUsersEl) activeUsersEl.textContent = analytics.activeUsers;
        if (avgScoreEl) avgScoreEl.textContent = `${(analytics.avgScore * 100).toFixed(1)}%`;
        if (avgStreakEl) avgStreakEl.textContent = analytics.avgStreak.toFixed(1);
        
        console.log('✅ Dashboard stats updated');
        
        // Render top performers
        console.log('🏆 Rendering top performers...');
        renderTopPerformers(analytics.topQuizPerformers, analytics.topScoringUsers);
        
        // Render learning path analytics
        console.log('🛤️ Rendering learning path analytics...');
        renderLearningPathAnalytics(analytics.learningPathPopularity, analytics.learningPathCompletionRates);
        
        // Render user activity timeline
        console.log('📅 Rendering user activity timeline...');
        renderUserActivityTimeline(analytics.recentActivity);
        
        // Render category performance
        console.log('📊 Rendering category performance...');
        renderCategoryPerformance(analytics.categoryPerformance);
        
        // Populate user insights selector
        console.log('🧠 Populating user insights selector...');
        populateUserInsightsSelector();
        
        // Initialize charts after a short delay to ensure DOM is ready
        console.log('📊 Initializing charts...');
        setTimeout(() => {
            initializeAnalyticsCharts();
        }, 100);
        
        // Start real-time refresh
        console.log('🔄 Starting real-time refresh...');
        startAnalyticsRefresh();
        
        console.log('✅ renderUserAnalytics completed successfully');
    } catch (error) {
        console.error('❌ Error in renderUserAnalytics:', error);
    }
}

// Calculate user analytics from profiles
function calculateUserAnalytics() {
    if (userProfiles.length === 0) {
        return {
            totalUsers: 0,
            activeUsers: 0,
            avgScore: 0,
            avgStreak: 0,
            topQuizPerformers: [],
            topScoringUsers: [],
            learningPathPopularity: [],
            learningPathCompletionRates: [],
            recentActivity: [],
            categoryPerformance: []
        };
    }
    
    const activeUsers = userProfiles.filter(p => p.isActive).length;
    const avgScore = userProfiles.reduce((sum, p) => sum + (p.averageQuizScore || 0), 0) / userProfiles.length;
    const avgStreak = userProfiles.reduce((sum, p) => sum + (p.currentStreak || 0), 0) / userProfiles.length;
    
    // Top quiz performers (by number of quizzes taken)
    const topQuizPerformers = [...userProfiles]
        .sort((a, b) => (b.totalQuizzesTaken || 0) - (a.totalQuizzesTaken || 0))
        .slice(0, 5)
        .map(p => ({
            userId: p.userId,
            displayName: p.displayName,
            quizCount: p.totalQuizzesTaken || 0
        }));
    
    // Top scoring users (by average score)
    const topScoringUsers = [...userProfiles]
        .filter(p => p.averageQuizScore > 0)
        .sort((a, b) => (b.averageQuizScore || 0) - (a.averageQuizScore || 0))
        .slice(0, 5)
        .map(p => ({
            userId: p.userId,
            displayName: p.displayName,
            avgScore: p.averageQuizScore || 0
        }));
    
    // Learning path popularity (mock data for now)
    const learningPathPopularity = [
        { pathId: "NETWORK_SECURITY", userCount: userProfiles.filter(p => p.preferredCategories?.includes("NETWORK_SECURITY")).length },
        { pathId: "CRYPTOGRAPHY", userCount: userProfiles.filter(p => p.preferredCategories?.includes("CRYPTOGRAPHY")).length },
        { pathId: "PENETRATION_TESTING", userCount: userProfiles.filter(p => p.preferredCategories?.includes("PENETRATION_TESTING")).length },
        { pathId: "INCIDENT_RESPONSE", userCount: userProfiles.filter(p => p.preferredCategories?.includes("INCIDENT_RESPONSE")).length }
    ].sort((a, b) => b.userCount - a.userCount);
    
    // Learning path completion rates (mock data for now)
    const learningPathCompletionRates = [
        { pathId: "NETWORK_SECURITY", avgProgress: 0.75 },
        { pathId: "CRYPTOGRAPHY", avgProgress: 0.68 },
        { pathId: "PENETRATION_TESTING", avgProgress: 0.82 },
        { pathId: "INCIDENT_RESPONSE", avgProgress: 0.71 }
    ].sort((a, b) => b.avgProgress - a.avgProgress);
    
    // Recent activity (mock data for now)
    const recentActivity = userProfiles
        .filter(p => p.lastActive)
        .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
        .slice(0, 10)
        .map(p => ({
            userId: p.userId,
            displayName: p.displayName,
            activity: "Last active",
            timestamp: p.lastActive,
            type: "ACTIVITY"
        }));
    
    // Category performance (mock data for now)
    const categoryPerformance = [
        { category: "NETWORK_SECURITY", attemptCount: userProfiles.reduce((sum, p) => sum + (p.totalQuizzesTaken || 0), 0) },
        { category: "CRYPTOGRAPHY", attemptCount: Math.floor(userProfiles.reduce((sum, p) => sum + (p.totalQuizzesTaken || 0), 0) * 0.8) },
        { category: "PENETRATION_TESTING", attemptCount: Math.floor(userProfiles.reduce((sum, p) => sum + (p.totalQuizzesTaken || 0), 0) * 0.6) },
        { category: "INCIDENT_RESPONSE", attemptCount: Math.floor(userProfiles.reduce((sum, p) => sum + (p.totalQuizzesTaken || 0), 0) * 0.7) }
    ].sort((a, b) => b.attemptCount - a.attemptCount);
    
    return {
        totalUsers: userProfiles.length,
        activeUsers,
        avgScore,
        avgStreak,
        topQuizPerformers,
        topScoringUsers,
        learningPathPopularity,
        learningPathCompletionRates,
        recentActivity,
        categoryPerformance
    };
}

// Render top performers
function renderTopPerformers(topQuizPerformers, topScoringUsers) {
    // Top quiz performers
    const topPerformersHtml = topQuizPerformers.map((user, index) => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    ${index + 1}
                </div>
                <div>
                    <div class="font-medium text-gray-900">${user.displayName}</div>
                    <div class="text-sm text-gray-500">${user.quizCount} quizzes taken</div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-lg font-bold text-blue-600">${user.quizCount}</div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('topQuizPerformers').innerHTML = topPerformersHtml;
    
    // Top scoring users
    const topScorersHtml = topScoringUsers.map((user, index) => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
                <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    ${index + 1}
                </div>
                <div>
                    <div class="font-medium text-gray-900">${user.displayName}</div>
                    <div class="text-sm text-gray-500">Average score</div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-lg font-bold text-green-600">${(user.avgScore * 100).toFixed(1)}%</div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('topScoringUsers').innerHTML = topScorersHtml;
}

// Render learning path analytics
function renderLearningPathAnalytics(popularity, completionRates) {
    // Learning path popularity
    const popularityHtml = popularity.map((path, index) => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
                <div class="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    ${index + 1}
                </div>
                <div>
                    <div class="font-medium text-gray-900">${path.pathId.replace(/_/g, ' ')}</div>
                    <div class="text-sm text-gray-500">Users enrolled</div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-lg font-bold text-purple-600">${path.userCount}</div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('learningPathPopularity').innerHTML = popularityHtml;
    
    // Learning path completion rates
    const completionHtml = completionRates.map((path, index) => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
                <div class="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    ${index + 1}
                </div>
                <div>
                    <div class="font-medium text-gray-900">${path.pathId.replace(/_/g, ' ')}</div>
                    <div class="text-sm text-gray-500">Completion rate</div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-lg font-bold text-yellow-600">${(path.avgProgress * 100).toFixed(1)}%</div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('learningPathCompletionRates').innerHTML = completionHtml;
}

// Render user activity timeline
function renderUserActivityTimeline(recentActivity) {
    const timelineHtml = recentActivity.map(activity => `
        <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div class="flex-1">
                <div class="flex items-center justify-between">
                    <div class="font-medium text-gray-900">${activity.displayName}</div>
                    <div class="text-sm text-gray-500">${formatTimestamp(activity.timestamp)}</div>
                </div>
                <div class="text-sm text-gray-600">${activity.activity}</div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('userActivityTimeline').innerHTML = timelineHtml;
}

// Render category performance
function renderCategoryPerformance(categoryPerformance) {
    const performanceHtml = categoryPerformance.map((category, index) => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
                <div class="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    ${index + 1}
                </div>
                <div>
                    <div class="font-medium text-gray-900">${category.category.replace(/_/g, ' ')}</div>
                    <div class="text-sm text-gray-500">Total attempts</div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-lg font-bold text-indigo-600">${category.attemptCount}</div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('categoryPerformance').innerHTML = performanceHtml;
}

// Format timestamp for display
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown';
    
    try {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    } catch (e) {
        return timestamp;
    }
}

// Load user analytics data
async function loadUserAnalyticsData() {
    if (isDemoMode) {
        // Use sample data for demo mode
        return;
    }
    
    try {
        // Load user profiles from Firestore
        const userProfilesSnapshot = await window.db.collection('user_profiles').get();
        userProfiles = [];
        userProfilesSnapshot.forEach((doc) => {
            userProfiles.push({ userId: doc.id, ...doc.data() });
        });
        
        // Load additional analytics data if available
        const analyticsSnapshot = await window.db.collection('user_analytics').get();
        userAnalytics = {};
        analyticsSnapshot.forEach((doc) => {
            userAnalytics[doc.id] = { ...doc.data() };
        });
        
        console.log('📊 Loaded user analytics data:', { profiles: userProfiles.length, analytics: Object.keys(userAnalytics).length });
        
    } catch (error) {
        console.error('❌ Error loading user analytics data:', error);
        showNotification('Error loading user analytics data');
    }
}

// Update dashboard with user analytics
function updateDashboardWithUserAnalytics() {
    if (userProfiles.length === 0) return;
    
    const analytics = calculateUserAnalytics();
    
    // Update dashboard stats
    const activeUsersElement = document.getElementById('activeUsers');
    if (activeUsersElement) {
        activeUsersElement.textContent = analytics.activeUsers;
    }
    
    // Update recent activity with user activity
    const recentActivityElement = document.getElementById('recentActivity');
    if (recentActivityElement) {
        const userActivityHtml = analytics.recentActivity.slice(0, 5).map(activity => `
            <div class="flex items-center space-x-3">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900">${activity.displayName}</div>
                    <div class="text-xs text-gray-500">${activity.activity} - ${formatTimestamp(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');
        
        recentActivityElement.innerHTML = userActivityHtml;
    }
}

// Add event listener for user analytics section
document.addEventListener('DOMContentLoaded', function() {
    // Existing event listeners...
    
    // User analytics section
    const userAnalyticsSection = document.querySelector('[data-section="user-analytics"]');
    if (userAnalyticsSection) {
        console.log('✅ User analytics section found, adding event listener');
        userAnalyticsSection.addEventListener('click', function() {
            console.log('🖱️ User analytics section clicked');
            showSection('user-analytics');
            renderUserAnalytics();
        });
    } else {
        console.error('❌ User analytics section not found');
    }
});

// Update the showSection function to handle user-analytics
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Remove active class from all sidebar items
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('sidebar-active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionName + '-section');
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }
    
    // Add active class to selected sidebar item
    const selectedSidebarItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (selectedSidebarItem) {
        selectedSidebarItem.classList.add('sidebar-active');
    }
    
    // Load section-specific data
    if (sectionName === 'dashboard') {
        loadDashboardData();
    } else if (sectionName === 'quiz-questions') {
        renderQuizQuestionsTable();
    } else if (sectionName === 'interview-qa') {
        renderInterviewQuestionsTable();
    } else if (sectionName === 'flashcards') {
        renderFlashcardsTable();
    } else if (sectionName === 'analytics') {
        renderAnalytics();
    } else if (sectionName === 'user-analytics') {
        renderUserAnalytics();
    } else if (sectionName === 'user-management') {
        loadUserProfiles();
        setupUserManagementEventListeners();
    }
}

//==============================
// ADVANCED ANALYTICS FEATURES
//==============================

// Chart.js integration for advanced visualizations
let analyticsCharts = {};

// Initialize charts when user analytics section is shown
function initializeAnalyticsCharts() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded, skipping chart initialization');
        return;
    }
    
    const analytics = calculateUserAnalytics();
    
    // Performance Trends Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx && !analyticsCharts.performance) {
        analyticsCharts.performance = new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Average Quiz Score',
                    data: [75, 78, 82, 85],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Active Users',
                    data: [120, 135, 142, 158],
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Performance Trends (Last 4 Weeks)'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Learning Path Distribution Chart
    const pathCtx = document.getElementById('learningPathChart');
    if (pathCtx && !analyticsCharts.learningPath) {
        analyticsCharts.learningPath = new Chart(pathCtx, {
            type: 'doughnut',
            data: {
                labels: ['Network Security', 'Cryptography', 'Penetration Testing', 'Incident Response'],
                datasets: [{
                    data: [
                        analytics.learningPathPopularity.find(p => p.pathId === 'NETWORK_SECURITY')?.userCount || 0,
                        analytics.learningPathPopularity.find(p => p.pathId === 'CRYPTOGRAPHY')?.userCount || 0,
                        analytics.learningPathPopularity.find(p => p.pathId === 'PENETRATION_TESTING')?.userCount || 0,
                        analytics.learningPathPopularity.find(p => p.pathId === 'INCIDENT_RESPONSE')?.userCount || 0
                    ],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Learning Path Distribution'
                    }
                }
            }
        });
    }
}

// Export analytics data to CSV
function exportAnalyticsToCSV() {
    const analytics = calculateUserAnalytics();
    
    // Prepare CSV data
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // User summary
    csvContent += "User Analytics Summary\n";
    csvContent += "Total Users," + analytics.totalUsers + "\n";
    csvContent += "Active Users," + analytics.activeUsers + "\n";
    csvContent += "Average Score," + (analytics.avgScore * 100).toFixed(1) + "%\n";
    csvContent += "Average Streak," + analytics.avgStreak.toFixed(1) + "\n\n";
    
    // Top performers
    csvContent += "Top Quiz Performers\n";
    csvContent += "Rank,User,Quizzes Taken\n";
    analytics.topQuizPerformers.forEach((user, index) => {
        csvContent += (index + 1) + "," + user.displayName + "," + user.quizCount + "\n";
    });
    
    csvContent += "\nTop Scoring Users\n";
    csvContent += "Rank,User,Average Score\n";
    analytics.topScoringUsers.forEach((user, index) => {
        csvContent += (index + 1) + "," + user.displayName + "," + (user.avgScore * 100).toFixed(1) + "%\n";
    });
    
    // Learning path data
    csvContent += "\nLearning Path Popularity\n";
    csvContent += "Path,User Count\n";
    analytics.learningPathPopularity.forEach(path => {
        csvContent += path.pathId.replace(/_/g, ' ') + "," + path.userCount + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cyberlearn_analytics_" + new Date().toISOString().split('T')[0] + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Analytics data exported successfully!');
}

// Real-time data refresh
let analyticsRefreshInterval;

function startAnalyticsRefresh() {
    // Refresh every 30 seconds
    analyticsRefreshInterval = setInterval(async () => {
        if (document.getElementById('user-analytics-section') && 
            !document.getElementById('user-analytics-section').classList.contains('hidden')) {
            
            // Reload data from Firebase if in Firebase mode
            if (isFirebaseMode && !isDemoMode) {
                await loadUserAnalyticsData();
            }
            
            // Re-render analytics
            renderUserAnalytics();
            
            // Update charts if they exist
            if (Object.keys(analyticsCharts).length > 0) {
                updateAnalyticsCharts();
            }
        }
    }, 30000); // 30 seconds
    
    console.log('🔄 Started real-time analytics refresh (30s interval)');
}

function stopAnalyticsRefresh() {
    if (analyticsRefreshInterval) {
        clearInterval(analyticsRefreshInterval);
        console.log('⏹️ Stopped analytics refresh');
    }
}

// Update existing charts with new data
function updateAnalyticsCharts() {
    const analytics = calculateUserAnalytics();
    
    // Update performance chart
    if (analyticsCharts.performance) {
        // Simulate trend data (in real implementation, this would come from historical data)
        const newData = [
            Math.max(0, analytics.avgScore * 100 - 5 + Math.random() * 10),
            Math.max(0, analytics.avgScore * 100 - 3 + Math.random() * 10),
            Math.max(0, analytics.avgScore * 100 - 1 + Math.random() * 10),
            analytics.avgScore * 100
        ];
        
        analyticsCharts.performance.data.datasets[0].data = newData;
        analyticsCharts.performance.update();
    }
    
    // Update learning path chart
    if (analyticsCharts.learningPath) {
        analyticsCharts.learningPath.data.datasets[0].data = [
            analytics.learningPathPopularity.find(p => p.pathId === 'NETWORK_SECURITY')?.userCount || 0,
            analytics.learningPathPopularity.find(p => p.pathId === 'CRYPTOGRAPHY')?.userCount || 0,
            analytics.learningPathPopularity.find(p => p.pathId === 'PENETRATION_TESTING')?.userCount || 0,
            analytics.learningPathPopularity.find(p => p.pathId === 'INCIDENT_RESPONSE')?.userCount || 0
        ];
        analyticsCharts.learningPath.update();
    }
}

// Enhanced user search and filtering
function searchAndFilterUsers(searchTerm, filters = {}) {
    let filteredUsers = [...userProfiles];
    
    // Text search
    if (searchTerm) {
        filteredUsers = filteredUsers.filter(user => 
            user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Filter by activity status
    if (filters.activeOnly) {
        filteredUsers = filteredUsers.filter(user => user.isActive);
    }
    
    // Filter by performance level
    if (filters.minScore) {
        filteredUsers = filteredUsers.filter(user => (user.averageQuizScore || 0) >= filters.minScore);
    }
    
    // Filter by streak
    if (filters.minStreak) {
        filteredUsers = filteredUsers.filter(user => (user.currentStreak || 0) >= filters.minStreak);
    }
    
    // Filter by learning path preference
    if (filters.learningPath) {
        filteredUsers = filteredUsers.filter(user => 
            user.preferredCategories?.includes(filters.learningPath)
        );
    }
    
    return filteredUsers;
}

// User engagement scoring
function calculateUserEngagementScore(user) {
    let score = 0;
    
    // Quiz engagement (40% weight)
    if (user.totalQuizzesTaken > 0) {
        score += Math.min(40, (user.totalQuizzesTaken / 20) * 40);
    }
    
    // Study time engagement (25% weight)
    if (user.totalStudyTime > 0) {
        score += Math.min(25, (user.totalStudyTime / 3600) * 25); // Convert to hours
    }
    
    // Streak maintenance (20% weight)
    if (user.currentStreak > 0) {
        score += Math.min(20, (user.currentStreak / 30) * 20);
    }
    
    // Learning path progress (15% weight)
    if (user.totalLearningPathsStarted > 0) {
        score += Math.min(15, (user.totalLearningPathsStarted / 4) * 15);
    }
    
    return Math.round(score);
}

// Generate user insights and recommendations
function generateUserInsights(user) {
    const insights = [];
    const engagementScore = calculateUserEngagementScore(user);
    
    // Performance insights
    if (user.averageQuizScore < 0.6) {
        insights.push({
            type: 'warning',
            message: 'Quiz performance below average. Consider reviewing basic concepts.',
            action: 'Review foundational materials'
        });
    } else if (user.averageQuizScore > 0.85) {
        insights.push({
            type: 'success',
            message: 'Excellent quiz performance! Ready for advanced challenges.',
            action: 'Try higher difficulty levels'
        });
    }
    
    // Engagement insights
    if (engagementScore < 30) {
        insights.push({
            type: 'warning',
            message: 'Low engagement detected. Consider setting learning goals.',
            action: 'Set daily study targets'
        });
    } else if (engagementScore > 70) {
        insights.push({
            type: 'success',
            message: 'High engagement level! Keep up the great work.',
            action: 'Maintain current pace'
        });
    }
    
    // Streak insights
    if (user.currentStreak < 3) {
        insights.push({
            type: 'info',
            message: 'Building learning momentum. Try to maintain daily practice.',
            action: 'Set daily reminders'
        });
    } else if (user.currentStreak > 14) {
        insights.push({
            type: 'success',
            message: 'Impressive streak! You\'re building excellent habits.',
            action: 'Continue daily practice'
        });
    }
    
    return insights;
}

//==============================
// USER MANAGEMENT FUNCTIONS
//==============================

// Load user profiles from Firestore or create sample data
async function loadUserProfiles() {
    try {
        if (isFirebaseMode && !isDemoMode) {
            // Load from Firestore
            const userProfilesSnapshot = await window.db.collection('user_profiles').get();
            userProfiles = [];
            userProfilesSnapshot.forEach((doc) => {
                userProfiles.push({ userId: doc.id, ...doc.data() });
            });
            console.log('📊 Loaded user profiles from Firestore:', userProfiles.length);
        } else {
            // Use sample data for demo mode
            userProfiles = [...sampleUserProfiles];
            console.log('📊 Loaded sample user profiles:', userProfiles.length);
        }
        
        // Render users table
        renderUsersTable();
        
    } catch (error) {
        console.error('❌ Error loading user profiles:', error);
        // Fallback to sample data
        userProfiles = [...sampleUserProfiles];
        renderUsersTable();
    }
}

// Render users table with search and filtering
function renderUsersTable() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;
    
    // Get filter values
    const searchTerm = document.getElementById('userSearchInput')?.value || '';
    const statusFilter = document.getElementById('userStatusFilter')?.value || '';
    const performanceFilter = document.getElementById('userPerformanceFilter')?.value || '';
    const pathFilter = document.getElementById('userPathFilter')?.value || '';
    
    // Filter users
    let filteredUsers = filterUsers(userProfiles, searchTerm, statusFilter, performanceFilter, pathFilter);
    
    // Clear table
    tableBody.innerHTML = '';
    
    if (filteredUsers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                    No users found matching the criteria
                </td>
            </tr>
        `;
        return;
    }
    
    // Render user rows
    filteredUsers.forEach(user => {
        const row = createUserTableRow(user);
        tableBody.appendChild(row);
    });
    
    console.log(`📋 Rendered ${filteredUsers.length} users in table`);
}

// Create user table row
function createUserTableRow(user) {
    const row = document.createElement('tr');
    row.className = 'hover:bg-gray-50';
    
    // Calculate user metrics
    const engagementScore = calculateUserEngagementScore(user);
    const performanceLevel = getPerformanceLevel(user.averageQuizScore || 0);
    const progressPercentage = calculateOverallProgress(user);
    const lastActiveFormatted = formatLastActive(user.lastActive);
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" src="${user.avatarUrl || 'https://via.placeholder.com/40'}" alt="">
                </div>
                <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">${user.displayName}</div>
                    <div class="text-sm text-gray-500">${user.email}</div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                ${user.isActive ? 'Active' : 'Inactive'}
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="flex-shrink-0">
                    <div class="text-sm font-medium text-gray-900">${(user.averageQuizScore * 100).toFixed(1)}%</div>
                    <div class="text-xs text-gray-500">${performanceLevel}</div>
                </div>
                <div class="ml-2">
                    <div class="w-16 bg-gray-200 rounded-full h-2">
                        <div class="bg-${getPerformanceColor(user.averageQuizScore)}-600 h-2 rounded-full" style="width: ${(user.averageQuizScore * 100)}%"></div>
                    </div>
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${progressPercentage.toFixed(1)}%</div>
            <div class="text-xs text-gray-500">Engagement: ${engagementScore}/100</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${lastActiveFormatted}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button onclick="viewUserDetails('${user.userId}')" class="text-blue-600 hover:text-blue-900 mr-3">
                <i class="fas fa-eye"></i> View
            </button>
            <button onclick="editUser('${user.userId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button onclick="deleteUser('${user.userId}')" class="text-red-600 hover:text-red-900">
                <i class="fas fa-trash"></i> Delete
            </button>
        </td>
    `;
    
    return row;
}

// Filter users based on criteria
function filterUsers(users, searchTerm, statusFilter, performanceFilter, pathFilter) {
    return users.filter(user => {
        // Search filter
        if (searchTerm && !user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        
        // Status filter
        if (statusFilter === 'active' && !user.isActive) return false;
        if (statusFilter === 'inactive' && user.isActive) return false;
        
        // Performance filter
        if (performanceFilter === 'high' && (user.averageQuizScore || 0) < 0.8) return false;
        if (performanceFilter === 'medium' && ((user.averageQuizScore || 0) < 0.6 || (user.averageQuizScore || 0) >= 0.8)) return false;
        if (performanceFilter === 'low' && (user.averageQuizScore || 0) >= 0.6) return false;
        
        // Learning path filter
        if (pathFilter && !user.preferredCategories?.includes(pathFilter)) return false;
        
        return true;
    });
}

// Get performance level
function getPerformanceLevel(score) {
    if (score >= 0.8) return 'High';
    if (score >= 0.6) return 'Medium';
    return 'Low';
}

// Get performance color
function getPerformanceColor(score) {
    if (score >= 0.8) return 'green';
    if (score >= 0.6) return 'yellow';
    return 'red';
}

// Calculate overall progress
function calculateOverallProgress(user) {
    let progress = 0;
    let totalWeight = 0;
    
    // Quiz progress (40% weight)
    if (user.totalQuizzesTaken > 0) {
        progress += (user.averageQuizScore || 0) * 40;
        totalWeight += 40;
    }
    
    // Learning path progress (30% weight)
    if (user.totalLearningPathsStarted > 0) {
        const pathProgress = Math.min(1, user.totalLearningPathsCompleted / user.totalLearningPathsStarted);
        progress += pathProgress * 30;
        totalWeight += 30;
    }
    
    // Study time progress (20% weight)
    if (user.totalStudyTime > 0) {
        const timeProgress = Math.min(1, user.totalStudyTime / 36000); // 10 hours = 100%
        progress += timeProgress * 20;
        totalWeight += 20;
    }
    
    // Streak progress (10% weight)
    if (user.currentStreak > 0) {
        const streakProgress = Math.min(1, user.currentStreak / 30); // 30 days = 100%
        progress += streakProgress * 10;
        totalWeight += 10;
    }
    
    return totalWeight > 0 ? progress / totalWeight * 100 : 0;
}

// Format last active time
function formatLastActive(lastActive) {
    if (!lastActive) return 'Never';
    
    try {
        const date = new Date(lastActive);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    } catch (e) {
        return 'Unknown';
    }
}

// User modal functions
function showAddUserModal() {
    const modal = document.getElementById('userModal');
    const title = document.getElementById('userModalTitle');
    const form = document.getElementById('userForm');
    
    if (modal && title && form) {
        title.textContent = 'Add New User';
        form.reset();
        modal.classList.remove('hidden');
        
        // Clear any existing user ID
        form.removeAttribute('data-user-id');
    }
}

function hideUserModal() {
    const modal = document.getElementById('userModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function editUser(userId) {
    const user = userProfiles.find(u => u.userId === userId);
    if (!user) return;
    
    const modal = document.getElementById('userModal');
    const title = document.getElementById('userModalTitle');
    const form = document.getElementById('userForm');
    
    if (modal && title && form) {
        title.textContent = 'Edit User';
        
        // Populate form fields
        document.getElementById('userEmail').value = user.email || '';
        document.getElementById('userDisplayName').value = user.displayName || '';
        document.getElementById('userAvatarUrl').value = user.avatarUrl || '';
        document.getElementById('userStatus').value = user.isActive ? 'true' : 'false';
        document.getElementById('userDifficultyPreference').value = user.difficultyPreference || 'BEGINNER';
        
        // Set preferred categories
        const categoriesSelect = document.getElementById('userPreferredCategories');
        if (categoriesSelect && user.preferredCategories) {
            Array.from(categoriesSelect.options).forEach(option => {
                option.selected = user.preferredCategories.includes(option.value);
            });
        }
        
        // Set user ID for form submission
        form.setAttribute('data-user-id', userId);
        
        modal.classList.remove('hidden');
    }
}

// View user details
function viewUserDetails(userId) {
    const user = userProfiles.find(u => u.userId === userId);
    if (!user) return;
    
    // Create detailed user view modal
    const modalHtml = `
        <div class="fixed inset-0 bg-gray-600 bg-opacity-50 z-50">
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-medium text-gray-900">User Details: ${user.displayName}</h3>
                            <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        ${generateUserDetailsContent(user)}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Insert modal into DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Generate user details content
function generateUserDetailsContent(user) {
    const engagementScore = calculateUserEngagementScore(user);
    const insights = generateUserInsights(user);
    
    return `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- User Profile -->
            <div class="space-y-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-medium text-gray-900 mb-3">Profile Information</h4>
                    <div class="space-y-2 text-sm">
                        <div><span class="font-medium">Email:</span> ${user.email}</div>
                        <div><span class="font-medium">Status:</span> <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${user.isActive ? 'Active' : 'Inactive'}</span></div>
                        <div><span class="font-medium">Join Date:</span> ${user.joinDate || 'Unknown'}</div>
                        <div><span class="font-medium">Last Active:</span> ${formatLastActive(user.lastActive)}</div>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-medium text-gray-900 mb-3">Learning Preferences</h4>
                    <div class="space-y-2 text-sm">
                        <div><span class="font-medium">Difficulty:</span> ${user.difficultyPreference || 'Not set'}</div>
                        <div><span class="font-medium">Categories:</span> ${user.preferredCategories?.join(', ') || 'None'}</div>
                    </div>
                </div>
            </div>
            
            <!-- Performance Metrics -->
            <div class="space-y-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-medium text-gray-900 mb-3">Performance Overview</h4>
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span>Engagement Score:</span>
                            <span class="font-medium">${engagementScore}/100</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Quiz Performance:</span>
                            <span class="font-medium">${(user.averageQuizScore * 100).toFixed(1)}%</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Current Streak:</span>
                            <span class="font-medium">${user.currentStreak || 0} days</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Total Study Time:</span>
                            <span class="font-medium">${Math.round((user.totalStudyTime || 0) / 3600)}h</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-medium text-gray-900 mb-3">Insights & Recommendations</h4>
                    <div class="space-y-2">
                        ${insights.length > 0 ? insights.map(insight => `
                            <div class="text-sm p-2 rounded ${insight.type === 'success' ? 'bg-green-100 text-green-800' : 
                                                           insight.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                                                           'bg-blue-100 text-blue-800'}">
                                <div class="font-medium">${insight.message}</div>
                                <div class="text-xs mt-1">💡 ${insight.action}</div>
                            </div>
                        `).join('') : '<div class="text-sm text-gray-500">No specific insights available</div>'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Delete user
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }
    
    try {
        if (isFirebaseMode && !isDemoMode) {
            // Delete from Firestore
            await window.db.collection('user_profiles').doc(userId).delete();
            console.log('✅ User deleted from Firestore:', userId);
        }
        
        // Remove from local array
        userProfiles = userProfiles.filter(u => u.userId !== userId);
        
        // Re-render table
        renderUsersTable();
        
        showNotification('User deleted successfully');
        
    } catch (error) {
        console.error('❌ Error deleting user:', error);
        showNotification('Error deleting user');
    }
}

// Refresh user data
function refreshUserData() {
    loadUserProfiles();
    showNotification('User data refreshed');
}

// Add event listeners for user management
function setupUserManagementEventListeners() {
    // Search input
    const searchInput = document.getElementById('userSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => renderUsersTable(), 300));
    }
    
    // Filter selects
    const statusFilter = document.getElementById('userStatusFilter');
    const performanceFilter = document.getElementById('userPerformanceFilter');
    const pathFilter = document.getElementById('userPathFilter');
    
    if (statusFilter) statusFilter.addEventListener('change', renderUsersTable);
    if (performanceFilter) performanceFilter.addEventListener('change', renderUsersTable);
    if (pathFilter) pathFilter.addEventListener('change', renderUsersTable);
    
    // User form
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', handleUserFormSubmit);
    }
}

// Handle user form submission
async function handleUserFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('userEmail').value,
        displayName: document.getElementById('userDisplayName').value,
        avatarUrl: document.getElementById('userAvatarUrl').value,
        isActive: document.getElementById('userStatus').value === 'true',
        difficultyPreference: document.getElementById('userDifficultyPreference').value,
        preferredCategories: Array.from(document.getElementById('userPreferredCategories').selectedOptions).map(opt => opt.value),
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        totalQuizzesTaken: 0,
        averageQuizScore: 0,
        currentStreak: 0,
        totalStudyTime: 0,
        totalXP: 0,
        level: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    const existingUserId = e.target.getAttribute('data-user-id');
    
    try {
        if (existingUserId) {
            // Update existing user
            const index = userProfiles.findIndex(u => u.userId === existingUserId);
            if (index >= 0) {
                userProfiles[index] = { ...userProfiles[index], ...formData, userId: existingUserId };
                
                if (isFirebaseMode && !isDemoMode) {
                    await window.db.collection('user_profiles').doc(existingUserId).set(formData);
                }
                
                showNotification('User updated successfully');
            }
        } else {
            // Add new user
            const newUserId = 'user_' + Date.now();
            const newUser = { ...formData, userId: newUserId };
            
            userProfiles.push(newUser);
            
            if (isFirebaseMode && !isDemoMode) {
                await window.db.collection('user_profiles').doc(newUserId).set(newUser);
            }
            
            showNotification('User added successfully');
        }
        
        hideUserModal();
        renderUsersTable();
        
    } catch (error) {
        console.error('❌ Error saving user:', error);
        showNotification('Error saving user');
    }
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}