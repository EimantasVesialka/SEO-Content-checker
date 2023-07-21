import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('URL', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('Text', () => {
  render(<App />);
  const linkElement = screen.getByText(/edit src/i);
  expect(linkElement).toBeInTheDocument();
});