"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";

type WebGLGuardProps = {
  children: ReactNode;
};

type WebGLErrorBoundaryState = {
  failed: boolean;
};

class WebGLErrorBoundary extends Component<
  WebGLGuardProps,
  WebGLErrorBoundaryState
> {
  state: WebGLErrorBoundaryState = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("The WebGL experience could not initialize.", error, errorInfo);
    }
  }

  render() {
    if (this.state.failed) {
      return <div className="experience-fallback" aria-hidden="true" />;
    }

    return this.props.children;
  }
}

export function WebGLGuard({ children }: WebGLGuardProps) {
  const isSupported = useWebGLSupport();

  if (isSupported === null) {
    return <div className="experience-fallback" aria-hidden="true" />;
  }

  if (!isSupported) {
    return <div className="experience-fallback" aria-hidden="true" />;
  }

  return <WebGLErrorBoundary>{children}</WebGLErrorBoundary>;
}
