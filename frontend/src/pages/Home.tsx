import React from 'react';

const Home = () => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '2rem',
      color: 'white',
      backgroundColor: '#091b2e',
      minHeight: '100vh',
      fontFamily: "'Roboto Slab', serif",
    },
    title: {
      fontSize: '2.5rem',
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
      margin: '0.5rem 0',
      color: '#ffffff',
    },
    subtitle: {
      fontSize: '1.2rem',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 300,
      marginBottom: '2rem',
      color: '#ffffff',
    },
    content: {
      flexGrow: 1, // Allows this section to expand and push the images down
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    imageRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: '2rem',  // Increased gap between images
      flexWrap: 'wrap',
      width: '100%',
      marginTop: '2rem',
    },
    responsiveImage: {
      width: '35%',  // Decreased the size of the images
      maxWidth: '250px', // Further reduced the max width
      borderRadius: '10px',
      transition: 'transform 0.3s',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Welcome to VAA-GPT</h1>
        <p style={styles.subtitle}>Experience the power of conversational AI</p>
      </div>
      
      <div style={styles.imageRow}>
        <img
          className="image-invert rotate"
          src="chatlogo.png"
          alt="Chat Logo"
          style={styles.responsiveImage}
        />
        <img className='image-invert'
          src="MAIT.png"
          alt="MAIT Logo"
          style={styles.responsiveImage}
        />
      </div>
    </div>
  );
};

export default Home;
