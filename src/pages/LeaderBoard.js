import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; 
import Header from './Header';
import Footer from './Footer';

const LeaderBoard = () => { 
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await fetch('/api/hackathons', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch hackathons');
        const data = await response.json();
        setHackathons(data);
        if (data.length > 0) {
          setSelectedHackathon(data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching hackathons:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackathons();
  }, [token]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!selectedHackathon) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/users/hackathons/${selectedHackathon}/leaderboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        const data = await response.json();
        setLeaderboard(data);

        // Fetch current user data
        const currentUserResponse = await fetch(`/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!currentUserResponse.ok) throw new Error('Failed to fetch current user');
        const currentUserData = await currentUserResponse.json();
        const currentUserRank = data.findIndex(entry => entry.userId === currentUserData.userId) + 1;
        setCurrentUser({ ...currentUserData, rank: currentUserRank });

      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedHackathon, token]);

  const containerStyle = {
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '30px',
    borderRadius: '15px',
    width: '90%',
    maxWidth: '1000px',
    margin: 'auto',
    marginTop: '50px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const hackathonSelectStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    color: 'white',
    padding: '12px 20px',
    fontSize: '16px',
    marginBottom: '30px',
    width: '100%',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const profileHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '30px',
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '10px',
  };

  const profileInfoStyle = {
    flexGrow: 1,
  };

  const rankingInfoStyle = {
    textAlign: 'right',
    fontSize: '24px',
    fontWeight: 'bold',
  };

  const leaderboardStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: '10px',
    overflow: 'hidden',
  };

  const headerRowStyle = {
    display: 'grid',
    gridTemplateColumns: '0.5fr 2fr 1fr 1fr',
    padding: '15px 10px',
    background: 'rgba(255, 255, 255, 0.1)',
    fontWeight: 'bold',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  };

  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '0.5fr 2fr 1fr 1fr',
    padding: '12px 10px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'background-color 0.3s ease',
  };


  const backButtonStyle = {
    textAlign: 'left',
    marginTop: '30px',
  };


  const buttonStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };


  return (
    <>
      <Header />
      <div style={{minHeight: '100vh', paddingBottom: '50px'}}>
        <div style={containerStyle}>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <>
              <select 
                value={selectedHackathon} 
                onChange={(e) => setSelectedHackathon(e.target.value)}
                style={hackathonSelectStyle}
              >
                {hackathons.map(hackathon => (
                  <option key={hackathon._id} value={hackathon._id}>
                    {hackathon.title}
                  </option>
                ))}
              </select>
              <div style={profileHeaderStyle}>
                <div style={profileInfoStyle}>
                  <h2 style={{margin: '0 0 10px 0'}}>{currentUser.username}</h2>
                </div>
                <div style={rankingInfoStyle}>
                  <p style={{margin: '0'}}>Rank: {currentUser.rank || 'N/A'}</p>
                </div>
              </div>
              <div style={leaderboardStyle}>
                <div style={headerRowStyle}>
                  <span>Rank</span>
                  <span>Username</span>
                  <span>Score</span>
                  <span>Coding Challenge Score</span>
                </div>
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.userId} 
                    style={{
                      ...rowStyle,
                      backgroundColor: entry.userId === currentUser.userId ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    }}
                  >
                    <span>{index + 1}</span>
                    <span>{entry.username}</span>
                    <span>{entry.totalScore}</span>
                    <span>{entry.codingChallengeScore}</span>
                  </div>
                ))}
              </div>
              <div style={backButtonStyle}>
                <button 
                  style={buttonStyle} 
                  onClick={() => window.history.back()} 
                  aria-label="Go back"
                  onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                >
                  Back
                </button>
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
