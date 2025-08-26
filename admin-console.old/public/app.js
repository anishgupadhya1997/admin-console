// CyberLearn Admin Console - Hybrid Approach
// Simple hardcoded authentication + Firebase Firestore for data persistence

// Global variables
let isAuthenticated = false;
let currentUser = null;
let currentQuestions = [];
let currentInterviewQuestions = [];
let currentFlashcardDecks = [];
let currentFlashcards = [];
let currentEditingId = null;
let currentEditingInterviewId = null;
let currentEditingDeckId = null;
let currentEditingFlashcardId = null;
let isFirestoreAvailable = false;

// Hardcoded credentials (change these to your preferred login)
const ADMIN_CREDENTIALS = {
    email: 'admin@cyberlearn.com',
    password: 'admin123'
};

// Sample questions for demo
const sampleQuestions = [
    {
        id: "demo_1",
        question: "What is the primary function of a SIEM system?",
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
        question: "What is the primary goal of threat hunting?",
        options: [
            "To wait for security alerts to appear",
            "To proactively search for threats that evade existing security controls",
            "To respond to security incidents after they occur",
            "To perform routine vulnerability scans"
        ],
        correctAnswer: "To proactively search for threats that evade existing security controls",
        explanation: "Threat hunting is a proactive cybersecurity approach where analysts actively search for threats that may have bypassed traditional security measures, rather than waiting for alerts.",
        category: "THREAT_HUNTING",
        difficulty: "ADVANCED",
        tags: ["threat hunting", "proactive", "security controls", "evasion"],
        isActive: true
    },
    {
        id: "demo_5",
        question: "What is the difference between static and dynamic malware analysis?",
        options: [
            "Static analysis is faster than dynamic analysis",
            "Static analysis examines code without execution, dynamic analysis runs the malware",
            "Dynamic analysis is cheaper than static analysis",
            "Static analysis requires more computing resources"
        ],
        correctAnswer: "Static analysis examines code without execution, dynamic analysis runs the malware",
        explanation: "Static analysis examines malware code without running it, while dynamic analysis involves executing the malware in a controlled environment to observe its behavior.",
        category: "MALWARE_ANALYSIS",
        difficulty: "ADVANCED",
        tags: ["malware", "static analysis", "dynamic analysis", "reverse engineering"],
        isActive: true
    },
    {
        id: "demo_6",
        question: "What is the purpose of a hash function in cryptography?",
        options: [
            "To encrypt data for secure transmission",
            "To create a fixed-size output from variable input data",
            "To generate encryption keys",
            "To compress large files"
        ],
        correctAnswer: "To create a fixed-size output from variable input data",
        explanation: "Hash functions take input data of any size and produce a fixed-size output (hash), which is useful for data integrity verification, digital signatures, and password storage.",
        category: "CRYPTOGRAPHY",
        difficulty: "INTERMEDIATE",
        tags: ["hash functions", "cryptography", "data integrity", "digital signatures"],
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
            "Incident response and escalation procedures",
            "Threat hunting and proactive monitoring",
            "Documentation and knowledge management"
        ],
        category: "SECURITY_OPERATIONS",
        difficulty: "BEGINNER",
        questionType: "SECURITY_OPERATIONS",
        tags: ["soc", "monitoring", "incident response", "alert triage"],
        isActive: true
    },
    {
        id: "interview_2",
        question: "Explain the OWASP Top 10 vulnerabilities and how you would mitigate them in a web application.",
        answer: "The OWASP Top 10 represents the most critical web application security risks. Key vulnerabilities include: 1) Injection attacks (SQL, NoSQL, LDAP) - mitigated through parameterized queries and input validation, 2) Broken Authentication - addressed with multi-factor authentication and secure session management, 3) Sensitive Data Exposure - prevented through encryption at rest and in transit, 4) XML External Entity (XXE) - mitigated by disabling XML external entity processing, 5) Broken Access Control - addressed through proper authorization checks and role-based access control, 6) Security Misconfiguration - prevented through security hardening and regular audits, 7) Cross-Site Scripting (XSS) - mitigated through output encoding and Content Security Policy, 8) Insecure Deserialization - addressed through input validation and secure deserialization practices, 9) Using Components with Known Vulnerabilities - prevented through vulnerability scanning and dependency management, 10) Insufficient Logging & Monitoring - addressed through comprehensive logging and real-time monitoring.",
        category: "PENETRATION_TESTING",
        difficulty: "INTERMEDIATE",
        questionType: "PENETRATION_TESTING",
        tags: ["owasp", "web security", "vulnerabilities", "mitigation"],
        isActive: true
    },
    {
        id: "interview_3",
        question: "What is the difference between symmetric and asymmetric encryption, and when would you use each?",
        answer: "Symmetric encryption uses the same key for both encryption and decryption, making it fast and efficient for large amounts of data. Examples include AES, DES, and 3DES. Asymmetric encryption uses a public-private key pair, where the public key encrypts data and the private key decrypts it. Examples include RSA, ECC, and DSA. Symmetric encryption is ideal for bulk data encryption, database encryption, and file encryption due to its speed. Asymmetric encryption is used for key exchange, digital signatures, and encrypting small amounts of sensitive data like session keys. In practice, hybrid systems often combine both: asymmetric encryption for secure key exchange, then symmetric encryption for the actual data transfer.",
        category: "CRYPTOGRAPHY",
        difficulty: "INTERMEDIATE",
        questionType: "CRYPTOGRAPHY",
        tags: ["encryption", "symmetric", "asymmetric", "aes", "rsa", "key exchange"],
        isActive: true
    },
    {
        id: "interview_4",
        question: "How would you respond to a suspected data breach in your organization?",
        answer: "My response to a suspected data breach would follow a structured incident response framework: 1) Immediate containment - isolate affected systems and networks to prevent further compromise, 2) Assessment - determine the scope, impact, and nature of the breach, 3) Evidence preservation - document everything and preserve digital evidence for forensic analysis, 4) Communication - notify stakeholders, legal team, and potentially law enforcement, 5) Remediation - remove threats, patch vulnerabilities, and restore systems, 6) Recovery - restore normal operations and implement additional security measures, 7) Post-incident review - analyze what happened, document lessons learned, and update incident response procedures. Throughout this process, I would maintain detailed logs, follow legal and regulatory requirements, and ensure transparent communication with affected parties.",
        category: "INCIDENT_RESPONSE",
        difficulty: "ADVANCED",
        questionType: "INCIDENT_RESPONSE",
        tags: ["incident response", "breach", "forensics", "containment", "recovery"],
        isActive: true
    }
];

