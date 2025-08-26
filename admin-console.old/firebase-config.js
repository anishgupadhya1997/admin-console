// Firebase Configuration for CyberLearn Admin Console
// Replace these values with your actual Firebase project configuration

export const firebaseConfig = {
    // Your Firebase project configuration
    // Get this from: Firebase Console > Project Settings > General > Your apps > Web app
    
    apiKey: "your-api-key-here",
    authDomain: "cyberaccend.firebaseapp.com",
    projectId: "cyberaccend",
    storageBucket: "cyberaccend.firebasestorage.app",
    messagingSenderId: "110562767185",
    appId: "1:110562767185:android:94f2e0ab421a369ba3a370"
};

// Firestore Collections Structure
export const COLLECTIONS = {
    QUIZ_QUESTIONS: 'quizQuestions',
    INTERVIEW_QUESTIONS: 'interviewQuestions',
    FLASHCARDS: 'flashcards',
    USERS: 'users',
    USER_PROGRESS: 'userProgress',
    ANALYTICS: 'analytics'
};

// Categories and Difficulties
export const QUIZ_CATEGORIES = {
    NETWORK_SECURITY: 'NETWORK_SECURITY',
    ETHICAL_HACKING: 'ETHICAL_HACKING',
    INCIDENT_RESPONSE: 'INCIDENT_RESPONSE',
    RISK_MANAGEMENT: 'RISK_MANAGEMENT',
    COMPLIANCE_GOVERNANCE: 'COMPLIANCE_GOVERNANCE',
    CRYPTOGRAPHY: 'CRYPTOGRAPHY',
    CLOUD_SECURITY: 'CLOUD_SECURITY',
    MOBILE_SECURITY: 'MOBILE_SECURITY',
    IOT_SECURITY: 'IOT_SECURITY',
    SECURITY_OPERATIONS: 'SECURITY_OPERATIONS'
};

export const QUIZ_DIFFICULTIES = {
    BEGINNER: 'BEGINNER',
    INTERMEDIATE: 'INTERMEDIATE',
    ADVANCED: 'ADVANCED'
};

// Data validation schemas
export const QUESTION_SCHEMA = {
    id: 'string',
    question: 'string',
    options: 'array',
    correctAnswer: 'string',
    explanation: 'string',
    category: 'string',
    difficulty: 'string',
    tags: 'array',
    isActive: 'boolean',
    createdAt: 'timestamp',
    updatedAt: 'timestamp'
};

// Helper functions
export function validateQuestion(question) {
    const errors = [];
    
    if (!question.question || question.question.trim().length < 10) {
        errors.push('Question must be at least 10 characters long');
    }
    
    if (!question.options || question.options.length < 2) {
        errors.push('Question must have at least 2 options');
    }
    
    if (!question.correctAnswer || !question.options.includes(question.correctAnswer)) {
        errors.push('Correct answer must be one of the provided options');
    }
    
    if (!question.explanation || question.explanation.trim().length < 20) {
        errors.push('Explanation must be at least 20 characters long');
    }
    
    if (!Object.values(QUIZ_CATEGORIES).includes(question.category)) {
        errors.push('Invalid category');
    }
    
    if (!Object.values(QUIZ_DIFFICULTIES).includes(question.difficulty)) {
        errors.push('Invalid difficulty');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

export function generateQuestionId(category) {
    const categoryPrefix = category.toLowerCase().substring(0, 4);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 5);
    return `${categoryPrefix}_${timestamp}_${random}`;
}
