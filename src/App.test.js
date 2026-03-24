import React from 'react';
import { render } from '@testing-library/react';
import { App } from './component/App';

test('renders InitTrack app', () => {
  const { getByText } = render(<App />);
  const beastiaryHeading = getByText(/beastiary/i);
  expect(beastiaryHeading).toBeInTheDocument();
});
