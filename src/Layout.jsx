import { cn } from './lib/utils';

// Pages that handle their own full layout (no wrapper needed)
const STANDALONE_PAGES = ['PlannerDashboard', 'Workspace', 'LandingPage'];

export default function Layout({ children, currentPageName }) {
  // Standalone pages get no wrapper - they handle everything themselves
  if (STANDALONE_PAGES.includes(currentPageName)) {
    return <>{children}</>;
  }

  // Legacy pages (Board, Budget, Vendors, Guests, etc.) keep existing layout
  const hideNav = currentPageName === 'WeddingSetup';

  return (
    <div className="min-h-screen bg-slate-50">
      <main>{children}</main>
    </div>
  );
}