import React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className = '',
  target,
  rel,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    // Prevent default for hash links
    if (href === '#') {
      e.preventDefault();
    }
  };

  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : rel}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};