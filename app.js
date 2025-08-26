// CyberLearn Admin Console - Main Application Logic
// Handles authentication, data management, and CSV upload functionality

// Global variables
let isDemoMode = false;
let currentUser = null;
let currentQuestions = [];
let currentInterviewQuestions = [];

// Sample data for demo mode
const sampleQuizQuestions = [
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
        question: "What defines the shared responsibility model in cloud security?",
        options: [
            "Security responsibilities between provider and customer",
            "Cost sharing agreements",
            "Data sharing between organizations",
            "Network bandwidth allocation"
        ],
        correctAnswer: "Security responsibilities between provider and customer",
        explanation: "The shared responsibility model divides security duties between cloud provider and customer based on the service type.",
        category: "CLOUD_SECURITY",
        difficulty: "INTERMEDIATE",
        tags: ["cloud", "shared responsibility", "aws"],
        isActive: true
    }
];

const sampleInterviewQuestions = [
    {
        id: "interview_1",
        question: "What are the key responsibilities of a SOC analyst and how do you prioritize security alerts?",
        answer: "A SOC analyst is responsible for monitoring security events, investigating alerts, and responding to incidents. Key responsibilities include: 1) Continuous monitoring of SIEM dashboards and security tools, 2) Analyzing and triaging security alerts based on severity and impact, 3) Conducting initial incident response and escalation procedures, 4) Documenting findings and maintaining incident records, 5) Threat hunting and proactive security monitoring. Alert prioritization follows a risk-based approach considering factors like asset criticality, threat severity, business impact, and regulatory requirements.",
        keyPoints: [
            "24/7 security monitoring and alert analysis",
            "Risk-based alert prioritization and triage",
            "Incident response and escalation procedures",
            "Threat hunting and proactive monitoring",
            "Documentation and knowledge management"
        ],
        category: "SECURITY_OPERATIONS",
        experienceLevel: "ENTRY",
        tags: ["soc", "monitoring", "incident response", "alert triage"],
        isActive: true
    }
];

// Wait for Firebase to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Admin Console loading...');
    
    // Wait for Firebase services to be available
    const checkFirebase = setInterval(() => {
        if (window.firebaseServices && window.auth && window.db) {
            clearInterval(checkFirebase);
            initializeApp();
        }
    }, 100);
});

function initializeApp() {
    console.log('🔥 Initializing app with Firebase services');
    
    // Initialize authentication state
    const { onAuthStateChanged } = window.firebaseServices;
    onAuthStateChanged(window.auth, (user) => {
        if (user) {
            console.log('✅ User authenticated:', user.email);
            currentUser = user;
            isDemoMode = false;
            showMainApp(user.email);
            loadDataFromFirebase();
        } else {
            console.log('ℹ️ No authenticated user');
            showLoginScreen();
        }
    });

    // Set up event listeners
    setupEventListeners();
    
    // Initialize with demo data
    currentQuestions = [...sampleQuizQuestions];
    currentInterviewQuestions = [...sampleInterviewQuestions];
    
    console.log('✅ App initialized successfully');
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Demo mode button
    const demoModeBtn = document.getElementById('demoModeBtn');
    if (demoModeBtn) {
        demoModeBtn.addEventListener('click', enterDemoMode);
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            showSection(section);
        });
    });

    // Add question button
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    if (addQuestionBtn) {
        addQuestionBtn.addEventListener('click', () => showQuestionModal());
    }

    // CSV upload button
    const csvUploadBtn = document.getElementById('csvUploadBtn');
    if (csvUploadBtn) {
        csvUploadBtn.addEventListener('click', () => showCsvUploadModal());
    }

    // Export buttons
    const exportQuestionsBtn = document.getElementById('exportQuestionsBtn');
    if (exportQuestionsBtn) {
        exportQuestionsBtn.addEventListener('click', exportQuestions);
    }

    const exportInterviewBtn = document.getElementById('exportInterviewBtn');
    if (exportInterviewBtn) {
        exportInterviewBtn.addEventListener('click', exportInterviewQuestions);
    }

    // Modal close buttons
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', hideQuestionModal);
    }

    const closeCsvModal = document.getElementById('closeCsvModal');
    if (closeCsvModal) {
        closeCsvModal.addEventListener('click', hideCsvUploadModal);
    }

    // Question form
    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
        questionForm.addEventListener('submit', handleQuestionSubmit);
    }

    // CSV upload handlers
    const csvFileInput = document.getElementById('csvFileInput');
    if (csvFileInput) {
        csvFileInput.addEventListener('change', handleCsvFileSelect);
    }

    const processCsvUpload = document.getElementById('processCsvUpload');
    if (processCsvUpload) {
        processCsvUpload.addEventListener('click', processCsvUpload);
    }

    const cancelCsvUpload = document.getElementById('cancelCsvUpload');
    if (cancelCsvUpload) {
        cancelCsvUpload.addEventListener('click', hideCsvUploadModal);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('🔐 Attempting login for:', email);
    
    try {
        const { signInWithEmailAndPassword } = window.firebaseServices;
        const userCredential = await signInWithEmailAndPassword(window.auth, email, password);
        const user = userCredential.user;
        
        console.log('✅ Login successful:', user.email);
        currentUser = user;
        isDemoMode = false;
        
        showNotification('🔥 Connected to Firebase!', 'success');
        showMainApp(user.email);
        await loadDataFromFirebase();
        
    } catch (error) {
        console.error('❌ Login failed:', error);
        showNotification(`Login failed: ${error.message}`, 'error');
    }
}