// Sample flashcard decks for demo
const sampleFlashcardDecks = [
    {
        id: "deck_1",
        name: "Network Security Fundamentals",
        description: "Essential concepts and terminology in network security",
        category: "NETWORK_SECURITY",
        difficulty: "BEGINNER",
        color: "#2196F3",
        tags: ["network", "firewall", "security", "basics"],
        estimatedStudyTime: 30,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "deck_2", 
        name: "Cryptography Essentials",
        description: "Core cryptographic principles and algorithms",
        category: "CRYPTOGRAPHY",
        difficulty: "INTERMEDIATE",
        color: "#9C27B0",
        tags: ["crypto", "encryption", "hashing", "algorithms"],
        estimatedStudyTime: 45,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "deck_3",
        name: "Incident Response Procedures",
        description: "Step-by-step incident response and forensics",
        category: "INCIDENT_RESPONSE", 
        difficulty: "ADVANCED",
        color: "#F44336",
        tags: ["incident", "response", "forensics", "procedures"],
        estimatedStudyTime: 60,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Sample flashcards for demo
const sampleFlashcards = [
    {
        id: "card_1",
        deckId: "deck_1",
        front: "What is a firewall?",
        back: "A network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules.",
        explanation: "Firewalls act as a barrier between trusted internal networks and untrusted external networks, filtering traffic to prevent unauthorized access.",
        category: "NETWORK_SECURITY",
        difficulty: "BEGINNER",
        tags: ["firewall", "network", "security", "traffic"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "card_2",
        deckId: "deck_1", 
        front: "What is the difference between a stateful and stateless firewall?",
        back: "Stateful firewalls track connection states and make decisions based on context, while stateless firewalls examine each packet independently without context.",
        explanation: "Stateful inspection provides better security by understanding the state of network connections, while stateless filtering is faster but less secure.",
        category: "NETWORK_SECURITY",
        difficulty: "INTERMEDIATE",
        tags: ["firewall", "stateful", "stateless", "connection"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "card_3",
        deckId: "deck_2",
        front: "What is symmetric encryption?",
        back: "A type of encryption where the same key is used for both encryption and decryption of data.",
        explanation: "Symmetric encryption is fast and efficient for large amounts of data but requires secure key distribution. Examples include AES, DES, and 3DES.",
        category: "CRYPTOGRAPHY",
        difficulty: "BEGINNER", 
        tags: ["symmetric", "encryption", "key", "aes"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "card_4",
        deckId: "deck_2",
        front: "What is a hash function?",
        back: "A mathematical function that converts input data of any size into a fixed-size string of characters, typically used for data integrity verification.",
        explanation: "Hash functions are one-way functions that produce unique fingerprints for data. Common examples include MD5, SHA-1, and SHA-256.",
        category: "CRYPTOGRAPHY",
        difficulty: "BEGINNER",
        tags: ["hash", "function", "integrity", "sha"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "card_5",
        deckId: "deck_3",
        front: "What are the phases of incident response?",
        back: "1. Preparation, 2. Identification, 3. Containment, 4. Eradication, 5. Recovery, 6. Lessons Learned",
        explanation: "The NIST incident response lifecycle provides a structured approach to handling security incidents effectively and minimizing damage.",
        category: "INCIDENT_RESPONSE",
        difficulty: "INTERMEDIATE",
        tags: ["incident", "response", "phases", "nist"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

//==============================
// INITIALIZATION AND SETUP
//==============================

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, setting up CyberLearn Admin Console...');
    
    // Setup event listeners
    setupEventListeners();
    
    // Load sample data
    currentQuestions = [...sampleQuestions];
    currentInterviewQuestions = [...sampleInterviewQuestions];
    currentFlashcardDecks = [...sampleFlashcardDecks];
    currentFlashcards = [...sampleFlashcards];
    
    // Make data globally available for API
    updateApiEndpoint();
    
    // Listen for Firestore ready event
    document.addEventListener('firestoreReady', () => {
        console.log('🔥 Firestore ready event received!');
        isFirestoreAvailable = true;
        console.log('📊 Firestore is now available for data persistence');
        
        // Load existing data from Firestore if available
        loadDataFromFirestore();
    });
    
    // Show login screen
        showLoginScreen();
});

//==============================
// EVENT LISTENERS
//==============================

// Setup event listeners
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('✅ Login form found, adding event listener');
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.warn('⚠️ Login form not found');
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        console.log('✅ Logout button found, adding event listener');
        logoutBtn.addEventListener('click', logout);
    } else {
        console.warn('⚠️ Logout button not found');
    }

    // Navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    console.log(`🧭 Found ${navButtons.length} navigation buttons`);
    navButtons.forEach((btn, index) => {
        console.log(`✅ Adding event listener to nav button ${index + 1}: ${btn.getAttribute('data-section')}`);
        btn.addEventListener('click', (e) => {
            const section = e.target.getAttribute('data-section');
            console.log(`🎯 Navigation clicked: ${section}`);
            showSection(section);
        });
    });

    // Add question button
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    if (addQuestionBtn) {
        console.log('✅ Add question button found, adding event listener');
        addQuestionBtn.addEventListener('click', () => {
            console.log('🆕 Add question button clicked');
            showQuestionModal();
        });
    } else {
        console.warn('⚠️ Add question button not found');
    }

    // Add interview question button
    const addInterviewQuestionBtn = document.getElementById('addInterviewQuestionBtn');
    if (addInterviewQuestionBtn) {
        console.log('✅ Add interview question button found, adding event listener');
        addInterviewQuestionBtn.addEventListener('click', () => {
            console.log('🆕 Add interview question button clicked');
            showInterviewQuestionModal();
        });
    } else {
        console.warn('⚠️ Add interview question button not found');
    }

    // Question form
    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
        console.log('✅ Question form found, adding event listener');
        questionForm.addEventListener('submit', handleQuestionSubmit);
    } else {
        console.warn('⚠️ Question form not found');
    }

    // Interview question form
    const interviewQuestionForm = document.getElementById('interviewQuestionForm');
    if (interviewQuestionForm) {
        console.log('✅ Interview question form found, adding event listener');
        interviewQuestionForm.addEventListener('submit', handleInterviewQuestionSubmit);
    } else {
        console.warn('⚠️ Interview question form not found');
    }

    // CSV upload button
    const csvUploadBtn = document.getElementById('csvUploadBtn');
    if (csvUploadBtn) {
        console.log('✅ CSV upload button found, adding event listener');
        csvUploadBtn.addEventListener('click', () => {
            console.log('📂 CSV upload button clicked');
            showCsvUploadModal();
        });
    } else {
        console.warn('⚠️ CSV upload button not found');
    }

    // Export buttons
    const bulkExportBtn = document.getElementById('bulkExportBtn');
    if (bulkExportBtn) {
        console.log('✅ Bulk export button found, adding event listener');
        bulkExportBtn.addEventListener('click', () => {
            console.log('📤 Bulk export button clicked');
            exportQuestions();
        });
    } else {
        console.warn('⚠️ Bulk export button not found');
    }

    const interviewExportBtn = document.getElementById('interviewExportBtn');
    if (interviewExportBtn) {
        console.log('✅ Interview export button found, adding event listener');
        interviewExportBtn.addEventListener('click', () => {
            console.log('📤 Interview export button clicked');
            exportInterviewQuestions();
        });
    } else {
        console.warn('⚠️ Interview export button not found');
    }

    // Modal close buttons
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        console.log('✅ Close modal button found, adding event listener');
        closeModal.addEventListener('click', () => {
            console.log('❌ Close modal button clicked');
            hideQuestionModal();
        });
    } else {
        console.warn('⚠️ Close modal button not found');
    }

    const closeInterviewModal = document.getElementById('closeInterviewModal');
    if (closeInterviewModal) {
        console.log('✅ Close interview modal button found, adding event listener');
        closeInterviewModal.addEventListener('click', () => {
            console.log('❌ Close interview modal button clicked');
            hideInterviewQuestionModal();
        });
    } else {
        console.warn('⚠️ Close interview modal button not found');
    }

    const closeCsvModal = document.getElementById('closeCsvModal');
    if (closeCsvModal) {
        console.log('✅ Close CSV modal button found, adding event listener');
        closeCsvModal.addEventListener('click', () => {
            console.log('❌ Close CSV modal button clicked');
            hideCsvUploadModal();
        });
    } else {
        console.warn('⚠️ Close CSV modal button not found');
    }

    // CSV file input
    const csvFileInput = document.getElementById('csvFileInput');
    if (csvFileInput) {
        console.log('✅ CSV file input found, adding event listener');
        csvFileInput.addEventListener('change', (e) => {
            console.log('📁 CSV file selected:', e.target.files[0]?.name);
            handleCsvFileSelect(e);
        });
    } else {
        console.warn('⚠️ CSV file input not found');
    }

    // CSV process button
    const processCsvUploadBtn = document.getElementById('processCsvUpload');
    if (processCsvUploadBtn) {
        console.log('✅ Process CSV upload button found, adding event listener');
        processCsvUploadBtn.addEventListener('click', () => {
            console.log('⚡ Process CSV upload button clicked');
            processCsvUpload();
        });
    } else {
        console.warn('⚠️ Process CSV upload button not found');
    }
    
    // CSV template download
    const downloadCsvTemplate = document.getElementById('downloadCsvTemplate');
    if (downloadCsvTemplate) {
        console.log('✅ Download CSV template link found, adding event listener');
        downloadCsvTemplate.addEventListener('click', function(e) {
            console.log('📥 Download CSV template clicked');
            e.preventDefault();
            downloadCsvTemplateFile();
        });
    } else {
        console.warn('⚠️ Download CSV template link not found');
    }

    // CSV cancel button
    const cancelCsvUpload = document.getElementById('cancelCsvUpload');
    if (cancelCsvUpload) {
        console.log('✅ Cancel CSV upload button found, adding event listener');
        cancelCsvUpload.addEventListener('click', () => {
            console.log('🚫 Cancel CSV upload button clicked');
            hideCsvUploadModal();
        });
    } else {
        console.warn('⚠️ Cancel CSV upload button not found');
    }

    // Question cancel button
    const cancelQuestion = document.getElementById('cancelQuestion');
    if (cancelQuestion) {
        console.log('✅ Cancel question button found, adding event listener');
        cancelQuestion.addEventListener('click', () => {
            console.log('🚫 Cancel question button clicked');
            hideQuestionModal();
        });
    } else {
        console.warn('⚠️ Cancel question button not found');
    }

    // Interview question cancel button
    const cancelInterviewQuestion = document.getElementById('cancelInterviewQuestion');
    if (cancelInterviewQuestion) {
        console.log('✅ Cancel interview question button found, adding event listener');
        cancelInterviewQuestion.addEventListener('click', () => {
            console.log('🚫 Cancel interview question button clicked');
            hideInterviewQuestionModal();
        });
    } else {
        console.warn('⚠️ Cancel interview question button not found');
    }

    // Database verification button
    const verifyDatabaseBtn = document.getElementById('verifyDatabaseBtn');
    if (verifyDatabaseBtn) {
        verifyDatabaseBtn.addEventListener('click', verifyFirestoreDatabase);
    }

    // Flashcard management buttons
    const addFlashcardDeckBtn = document.getElementById('addFlashcardDeckBtn');
    console.log('🔍 Looking for addFlashcardDeckBtn:', addFlashcardDeckBtn);
    if (addFlashcardDeckBtn) {
        console.log('✅ Found addFlashcardDeckBtn, adding event listener');
        addFlashcardDeckBtn.addEventListener('click', () => {
            console.log('🎯 Add Deck button clicked!');
            currentEditingDeckId = null;
            showFlashcardDeckModal();
        });
    } else {
        console.log('❌ addFlashcardDeckBtn not found in DOM');
    }

    const addFlashcardBtn = document.getElementById('addFlashcardBtn');
    console.log('🔍 Looking for addFlashcardBtn:', addFlashcardBtn);
    if (addFlashcardBtn) {
        console.log('✅ Found addFlashcardBtn, adding event listener');
        addFlashcardBtn.addEventListener('click', () => {
            console.log('🎯 Add Card button clicked!');
            currentEditingFlashcardId = null;
            showFlashcardModal();
        });
    } else {
        console.log('❌ addFlashcardBtn not found in DOM');
    }

    // Flashcard form submissions
    const flashcardDeckForm = document.getElementById('flashcardDeckForm');
    if (flashcardDeckForm) {
        flashcardDeckForm.addEventListener('submit', handleFlashcardDeckSubmit);
    }

    const flashcardForm = document.getElementById('flashcardForm');
    if (flashcardForm) {
        flashcardForm.addEventListener('submit', handleFlashcardSubmit);
    } else {
        console.warn('⚠️ Flashcard form not found');
    }

    // Flashcard tab buttons
    const flashcardTabBtns = document.querySelectorAll('.flashcard-tab-btn');
    console.log(`🗂️ Found ${flashcardTabBtns.length} flashcard tab buttons`);
    flashcardTabBtns.forEach((btn, index) => {
        console.log(`✅ Adding event listener to flashcard tab button ${index + 1}: ${btn.getAttribute('data-tab')}`);
        btn.addEventListener('click', (e) => {
            const tab = e.target.getAttribute('data-tab');
            console.log(`🗂️ Flashcard tab clicked: ${tab}`);
            showFlashcardTab(tab);
        });
    });

    console.log('✅ All event listeners set up successfully!');
}

//==============================
// AUTHENTICATION FUNCTIONS
//==============================

// Handle login with hardcoded credentials
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    console.log('🔐 Login attempt:', email);
    
    // Clear previous errors
    errorDiv.classList.add('hidden');
    errorDiv.textContent = '';
    
    // Check against hardcoded credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        console.log('✅ Login successful!');
        isAuthenticated = true;
        currentUser = { email: email, name: 'Admin User' };
        showMainApp();
    } else {
        console.log('❌ Login failed: Invalid credentials');
        errorDiv.textContent = 'Invalid email or password. Please try again.';
        errorDiv.classList.remove('hidden');
    }
}

// Logout
function logout() {
    isAuthenticated = false;
    currentUser = null;
    showLoginScreen();
}

//==============================
// UI NAVIGATION FUNCTIONS
//==============================

// Show login screen
function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

// Show main application
function showMainApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    // Update user info
    const userEmail = document.getElementById('userEmail');
    if (userEmail) {
        userEmail.textContent = currentUser?.email || 'Admin User';
    }
    
    // Load initial data
    loadDashboardData();
    renderQuestionsTable();
    renderInterviewQuestionsTable();
    renderFlashcardDecksTable();
    renderFlashcardsTable();
    populateFlashcardDeckSelect();
}

