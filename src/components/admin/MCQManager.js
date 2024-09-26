import React, { useState } from 'react';
import { Typography, TextField, Button, FormControlLabel, Checkbox, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const MCQManager = ({ onSubmit, initialMCQs = [] }) => {
  const [mcqs, setMcqs] = useState(initialMCQs);

  const handleInputChange = (mcqIndex, field, value, optionIndex) => {
    const updatedMCQs = [...mcqs];
    if (field === 'options') {
      updatedMCQs[mcqIndex].options[optionIndex] = value;
    } else if (field === 'correctAnswers') {
      const correctAnswers = updatedMCQs[mcqIndex].correctAnswers;
      if (correctAnswers.includes(optionIndex)) {
        correctAnswers.splice(correctAnswers.indexOf(optionIndex), 1);
      } else {
        correctAnswers.push(optionIndex);
      }
    } else {
      updatedMCQs[mcqIndex][field] = value;
    }
    setMcqs(updatedMCQs);
  };

  const addOption = (mcqIndex) => {
    const updatedMCQs = [...mcqs];
    updatedMCQs[mcqIndex].options.push('');
    setMcqs(updatedMCQs);
  };

  const removeOption = (mcqIndex, optionIndex) => {
    const updatedMCQs = [...mcqs];
    updatedMCQs[mcqIndex].options.splice(optionIndex, 1);
    updatedMCQs[mcqIndex].correctAnswers = updatedMCQs[mcqIndex].correctAnswers.filter(
      (index) => index !== optionIndex && (index > optionIndex ? index - 1 : index)
    );
    setMcqs(updatedMCQs);
  };

  const addMCQ = () => {
    setMcqs([...mcqs, { question: '', options: ['', ''], correctAnswers: [], isMultipleAnswer: false }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedMCQs = mcqs.map(mcq => ({
      question: mcq.question.trim(),
      options: mcq.options.filter(option => option.trim() !== ''),
      correctAnswers: mcq.correctAnswers.filter(index => index < mcq.options.length),
      isMultipleAnswer: mcq.isMultipleAnswer // Add this line
    })).filter(mcq => mcq.question.trim() !== '' && mcq.options.length >= 2); // Remove MCQs with empty question or less than 2 options
    onSubmit(cleanedMCQs);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>Manage MCQs</Typography>
      <form onSubmit={handleSubmit}>
        {mcqs.map((mcq, mcqIndex) => (
          <div key={mcqIndex} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <TextField
              fullWidth
              label={`Question ${mcqIndex + 1}`}
              value={mcq.question}
              onChange={(e) => handleInputChange(mcqIndex, 'question', e.target.value)}
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={mcq.isMultipleAnswer}
                  onChange={(e) => handleInputChange(mcqIndex, 'isMultipleAnswer', e.target.checked)}
                />
              }
              label="Allow multiple answers"
            />
            {mcq.options.map((option, optionIndex) => (
              <div key={optionIndex} style={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={mcq.correctAnswers.includes(optionIndex)}
                      onChange={() => handleInputChange(mcqIndex, 'correctAnswers', null, optionIndex)}
                    />
                  }
                  label={`Correct Answer`}
                />
                <TextField
                  fullWidth
                  label={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) => handleInputChange(mcqIndex, 'options', e.target.value, optionIndex)}
                  margin="normal"
                />
                <IconButton onClick={() => removeOption(mcqIndex, optionIndex)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
            <Button onClick={() => addOption(mcqIndex)} startIcon={<AddIcon />}>
              Add Option
            </Button>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', flexDirection: 'column' }}>
        <Button onClick={addMCQ} variant="outlined" startIcon={<AddIcon />} style={{ marginBottom: '20px', width: '30%' }}>
          Add New MCQ
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" style={{marginBottom: '20px', width: '30%' }}>
          Add MCQs to Hackathon
        </Button>
        </div>
      </form>
    </div>
  );
};

export default MCQManager;