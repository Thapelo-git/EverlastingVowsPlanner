import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Dashboard now redirects to the new PlannerDashboard
export default function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/PlannerDashboard', { replace: true });
  }, []);
  return null;
}