function enterDemoMode() {
    console.log('📝 Entering demo mode');
    isDemoMode = true;
    currentUser = { email: 'Demo Mode' };
    
    showNotification('📝 Running in Demo Mode', 'info');
    showMainApp('Demo Mode');
    updateDashboard();
    renderQuestions();
    renderInterviewQuestions();
}

async function handleLogout() {
    try {
        if (!isDemoMode && window.firebaseServices) {
            const { signOut } = window.firebaseServices;
            await signOut(window.auth);
        }
        
        currentUser = null;
        isDemoMode = false;
        currentQuestions = [];
        currentInterviewQuestions = [];
        
        showLoginScreen();
        showNotification('Logged out successfully', 'success');
        
    } catch (error) {
        console.error('❌ Logout failed:', error);
        showNotification('Logout failed', 'error');
    }
}

function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainApp').classList.add('hidden');
}

function showMainApp(userEmail) {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('userEmail').textContent = userEmail;
    
    // Show dashboard by default
    showSection('dashboard');
    updateDashboard();
    renderQuestions();
    renderInterviewQuestions();
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('hidden'));
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    // Update sidebar active state
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.classList.remove('sidebar-active');
        if (item.getAttribute('data-section') === sectionName) {
            item.classList.add('sidebar-active');
        }
    });
}

function updateDashboard() {
    document.getElementById('totalQuizQuestions').textContent = currentQuestions.length;
    document.getElementById('totalInterviewQuestions').textContent = currentInterviewQuestions.length;
    document.getElementById('activeQuestions').textContent = currentQuestions.filter(q => q.isActive).length;
}

