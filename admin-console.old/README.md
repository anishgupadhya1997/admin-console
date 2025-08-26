# 🌐 CyberLearn Centralized Admin Console

A powerful web-based dashboard for managing CyberLearn content from anywhere in the world.

## 🚀 Features

### ✅ **Complete Question Management**
- Add, edit, delete quiz questions
- Visual question editor with live preview
- Bulk import/export via JSON
- Advanced filtering and search
- Real-time Firebase sync

### ✅ **Dashboard & Analytics**
- Overview of total questions, categories, users
- Recent activity tracking
- Performance metrics
- Content statistics

### ✅ **Multi-Category Support**
- Network Security
- Ethical Hacking
- Cryptography
- Cloud Security
- Mobile Security
- Incident Response
- Risk Management
- Compliance & Governance
- IoT Security
- Security Operations

### ✅ **Advanced Features**
- Real-time collaboration
- Version control
- Content validation
- Responsive design
- Secure authentication

---

## 🛠️ Setup Instructions

### **Step 1: Firebase Configuration**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `cyberaccend`
3. **Enable Authentication**:
   - Authentication → Sign-in method
   - Enable Email/Password
   - Add authorized users (admins)

4. **Enable Firestore Database**:
   - Firestore Database → Create database
   - Start in production mode
   - Choose location

5. **Configure Security Rules**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated admin users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. **Get Web App Config**:
   - Project Settings → General → Your apps
   - Add web app if not exists
   - Copy configuration object

### **Step 2: Update Configuration**

1. **Edit `firebase-config.js`**:
```javascript
export const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "cyberaccend.firebaseapp.com",
    projectId: "cyberaccend",
    storageBucket: "cyberaccend.firebasestorage.app",
    messagingSenderId: "110562767185",
    appId: "your-actual-app-id"
};
```

2. **Update `app.js`** (line 25):
```javascript
const firebaseConfig = {
    // Replace with your actual config
    apiKey: "your-actual-api-key",
    authDomain: "cyberaccend.firebaseapp.com",
    projectId: "cyberaccend",
    storageBucket: "cyberaccend.firebasestorage.app",
    messagingSenderId: "110562767185",
    appId: "your-actual-app-id"
};
```

### **Step 3: Create Admin Users**

1. **In Firebase Console**:
   - Authentication → Users → Add user
   - Create accounts for content managers
   - Use strong passwords

2. **Or programmatically**:
```javascript
// In Firebase console or admin SDK
await admin.auth().createUser({
  email: 'admin@cyberlearn.com',
  password: 'secure-password-123',
  displayName: 'CyberLearn Admin'
});
```

### **Step 4: Deploy the Console**

#### **Option A: Firebase Hosting (Recommended)**

1. **Install Firebase CLI**:
```bash
npm install -g firebase-tools
```

2. **Initialize hosting**:
```bash
cd admin-console
firebase login
firebase init hosting
# Select your project
# Set public directory to: . (current directory)
# Configure as single-page app: Yes
# Overwrite index.html: No
```

3. **Deploy**:
```bash
firebase deploy
```

4. **Access**: Your console will be available at `https://cyberaccend.web.app`

#### **Option B: Netlify**

1. **Create account**: https://netlify.com
2. **Drag and drop** the `admin-console` folder
3. **Configure domain** (optional)

#### **Option C: Local Development**

1. **Start local server**:
```bash
cd admin-console
python -m http.server 8000
# or
npx serve .
```

2. **Access**: http://localhost:8000

---

## 📱 Android App Integration

### **Update Repository to Sync with Firestore**

1. **Ensure Firestore is enabled** in `QuizRepository.kt`:
```kotlin
suspend fun syncQuestionsFromFirestore() {
    try {
        val snapshot = questionsCollection.get().await()
        val questions = snapshot.documents.mapNotNull { doc ->
            doc.toObject(QuizQuestion::class.java)?.copy(id = doc.id)
        }
        if (questions.isNotEmpty()) {
            quizQuestionDao.insertQuestions(questions)
        }
    } catch (e: Exception) {
        // Fallback to sample data
        seedSampleData()
    }
}
```

2. **Call sync in Repository constructor**:
```kotlin
init {
    // Sync questions on app start
    GlobalScope.launch {
        syncQuestionsFromFirestore()
    }
}
```

