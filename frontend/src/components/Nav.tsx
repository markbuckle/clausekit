import gavelBooks from '../../assets/gavel-books.svg';

export default function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="brand" href="#top">
          <span className="mark logo"><img src={gavelBooks} alt="ClauseKit" /></span>
          <span className="wordmark">Clause<b>Kit</b></span>
        </a>
        <nav className="nav-links">
          <a href="#product">Product <span className="car" /></a>
          {/* <a href="#customers">Customers</a> */}
          {/* <a href="#security">Security</a> */}
          {/* <a href="#pricing">Pricing</a> */}
          {/* <a href="#resources">Resources <span className="car" /></a> */}
        </nav>
        <div className="nav-cta">
          <a className="login" href="#login">Log in</a>
          <a className="btn primary" href="#demo">Book a demo</a>
        </div>
      </div>
    </header>
  );
}