// Show specific section
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('hidden'));
    
    // Show requested section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
}

//==============================
// DASHBOARD FUNCTIONS
//==============================

// Load dashboard data
function loadDashboardData() {
    // Update stats
    document.getElementById('totalQuestions').textContent = currentQuestions.length;
    document.getElementById('activeQuestions').textContent = currentQuestions.filter(q => q.isActive).length;
    document.getElementById('totalCategories').textContent = new Set(currentQuestions.map(q => q.category)).size;
    document.getElementById('totalInterviewQuestions').textContent = currentInterviewQuestions.length;
    
    // Update flashcard stats
    const totalFlashcardDecksEl = document.getElementById('totalFlashcardDecks');
    if (totalFlashcardDecksEl) {
        totalFlashcardDecksEl.textContent = currentFlashcardDecks.length;
    }
    
    const totalFlashcardsEl = document.getElementById('totalFlashcards');
    if (totalFlashcardsEl) {
        totalFlashcardsEl.textContent = currentFlashcards.length;
    }
    
    const totalStudySessionsEl = document.getElementById('totalStudySessions');
    if (totalStudySessionsEl) {
        totalStudySessionsEl.textContent = '0'; // Placeholder for future implementation
    }
}

//==============================
// FIRESTORE DATA PERSISTENCE FUNCTIONS
//==============================

// Load data from Firestore
async function loadDataFromFirestore() {
    if (!isFirestoreAvailable || !window.db) return;
    
    try {
        console.log('📥 Loading data from Firestore...');
        
        // Load quiz questions
        const quizSnapshot = await window.db.collection('quiz_questions').get();
        const quizQuestions = [];
        quizSnapshot.forEach((doc) => {
            quizQuestions.push({ id: doc.id, ...doc.data() });
        });
        
        // Load interview questions
        const interviewSnapshot = await window.db.collection('interview_questions').get();
        const interviewQuestions = [];
        interviewSnapshot.forEach((doc) => {
            interviewQuestions.push({ id: doc.id, ...doc.data() });
        });
        
        // Load flashcard decks
        const deckSnapshot = await window.db.collection('flashcard_decks').get();
        const flashcardDecks = [];
        deckSnapshot.forEach((doc) => {
            flashcardDecks.push({ id: doc.id, ...doc.data() });
        });
        
        // Load flashcards
        const flashcardSnapshot = await window.db.collection('flashcards').get();
        const flashcards = [];
        flashcardSnapshot.forEach((doc) => {
            flashcards.push({ id: doc.id, ...doc.data() });
        });
        
        // Update current data if Firestore has data
        if (quizQuestions.length > 0) {
            currentQuestions = quizQuestions;
            console.log('📊 Loaded quiz questions from Firestore:', quizQuestions.length);
            console.log('📝 Quiz questions data:', quizQuestions);
        } else {
            console.log('📝 No quiz questions found in Firestore, keeping local data');
        }
        if (interviewQuestions.length > 0) {
            currentInterviewQuestions = interviewQuestions;
            console.log('📊 Loaded interview questions from Firestore:', interviewQuestions.length);
            console.log('📝 Interview questions data:', interviewQuestions);
        } else {
            console.log('📝 No interview questions found in Firestore, keeping local data');
        }
        if (flashcardDecks.length > 0) {
            currentFlashcardDecks = flashcardDecks;
            console.log('📊 Loaded flashcard decks from Firestore:', flashcardDecks.length);
        } else {
            console.log('📝 No flashcard decks found in Firestore, keeping local data');
        }
        if (flashcards.length > 0) {
            currentFlashcards = flashcards;
            console.log('📊 Loaded flashcards from Firestore:', flashcards.length);
        } else {
            console.log('📝 No flashcards found in Firestore, keeping local data');
        }
        
        console.log('📊 Current questions after loading:', currentQuestions.length);
        console.log('📊 Current interview questions after loading:', currentInterviewQuestions.length);
        console.log('📊 Current flashcard decks after loading:', currentFlashcardDecks.length);
        console.log('📊 Current flashcards after loading:', currentFlashcards.length);
        
        // Refresh UI
        console.log('🔄 Refreshing UI components...');
        loadDashboardData();
        console.log('📊 Dashboard data loaded');
        renderQuestionsTable();
        console.log('📋 Questions table rendered');
        renderInterviewQuestionsTable();
        console.log('📋 Interview questions table rendered');
        renderFlashcardDecksTable();
        console.log('📋 Flashcard decks table rendered');
        renderFlashcardsTable();
        console.log('📋 Flashcards table rendered');
        populateFlashcardDeckSelect();
        console.log('📋 Flashcard deck select populated');
        
        console.log('✅ Data loaded from Firestore successfully');
        
    } catch (error) {
        console.error('❌ Error loading from Firestore:', error);
        console.log('📝 Continuing with local sample data');
    }
}

