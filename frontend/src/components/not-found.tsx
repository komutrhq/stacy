export function NotFound(): JSX.Element {
  return (
    <main role="main" className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404: Page Not Found</h1>
        <p className="mb-4">Sorry, we couldn't find the page you're looking for.</p>
        <a href="/" className="text-blue-500 hover:text-blue-700">
          Return to Home
        </a>
      </div>
    </main>
  );
}
