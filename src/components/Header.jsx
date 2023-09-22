import headerLogo from '../images/logo-header.svg';

export default function Header() {
  return (
    <header className="header">
      <img className="header__logo" alt="Логотип" src={headerLogo} />
    </header>
  );
}
