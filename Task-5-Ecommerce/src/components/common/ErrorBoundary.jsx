import { Component } from 'react'
import Container from '../ui/Container'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught a render error:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="py-24">
          <Container>
            <div className="flex flex-col items-center gap-6 text-center">
              <span className="text-6xl">⚠️</span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Something went wrong
              </h1>
              <p className="max-w-sm text-slate-500 dark:text-slate-400">
                An unexpected error occurred. Please try refreshing the page.
              </p>
              <button
                type="button"
                onClick={this.handleReset}
                className="rounded-2xl bg-violet-500 px-6 py-3 font-medium text-white hover:bg-violet-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </Container>
        </section>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary