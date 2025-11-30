export function Footer() {
  return (
    <footer className="border-t py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} TextCheck &middot; Данные не сохраняются на сервере
      </div>
    </footer>
  )
}
