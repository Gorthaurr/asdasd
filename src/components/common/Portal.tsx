import { createPortal } from 'react-dom';
import { useEffect, useState, forwardRef } from 'react';

interface PortalProps {
  children: React.ReactNode;
  container?: Element;
}

export const Portal = forwardRef<HTMLDivElement, PortalProps>(({ children, container }, ref) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(<div ref={ref}>{children}</div>, container || document.body);
});

Portal.displayName = 'Portal';
