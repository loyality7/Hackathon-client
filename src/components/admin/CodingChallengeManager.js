import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, IconButton, FormControlLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const languages = ['C', 'C++', 'Python', 'Java', 'JavaScript'];

const CodingChallengeManager = ({ onSubmit, onCancel, initialChallenge = null }) => {
  const [challenge, setChallenge] = useState(initialChallenge || {
    name: '',
    constraints: '',
    languages: [],
    problemStatement: '',
    languageImplementations: {},
    testCases: [],
    proctoring: false,
  });

  useEffect(() => {
    const newImplementations = {};
    challenge.languages.forEach(lang => {
      newImplementations[lang] = {
        invisibleCode: '',
        visibleCode: '',
      };
    });
    setChallenge(prev => ({
      ...prev,
      languageImplementations: {
        ...prev.languageImplementations,
        ...newImplementations
      }
    }));
  }, [challenge.languages]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChallenge({ ...challenge, [name]: type === 'checkbox' ? checked : value });
  };

  const handleLanguageChange = (event) => {
    setChallenge({ ...challenge, languages: event.target.value });
  };

  const handleCodeChange = (language, codeType, value) => {
    setChallenge(prev => ({
      ...prev,
      languageImplementations: {
        ...prev.languageImplementations,
        [language]: {
          ...prev.languageImplementations[language],
          [codeType]: value
        }
      }
    }));
  };

  const handleAddTestCase = () => {
    setChallenge(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '', isVisible: true }]
    }));
  };

  const handleTestCaseVisibilityToggle = (index) => {
    setChallenge(prev => ({
      ...prev,
      testCases: prev.testCases.map((testCase, i) => 
        i === index ? { ...testCase, isVisible: !testCase.isVisible } : testCase
      )
    }));
  };

  const handleTestCaseChange = (index, field, value) => {
    setChallenge(prev => ({
      ...prev,
      testCases: prev.testCases.map((testCase, i) => 
        i === index ? { ...testCase, [field]: value } : testCase
      )
    }));
  };

  const handleRemoveTestCase = (index) => {
    setChallenge(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation for required fields
    if (!challenge.name || !challenge.constraints || !challenge.problemStatement || challenge.languages.length === 0) {
      alert('Please fill in all required fields (Name, Constraints, Problem Statement, and select at least one Language)');
      return;
    }
    onSubmit(challenge);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>Manage Coding Challenge</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          required // Add required prop
          name="name"
          label="Challenge Name"
          value={challenge.name}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          required // Add required prop
          name="constraints"
          label="Constraints"
          value={challenge.constraints}
          onChange={handleInputChange}
          margin="normal"
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Languages</InputLabel>
          <Select
            multiple
            name="languages"
            value={challenge.languages}
            onChange={handleLanguageChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {languages.map((lang) => (
              <MenuItem key={lang} value={lang}>
                <Checkbox checked={challenge.languages.indexOf(lang) > -1} />
                <ListItemText primary={lang} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          required // Add required prop
          name="problemStatement"
          label="Problem Statement"
          multiline
          rows={4}
          value={challenge.problemStatement}
          onChange={handleInputChange}
          margin="normal"
        />
        
        {challenge.languages.map(lang => (
          <div key={lang}>
            <Typography variant="h6">{lang}</Typography>
            <TextField
              fullWidth
              label={`Invisible Code (${lang})`}
              multiline
              rows={4}
              value={challenge.languageImplementations[lang]?.invisibleCode || ''}
              onChange={(e) => handleCodeChange(lang, 'invisibleCode', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label={`Visible Code (${lang})`}
              multiline
              rows={4}
              value={challenge.languageImplementations[lang]?.visibleCode || ''}
              onChange={(e) => handleCodeChange(lang, 'visibleCode', e.target.value)}
              margin="normal"
            />
          </div>
        ))}
        
        <Typography variant="h6" gutterBottom>Test Cases</Typography>
        {challenge.testCases.map((testCase, index) => (
          <div key={index}>
            <TextField
              fullWidth
              label={`Test Case ${index + 1} Input`}
              multiline
              rows={2}
              value={testCase.input}
              onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label={`Test Case ${index + 1} Expected Output`}
              multiline
              rows={2}
              value={testCase.expectedOutput}
              onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
              margin="normal"
            />
            <IconButton onClick={() => handleTestCaseVisibilityToggle(index)}>
              {testCase.isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
            <IconButton onClick={() => handleRemoveTestCase(index)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
        <Button onClick={handleAddTestCase} variant="outlined" color="primary">
          Add Test Case
        </Button>
        
        <FormControlLabel
          control={
            <Checkbox
              checked={challenge.proctoring}
              onChange={handleInputChange}
              name="proctoring"
              color="primary"
            />
          }
          label="Proctoring"
        />
        
        <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>
          Add Challenge
        </Button>
        <Button variant="contained" color="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </form>
    </div>
  );
};

export default CodingChallengeManager;
