import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Board now redirects to the new Workspace
export default function Board() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/Workspace', { replace: true });
  }, []);
  return null;
}