import { Outlet, NavLink } from 'react-router-dom'

const navItems = [
    { path: '/dashboard', label: 'ダッシュボード', icon: 'monitoring' },
    { path: '/templates', label: 'テンプレート', icon: 'edit_note' },
    { path: '/rich-menus', label: 'リッチメニュー', icon: 'menu_book' },
    { path: '/settings', label: '設定', icon: 'settings' },
]

export default function Layout() {
    return (
        <div className="flex bg-transparent h-screen w-full overflow-hidden text-[#1d1d1f] font-sans">
            {/* Sidebar - Floating Glass Panel style for macOS feel */}
            <aside className="w-64 flex-shrink-0 flex flex-col z-20 m-4 rounded-3xl glass-panel overflow-hidden border border-white/40">
                <div className="px-6 py-6 flex items-center gap-3 border-b border-white/20 bg-white/10">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00C6FF] to-[#0072FF] rounded-xl flex items-center justify-center text-white shadow-lg">
                        <span className="material-symbols-rounded text-2xl drop-shadow-sm">local_hospital</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-[#1d1d1f] tracking-tight drop-shadow-sm">Med CRM</h1>
                    </div>
                </div>

                <nav className="flex-1 px-3 space-y-2 overflow-y-auto mt-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${isActive
                                    ? 'bg-white/60 shadow-lg text-[#007AFF] font-bold backdrop-blur-sm'
                                    : 'text-[#1d1d1f]/70 hover:bg-white/30 hover:text-[#1d1d1f]'
                                }`
                            }
                        >
                            <span className={`material-symbols-rounded text-2xl z-10 transition-transform group-hover:scale-110 ${({ isActive }) => isActive ? 'fill-1' : ''
                                }`}>{item.icon}</span>
                            <span className="text-sm tracking-wide z-10">{item.label}</span>
                            {/* Active Indicator Glow */}
                            {({ isActive }) => isActive && <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-transparent rounded-2xl" />}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 bg-white/10 border-t border-white/20 backdrop-blur-sm">
                    <div className="bg-white/40 p-3 rounded-2xl flex items-center gap-3 border border-white/30 shadow-sm backdrop-blur-md">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-[#007AFF]">
                            <span className="material-symbols-rounded text-lg">verified</span>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-[#1d1d1f]/50 uppercase tracking-widest">現在のプラン</p>
                            <p className="font-bold text-xs text-[#1d1d1f]">トライアル利用中</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto w-full p-4 md:p-6 pb-32">
                    {/* Main content container with consistent styling handled by pages */}
                    <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    )
}
