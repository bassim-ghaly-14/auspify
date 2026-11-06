import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'

function NotFound() {
  return (
    <section className="py-20">
      <Container>
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <p className="select-none text-[10rem] font-black leading-none text-slate-200 dark:text-white/5">
            404
          </p>
          <div className="-mt-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Page Not Found
            </h1>
            <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
              The page you are looking for does not exist or has been moved.
            </p>
          </div>
          <Link
            to="/"
            className="rounded-2xl bg-violet-500 px-6 py-3 font-medium text-white transition-all hover:bg-violet-600 active:scale-95"
          >
            Back to Home
          </Link>
        </div>
      </Container>
    </section>
  )
}

export default NotFound