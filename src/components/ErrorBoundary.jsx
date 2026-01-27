import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        // Log error to service (e.g., Sentry, LogRocket)
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-surface flex items-center justify-center p-4">
                    <Card padding="lg" className="max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-error" />
                        </div>

                        <h1 className="text-xl font-bold text-primary mb-2">Something went wrong</h1>
                        <p className="text-muted mb-6">
                            We're sorry, but something unexpected happened. Please try again or go back to the home page.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-6 p-4 bg-secondary rounded-lg text-left overflow-auto max-h-40">
                                <p className="text-sm font-mono text-error">{this.state.error.toString()}</p>
                                {this.state.errorInfo && (
                                    <pre className="text-xs text-muted mt-2 whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button onClick={this.handleReset}>
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>
                            <Button variant="secondary" onClick={() => window.location.href = '/'}>
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </Button>
                        </div>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
