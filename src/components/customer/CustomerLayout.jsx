import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

export default function CustomerLayout({ children, showHeader = true }) {
  return (
    <div className="customer-page">
      {showHeader && (
        <header className="customer-header">
          <div className="customer-header__inner">
            <Link to="/">
              <div className="customer-header__logo">
                <Camera size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                スタジオうえじ
                <span className="customer-header__sub" style={{ display: 'block' }}>七五三撮影予約</span>
              </div>
            </Link>
          </div>
        </header>
      )}
      {children}
    </div>
  );
}
