# CyberLearn Admin Console

A comprehensive Firebase-based admin console for managing cybersecurity quiz and interview questions with CSV upload functionality.

## Features

### ✅ **Complete Question Management**
- Add, edit, delete quiz questions
- Manage interview Q&A pairs
- Visual question editor with live preview
- Advanced filtering and search
- Real-time Firebase sync

### ✅ **CSV Upload Functionality**
- Bulk import quiz and interview questions from CSV files
- Smart validation with error/warning messages
- Preview function before import
- Template download for correct format
- Automatic data conversion and validation

### ✅ **Dashboard & Analytics**
- Overview of total questions, categories, and active questions
- Real-time statistics
- Content management metrics

### ✅ **Multi-Category Support**
- Security Operations (SOC)
- Cloud Security
- Network Security
- Penetration Testing
- Cryptography
- Malware Analysis

## CSV Upload Guide

### Quiz Questions CSV Format

**Required Headers:**
```csv
question,option1,option2,option3,option4,correctAnswer,explanation,category,difficulty,tags
```

**Sample Row:**
```csv
"What is the primary function of a SIEM system?","Collect and analyze security events","Encrypt network traffic","Perform vulnerability scans","Create firewalls","Collect and analyze security events","SIEM systems centralize security monitoring and analysis","SECURITY_OPERATIONS","INTERMEDIATE","siem,soc,monitoring"
```

### Interview Questions CSV Format

**Required Headers:**
```csv
question,answer,category,experienceLevel,tags
```

**Sample Row:**
```csv
"What are the key responsibilities of a SOC analyst?","A SOC analyst monitors security events, investigates alerts, responds to incidents...","SECURITY_OPERATIONS","ENTRY","soc,monitoring,incident response"
```

### Valid Categories
- `SECURITY_OPERATIONS`
- `CLOUD_SECURITY`
- `NETWORK_SECURITY`
- `PENETRATION_TESTING`
- `CRYPTOGRAPHY`
- `MALWARE_ANALYSIS`

### Valid Difficulty Levels
- `BEGINNER`
- `INTERMEDIATE`
- `ADVANCED`

### Valid Experience Levels (Interview Questions)
- `ENTRY`
- `INTERMEDIATE`
- `SENIOR`
- `ADVANCED`

## How to Use CSV Upload

1. **Download Template**: Click "Download Template" to get a properly formatted CSV file
2. **Prepare Your Data**: Fill in your questions using the template format
3. **Select Question Type**: Choose "Quiz Questions" or "Interview Questions"
4. **Upload CSV**: Select your CSV file and click "Choose File"
5. **Review Preview**: Check the first 3 rows to ensure proper formatting
6. **Validate Data**: Review validation results for any errors or warnings
7. **Upload**: Click "Upload Questions" to import your data

## Firebase Setup

1. **Create Firebase Project**: Go to [Firebase Console](https://console.firebase.google.com/)
2. **Enable Authentication**: Enable Email/Password authentication
3. **Enable Firestore**: Create a Firestore database
4. **Update Config**: Replace the Firebase config in `firebase-config.js`
5. **Create Admin User**: Add admin users in Firebase Authentication

## Local Development

1. **Clone Repository**
2. **Open `index.html`** in a web browser
3. **Login Options**:
   - Use Firebase credentials for real data persistence
   - Click "Continue in Demo Mode" for local testing

## Demo Mode vs Firebase Mode

### Demo Mode
- **Login**: Click "Continue in Demo Mode"
- **Data Storage**: Browser memory only
- **Persistence**: Data lost on refresh
- **Use Case**: Testing and development

### Firebase Mode
- **Login**: Use Firebase user credentials
- **Data Storage**: Firestore database
- **Persistence**: Data survives browser refresh/logout
- **Use Case**: Production use with team collaboration

## CSV Validation Features

- **Missing Columns**: Error - won't import
- **Empty Required Fields**: Error - won't import
- **Invalid Categories**: Warning - defaults to SECURITY_OPERATIONS
- **Invalid Difficulty**: Warning - defaults to INTERMEDIATE
- **Correct Answer Not in Options**: Auto-adds to options
- **Extra Columns**: Warning - ignored

## Troubleshooting

### CSV Upload Issues
1. **Check File Format**: Ensure CSV uses proper comma separation
2. **Verify Headers**: Headers must match required format exactly
3. **Check Encoding**: Use UTF-8 encoding for special characters
4. **Review Validation**: Fix all errors before uploading

### Login Issues
1. **Firebase Mode**: Ensure Email/Password is enabled in Firebase Console
2. **Demo Mode**: Click "Continue in Demo Mode" for local testing
3. **Clear Cache**: Clear browser cache if experiencing issues

### Data Not Saving
1. **Check Firebase Connection**: Verify Firebase config is correct
2. **Authentication**: Ensure user is properly authenticated
3. **Firestore Rules**: Verify database security rules allow write access

## File Structure

```
admin-console/
├── index.html              # Main application HTML
├── app.js                  # Application logic and CSV processing
├── firebase-config.js      # Firebase configuration
├── sample_quiz_questions.csv      # Sample quiz questions template
├── sample_interview_questions.csv # Sample interview questions template
└── README.md              # This file
```

## Sample Files Included

- `sample_quiz_questions.csv`: Template with 7 sample quiz questions
- `sample_interview_questions.csv`: Template with 6 sample interview questions

Use these files to test the CSV upload functionality and as templates for your own questions.

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify CSV format matches the templates
3. Ensure Firebase configuration is correct
4. Test with sample CSV files first

## License

This project is open source and available under the MIT License.