// Save question to Firestore
async function saveQuestionToFirestore(question, isInterview = false) {
    console.log('💾 === FIRESTORE SAVE STARTED ===');
    console.log('📝 Question to save:', question);
    console.log('🔍 Is interview question:', isInterview);
    console.log('🔥 Firestore available:', isFirestoreAvailable);
    console.log('📊 Window.db available:', typeof window.db);
    console.log('📊 Window.db object:', window.db);
    
    if (!isFirestoreAvailable || !window.db) {
        console.log('❌ Firestore not available or window.db is null');
        console.log('💾 Returning false - save failed');
        return false;
    }
    
    try {
        const collectionName = isInterview ? 'interview_questions' : 'quiz_questions';
        console.log('📁 Using collection:', collectionName);
        
        if (question.id && !question.id.startsWith('demo_') && !question.id.startsWith('new_') && !question.id.startsWith('csv_')) {
            // Update existing
            console.log('✏️ Updating existing question with ID:', question.id);
            await window.db.collection(collectionName).doc(question.id).update(question);
            console.log('✅ Successfully updated question in Firestore:', question.id);
        } else {
            // Add new
            console.log('➕ Adding new question to Firestore...');
            const docRef = await window.db.collection(collectionName).add(question);
            question.id = docRef.id;
            console.log('✅ Successfully added question to Firestore with new ID:', question.id);
            console.log('📊 Document reference:', docRef);
        }
        
        console.log('💾 === FIRESTORE SAVE SUCCESSFUL ===');
        return true;
        
    } catch (error) {
        console.error('❌ === FIRESTORE SAVE FAILED ===');
        console.error('❌ Error details:', error);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error stack:', error.stack);
        return false;
    }
}

// Delete question from Firestore
async function deleteQuestionFromFirestore(questionId, isInterview = false) {
    if (!isFirestoreAvailable || !window.db) return false;
    
    try {
        const collectionName = isInterview ? 'interview_questions' : 'quiz_questions';
        
        await window.db.collection(collectionName).doc(questionId).delete();
        console.log('✅ Deleted question from Firestore:', questionId);
        return true;
    } catch (error) {
        console.error('❌ Error deleting from Firestore:', error);
        return false;
    }
}

//==============================
// QUESTION MANAGEMENT FUNCTIONS
//==============================

// Show question modal
function showQuestionModal() {
    const modal = document.getElementById('questionModal');
    const modalTitle = document.getElementById('modalTitle');
    
    if (currentEditingId) {
        modalTitle.textContent = 'Edit Question';
        populateQuestionForm(currentEditingId);
    } else {
        modalTitle.textContent = 'Add New Question';
        clearQuestionForm();
    }
    
    modal.classList.remove('hidden');
}

// Hide question modal
function hideQuestionModal() {
    document.getElementById('questionModal').classList.add('hidden');
    clearQuestionForm();
}

// Clear question form
function clearQuestionForm() {
    document.getElementById('questionForm').reset();
    currentEditingId = null;
}

// Populate question form for editing
function populateQuestionForm(questionId) {
    const question = currentQuestions.find(q => q.id === questionId);
    if (!question) return;

    document.getElementById('questionText').value = question.question;
    document.getElementById('questionCategory').value = question.category;
    document.getElementById('questionDifficulty').value = question.difficulty;
    document.getElementById('questionExplanation').value = question.explanation;
    document.getElementById('questionTags').value = question.tags ? question.tags.join(', ') : '';
    document.getElementById('questionActive').checked = question.isActive !== false;
    
    // Set options
    question.options.forEach((option, index) => {
        document.getElementById(`option${index}`).value = option;
    });

    // Set correct answer
    const correctIndex = question.options.indexOf(question.correctAnswer);
    if (correctIndex >= 0) {
        document.getElementById(`option${correctIndex}Radio`).checked = true;
    }
}

// Handle question form submission
async function handleQuestionSubmit(e) {
    e.preventDefault();
    
    console.log('🚀 === QUESTION SUBMISSION STARTED ===');
    console.log('🔍 Form submission event:', e);

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
    
    console.log('📝 Form data prepared:', formData);
    console.log('🔍 Current editing ID:', currentEditingId);
    console.log('🔥 Firestore available:', isFirestoreAvailable);
    console.log('📊 Window.db available:', typeof window.db);
    console.log('📊 Window.db object:', window.db);

    if (currentEditingId) {
        // Update existing question
        const index = currentQuestions.findIndex(q => q.id === currentEditingId);
        if (index >= 0) {
            currentQuestions[index] = { ...currentQuestions[index], ...formData };
            console.log('✏️ Updated existing question:', currentQuestions[index]);
            // Save to Firestore
            console.log('💾 Attempting to save to Firestore...');
            const firestoreResult = await saveQuestionToFirestore(currentQuestions[index]);
            console.log('💾 Firestore save result:', firestoreResult);
        }
    } else {
        // Add new question
        formData.id = 'new_' + Date.now();
        formData.createdAt = new Date().toISOString();
        currentQuestions.push(formData);
        console.log('➕ Added new question to local array:', formData);
        // Save to Firestore
        console.log('💾 Attempting to save to Firestore...');
        const firestoreResult = await saveQuestionToFirestore(formData);
        console.log('💾 Firestore save result:', firestoreResult);
    }
    
    console.log('📊 Current questions count:', currentQuestions.length);
    console.log('📊 Current questions array:', currentQuestions);

    hideQuestionModal();
    renderQuestionsTable();
    loadDashboardData();
    updateApiEndpoint(); // Update API for Android app
    showNotification('Question saved successfully!');
    
    console.log('✅ === QUESTION SUBMISSION COMPLETED ===');
}

