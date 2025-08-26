// Dynamic Flashcard API endpoint
// This serves flashcard data in real-time from the current admin console data

// Function to get current flashcard data
function getCurrentFlashcardData() {
    // Get data from the main app if available
    if (window.currentFlashcardDecks && window.currentFlashcards) {
        return {
            flashcard_decks: window.currentFlashcardDecks,
            flashcards: window.currentFlashcards,
            last_updated: new Date().toISOString(),
            total_flashcard_decks: window.currentFlashcardDecks.length,
            total_flashcards: window.currentFlashcards.length
        };
    }
    
    // Fallback to sample data if main app data not available
    return {
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
            },
            {
                "id": "deck_2",
                "name": "Cryptography Essentials",
                "description": "Core cryptographic principles and algorithms",
                "category": "CRYPTOGRAPHY",
                "difficulty": "INTERMEDIATE",
                "color": "#9C27B0",
                "tags": ["crypto", "encryption", "hashing", "algorithms"],
                "estimatedStudyTime": 45,
                "createdAt": new Date().toISOString(),
                "updatedAt": new Date().toISOString()
            },
            {
                "id": "deck_3",
                "name": "Incident Response Procedures",
                "description": "Step-by-step incident response and forensics",
                "category": "INCIDENT_RESPONSE",
                "difficulty": "ADVANCED",
                "color": "#F44336",
                "tags": ["incident", "response", "forensics", "procedures"],
                "estimatedStudyTime": 60,
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
            },
            {
                "id": "card_2",
                "deckId": "deck_1",
                "front": "What is the difference between a stateful and stateless firewall?",
                "back": "Stateful firewalls track connection states and make decisions based on context, while stateless firewalls examine each packet independently without context.",
                "explanation": "Stateful inspection provides better security by understanding the state of network connections, while stateless filtering is faster but less secure.",
                "category": "NETWORK_SECURITY",
                "difficulty": "INTERMEDIATE",
                "tags": ["firewall", "stateful", "stateless", "connection"],
                "createdAt": new Date().toISOString(),
                "updatedAt": new Date().toISOString()
            },
            {
                "id": "card_3",
                "deckId": "deck_2",
                "front": "What is symmetric encryption?",
                "back": "A type of encryption where the same key is used for both encryption and decryption of data.",
                "explanation": "Symmetric encryption is fast and efficient for large amounts of data but requires secure key distribution. Examples include AES, DES, and 3DES.",
                "category": "CRYPTOGRAPHY",
                "difficulty": "BEGINNER",
                "tags": ["symmetric", "encryption", "key", "aes"],
                "createdAt": new Date().toISOString(),
                "updatedAt": new Date().toISOString()
            },
            {
                "id": "card_4",
                "deckId": "deck_2",
                "front": "What is a hash function?",
                "back": "A mathematical function that converts input data of any size into a fixed-size string of characters, typically used for data integrity verification.",
                "explanation": "Hash functions are one-way functions that produce unique fingerprints for data. Common examples include MD5, SHA-1, and SHA-256.",
                "category": "CRYPTOGRAPHY",
                "difficulty": "BEGINNER",
                "tags": ["hash", "function", "integrity", "sha"],
                "createdAt": new Date().toISOString(),
                "updatedAt": new Date().toISOString()
            },
            {
                "id": "card_5",
                "deckId": "deck_3",
                "front": "What are the phases of incident response?",
                "back": "1. Preparation, 2. Identification, 3. Containment, 4. Eradication, 5. Recovery, 6. Lessons Learned",
                "explanation": "The NIST incident response lifecycle provides a structured approach to handling security incidents effectively and minimizing damage.",
                "category": "INCIDENT_RESPONSE",
                "difficulty": "INTERMEDIATE",
                "tags": ["incident", "response", "phases", "nist"],
                "createdAt": new Date().toISOString(),
                "updatedAt": new Date().toISOString()
            }
        ],
        last_updated: new Date().toISOString(),
        total_flashcard_decks: 3,
        total_flashcards: 5
    };
}

// Function to serve flashcards as JSON
function serveFlashcards() {
    const data = getCurrentFlashcardData();
    return JSON.stringify(data, null, 2);
}

// Make functions globally available
window.getCurrentFlashcardData = getCurrentFlashcardData;
window.serveFlashcards = serveFlashcards;

// Auto-update the API data every 5 seconds
setInterval(() => {
    if (window.updateApiEndpoint) {
        window.updateApiEndpoint();
    }
}, 5000);

console.log('🗂️ Dynamic Flashcard API endpoint loaded');
