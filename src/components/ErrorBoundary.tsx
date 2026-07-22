import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  declare props: Props;
  declare state: State;
  declare setState: Component<Props, State>['setState'];

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('TeachMate AI ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <div className="min-h-screen bg-off-white text-dark-text flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-bright-orange shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-light-orange text-bright-orange rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-deep-purple mb-1">Something unexpected happened</h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                TeachMate AI encountered a temporary UI error. Your work is safe.
              </p>
            </div>
            {this.state.error && (
              <div className="bg-gray-100 p-3 rounded-xl text-[11px] text-gray-700 font-mono text-left max-h-32 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-primary-purple hover:bg-deep-purple text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return <>{this.props.children}</>;
  }
}
