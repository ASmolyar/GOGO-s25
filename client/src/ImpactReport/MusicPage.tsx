import React from 'react';
import Header from './components/Header';
import MusicLibrary from './components/MusicLibrary';
import styled from 'styled-components';

const PageContainer = styled.div`
  background-color: var(--spotify-black);
  min-height: 100vh;
  color: white;
`;

const MainContent = styled.div`
  padding-top: 100px; /* Space for fixed header */
`;

const MusicPage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <MainContent>
        <MusicLibrary />
      </MainContent>
    </PageContainer>
  );
};

export default MusicPage; 