// Render questions table
function renderQuestionsTable() {
    console.log('🎨 === RENDERING QUESTIONS TABLE ===');
    console.log('📊 Current questions count:', currentQuestions.length);
    console.log('📝 Current questions data:', currentQuestions);
    
    const tbody = document.getElementById('questionsTableBody');
    console.log('🔍 Looking for questions table body element...');
    console.log('📋 Table body element:', tbody);
    
    if (!tbody) {
        console.log('❌ Questions table body not found');
        console.log('🔍 Available elements with similar names:');
        const allElements = document.querySelectorAll('*[id*="question"]');
        allElements.forEach(el => console.log('📋 Element:', el.id, el));
        return;
    }
    
    console.log('📋 Table body element found, clearing content...');
    tbody.innerHTML = '';
    
    console.log('🔄 Starting to render questions...');
    currentQuestions.forEach((question, index) => {
        console.log(`📝 Rendering question ${index + 1}:`, question);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-normal">
                <div class="text-sm font-medium text-gray-900">${question.question}</div>
                <div class="text-sm text-gray-500">${question.explanation.substring(0, 100)}${question.explanation.length > 100 ? '...' : ''}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    ${question.category.replace('_', ' ')}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ${question.difficulty}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editQuestion('${question.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteQuestion('${question.id}')" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
        console.log(`✅ Question ${index + 1} row added to table`);
    });
    console.log(`🎯 Finished rendering ${currentQuestions.length} questions`);
}

// Edit question
window.editQuestion = function(questionId) {
    currentEditingId = questionId;
    showQuestionModal();
};

// Delete question
window.deleteQuestion = async function(questionId) {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    // Delete from Firestore first
    await deleteQuestionFromFirestore(questionId);
    
    currentQuestions = currentQuestions.filter(q => q.id !== questionId);
    renderQuestionsTable();
    loadDashboardData();
    updateApiEndpoint(); // Update API for Android app
    showNotification('Question deleted successfully!');
};

//==============================
// INTERVIEW QUESTION MANAGEMENT FUNCTIONS
//==============================

// Show interview question modal
function showInterviewQuestionModal() {
    const modal = document.getElementById('interviewQuestionModal');
    const modalTitle = document.getElementById('interviewModalTitle');
    
    if (currentEditingInterviewId) {
        modalTitle.textContent = 'Edit Interview Question';
        populateInterviewQuestionForm(currentEditingInterviewId);
    } else {
        modalTitle.textContent = 'Add New Interview Question';
        clearInterviewQuestionForm();
    }
    
    modal.classList.remove('hidden');
}

// Hide interview question modal
function hideInterviewQuestionModal() {
    document.getElementById('interviewQuestionModal').classList.add('hidden');
    clearInterviewQuestionForm();
}

// Clear interview question form
function clearInterviewQuestionForm() {
    document.getElementById('interviewQuestionForm').reset();
    currentEditingInterviewId = null;
}

// Populate interview question form for editing
function populateInterviewQuestionForm(questionId) {
    const question = currentInterviewQuestions.find(q => q.id === questionId);
    if (!question) return;

    document.getElementById('interviewQuestionText').value = question.question;
    document.getElementById('interviewQuestionCategory').value = question.category;
    document.getElementById('interviewExperienceLevel').value = question.experienceLevel;
    document.getElementById('interviewQuestionAnswer').value = question.answer;
    document.getElementById('interviewKeyPoints').value = question.keyPoints ? question.keyPoints.join('\n') : '';
    document.getElementById('interviewQuestionTags').value = question.tags ? question.tags.join(', ') : '';
    document.getElementById('interviewQuestionActive').checked = question.isActive !== false;
}

// Handle interview question form submission
async function handleInterviewQuestionSubmit(e) {
    e.preventDefault();

    const formData = {
        question: document.getElementById('interviewQuestionText').value,
        category: document.getElementById('interviewQuestionCategory').value,
        experienceLevel: document.getElementById('interviewExperienceLevel').value,
        answer: document.getElementById('interviewQuestionAnswer').value,
        keyPoints: document.getElementById('interviewKeyPoints').value.split('\n').map(point => point.trim()).filter(point => point),
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
            // Save to Firestore
                await saveQuestionToFirestore(currentInterviewQuestions[index], true);
        }
    } else {
        // Add new question
        formData.id = 'new_interview_' + Date.now();
        formData.createdAt = new Date().toISOString();
        currentInterviewQuestions.push(formData);
        // Save to Firestore
            await saveQuestionToFirestore(formData, true);
    }

    hideInterviewQuestionModal();
    renderInterviewQuestionsTable();
    loadDashboardData();
    updateApiEndpoint(); // Update API for Android app
    showNotification('Interview question saved successfully!');
}

// Render interview questions table
function renderInterviewQuestionsTable() {
    const tbody = document.getElementById('interviewQuestionsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    currentInterviewQuestions.forEach(question => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-normal">
                <div class="text-sm font-medium text-gray-900">${question.question}</div>
                <div class="text-sm text-gray-500">${question.answer.substring(0, 100)}${question.answer.length > 100 ? '...' : ''}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    ${question.category.replace('_', ' ')}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    ${question.experienceLevel}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editInterviewQuestion('${question.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteInterviewQuestion('${question.id}')" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Edit interview question
window.editInterviewQuestion = function(questionId) {
    currentEditingInterviewId = questionId;
    showInterviewQuestionModal();
};

// Delete interview question
window.deleteInterviewQuestion = async function(questionId) {
    if (!confirm('Are you sure you want to delete this interview question?')) return;

    // Delete from Firestore first
        await deleteQuestionFromFirestore(questionId, true);

    currentInterviewQuestions = currentInterviewQuestions.filter(q => q.id !== questionId);
    renderInterviewQuestionsTable();
    loadDashboardData();
    updateApiEndpoint(); // Update API for Android app
    showNotification('Interview question deleted successfully!');
};

//==============================
// CSV UPLOAD FUNCTIONS
//==============================

// Show CSV upload modal
function showCsvUploadModal() {
    console.log('📂 showCsvUploadModal called');
    const modal = document.getElementById('csvUploadModal');
    if (!modal) {
        console.error('❌ CSV upload modal not found!');
        return;
    }
    console.log('📋 Showing CSV upload modal');
    modal.classList.remove('hidden');
    
    // Reset the form
    document.getElementById('csvFileInput').value = '';
    document.getElementById('fileName').textContent = 'No file chosen';
    document.getElementById('csvPreview').classList.add('hidden');
    document.getElementById('csvValidation').classList.add('hidden');
    document.getElementById('processCsvUpload').disabled = true;
}

// Hide CSV upload modal
function hideCsvUploadModal() {
    document.getElementById('csvUploadModal').classList.add('hidden');
    document.getElementById('csvFileInput').value = '';
    document.getElementById('csvPreview').classList.add('hidden');
    document.getElementById('csvValidation').classList.add('hidden');
    document.getElementById('processCsvUpload').disabled = true;
}

// Handle CSV file selection
function handleCsvFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Update file name display
    document.getElementById('fileName').textContent = file.name;
    
    // Show loading indicator
    document.getElementById('loadingIndicator').classList.remove('hidden');
    document.getElementById('csvPreview').classList.add('hidden');
    document.getElementById('csvValidation').classList.add('hidden');
    document.getElementById('processCsvUpload').disabled = true;

    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const csvContent = e.target.result;
            const lines = csvContent.split('\n').filter(line => line.trim() !== '');
            
            if (lines.length < 2) {
                showValidationError('CSV file is empty or has no data rows');
                return;
            }
            
            // Parse CSV header
            const headers = parseCsvLine(lines[0]);
            
            // Show preview
            const previewContent = document.getElementById('csvPreviewContent');
            previewContent.textContent = lines.slice(0, 4).join('\n');
            document.getElementById('csvPreview').classList.remove('hidden');
            
            // Validate CSV structure
            const validation = validateCsvStructure(lines);
            showValidationResults(validation);
            
            // Enable process button if valid
            document.getElementById('processCsvUpload').disabled = !validation.isValid;
            
        } catch (error) {
            console.error('Error processing CSV:', error);
            showValidationError('Error processing CSV file: ' + error.message);
        } finally {
            document.getElementById('loadingIndicator').classList.add('hidden');
        }
    };
    
    reader.onerror = function() {
        showValidationError('Error reading file. Please try again.');
        document.getElementById('loadingIndicator').classList.add('hidden');
    };
    
    reader.readAsText(file);
}

// Parse a single CSV line, handling quoted values
function parseCsvLine(line) {
    const result = [];
    let inQuotes = false;
    let current = '';
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    // Add the last field
    result.push(current.trim());
    return result;
}

