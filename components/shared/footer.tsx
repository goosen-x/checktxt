export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-background py-8 mt-auto">
      <div className="container mx-auto px-4 text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Сайт разработан{' '}
          <a
            href="https://portfolio.gooselabs.ru/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline transition-colors"
          >
            Дмитрием Борисенко
          </a>
        </p>
        <p className="text-sm">
          <a
            href="https://github.com/goose-x/checktxt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            Посмотреть исходный код на GitHub
          </a>
        </p>
      </div>
    </footer>
  )
}
