// Dynamic API endpoint for CyberLearn questions
// This serves questions in real-time from the current data

// Function to get current questions data
function getCurrentQuestionsData() {
    // Get data from the main app if available
    if (window.currentQuestions && window.currentInterviewQuestions && window.currentFlashcardDecks && window.currentFlashcards) {
        return {
            quiz_questions: window.currentQuestions,
            interview_questions: window.currentInterviewQuestions,
            flashcard_decks: window.currentFlashcardDecks,
            flashcards: window.currentFlashcards,
            last_updated: new Date().toISOString(),
            total_quiz_questions: window.currentQuestions.length,
            total_interview_questions: window.currentInterviewQuestions.length,
            total_flashcard_decks: window.currentFlashcardDecks.length,
            total_flashcards: window.currentFlashcards.length
        };
    }
    
    // Fallback to sample data
    return {
        quiz_questions: [
            {
                "id": "demo_1",
                "question": "What is the primary function of a SIEM system?",
                "options": [
                    "To collect, analyze, and correlate security events from multiple sources",
                    "To encrypt network traffic",
                    "To perform vulnerability scans",
                    "To create network firewalls"
                ],
                "correctAnswer": "To collect, analyze, and correlate security events from multiple sources",
                "explanation": "SIEM systems are essential in Security Operations Centers (SOCs) for centralizing log data, detecting threats, and providing real-time analysis of security alerts.",
                "category": "SECURITY_OPERATIONS",
                "difficulty": "INTERMEDIATE",
                "tags": ["siem", "soc", "monitoring", "correlation"],
                "isActive": true
            }
        ],
        interview_questions: [
            {
                "id": "interview_1",
                "question": "What are the key responsibilities of a SOC analyst and how do you prioritize security alerts?",
                "answer": "A SOC analyst is responsible for monitoring security events, investigating alerts, and responding to incidents. Key responsibilities include: 1) Continuous monitoring of SIEM dashboards and security tools, 2) Analyzing and triaging security alerts based on severity and impact, 3) Conducting initial incident response and escalation procedures, 4) Documenting findings and maintaining incident records, 5) Threat hunting and proactive security monitoring. Alert prioritization follows a risk-based approach considering factors like asset criticality, threat severity, business impact, and regulatory requirements. Critical alerts affecting core business systems take precedence over low-severity alerts on non-critical assets.",
                "category": "SECURITY_OPERATIONS",
                "difficulty": "BEGINNER",
                "questionType": "SECURITY_OPERATIONS",
                "tags": ["soc", "monitoring", "incident response", "alert triage"],
                "isActive": true
            }
        ],
        flashcard_decks: [
            {
                "id": "deck_1",
                "name": "Network Security Fundamentals",
                "description": "Essential concepts and terminology in network security",
                "category": "NETWORK_SECURITY",
                "difficulty": "BEGINNER",
                "color": "#2196F3",
                "tags": ["network", "firewall", "security", "basics"],
                "estimatedStudyTime": 30,
                "createdAt": new Date().toISOString(),
                "updatedAt": new Date().toISOString()
            }
        ],
        flashcards: [
            {
                "id": "card_1",
                "deckId": "deck_1",
                "front": "What is a firewall?",
                "back": "A network security device that monitors and controls incoming and outgoing network traffic based on predetermined security rules.",
                "explanation": "Firewalls act as a barrier between trusted internal networks and untrusted external networks, filtering traffic to prevent unauthorized access.",
                "category": "NETWORK_SECURITY",
                "difficulty": "BEGINNER",
                "tags": ["firewall", "network", "security", "traffic"],
                "createdAt": new Date().toISOString(),
                "updatedAt": new Date().toISOString()
            }
        ],
        "last_updated": new Date().toISOString(),
        "total_quiz_questions": 1,
        "total_interview_questions": 1,
        "total_flashcard_decks": 1,
        "total_flashcards": 1
    };
}

// Function to serve questions as JSON
function serveQuestions() {
    const data = getCurrentQuestionsData();
    return JSON.stringify(data, null, 2);
}

// Make functions globally available
window.getCurrentQuestionsData = getCurrentQuestionsData;
window.serveQuestions = serveQuestions;

// Auto-update the API data every 5 seconds
setInterval(() => {
    if (window.updateApiEndpoint) {
        window.updateApiEndpoint();
    }
}, 5000);

console.log('📡 Dynamic API endpoint loaded');
