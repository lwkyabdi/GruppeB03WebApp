import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="site-header"><div className="header-inner">
      <h2><a href="/" className="brand">MovieMate</a></h2>
      <Navigation />
    </div></header>
  );
}