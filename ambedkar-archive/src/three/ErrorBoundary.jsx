import React from 'react';
import WebGLFallback from './WebGLFallback';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Experience Error Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <WebGLFallback
          title="3D Experience Recovery"
          returnUrl={this.props.returnUrl || '/timeline.html'}
        />
      );
    }
    return this.props.children;
  }
}