// Validate CSV structure
function validateCsvStructure(lines) {
    if (lines.length < 2) {
        return {
            isValid: false,
            errors: ['CSV must have at least one data row'],
            warnings: []
        };
    }
    
    const headers = parseCsvLine(lines[0]);
    const requiredFields = ['question', 'option1', 'option2', 'correctAnswer'];
    const optionalFields = ['option3', 'option4', 'explanation', 'category', 'difficulty', 'tags'];
    const allFields = [...requiredFields, ...optionalFields];
    
    const errors = [];
    const warnings = [];
    
    // Check for required headers
    const missingHeaders = requiredFields.filter(field => 
        !headers.some(h => h.toLowerCase() === field.toLowerCase())
    );
    
    if (missingHeaders.length > 0) {
        errors.push(`Missing required headers: ${missingHeaders.join(', ')}`);
    }
    
    // Check for unknown headers
    headers.forEach(header => {
        if (!allFields.some(field => field.toLowerCase() === header.toLowerCase())) {
            warnings.push(`Unknown header: "${header}" will be ignored`);
        }
    });
    
    // Check data rows
    const dataRows = lines.slice(1);
    dataRows.forEach((row, index) => {
        const values = parseCsvLine(row);
        if (values.length < requiredFields.length) {
            errors.push(`Row ${index + 2}: Not enough columns (expected at least ${requiredFields.length}, got ${values.length})`);
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        headers,
        rowCount: dataRows.length
    };
}

// Show validation results
function showValidationResults(validation) {
    const resultsDiv = document.getElementById('csvValidationResults');
    resultsDiv.innerHTML = '';
    
    if (validation.errors.length === 0 && validation.warnings.length === 0) {
        resultsDiv.innerHTML = `
            <div class="p-2 text-green-700 bg-green-100 rounded">
                <i class="fas fa-check-circle mr-1"></i>
                CSV file is valid. Found ${validation.rowCount} question(s).
            </div>
        `;
        document.getElementById('csvValidation').classList.remove('hidden');
        return;
    }
    
    if (validation.errors.length > 0) {
        const errorHtml = validation.errors.map(error => `
            <div class="p-2 text-red-700 bg-red-100 rounded flex items-start">
                <i class="fas fa-times-circle mr-2 mt-0.5"></i>
                <span>${error}</span>
            </div>
        `).join('');
        
        resultsDiv.innerHTML += errorHtml;
    }
    
    if (validation.warnings.length > 0) {
        const warningHtml = validation.warnings.map(warning => `
            <div class="p-2 text-yellow-700 bg-yellow-100 rounded flex items-start">
                <i class="fas fa-exclamation-triangle mr-2 mt-0.5"></i>
                <span>${warning}</span>
            </div>
        `).join('');
        
        resultsDiv.innerHTML += warningHtml;
    }
    
    document.getElementById('csvValidation').classList.remove('hidden');
}

// Show validation error
function showValidationError(message) {
    const resultsDiv = document.getElementById('csvValidationResults');
    resultsDiv.innerHTML = `
        <div class="p-2 text-red-700 bg-red-100 rounded">
            <i class="fas fa-times-circle mr-1"></i>
            ${message}
        </div>
    `;
    document.getElementById('csvValidation').classList.remove('hidden');
}

// Process CSV upload
async function processCsvUpload() {
    const file = document.getElementById('csvFileInput').files[0];
    if (!file) return;
    
    // Show loading state
    const processBtn = document.getElementById('processCsvUpload');
    const buttonText = document.getElementById('uploadButtonText');
    const uploadSpinner = document.getElementById('uploadSpinner');
    
    buttonText.textContent = 'Uploading...';
    processBtn.disabled = true;
    uploadSpinner.classList.remove('hidden');
    
    try {
        const csvContent = await readFileAsText(file);
        const lines = csvContent.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length < 2) {
            throw new Error('CSV file is empty or has no data rows');
        }
        
        const headers = parseCsvLine(lines[0]);
        const questions = [];
        let successCount = 0;
        let errorCount = 0;
        
        // Process each data row
        for (let i = 1; i < lines.length; i++) {
            try {
                const values = parseCsvLine(lines[i]);
                if (values.length < 4) { // At least question, option1, option2, correctAnswer
                    errorCount++;
                    continue;
                }
                
                const question = {
                    id: 'csv_' + Date.now() + '_' + i,
                    question: values[headers.indexOf('question')] || '',
                    options: [
                        values[headers.indexOf('option1')] || '',
                        values[headers.indexOf('option2')] || '',
                        values[headers.indexOf('option3')] || '',
                        values[headers.indexOf('option4')] || ''
                    ].filter(opt => opt !== ''), // Remove empty options
                    correctAnswer: values[headers.indexOf('correctAnswer')] || '',
                    explanation: values[headers.indexOf('explanation')] || '',
                    category: (values[headers.indexOf('category')] || 'GENERAL').toUpperCase(),
                    difficulty: (values[headers.indexOf('difficulty')] || 'MEDIUM').toUpperCase(),
                    tags: (values[headers.indexOf('tags')] || '').split(';').map(tag => tag.trim()).filter(tag => tag !== ''),
                    isActive: true,
                    createdAt: new Date().toISOString()
                };
                
                // Validate question
                if (!question.question || question.options.length < 2 || !question.correctAnswer) {
                    errorCount++;
                    continue;
                }
                
                questions.push(question);
                successCount++;
                
                // Save to Firestore
                await saveQuestionToFirestore(question);
                
                // Update progress
                buttonText.textContent = `Uploading... (${i}/${lines.length - 1})`;
                
            } catch (error) {
                console.error(`Error processing row ${i + 1}:`, error);
                errorCount++;
            }
        }
        
        // Update UI
        currentQuestions.push(...questions);
        renderQuestionsTable();
        loadDashboardData();
        updateApiEndpoint();
        
        // Show success message
        showNotification(
            `Successfully imported ${successCount} question(s).` + 
            (errorCount > 0 ? ` ${errorCount} row(s) had errors.` : '')
        );
        
        // Close modal after a short delay
        setTimeout(hideCsvUploadModal, 1000);
        
    } catch (error) {
        console.error('Error processing CSV:', error);
        showValidationError('Error processing CSV: ' + error.message);
    } finally {
        // Reset button state
        buttonText.textContent = 'Upload Questions';
        processBtn.disabled = false;
        uploadSpinner.classList.add('hidden');
    }
}

// Helper function to read file as text
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = e => reject(new Error('Error reading file'));
        reader.readAsText(file);
    });
}

