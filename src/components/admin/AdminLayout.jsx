import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, CalendarDays, Users, BarChart3, Settings,
  FileText, PenTool, Image, Clock, FlaskConical, Bell, LogOut,
  TrendingUp, Filter, CreditCard, DollarSign, MessageCircle,
  PieChart, Target, ArrowLeftRight
} from 'lucide-react';

export default function AdminLayout({ children, title, subtitle }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { group: '予約管理', items: [
      { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'ダッシュボード' },
      { to: '/admin/reservations', icon: <Users size={18} />, label: '予約一覧' },
      { to: '/admin/calendar', icon: <CalendarDays size={18} />, label: 'カレンダー' },
    ]},
    { group: 'データ観測', items: [
      { to: '/admin/data', icon: <BarChart3 size={18} />, label: 'データダッシュボード' },
      { to: '/admin/data/funnel', icon: <Filter size={18} />, label: 'ファネル分析' },
      { to: '/admin/data/traffic', icon: <TrendingUp size={18} />, label: '流入分析' },
      { to: '/admin/data/form-dropoff', icon: <ArrowLeftRight size={18} />, label: 'フォーム離脱分析' },
      { to: '/admin/data/plans', icon: <PieChart size={18} />, label: 'プラン分析' },
      { to: '/admin/data/meetings', icon: <MessageCircle size={18} />, label: '打ち合わせ分析' },
      { to: '/admin/data/payments', icon: <CreditCard size={18} />, label: '決済分析' },
      { to: '/admin/data/sales', icon: <DollarSign size={18} />, label: '売上分析' },
    ]},
    { group: 'サイト編集', items: [
      { to: '/admin/site-editor', icon: <PenTool size={18} />, label: 'サイト編集' },
      { to: '/admin/plans', icon: <FileText size={18} />, label: 'プラン編集' },
      { to: '/admin/form-fields', icon: <Settings size={18} />, label: 'フォーム項目' },
      { to: '/admin/faq', icon: <FileText size={18} />, label: 'FAQ編集' },
      { to: '/admin/images', icon: <Image size={18} />, label: '画像編集' },
      { to: '/admin/meeting-slots', icon: <Clock size={18} />, label: '打ち合わせ枠' },
    ]},
    { group: '改善', items: [
      { to: '/admin/ab-tests', icon: <FlaskConical size={18} />, label: 'ABテスト' },
      { to: '/admin/notifications', icon: <Bell size={18} />, label: '通知設定' },
    ]},
  ];

  return (
    <div className="admin-layout">
      <nav className="sidebar">
        <div className="sidebar__logo">
          <div className="sidebar__logo-text">スタジオうえじ</div>
          <div className="sidebar__logo-sub">管理画面</div>
        </div>
        <div className="sidebar__nav">
          {navItems.map(group => (
            <div key={group.group}>
              <div className="sidebar__group-title">{group.group}</div>
              <div className="sidebar__group">
                {group.items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/admin'}
                    className={({ isActive }) =>
                      `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button className="sidebar__link" onClick={handleLogout} style={{ width: '100%' }}>
            <LogOut size={18} />
            ログアウト
          </button>
        </div>
      </nav>
      <main className="admin-content">
        <div className="admin-header">
          <div>
            <h1 className="admin-header__title">{title}</h1>
            {subtitle && <p className="admin-header__subtitle">{subtitle}</p>}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
