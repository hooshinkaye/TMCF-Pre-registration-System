import { Component, type ErrorInfo, type ReactNode } from 'react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Homepage render error:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
          <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-red-600">Page failed to render</p>
            <h1 className="mt-2 text-2xl font-black text-slate-950">Homepage error</h1>
            <p className="mt-3 text-slate-600">
              The app is running, but one homepage component crashed during render.
            </p>
            <pre className="mt-5 overflow-auto rounded-md bg-slate-950 p-4 text-sm text-white">
              {this.state.error.message}
            </pre>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
