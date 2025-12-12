import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('main.jsx: Script starting...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('main.jsx: FATAL - Root element not found!');
} else {
  console.log('main.jsx: Root element found', rootElement);
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-red-600 bg-red-50 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Application Error</h1>
          <p className="font-mono mb-4">{this.state.error?.toString()}</p>
          <pre className="text-sm overflow-auto max-h-96 bg-white p-4 rounded border border-red-200">
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

try {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
  console.log('main.jsx: Render initiated');
} catch (e) {
  console.error('main.jsx: Exception during root render:', e);
}
