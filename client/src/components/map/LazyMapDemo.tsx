import React, { Suspense, useState, useEffect } from 'react';
import styled from 'styled-components';
import COLORS from '../../assets/colors.ts';

// Use React.lazy to load the map component only when needed
const MapDemo = React.lazy(() => import('./MapDemo'));

// A container for the loading state
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 450px;
  width: 100%;
  background-color: var(--spotify-dark-gray, #172a3a);
  border-radius: 12px;
  color: white;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top-color: var(--spotify-blue, #1946f5);
  animation: spin 1s ease-in-out infinite;
  margin-right: 15px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Define proper types for the error boundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Simple error boundary component
class MapErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Map Error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <LoadingContainer>
          <div style={{ textAlign: 'center' }}>
            <p>Something went wrong loading the map.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={{
                background: COLORS.gogo_blue,
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              Try Again
            </button>
          </div>
        </LoadingContainer>
      );
    }

    return this.props.children;
  }
}

function LazyMapDemo() {
  // Track whether component is mounted to prevent memory leaks
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return <LoadingContainer>Initializing map...</LoadingContainer>;
  }

  return (
    <MapErrorBoundary>
      <Suspense
        fallback={
          <LoadingContainer>
            <Spinner />
            <span>Loading map...</span>
          </LoadingContainer>
        }
      >
        <MapDemo />
      </Suspense>
    </MapErrorBoundary>
  );
}

export default LazyMapDemo;
