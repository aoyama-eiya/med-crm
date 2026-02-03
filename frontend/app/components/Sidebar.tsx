'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40">
                <span className="text-xs font-bold text-mac-text tracking-wider uppercase">Med CRM</span>
                <button onClick={() => setIsOpen(true)} className="p-2 text-mac-text">
                    <span className="material-symbols-rounded text-2xl">menu</span>
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-mac-sidebar border-r border-mac-border flex flex-col animate-slide-right">
                        <div className="h-14 flex items-center justify-between px-5 pt-4 pb-4">
                            <span className="text-xs font-bold text-mac-text-secondary/60 tracking-wider uppercase">Med CRM</span>
                            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-black/5">
                                <span className="material-symbols-rounded text-xl text-gray-500">close</span>
                            </button>
                        </div>
                        <Navigation onItemClick={() => setIsOpen(false)} />
                        <UserFooter />
                    </aside>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-[260px] flex-shrink-0 flex-col bg-mac-sidebar border-r border-mac-border h-full select-none">
                <div className="h-14 flex items-center px-5 pt-8 pb-4">
                    <span className="text-xs font-bold text-mac-text-secondary/60 tracking-wider uppercase">Med CRM</span>
                </div>
                <Navigation />
                <UserFooter />
            </aside>
        </>
    )
}

function Navigation({ onItemClick }: { onItemClick?: () => void }) {
    return (
        <nav className="flex-1 px-0 space-y-0 mt-2 overflow-y-auto">
            <SidebarItem href="/" label="ダッシュボード" icon="monitoring" onClick={onItemClick} />
            <SidebarItem href="/auto-messages" label="自動メッセージ" icon="schedule_send" onClick={onItemClick} />
            <SidebarItem href="/rich-menus" label="リッチメニュー" icon="menu_book" onClick={onItemClick} />
            <SidebarItem href="/settings" label="設定" icon="settings" onClick={onItemClick} />
        </nav>
    )
}

function UserFooter() {
    return (
        <div className="p-4 border-t border-mac-border">
            <div className="flex items-center gap-3 px-2 py-1">
                <div className="w-8 h-8 bg-mac-border flex items-center justify-center text-mac-text-secondary">
                    <span className="material-symbols-rounded text-lg">person</span>
                </div>
                <div>
                    <p className="text-xs font-bold text-mac-text">管理者</p>
                    <p className="text-[10px] text-mac-text-secondary">admin@dental.jp</p>
                </div>
            </div>
        </div>
    )
}

function SidebarItem({ href, label, icon, onClick }: { href: string, label: string, icon: string, onClick?: () => void }) {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-3 text-[13px] font-medium transition-colors border-l-4 ${isActive
                    ? 'bg-white border-mac-accent text-mac-accent shadow-sm'
                    : 'border-transparent text-mac-text hover:bg-black/5 active:bg-black/10'
                }`}
        >
            <span className={`material-symbols-rounded text-[20px] transition-colors ${isActive ? 'text-mac-accent' : 'text-mac-text-secondary group-hover:text-mac-text'
                }`}>{icon}</span>
            {label}
        </Link>
    )
}