// Download CSV template file
function downloadCsvTemplateFile() {
    const csvContent = `question,option1,option2,option3,option4,correctAnswer,explanation,category,difficulty,tags
"What is a firewall?","A network security device","An antivirus software","A backup system","A password manager","A network security device","A firewall monitors and controls incoming and outgoing network traffic","NETWORK_SECURITY","BEGINNER","network;security;firewall"
"What does SQL stand for?","Structured Query Language","Simple Query Language","Sequential Query Language","Standard Query Language","Structured Query Language","SQL is used to communicate with databases","DATABASE","BEGINNER","database;sql"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'quiz_questions_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    showNotification('CSV template downloaded successfully!');
    
    // Clean up the object URL
    window.URL.revokeObjectURL(url);
}

//==============================
// EXPORT FUNCTIONS
//==============================

// Export questions to JSON
function exportQuestions() {
    const dataStr = JSON.stringify(currentQuestions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cyberlearn_quiz_questions.json';
    link.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Questions exported successfully!');
}

// Export interview questions to JSON
function exportInterviewQuestions() {
    const dataStr = JSON.stringify(currentInterviewQuestions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cyberlearn_interview_questions.json';
    link.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Interview questions exported successfully!');
}

// Generate mobile app questions code
function generateMobileAppQuestions() {
    const questions = currentQuestions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        category: q.category,
        difficulty: q.difficulty,
        tags: q.tags
    }));
    
    const jsonStr = JSON.stringify(questions, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
        showNotification('Questions copied to clipboard! Paste them into your mobile app.');
    }).catch(() => {
        showNotification('Failed to copy to clipboard. Use export instead.');
    });
}

//==============================
// FLASHCARD MANAGEMENT FUNCTIONS
//==============================

// Show flashcard deck modal
function showFlashcardDeckModal() {
    console.log('🚀 showFlashcardDeckModal called');
    const modal = document.getElementById('flashcardDeckModal');
    const modalTitle = document.getElementById('deckModalTitle');
    
    console.log('🔍 Modal element:', modal);
    console.log('🔍 Modal title element:', modalTitle);
    
    if (currentEditingDeckId) {
        modalTitle.textContent = 'Edit Flashcard Deck';
        populateFlashcardDeckForm(currentEditingDeckId);
    } else {
        modalTitle.textContent = 'Add New Flashcard Deck';
        clearFlashcardDeckForm();
    }
    
    modal.classList.remove('hidden');
    console.log('✅ Modal should now be visible');
}

// Hide flashcard deck modal
function hideFlashcardDeckModal() {
    document.getElementById('flashcardDeckModal').classList.add('hidden');
    clearFlashcardDeckForm();
}

// Clear flashcard deck form
function clearFlashcardDeckForm() {
    document.getElementById('flashcardDeckForm').reset();
    currentEditingDeckId = null;
}

// Populate flashcard deck form for editing
function populateFlashcardDeckForm(deckId) {
    const deck = currentFlashcardDecks.find(d => d.id === deckId);
    if (!deck) return;

    document.getElementById('deckName').value = deck.name;
    document.getElementById('deckDescription').value = deck.description;
    document.getElementById('deckCategory').value = deck.category;
    document.getElementById('deckDifficulty').value = deck.difficulty;
    document.getElementById('deckColor').value = deck.color;
    document.getElementById('deckStudyTime').value = deck.estimatedStudyTime;
    document.getElementById('deckTags').value = deck.tags ? deck.tags.join(', ') : '';
}

// Handle flashcard deck form submission
async function handleFlashcardDeckSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('deckName').value,
        description: document.getElementById('deckDescription').value,
        category: document.getElementById('deckCategory').value,
        difficulty: document.getElementById('deckDifficulty').value,
        color: document.getElementById('deckColor').value,
        estimatedStudyTime: parseInt(document.getElementById('deckStudyTime').value),
        tags: document.getElementById('deckTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
        updatedAt: new Date().toISOString()
    };

    // Validate form
    if (!formData.name || !formData.description) {
        alert('Please fill in all required fields');
        return;
    }

    if (currentEditingDeckId) {
        // Update existing deck
        const index = currentFlashcardDecks.findIndex(d => d.id === currentEditingDeckId);
        if (index >= 0) {
            currentFlashcardDecks[index] = { ...currentFlashcardDecks[index], ...formData };
            // Save to Firestore
            await saveFlashcardDeckToFirestore(currentFlashcardDecks[index]);
        }
    } else {
        // Add new deck
        formData.id = 'deck_new_' + Date.now();
        formData.createdAt = new Date().toISOString();
        currentFlashcardDecks.push(formData);
        // Save to Firestore
        await saveFlashcardDeckToFirestore(formData);
    }

    hideFlashcardDeckModal();
    renderFlashcardDecksTable();
    populateFlashcardDeckSelect();
    loadDashboardData();
    updateApiEndpoint();
    showNotification('Flashcard deck saved successfully!');
}

// Show flashcard modal
function showFlashcardModal() {
    const modal = document.getElementById('flashcardModal');
    const modalTitle = document.getElementById('flashcardModalTitle');
    
    populateFlashcardDeckSelect();
    
    if (currentEditingFlashcardId) {
        modalTitle.textContent = 'Edit Flashcard';
        populateFlashcardForm(currentEditingFlashcardId);
    } else {
        modalTitle.textContent = 'Add New Flashcard';
        clearFlashcardForm();
    }
    
    modal.classList.remove('hidden');
}

// Hide flashcard modal
function hideFlashcardModal() {
    document.getElementById('flashcardModal').classList.add('hidden');
    clearFlashcardForm();
}

// Clear flashcard form
function clearFlashcardForm() {
    document.getElementById('flashcardForm').reset();
    currentEditingFlashcardId = null;
}

// Populate flashcard form for editing
function populateFlashcardForm(flashcardId) {
    const flashcard = currentFlashcards.find(f => f.id === flashcardId);
    if (!flashcard) return;

    document.getElementById('flashcardDeck').value = flashcard.deckId;
    document.getElementById('flashcardFront').value = flashcard.front;
    document.getElementById('flashcardBack').value = flashcard.back;
    document.getElementById('flashcardExplanation').value = flashcard.explanation || '';
    document.getElementById('flashcardCategory').value = flashcard.category;
    document.getElementById('flashcardDifficulty').value = flashcard.difficulty;
    document.getElementById('flashcardTags').value = flashcard.tags ? flashcard.tags.join(', ') : '';
}

// Handle flashcard form submission
async function handleFlashcardSubmit(e) {
    e.preventDefault();
    
    const formData = {
        deckId: document.getElementById('flashcardDeck').value,
        front: document.getElementById('flashcardFront').value,
        back: document.getElementById('flashcardBack').value,
        explanation: document.getElementById('flashcardExplanation').value,
        category: document.getElementById('flashcardCategory').value,
        difficulty: document.getElementById('flashcardDifficulty').value,
        tags: document.getElementById('flashcardTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
        updatedAt: new Date().toISOString()
    };

    // Validate form
    if (!formData.deckId || !formData.front || !formData.back) {
        alert('Please fill in all required fields');
        return;
    }

    if (currentEditingFlashcardId) {
        // Update existing flashcard
        const index = currentFlashcards.findIndex(f => f.id === currentEditingFlashcardId);
        if (index >= 0) {
            currentFlashcards[index] = { ...currentFlashcards[index], ...formData };
            // Save to Firestore
            await saveFlashcardToFirestore(currentFlashcards[index]);
        }
    } else {
        // Add new flashcard
        formData.id = 'card_new_' + Date.now();
        formData.createdAt = new Date().toISOString();
        currentFlashcards.push(formData);
        // Save to Firestore
        await saveFlashcardToFirestore(formData);
    }

    hideFlashcardModal();
    renderFlashcardsTable();
    loadDashboardData();
    updateApiEndpoint();
    showNotification('Flashcard saved successfully!');
}

// Render flashcard decks table
function renderFlashcardDecksTable() {
    const tbody = document.getElementById('flashcardDecksTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    currentFlashcardDecks.forEach(deck => {
        const cardCount = currentFlashcards.filter(c => c.deckId === deck.id).length;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-normal">
                <div class="flex items-center">
                    <div class="w-4 h-4 rounded mr-3" style="background-color: ${deck.color}"></div>
                    <div>
                        <div class="text-sm font-medium text-gray-900">${deck.name}</div>
                        <div class="text-sm text-gray-500">${deck.description.substring(0, 100)}${deck.description.length > 100 ? '...' : ''}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    ${deck.category.replace('_', ' ')}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${cardCount} cards
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ${deck.difficulty}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editFlashcardDeck('${deck.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteFlashcardDeck('${deck.id}')" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render flashcards table
function renderFlashcardsTable() {
    const tbody = document.getElementById('flashcardsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const deckFilter = document.getElementById('deckFilter');
    const selectedDeckId = deckFilter ? deckFilter.value : '';
    
    const filteredFlashcards = selectedDeckId 
        ? currentFlashcards.filter(f => f.deckId === selectedDeckId)
        : currentFlashcards;
    
    filteredFlashcards.forEach(flashcard => {
        const deck = currentFlashcardDecks.find(d => d.id === flashcard.deckId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-normal">
                <div class="text-sm font-medium text-gray-900">${flashcard.front}</div>
                <div class="text-sm text-gray-500">${flashcard.back.substring(0, 100)}${flashcard.back.length > 100 ? '...' : ''}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    ${deck ? deck.name : 'Unknown'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    ${flashcard.category.replace('_', ' ')}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ${flashcard.difficulty}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editFlashcard('${flashcard.id}')" class="text-blue-600 hover:text-blue-900 mr-3">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteFlashcard('${flashcard.id}')" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Populate flashcard deck select dropdown
function populateFlashcardDeckSelect() {
    const select = document.getElementById('flashcardDeck');
    const filter = document.getElementById('deckFilter');
    
    if (select) {
        select.innerHTML = '<option value="">Choose a deck...</option>';
        currentFlashcardDecks.forEach(deck => {
            const option = document.createElement('option');
            option.value = deck.id;
            option.textContent = deck.name;
            select.appendChild(option);
        });
    }
    
    if (filter) {
        filter.innerHTML = '<option value="">All Decks</option>';
        currentFlashcardDecks.forEach(deck => {
            const option = document.createElement('option');
            option.value = deck.id;
            option.textContent = deck.name;
            filter.appendChild(option);
        });
        
        filter.addEventListener('change', renderFlashcardsTable);
    }
}

// Show flashcard tab
function showFlashcardTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.flashcard-tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Remove active state from all tabs
    document.querySelectorAll('.flashcard-tab').forEach(tab => {
        tab.classList.remove('border-blue-500', 'text-blue-600');
        tab.classList.add('border-transparent', 'text-gray-500');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(`flashcard-${tabName}-content`);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }
    
    // Activate selected tab
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedTab) {
        selectedTab.classList.remove('border-transparent', 'text-gray-500');
        selectedTab.classList.add('border-blue-500', 'text-blue-600');
    }
    
    // Load specific tab data
    if (tabName === 'analytics') {
        loadFlashcardAnalytics();
    }
}

// Load flashcard analytics
function loadFlashcardAnalytics() {
    // Category breakdown
    const categoryStats = {};
    currentFlashcards.forEach(card => {
        categoryStats[card.category] = (categoryStats[card.category] || 0) + 1;
    });
    const categoryBreakdown = Object.entries(categoryStats)
        .map(([cat, count]) => `${cat.replace('_', ' ')}: ${count}`)
        .join(', ') || 'No data';
    document.getElementById('categoryBreakdown').textContent = categoryBreakdown;
    
    // Difficulty breakdown
    const difficultyStats = {};
    currentFlashcards.forEach(card => {
        difficultyStats[card.difficulty] = (difficultyStats[card.difficulty] || 0) + 1;
    });
    const difficultyBreakdown = Object.entries(difficultyStats)
        .map(([diff, count]) => `${diff}: ${count}`)
        .join(', ') || 'No data';
    document.getElementById('difficultyBreakdown').textContent = difficultyBreakdown;
    
    // Average cards per deck
    const avgCards = currentFlashcardDecks.length > 0 
        ? Math.round(currentFlashcards.length / currentFlashcardDecks.length)
        : 0;
    document.getElementById('avgCardsPerDeck').textContent = avgCards;
}

// Edit flashcard deck
window.editFlashcardDeck = function(deckId) {
    currentEditingDeckId = deckId;
    showFlashcardDeckModal();
};

// Delete flashcard deck
window.deleteFlashcardDeck = async function(deckId) {
    const deck = currentFlashcardDecks.find(d => d.id === deckId);
    const cardCount = currentFlashcards.filter(c => c.deckId === deckId).length;
    
    if (!confirm(`Are you sure you want to delete '${deck.name}'? This will also delete ${cardCount} flashcards in the deck.`)) {
        return;
    }
    
    // Delete from Firestore first
    await deleteFlashcardDeckFromFirestore(deckId);
    
    // Remove deck and associated cards
    currentFlashcardDecks = currentFlashcardDecks.filter(d => d.id !== deckId);
    currentFlashcards = currentFlashcards.filter(c => c.deckId !== deckId);
    
    renderFlashcardDecksTable();
    renderFlashcardsTable();
    populateFlashcardDeckSelect();
    loadDashboardData();
    updateApiEndpoint();
    showNotification('Flashcard deck deleted successfully!');
};

// Edit flashcard
window.editFlashcard = function(flashcardId) {
    currentEditingFlashcardId = flashcardId;
    showFlashcardModal();
};

// Delete flashcard
window.deleteFlashcard = async function(flashcardId) {
    if (!confirm('Are you sure you want to delete this flashcard?')) return;
    
    // Delete from Firestore first
    await deleteFlashcardFromFirestore(flashcardId);
    
    currentFlashcards = currentFlashcards.filter(f => f.id !== flashcardId);
    renderFlashcardsTable();
    loadDashboardData();
    updateApiEndpoint();
    showNotification('Flashcard deleted successfully!');
};

// Export flashcard decks
function exportFlashcardDecks() {
    const dataStr = JSON.stringify(currentFlashcardDecks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cyberlearn_flashcard_decks.json';
    link.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Flashcard decks exported successfully!');
}

// Export flashcards
function exportFlashcards() {
    const dataStr = JSON.stringify(currentFlashcards, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cyberlearn_flashcards.json';
    link.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Flashcards exported successfully!');
}

// Save flashcard deck to Firestore
async function saveFlashcardDeckToFirestore(deck) {
    if (!isFirestoreAvailable || !window.db) return false;
    
    try {
        console.log('💾 Saving flashcard deck to Firestore:', deck);
        
        if (deck.id && !deck.id.startsWith('deck_new_')) {
            // Update existing document
            console.log('✏️ Updating existing deck:', deck.id);
            await window.db.collection('flashcard_decks').doc(deck.id).update(deck);
        } else {
            // Create new document
            console.log('➕ Creating new deck');
            const { id, ...deckData } = deck; // Remove the temporary ID
            const docRef = await window.db.collection('flashcard_decks').add(deckData);
            deck.id = docRef.id; // Update with the real Firestore ID
            console.log('✅ New deck created with ID:', docRef.id);
        }
        return true;
    } catch (error) {
        console.error('❌ Error saving flashcard deck to Firestore:', error);
        return false;
    }
}

// Save flashcard to Firestore
async function saveFlashcardToFirestore(flashcard) {
    if (!isFirestoreAvailable || !window.db) return false;
    
    try {
        console.log('💾 Saving flashcard to Firestore:', flashcard);
        
        if (flashcard.id && !flashcard.id.startsWith('card_new_')) {
            // Update existing document
            console.log('✏️ Updating existing flashcard:', flashcard.id);
            await window.db.collection('flashcards').doc(flashcard.id).update(flashcard);
        } else {
            // Create new document
            console.log('➕ Creating new flashcard');
            const { id, ...flashcardData } = flashcard; // Remove the temporary ID
            const docRef = await window.db.collection('flashcards').add(flashcardData);
            flashcard.id = docRef.id; // Update with the real Firestore ID
            console.log('✅ New flashcard created with ID:', docRef.id);
        }
        return true;
    } catch (error) {
        console.error('❌ Error saving flashcard to Firestore:', error);
        return false;
    }
}

// Delete flashcard deck from Firestore
async function deleteFlashcardDeckFromFirestore(deckId) {
    if (!isFirestoreAvailable || !window.db) return false;
    
    try {
        await window.db.collection('flashcard_decks').doc(deckId).delete();
        // Also delete all flashcards in the deck
        const flashcardsQuery = await window.db.collection('flashcards').where('deckId', '==', deckId).get();
        const batch = window.db.batch();
        flashcardsQuery.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        return true;
    } catch (error) {
        console.error('Error deleting flashcard deck from Firestore:', error);
        return false;
    }
}

// Delete flashcard from Firestore
async function deleteFlashcardFromFirestore(flashcardId) {
    if (!isFirestoreAvailable || !window.db) return false;
    
    try {
        await window.db.collection('flashcards').doc(flashcardId).delete();
        return true;
    } catch (error) {
        console.error('Error deleting flashcard from Firestore:', error);
        return false;
    }
}

//==============================
// UTILITY FUNCTIONS
//==============================

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
        
        console.log('📊 Checking flashcard_decks collection...');
        const deckSnapshot = await window.db.collection('flashcard_decks').get();
        console.log('📊 Flashcard decks snapshot:', deckSnapshot);
        console.log('📊 Flashcard decks count:', deckSnapshot.size);
        
        deckSnapshot.forEach((doc) => {
            console.log('📝 Flashcard deck document:', doc.id, doc.data());
        });
        
        console.log('📊 Checking flashcards collection...');
        const flashcardSnapshot = await window.db.collection('flashcards').get();
        console.log('📊 Flashcards snapshot:', flashcardSnapshot);
        console.log('📊 Flashcards count:', flashcardSnapshot.size);
        
        flashcardSnapshot.forEach((doc) => {
            console.log('📝 Flashcard document:', doc.id, doc.data());
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

// Update API endpoint for Android app
function updateApiEndpoint() {
    // Make questions data globally available for the API
    window.currentQuestions = currentQuestions;
    window.currentInterviewQuestions = currentInterviewQuestions;
    window.currentFlashcardDecks = currentFlashcardDecks;
    window.currentFlashcards = currentFlashcards;
    
    if (isFirestoreAvailable && window.db) {
        try {
            const apiData = {
                quiz_questions: currentQuestions,
                interview_questions: currentInterviewQuestions,
                flashcard_decks: currentFlashcardDecks,
                flashcards: currentFlashcards,
                last_updated: new Date().toISOString(),
                total_quiz_questions: currentQuestions.length,
                total_interview_questions: currentInterviewQuestions.length,
                total_flashcard_decks: currentFlashcardDecks.length,
                total_flashcards: currentFlashcards.length
            };
            
            // Save to Firestore as a single document for easy access
            window.db.collection('api_data').doc('questions').set(apiData);
            console.log('📡 API endpoint updated for Android app (Firestore)');
            
        } catch (error) {
            console.error('❌ Error updating API endpoint in Firestore:', error);
        }
    }
    
    console.log('📡 API endpoint updated for Android app (Local)');
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
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