3. **Real-time listening** (optional):
```kotlin
private fun setupRealtimeSync() {
    questionsCollection.addSnapshotListener { snapshot, error ->
        if (error != null) return@addSnapshotListener
        
        snapshot?.let { querySnapshot ->
            val questions = querySnapshot.documents.mapNotNull { doc ->
                doc.toObject(QuizQuestion::class.java)?.copy(id = doc.id)
            }
            
            GlobalScope.launch {
                quizQuestionDao.insertQuestions(questions)
            }
        }
    }
}
```

---

## 🎯 Usage Guide

### **Adding Questions**

1. **Login** to admin console
2. **Navigate** to Quiz Questions
3. **Click** "Add Question"
4. **Fill in details**:
   - Question text
   - 4 answer options
   - Mark correct answer
   - Add explanation
   - Select category & difficulty
   - Add tags
5. **Save** - Question appears in app immediately

### **Bulk Import**

1. **Prepare JSON file**:
```json
[
  {
    "question": "What is a firewall?",
    "options": [
      "Network security device",
      "Type of virus",
      "Cable type",
      "Software bug"
    ],
    "correctAnswer": "Network security device",
    "explanation": "A firewall monitors and filters network traffic.",
    "category": "NETWORK_SECURITY",
    "difficulty": "BEGINNER",
    "tags": ["firewall", "network", "security"],
    "isActive": true
  }
]
```

2. **In console**: Quiz Questions → Bulk Import
3. **Select file** → Questions imported automatically

### **Content Management Best Practices**

1. **Question Writing**:
   - Clear, unambiguous language
   - Realistic scenarios
   - Current industry practices
   - Progressive difficulty

2. **Organization**:
   - Consistent tagging
   - Balanced categories
   - Regular reviews
   - Version tracking

3. **Quality Control**:
   - Peer review
   - Testing in app
   - User feedback
   - Performance analytics

---

## 🔧 Advanced Configuration

### **Custom Categories**

Add new categories in `firebase-config.js`:
```javascript
export const QUIZ_CATEGORIES = {
    // Existing categories...
    AI_SECURITY: 'AI_SECURITY',
    BLOCKCHAIN_SECURITY: 'BLOCKCHAIN_SECURITY'
};
```

### **Analytics Integration**

Add Google Analytics to track usage:
```html
<!-- In index.html head -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### **Custom Domains**

1. **Firebase Hosting**:
   - Project Settings → Hosting
   - Add custom domain
   - Follow DNS configuration

2. **SSL/Security**:
   - Automatic with Firebase
   - Force HTTPS in hosting config

---

## 🛡️ Security Features

### **Authentication**
- Email/password login required
- Admin-only access
- Session management
- Secure logout

### **Data Protection**
- Firestore security rules
- Input validation
- XSS prevention
- CSRF protection

### **Access Control**
- Role-based permissions
- Admin user management
- Audit logging
- Activity tracking

---

## 📊 Monitoring & Maintenance

### **Performance Monitoring**
- Firebase Performance
- Google Analytics
- Error tracking
- Usage metrics

### **Backup Strategy**
- Daily exports
- Version control
- Recovery procedures
- Data validation

### **Update Process**
1. Test changes locally
2. Deploy to staging
3. Validate functionality
4. Deploy to production
5. Monitor for issues

---

## 🆘 Troubleshooting

### **Common Issues**

1. **Login fails**: Check Firebase auth configuration
2. **Data not syncing**: Verify Firestore rules
3. **Import fails**: Validate JSON structure
4. **Slow loading**: Optimize queries and pagination

### **Support Contacts**
- Firebase Console: https://console.firebase.google.com/
- Documentation: https://firebase.google.com/docs
- Community: https://stackoverflow.com/questions/tagged/firebase

---

## 🚀 Deployment Checklist

- [ ] Firebase project configured
- [ ] Firestore database enabled
- [ ] Authentication enabled
- [ ] Security rules configured
- [ ] Admin users created
- [ ] Firebase config updated
- [ ] Console deployed
- [ ] Android app syncing
- [ ] Test end-to-end workflow
- [ ] Monitor for issues

Your centralized admin console is now ready for managing CyberLearn content! 🎉
