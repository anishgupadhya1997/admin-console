# CSV Upload Guide for CyberLearn Admin Console

## Overview
The CSV upload feature allows you to bulk import quiz questions into the CyberLearn system. This guide explains the correct CSV format and how to use the upload functionality.

## Fixed Issues
The following issues have been resolved in the latest version:

1. **Line splitting bug**: Fixed `split('\\n')` to `split(/\r?\n/)` to handle different line endings
2. **CSV parsing**: Improved `parseCsvRow()` function to properly handle quoted fields and escaped quotes
3. **Preview display**: Fixed preview text joining to use proper line breaks
4. **Error handling**: Added comprehensive error handling and validation
5. **Button states**: Fixed upload button text and disabled states

## Correct CSV Format

### Required Headers
Your CSV file must have these exact headers (case-insensitive):
```
question,option1,option2,option3,option4,correctAnswer,explanation,category,difficulty,tags
```

### Column Descriptions

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| `question` | Yes | The quiz question text | "What is the primary function of a SIEM system?" |
| `option1` | Yes | First answer option | "Collect and analyze security events" |
| `option2` | Yes | Second answer option | "Encrypt network traffic" |
| `option3` | No | Third answer option | "Perform vulnerability scans" |
| `option4` | No | Fourth answer option | "Create firewalls" |
| `correctAnswer` | Yes | The correct answer (must match one of the options) | "Collect and analyze security events" |
| `explanation` | Yes | Explanation of the correct answer | "SIEM systems centralize security monitoring and analysis" |
| `category` | No | Question category (defaults to SECURITY_OPERATIONS) | "SECURITY_OPERATIONS" |
| `difficulty` | No | Difficulty level (defaults to BEGINNER) | "INTERMEDIATE" |
| `tags` | No | Comma-separated tags | "siem,soc,monitoring" |

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

## Sample CSV Content

```csv
question,option1,option2,option3,option4,correctAnswer,explanation,category,difficulty,tags
"What is the primary function of a SIEM system?","Collect and analyze security events","Encrypt network traffic","Perform vulnerability scans","Create firewalls","Collect and analyze security events","SIEM systems centralize security monitoring and analysis","SECURITY_OPERATIONS","INTERMEDIATE","siem,soc,monitoring"
"What defines the shared responsibility model in cloud security?","Security responsibilities between provider and customer","Cost sharing agreements","Data sharing between organizations","Network bandwidth allocation","Security responsibilities between provider and customer","Model divides security duties between cloud provider and customer","CLOUD_SECURITY","INTERMEDIATE","cloud,shared responsibility,aws"
"What is the purpose of network segmentation?","Isolate traffic and limit attack spread","Increase network speed","Reduce hardware costs","Simplify management","Isolate traffic and limit attack spread","Segmentation prevents lateral movement and contains breaches","NETWORK_SECURITY","INTERMEDIATE","segmentation,isolation,vlans"
```

## How to Use

1. **Access the Upload Feature**:
   - Navigate to the "Quiz Questions" section
   - Click the "Bulk Import" button

2. **Download Template** (Optional):
   - Click "Download Template" to get a properly formatted CSV template
   - Use this as a starting point for your questions

3. **Upload Your CSV**:
   - Click "Choose File" and select your CSV file
   - The system will automatically validate and preview your data
   - Review the validation results
   - Click "Upload Questions" to import

4. **Review Results**:
   - Check the notification for import status
   - View imported questions in the questions table

## Validation Rules

The system validates your CSV data and will show errors for:

- **Missing required fields**: question, option1, option2, correctAnswer, explanation
- **Insufficient options**: At least 2 options are required
- **Invalid categories**: Must be one of the valid categories listed above
- **Invalid difficulty levels**: Must be one of the valid difficulty levels listed above
- **Empty rows**: Rows with no data are ignored

## Troubleshooting

### Common Issues

1. **"No file selected"**: Make sure you've selected a .csv file
2. **"Missing required column"**: Check that your headers match exactly (case-insensitive)
3. **"Row X: Question is required"**: Ensure all required fields have values
4. **"Row X: Need at least 2 options"**: Provide at least option1 and option2
5. **"Unknown category"**: Use one of the valid categories listed above

### File Format Issues

- **Encoding**: Use UTF-8 encoding for special characters
- **Line endings**: The system handles both Windows (\r\n) and Unix (\n) line endings
- **Quotes**: Use double quotes around fields containing commas or quotes
- **Escaped quotes**: Use double quotes to escape quotes within fields (e.g., `"He said ""Hello"" to me"`)

### Browser Compatibility

The CSV upload feature works in all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Technical Details

### Question Object Structure
Each imported question is converted to this format:

```javascript
{
    id: 'csv_' + timestamp + '_' + randomString,
    question: 'Question text',
    options: ['option1', 'option2', 'option3', 'option4'],
    correctAnswer: 'correct option',
    explanation: 'explanation text',
    category: 'CATEGORY_NAME',
    difficulty: 'DIFFICULTY_LEVEL',
    tags: ['tag1', 'tag2', 'tag3'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
}
```

### Import Process
1. File is read as text
2. CSV is parsed line by line
3. Headers are validated
4. Data rows are parsed and validated
5. Questions are created and added to the current questions array
6. UI is updated to show new questions

## Support

If you encounter issues with CSV upload:
1. Check the browser console for detailed error messages
2. Verify your CSV format matches the template
3. Ensure all required fields are filled
4. Try with a smaller file first to test the format
