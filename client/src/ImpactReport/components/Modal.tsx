import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { animate } from 'animejs';
import { useLocation } from 'react-router-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  width?: string;
  maxHeight?: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div<{ width?: string; maxHeight?: string }>`
  background: linear-gradient(to bottom, #333, #121212);
  border-radius: 8px;
  width: ${(props) => props.width || '90%'};
  max-width: 1200px;
  max-height: ${(props) => props.maxHeight || '90vh'};
  overflow-y: auto;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  opacity: 0;
  transform: translateY(20px);

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  position: sticky;
  top: 0;
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: white;
  font-size: 1.2rem;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  transition: color 0.2s ease;

  &:hover {
    color: white;
  }
`;

const ModalContent = styled.div`
  padding: 0;
`;

/**
 * Modal component for displaying content in an overlay
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  width,
  maxHeight,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState<boolean>(isOpen);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Handle enter/exit animations and unmount timing
  useEffect(() => {
    const overlay = overlayRef.current;
    const container = containerRef.current;
    if (!overlay || !container) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isOpen) {
      setShouldRender(true);
      if (reduceMotion) {
        overlay.style.opacity = '1';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
        return;
      }
      animate(overlay, {
        opacity: [0, 1],
        duration: 220,
        easing: 'easeOutCubic',
      });
      animate(container, {
        opacity: [0, 1],
        translateY: [20, 0],
        scale: [0.98, 1],
        duration: 280,
        easing: 'easeOutCubic',
      });
    } else if (shouldRender) {
      if (reduceMotion) {
        setShouldRender(false);
        return;
      }
      animate(container, {
        opacity: [1, 0],
        translateY: [0, 12],
        scale: [1, 0.98],
        duration: 220,
        easing: 'easeInCubic',
      });
      animate(overlay, {
        opacity: [1, 0],
        duration: 240,
        easing: 'easeInCubic',
      });
      const timeout = setTimeout(() => setShouldRender(false), 240);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, shouldRender]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  const modalNode = (
    <ModalOverlay
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) {
          onClose();
        }
      }}
    >
      <ModalContainer ref={containerRef} width={width} maxHeight={maxHeight}>
        {title && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <CloseButton onClick={onClose}>×</CloseButton>
          </ModalHeader>
        )}
        {!title && (
          <CloseButton
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 20,
              background: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            ×
          </CloseButton>
        )}
        <ModalContent>{children}</ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );

  if (typeof document !== 'undefined' && document.body) {
    return ReactDOM.createPortal(modalNode, document.body);
  }

  return modalNode;
};

export default Modal;
