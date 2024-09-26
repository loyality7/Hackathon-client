import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; 
import Header from './Header';
import Footer from './Footer';

const LeaderBoard = () => { 
  const [submissions, setSubmissions] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchAllSubmissions = async () => {
      try {
        const hackathonsResponse = await fetch('/api/hackathons', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        });
        if (!hackathonsResponse.ok) throw new Error('Failed to fetch hackathons');
        const hackathons = await hackathonsResponse.json();

        let allSubmissions = [];

        for (const hackathon of hackathons) {
          const submissionsResponse = await fetch(`/api/admin/hackathons/${hackathon._id}/submissions`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!submissionsResponse.ok) throw new Error(`Failed to fetch submissions for hackathon ${hackathon._id}`);
          const data = await submissionsResponse.json();
          allSubmissions = allSubmissions.concat(data.projectSubmissions);
        }

        const sortedSubmissions = allSubmissions.sort((a, b) => b.score - a.score);
        setSubmissions(sortedSubmissions);

        const currentUserResponse = await fetch(`/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!currentUserResponse.ok) throw new Error('Failed to fetch current user');
        const currentUserData = await currentUserResponse.json();
        const currentUserRank = sortedSubmissions.findIndex(submission => submission.user.userId === currentUserData.userId) + 1;
        setCurrentUser({ ...currentUserData, rank: currentUserRank });

      } catch (error) {
        console.error('Error fetching submissions:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSubmissions();
  }, [token]);  

  const containerStyle = {
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '80%',
    margin: 'auto',
    marginTop: '50px',
    
  };

  const profileHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  };

  const profileInfoStyle = {
    flexGrow: 1,
    marginLeft: '20px',
  };

  const rankingInfoStyle = {
    textAlign: 'right',
  };

  const leaderboardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '10px',
    borderRadius: '10px',
  };

  const headerRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const backButtonStyle = {
    textAlign: 'left',
    marginTop: '20px',
  };

  const buttonStyle = {
    background: 'none',
    border: '1px solid white',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <>
      <Header />
      <div style={{height: '100vh'}}>
      <div style={containerStyle}>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <>
            <div style={profileHeaderStyle}>
              <div style={profileInfoStyle}>
                <h2>{currentUser.username}</h2>
                <p>#{currentUser.userId}</p>
              </div>
              <div style={rankingInfoStyle}>
                <p>Rank: {currentUser.rank}</p>
              </div>
            </div>
            <div style={leaderboardStyle}>
              <div style={headerRowStyle}>
                <span>Rank</span>
                <span>Username</span>
                <span>User ID</span>
                <span>Score</span>
              </div>
              {Array.isArray(submissions) && submissions.map((submission, index) => (
                <div key={submission._id} style={rowStyle}>
                  <span>{index + 1}</span>
                  <span>{submission.user.username}</span>
                  <span>{submission.user.userId}</span>
                  <span>{submission.score}</span>
                </div>
              ))}
            </div>
            <div style={backButtonStyle} >
              <button style={buttonStyle} onClick={() => window.history.back()} aria-label="Go back">Back</button>
            </div>
          </>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
};

export default LeaderBoard;