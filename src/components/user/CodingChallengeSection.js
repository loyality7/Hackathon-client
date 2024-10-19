 import React, { useState, useEffect, useRef } from 'react';
import { Typography, Button, Select, MenuItem, Paper, Box, IconButton, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import AceEditor from 'react-ace';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Proctoring from './Proctoring';

import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-csharp';

import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';

const CodingChallengeSection = ({ hackathonId, challenges, onAllChallengesCompleted }) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [testResults, setTestResults] = useState([]);
  const editorRef = useRef(null);
  const [showTestResults, setShowTestResults] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const alertCountRef = useRef(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [isExecuting, setIsExecuting] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (challenges && challenges.length > 0) {
      setChallenge(challenges[currentChallengeIndex]);
      console.log('Current challenge:', challenges[currentChallengeIndex]);
    }
  }, [challenges, currentChallengeIndex]);

  useEffect(() => {
    if (challenge) {
      setSelectedLanguage('');
      setUserCode('');
    }
  }, [challenge]);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    setUserCode(challenge.languageImplementations[newLanguage]?.visibleCode || '');
  };

  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
  };

  const executeCode = async (action) => {
    setShowTestResults(true);
    setIsExecuting(true);
    // Reset test results before running new tests
    setTestResults([]);
    try {
      const newTestResults = [];
      const testCasesToRun = action === 'running' ? [challenge.testCases[0]] : challenge.testCases;
      let challengeScore = 0;

      for (let i = 0; i < testCasesToRun.length; i++) {
        const testCase = testCasesToRun[i];
        
        const payload = {
          language: selectedLanguage.toLowerCase(),
          code: userCode,
          input: testCase.input
        };

        console.log('Request Payload:', payload);

        try {
          const response = await axios.post('/api/users/test-judge0', payload);
          console.log('Response Data:', response.data);

          const result = {
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: response.data.stdout || '',
            passed: (response.data.stdout || '').trim() === (testCase.expectedOutput || '').trim(),
            time: response.data.time,
            memory: response.data.memory,
            status: 'completed'
          };
          newTestResults.push(result);
        } catch (error) {
          console.error('Error executing test case:', error);
          const errorMessage = error.response?.data?.message || error.message || 'An error occurred while executing the code.';
          newTestResults.push({
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: errorMessage,
            passed: false,
            time: 'N/A',
            memory: 'N/A',
            status: 'error'
          });
        }

        // Update test results one by one
        setTestResults(prevResults => [...prevResults, newTestResults[newTestResults.length - 1]]);

        if (newTestResults[newTestResults.length - 1].passed) {
          challengeScore += 1;
        }
      }

      if (challengeScore === challenge.testCases.length) {
        challengeScore += 2; // Bonus points for passing all test cases
      }

      setScore(prevScore => prevScore + challengeScore);

      return newTestResults;
    } catch (error) {
      console.error('Error executing code:', error);
      console.error('Error details:', error.response?.data);
      let errorMessage = 'An error occurred while executing the code.';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
        if (error.response.data.details && error.response.data.details.error) {
          errorMessage += '\n' + error.response.data.details.error;
        }
      }
      setTestResults([{
        input: 'N/A',
        expectedOutput: 'N/A',
        actualOutput: errorMessage,
        passed: false,
        status: 'error'
      }]);
      throw error;
      toast.error('An error occurred while executing the code. Please try again later.');
      return [];
    } finally {
      setIsExecuting(false);
    }
  };

  const toggleTestResults = () => {
    setShowTestResults(!showTestResults);
  };

  const handleSubmit = async () => {
    try {
      setIsExecuting(true);
      const results = await executeCode('submitting');

      const allTestsPassed = results.every(result => result.passed);

      const submissionData = {
        code: userCode,
        language: selectedLanguage,
        testResults: results,
        passed: allTestsPassed,
        score: score
      };

      const response = await axios.post(`/api/hackathons/${hackathonId}/submit-coding-challenge`, submissionData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Submission successful!');

      if (!allTestsPassed) {
        toast.info('Note: Not all test cases passed. Your submission has been recorded.');
      }

    } catch (error) {
      console.error('Error submitting coding challenge:', error);
      toast.error('Error submitting coding challenge: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsExecuting(false);
    }
  };

  const handleRun = () => {
    executeCode('running');
  };

  const handleNextChallenge = () => {
    console.log('Next button clicked');
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(prev => {
        console.log('Moving to challenge:', prev + 1);
        return prev + 1;
      });
      setUserCode('');
      setTestResults([]);
    }
  };

  const handlePreviousChallenge = () => {
    console.log('Previous button clicked');
    if (currentChallengeIndex > 0) {
      setCurrentChallengeIndex(prev => {
        console.log('Moving to challenge:', prev - 1);
        return prev - 1;
      });
      setUserCode('');
      setTestResults([]);
    }
  };

  if (challenges.length === 0) return <Typography>No coding challenges available for this hackathon.</Typography>;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (editorRef.current.requestFullscreen) {
        editorRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleRefresh = () => {
    setUserCode(challenge.languageImplementations[selectedLanguage].visibleCode);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const languageToMode = {
    'C++': 'c_cpp',
    'Python': 'python',
    'JavaScript': 'javascript',
    'Java': 'java',
    'C#': 'csharp',
  };

  const handleAlert = (message) => {
    toast.error(message);
    alertCountRef.current += 1;
    if (alertCountRef.current >= 3) {
      // Log out the user
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  console.log('Current challenge index:', currentChallengeIndex);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: 'calc(100vh - 201px)', 
      gap: 2,
      padding: isMobile ? 2 : 0,
    }}>
      {/* Challenge Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={handlePreviousChallenge} 
          disabled={currentChallengeIndex === 0}
        >
          Previous Challenge
        </Button>
        <Typography variant="h6">
          Challenge {currentChallengeIndex + 1} of {challenges.length}
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleNextChallenge} 
          disabled={currentChallengeIndex === challenges.length - 1}
        >
          Next Challenge
        </Button>
      </Box>

      {/* Main content */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile || isTablet ? 'column' : 'row',
        flex: 1,
        gap: 2,
      }}>
        {/* Left Panel - Problem Statement */}
        <Paper elevation={3} sx={{ 
          width: isMobile || isTablet ? '100%' : '30%', 
          bgcolor: isDarkMode ? '#1e1e1e' : '#f5f5f5', 
          color: isDarkMode ? 'white' : 'black', 
          p: 3, 
          overflowY: 'auto', 
          borderRadius: 2,
          mb: isMobile || isTablet ? 2 : 0,
        }}>
          {challenge && (
            <>
              <Typography variant="h5" gutterBottom sx={{ color: isDarkMode ? '#61dafb' : '#007acc', fontWeight: 'bold' }}>
                {challenge.name}
              </Typography>
              
              <Typography variant="h6" sx={{ mt: 3, mb: 1, color: isDarkMode ? '#bb86fc' : '#5e35b1' }}>Problem Statement</Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>{challenge.problemStatement}</Typography>
              
              <Typography variant="h6" sx={{ mt: 3, mb: 1, color: isDarkMode ? '#bb86fc' : '#5e35b1' }}>Constraints</Typography>
              <Typography variant="body2">{challenge.constraints}</Typography>
              
              <Typography variant="h6" sx={{ mt: 3, mb: 1, color: isDarkMode ? '#bb86fc' : '#5e35b1' }}>Sample Test Cases</Typography>
              {challenge.testCases.filter(tc => tc.isVisible).map((testCase, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Input:</Typography>
                  <Typography variant="body2" component="pre" sx={{ bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5', p: 1, borderRadius: 1 }}>
                    {testCase.input}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>Expected Output:</Typography>
                  <Typography variant="body2" component="pre" sx={{ bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5', p: 1, borderRadius: 1 }}>
                    {testCase.expectedOutput}
                  </Typography>
                </Box>
              ))}
            </>
          )}
        </Paper>

        {/* Right Panel - Code Editor and Test Cases */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          bgcolor: isDarkMode ? '#1e1e1e' : '#f5f5f5', 
          p: 2, 
          borderRadius: 2,
          ml: isMobile || isTablet ? 0 : 2,
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', 
            mb: 2, 
            gap: 2,
          }}>
            <Select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              displayEmpty
              sx={{ 
                width: isMobile ? '100%' : 150, 
                bgcolor: isDarkMode ? 'white' : '#f5f5f5' 
              }}
            >
              <MenuItem value="" disabled>Select Language</MenuItem>
              {challenge && challenge.languages.map((lang) => (
                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
              ))}
            </Select>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: isMobile ? 'space-between' : 'flex-end',
              width: isMobile ? '100%' : 'auto',
            }}>
              <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={handleRun}>Run</Button>
              <Button variant="contained" color="secondary" onClick={handleSubmit}>Submit</Button>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: isMobile ? 'center' : 'flex-end',
              mt: isMobile ? 2 : 0,
            }}>
              <IconButton onClick={toggleFullscreen} sx={{ color: isDarkMode ? 'white' : 'black' }}><FullscreenIcon /></IconButton>
              <IconButton onClick={handleRefresh} sx={{ color: isDarkMode ? 'white' : 'black' }}><RefreshIcon /></IconButton>
              <IconButton onClick={toggleTheme} sx={{ color: isDarkMode ? 'white' : 'black' }}>
                {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile || (isTablet && showTestResults) ? 'column' : 'row',
            height: isMobile || isTablet ? 'auto' : 'calc(100% - 60px)', 
            position: 'relative',
            gap: 2,
          }}>
            <div ref={editorRef} style={{ 
              width: isMobile || (isTablet && showTestResults) ? '100%' : (showTestResults ? '60%' : '100%'), 
              transition: 'width 0.3s',
              minHeight: isMobile || isTablet ? '400px' : 'auto',
            }}>
              <AceEditor
                mode={languageToMode[selectedLanguage] || 'text'}
                theme={isDarkMode ? 'tomorrow_night_eighties' : 'tomorrow'}
                name="code-editor"
                value={userCode}
                onChange={handleCodeChange}
                width="100%"
                height={isMobile || isTablet ? "400px" : "100%"}
                editorProps={{ $blockScrolling: true }}
                fontSize={14}
                showPrintMargin={false}
                highlightActiveLine={true}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
              />
            </div>
            <Box 
              sx={{ 
                width: isMobile || isTablet ? '100%' : (showTestResults ? '40%' : '0%'), 
                overflow: 'hidden',
                transition: 'width 0.3s, height 0.3s',
                position: 'relative',
                height: isMobile || isTablet ? (showTestResults ? '300px' : '40px') : '100%',
              }}
            >
              <IconButton 
                onClick={toggleTestResults}
                sx={{ 
                  position: 'absolute', 
                  left: '-20px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  zIndex: 1,
                  bgcolor: isDarkMode ? 'white' : '#f5f5f5',
                  '&:hover': { bgcolor: isDarkMode ? '#f0f0f0' : '#e0e0e0' },
                }}
              >
                {showTestResults ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
              </IconButton>
              <Box sx={{ ml: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: 1, bgcolor: isDarkMode ? '#042240' : '#f5f5f5', color: isDarkMode ? 'white' : 'black', p: 2, overflowY: 'auto', borderRadius: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Test Results</Typography>
                  {testResults.length > 0 ? (
                    testResults.map((result, index) => (
                      <Box key={index} sx={{ mb: 2, p: 1, bgcolor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#f0f0f0', borderRadius: 1 }}>
                        {isExecuting ? (
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                        ) : result.passed ? (
                          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                        ) : (
                          <CancelIcon color="error" sx={{ mr: 1 }} />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Test Case {index + 1}</Typography>
                        <Typography variant="body2">Input: {result.input}</Typography>
                        <Typography variant="body2">Expected: {result.expectedOutput}</Typography>
                        <Typography variant="body2">Actual: {result.actualOutput}</Typography>
                        <Typography variant="body2">Time: {result.time} seconds</Typography>
                        <Typography variant="body2">Memory: {result.memory} KB</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2">No test cases run yet.</Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          
          {challenge?.proctoring && <Proctoring onAlert={handleAlert} />}
          <ToastContainer />
        </Box>
      </Box>

      {/* Completion status */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1">
          Completed: {currentChallengeIndex + 1} / {challenges.length}
        </Typography>
      </Box>
    </Box>
  );
};

export default CodingChallengeSection;