function renderQuestions() {
    const tbody = document.getElementById('questionsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    currentQuestions.forEach(question => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${question.question.substring(0, 100)}...</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    ${question.category}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    ${question.difficulty}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editQuestion('${question.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                <button onclick="deleteQuestion('${question.id}')" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function renderInterviewQuestions() {
    const tbody = document.getElementById('interviewTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    currentInterviewQuestions.forEach(question => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${question.question.substring(0, 100)}...</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    ${question.category}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    ${question.experienceLevel}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editInterviewQuestion('${question.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                <button onclick="deleteInterviewQuestion('${question.id}')" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// CSV Upload Functions
function showCsvUploadModal() {
    document.getElementById('csvUploadModal').classList.remove('hidden');
}

function hideCsvUploadModal() {
    document.getElementById('csvUploadModal').classList.add('hidden');
    // Reset form
    document.getElementById('csvFileInput').value = '';
    document.getElementById('csvPreview').classList.add('hidden');
    document.getElementById('csvValidation').classList.add('hidden');
    document.getElementById('processCsvUpload').disabled = true;
}

function handleCsvFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('📁 CSV file selected:', file.name);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvText = e.target.result;
        console.log('📄 CSV content loaded, length:', csvText.length);
        
        try {
            const result = parseCsvContent(csvText);
            displayCsvPreview(result);
            validateCsvData(result);
        } catch (error) {
            console.error('❌ CSV parsing error:', error);
            showNotification('Error parsing CSV file: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

function parseCsvContent(csvText) {
    console.log('🔍 Parsing CSV content...');
    
    // Split into lines and handle different line endings
    const lines = csvText.split(/\r?\n/).filter(line => line.trim());
    
    if (lines.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row');
    }
    
    // Parse header
    const headers = parseCsvRow(lines[0]);
    console.log('📋 CSV headers:', headers);
    
    // Parse data rows
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const row = parseCsvRow(lines[i]);
            if (row.length > 0) {
                rows.push(row);
            }
        }
    }
    
    console.log(`✅ Parsed ${rows.length} data rows`);
    
    return {
        headers: headers,
        rows: rows,
        preview: lines.slice(0, 4).join('\n') // First 3 rows for preview
    };
}

function parseCsvRow(row) {
    const result = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < row.length) {
        const char = row[i];
        
        if (char === '"') {
            if (inQuotes && row[i + 1] === '"') {
                // Escaped quote
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
            current += char;
            i++;
        }
    }
    
    // Add the last field
    result.push(current.trim());
    
    return result;
}

function displayCsvPreview(result) {
    const previewDiv = document.getElementById('csvPreview');
    const contentDiv = document.getElementById('csvPreviewContent');
    
    contentDiv.textContent = result.preview;
    previewDiv.classList.remove('hidden');
    
    console.log('👀 CSV preview displayed');
}

function validateCsvData(result) {
    console.log('✅ Validating CSV data...');
    
    const questionType = document.getElementById('questionTypeSelect').value;
    const validationDiv = document.getElementById('csvValidation');
    const resultsDiv = document.getElementById('csvValidationResults');
    const uploadBtn = document.getElementById('processCsvUpload');
    
    let errors = [];
    let warnings = [];
    let validRows = 0;
    
    // Check required headers based on question type
    const requiredHeaders = questionType === 'quiz' 
        ? ['question', 'option1', 'option2', 'correctAnswer', 'explanation']
        : ['question', 'answer', 'category'];
    
    // Validate headers
    const missingHeaders = requiredHeaders.filter(header => 
        !result.headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
    );
    
    if (missingHeaders.length > 0) {
        errors.push(`Missing required headers: ${missingHeaders.join(', ')}`);
    }
    
    // Validate data rows
    result.rows.forEach((row, index) => {
        const rowNum = index + 2; // +2 because index starts at 0 and we skip header
        
        if (questionType === 'quiz') {
            // Validate quiz question row
            if (!row[0] || row[0].length < 10) {
                errors.push(`Row ${rowNum}: Question must be at least 10 characters`);
            }
            if (!row[1] || !row[2]) {
                errors.push(`Row ${rowNum}: Must have at least 2 options`);
            }
            if (!row.find(cell => cell && cell.length > 0)) {
                errors.push(`Row ${rowNum}: Correct answer is required`);
            }
        } else {
            // Validate interview question row
            if (!row[0] || row[0].length < 10) {
                errors.push(`Row ${rowNum}: Question must be at least 10 characters`);
            }
            if (!row[1] || row[1].length < 20) {
                errors.push(`Row ${rowNum}: Answer must be at least 20 characters`);
            }
        }
        
        if (errors.length === 0) {
            validRows++;
        }
    });
    
    // Display validation results
    let html = '';
    
    if (errors.length > 0) {
        html += '<div class="mb-3"><h5 class="font-medium text-red-700">❌ Errors (must fix):</h5>';
        html += '<ul class="list-disc list-inside text-sm text-red-600">';
        errors.forEach(error => html += `<li>${error}</li>`);
        html += '</ul></div>';
    }
    
    if (warnings.length > 0) {
        html += '<div class="mb-3"><h5 class="font-medium text-yellow-700">⚠️ Warnings (will auto-correct):</h5>';
        html += '<ul class="list-disc list-inside text-sm text-yellow-600">';
        warnings.forEach(warning => html += `<li>${warning}</li>`);
        html += '</ul></div>';
    }
    
    if (errors.length === 0) {
        html += `<div class="text-green-700">✅ Ready to import ${validRows} ${questionType} questions</div>`;
        uploadBtn.disabled = false;
    } else {
        uploadBtn.disabled = true;
    }
    
    resultsDiv.innerHTML = html;
    validationDiv.classList.remove('hidden');
    
    console.log(`📊 Validation complete: ${errors.length} errors, ${warnings.length} warnings, ${validRows} valid rows`);
}

function processCsvUpload() {
    console.log('🚀 Processing CSV upload...');
    
    const file = document.getElementById('csvFileInput').files[0];
    const questionType = document.getElementById('questionTypeSelect').value;
    
    if (!file) {
        showNotification('Please select a CSV file', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvText = e.target.result;
        
        try {
            const result = parseCsvContent(csvText);
            const questions = convertCsvToQuestions(result, questionType);
            
            // Add questions to appropriate array
            if (questionType === 'quiz') {
                currentQuestions.push(...questions);
                renderQuestions();
                showNotification(`✅ Successfully imported ${questions.length} quiz questions`, 'success');
            } else {
                currentInterviewQuestions.push(...questions);
                renderInterviewQuestions();
                showNotification(`✅ Successfully imported ${questions.length} interview questions`, 'success');
            }
            
            // Save to Firebase if not in demo mode
            if (!isDemoMode) {
                saveDataToFirebase();
            }
            
            updateDashboard();
            hideCsvUploadModal();
            
        } catch (error) {
            console.error('❌ CSV processing error:', error);
            showNotification('Error processing CSV: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

function convertCsvToQuestions(result, questionType) {
    console.log(`🔄 Converting CSV to ${questionType} questions...`);
    
    const questions = [];
    const headers = result.headers.map(h => h.toLowerCase());
    
    result.rows.forEach((row, index) => {
        if (row.length === 0 || !row[0]) return; // Skip empty rows
        
        try {
            if (questionType === 'quiz') {
                const question = convertToQuizQuestion(row, headers, index);
                if (question) questions.push(question);
            } else {
                const question = convertToInterviewQuestion(row, headers, index);
                if (question) questions.push(question);
            }
        } catch (error) {
            console.warn(`⚠️ Skipping row ${index + 2}: ${error.message}`);
        }
    });
    
    console.log(`✅ Converted ${questions.length} questions`);
    return questions;
}

function convertToQuizQuestion(row, headers, index) {
    // Find column indices
    const questionIdx = headers.findIndex(h => h.includes('question'));
    const option1Idx = headers.findIndex(h => h.includes('option1'));
    const option2Idx = headers.findIndex(h => h.includes('option2'));
    const option3Idx = headers.findIndex(h => h.includes('option3'));
    const option4Idx = headers.findIndex(h => h.includes('option4'));
    const correctIdx = headers.findIndex(h => h.includes('correct'));
    const explanationIdx = headers.findIndex(h => h.includes('explanation'));
    const categoryIdx = headers.findIndex(h => h.includes('category'));
    const difficultyIdx = headers.findIndex(h => h.includes('difficulty'));
    
    if (questionIdx === -1 || option1Idx === -1 || option2Idx === -1 || correctIdx === -1 || explanationIdx === -1) {
        throw new Error('Missing required columns');
    }
    
    // Extract data
    const questionText = row[questionIdx]?.trim();
    const options = [
        row[option1Idx]?.trim(),
        row[option2Idx]?.trim(),
        option3Idx !== -1 ? row[option3Idx]?.trim() : '',
        option4Idx !== -1 ? row[option4Idx]?.trim() : ''
    ].filter(opt => opt && opt.length > 0);
    
    const correctAnswer = row[correctIdx]?.trim();
    const explanation = row[explanationIdx]?.trim();
    const category = categoryIdx !== -1 ? row[categoryIdx]?.trim() : 'SECURITY_OPERATIONS';
    const difficulty = difficultyIdx !== -1 ? row[difficultyIdx]?.trim() : 'INTERMEDIATE';
    
    if (!questionText || options.length < 2 || !correctAnswer || !explanation) {
        throw new Error('Missing required data');
    }
    
    // Ensure correct answer is in options
    if (!options.includes(correctAnswer)) {
        options.push(correctAnswer);
    }
    
    return {
        id: `csv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        question: questionText,
        options: options,
        correctAnswer: correctAnswer,
        explanation: explanation,
        category: category.toUpperCase(),
        difficulty: difficulty.toUpperCase(),
        tags: [],
        isActive: true,
        createdAt: new Date().toISOString()
    };
}

function convertToInterviewQuestion(row, headers, index) {
    // Find column indices
    const questionIdx = headers.findIndex(h => h.includes('question'));
    const answerIdx = headers.findIndex(h => h.includes('answer'));
    const categoryIdx = headers.findIndex(h => h.includes('category'));
    const experienceIdx = headers.findIndex(h => h.includes('experience') || h.includes('level'));
    
    if (questionIdx === -1 || answerIdx === -1) {
        throw new Error('Missing required columns');
    }
    
    // Extract data
    const questionText = row[questionIdx]?.trim();
    const answer = row[answerIdx]?.trim();
    const category = categoryIdx !== -1 ? row[categoryIdx]?.trim() : 'SECURITY_OPERATIONS';
    const experienceLevel = experienceIdx !== -1 ? row[experienceIdx]?.trim() : 'ENTRY';
    
    if (!questionText || !answer) {
        throw new Error('Missing required data');
    }
    
    return {
        id: `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        question: questionText,
        answer: answer,
        keyPoints: [],
        category: category.toUpperCase(),
        experienceLevel: experienceLevel.toUpperCase(),
        tags: [],
        isActive: true,
        createdAt: new Date().toISOString()
    };
}

// Question Modal Functions
function showQuestionModal(questionId = null) {
    const modal = document.getElementById('questionModal');
    const title = document.getElementById('modalTitle');
    
    if (questionId) {
        title.textContent = 'Edit Question';
        // Load question data for editing
        const question = currentQuestions.find(q => q.id === questionId);
        if (question) {
            populateQuestionForm(question);
        }
    } else {
        title.textContent = 'Add New Question';
        clearQuestionForm();
    }
    
    modal.classList.remove('hidden');
}

function hideQuestionModal() {
    document.getElementById('questionModal').classList.add('hidden');
    clearQuestionForm();
}

function clearQuestionForm() {
    document.getElementById('questionText').value = '';
    document.getElementById('questionCategory').value = 'SECURITY_OPERATIONS';
    document.getElementById('questionDifficulty').value = 'INTERMEDIATE';
    document.getElementById('option0').value = '';
    document.getElementById('option1').value = '';
    document.getElementById('option2').value = '';
    document.getElementById('option3').value = '';
    document.getElementById('questionExplanation').value = '';
    
    // Clear radio buttons
    const radios = document.querySelectorAll('input[name="correctAnswer"]');
    radios.forEach(radio => radio.checked = false);
}

function populateQuestionForm(question) {
    document.getElementById('questionText').value = question.question;
    document.getElementById('questionCategory').value = question.category;
    document.getElementById('questionDifficulty').value = question.difficulty;
    document.getElementById('questionExplanation').value = question.explanation;
    
    // Populate options
    question.options.forEach((option, index) => {
        const optionInput = document.getElementById(`option${index}`);
        if (optionInput) {
            optionInput.value = option;
        }
        
        // Set correct answer radio
        if (option === question.correctAnswer) {
            const radio = document.getElementById(`option${index}Radio`);
            if (radio) {
                radio.checked = true;
            }
        }
    });
}

function handleQuestionSubmit(e) {
    e.preventDefault();
    
    const questionData = {
        question: document.getElementById('questionText').value,
        category: document.getElementById('questionCategory').value,
        difficulty: document.getElementById('questionDifficulty').value,
        explanation: document.getElementById('questionExplanation').value,
        options: [
            document.getElementById('option0').value,
            document.getElementById('option1').value,
            document.getElementById('option2').value,
            document.getElementById('option3').value
        ].filter(opt => opt.trim()),
        correctAnswer: ''
    };
    
    // Find correct answer
    const correctRadio = document.querySelector('input[name="correctAnswer"]:checked');
    if (correctRadio) {
        const optionIndex = parseInt(correctRadio.value);
        questionData.correctAnswer = questionData.options[optionIndex];
    }
    
    // Validate
    if (!questionData.question || questionData.options.length < 2 || !questionData.correctAnswer || !questionData.explanation) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Create question object
    const question = {
        id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...questionData,
        tags: [],
        isActive: true,
        createdAt: new Date().toISOString()
    };
    
    // Add to array
    currentQuestions.push(question);
    
    // Save to Firebase if not in demo mode
    if (!isDemoMode) {
        saveDataToFirebase();
    }
    
    // Update UI
    renderQuestions();
    updateDashboard();
    hideQuestionModal();
    
    showNotification('Question added successfully!', 'success');
}

// Data persistence functions
async function loadDataFromFirebase() {
    if (isDemoMode || !window.firebaseServices) return;
    
    try {
        console.log('📥 Loading data from Firebase...');
        
        const { collection, getDocs } = window.firebaseServices;
        
        // Load quiz questions
        const quizSnapshot = await getDocs(collection(window.db, 'quiz_questions'));
        const quizQuestions = [];
        quizSnapshot.forEach(doc => {
            quizQuestions.push({ id: doc.id, ...doc.data() });
        });
        
        // Load interview questions
        const interviewSnapshot = await getDocs(collection(window.db, 'interview_questions'));
        const interviewQuestions = [];
        interviewSnapshot.forEach(doc => {
            interviewQuestions.push({ id: doc.id, ...doc.data() });
        });
        
        if (quizQuestions.length > 0) {
            currentQuestions = quizQuestions;
        }
        
        if (interviewQuestions.length > 0) {
            currentInterviewQuestions = interviewQuestions;
        }
        
        console.log(`✅ Loaded ${currentQuestions.length} quiz questions and ${currentInterviewQuestions.length} interview questions`);
        
        updateDashboard();
        renderQuestions();
        renderInterviewQuestions();
        
    } catch (error) {
        console.error('❌ Error loading data from Firebase:', error);
        showNotification('Error loading data from Firebase', 'error');
    }
}

async function saveDataToFirebase() {
    if (isDemoMode || !window.firebaseServices) return;
    
    try {
        console.log('💾 Saving data to Firebase...');
        
        const { collection, setDoc, doc } = window.firebaseServices;
        
        // Save quiz questions
        for (const question of currentQuestions) {
            await setDoc(doc(window.db, 'quiz_questions', question.id), question);
        }
        
        // Save interview questions
        for (const question of currentInterviewQuestions) {
            await setDoc(doc(window.db, 'interview_questions', question.id), question);
        }
        
        console.log('✅ Data saved to Firebase successfully');
        
    } catch (error) {
        console.error('❌ Error saving data to Firebase:', error);
        showNotification('Error saving data to Firebase', 'error');
    }
}

// Export functions
function exportQuestions() {
    const dataStr = JSON.stringify(currentQuestions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `quiz_questions_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Quiz questions exported successfully!', 'success');
}

function exportInterviewQuestions() {
    const dataStr = JSON.stringify(currentInterviewQuestions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `interview_questions_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Interview questions exported successfully!', 'success');
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${getNotificationClasses(type)}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

function getNotificationClasses(type) {
    switch (type) {
        case 'success':
            return 'bg-green-500 text-white';
        case 'error':
            return 'bg-red-500 text-white';
        case 'warning':
            return 'bg-yellow-500 text-black';
        default:
            return 'bg-blue-500 text-white';
    }
}

// Global functions for button clicks
window.editQuestion = function(id) {
    showQuestionModal(id);
};

window.deleteQuestion = function(id) {
    if (confirm('Are you sure you want to delete this question?')) {
        currentQuestions = currentQuestions.filter(q => q.id !== id);
        renderQuestions();
        updateDashboard();
        
        if (!isDemoMode) {
            saveDataToFirebase();
        }
        
        showNotification('Question deleted successfully!', 'success');
    }
};

window.editInterviewQuestion = function(id) {
    // Implementation for editing interview questions
    console.log('Edit interview question:', id);
};

window.deleteInterviewQuestion = function(id) {
    if (confirm('Are you sure you want to delete this interview question?')) {
        currentInterviewQuestions = currentInterviewQuestions.filter(q => q.id !== id);
        renderInterviewQuestions();
        updateDashboard();
        
        if (!isDemoMode) {
            saveDataToFirebase();
        }
        
        showNotification('Interview question deleted successfully!', 'success');
    }
};

console.log('📱 Admin Console JavaScript loaded');