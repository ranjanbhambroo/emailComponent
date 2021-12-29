import { render } from '@testing-library/react';
import App from './App';


jest.mock('./emailComponent', () => () => <div data-testid="email-component" />);

test('renders email component <EmailComponent />', () => {
  const {getByTestId} = render(<App />);
  expect(getByTestId(/email-component/)).toBeInTheDocument();
});
