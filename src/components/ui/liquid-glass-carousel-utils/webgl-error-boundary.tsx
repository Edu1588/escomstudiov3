import React, { Component, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface WebGLErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class WebGLErrorBoundary extends Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): WebGLErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <WebGLFallback message="WebGL Error: Unable to render 3D canvas." />
        )
      );
    }
    return this.props.children;
  }
}

export interface WebGLFallbackProps {
  className?: string;
  message?: string;
}

export function WebGLFallback({
  className,
  message = "This carousel needs WebGL, which is unavailable in this browser.",
}: WebGLFallbackProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center text-sm text-zinc-400 bg-black/40 border border-white/10 rounded-2xl",
        className
      )}
    >
      <p>{message}</p>
    </div>
  );
}
