// src/App.jsx
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md w-full px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Employee Performance Evaluation System</h1>
          <p className="text-indigo-100 mt-1 font-light">AI-powered performance analytics</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-10 px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <Dashboard />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-6 w-full px-8 text-center text-sm">
        <div className="max-w-7xl mx-auto">
          <p>Employee Performance Evaluation System &copy; {new Date().getFullYear()}</p>
          <p className="text-slate-400 mt-1">
            Powered by First-Order Logic, Heuristics, Backtracking, and CSP Algorithms
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;