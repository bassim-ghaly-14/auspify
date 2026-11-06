import Container from '../ui/Container'

function Footer() {
  return (
    <footer className="border-t border-slate-200 py-8 dark:border-white/10">
      <Container>
        <p className="text-center text-sm text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} TRADO Store. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}

export default Footer