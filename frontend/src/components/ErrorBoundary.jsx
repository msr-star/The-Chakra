import React from 'react';
import { Zap, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center px-6"
                    style={{ background: '#120803' }}>
                    <div className="text-center max-w-md">
                        {/* Logo */}
                        <div className="flex items-center justify-center gap-2.5 mb-10">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #FF5A00, #FF9D00)' }}>
                                <Zap size={20} className="text-white" fill="white" />
                            </div>
                            <span className="text-xl font-bold text-white"
                                style={{ fontFamily: 'Outfit, sans-serif' }}>
                                The Chakra
                            </span>
                        </div>

                        {/* Error Icon */}
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(255,90,0,0.1)', border: '1px solid rgba(255,90,0,0.2)' }}>
                            <span className="text-4xl">⚡</span>
                        </div>

                        <h1 className="text-3xl font-black text-white mb-3"
                            style={{ fontFamily: 'Outfit, sans-serif' }}>
                            Something Went Wrong
                        </h1>
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                            An unexpected error occurred. Don&rsquo;t worry — your data is safe.
                            Try refreshing the page or head back home.
                        </p>

                        <div className="flex flex-wrap gap-3 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all"
                                style={{ background: 'linear-gradient(135deg, #FF5A00, #FF9D00)' }}
                            >
                                <RefreshCw size={14} /> Refresh Page
                            </button>
                            <a
                                href="/"
                                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-gray-300 transition-all"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                <Home size={14} /> Go Home
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
