'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LogOut, Menu, Phone, Search, ShipWheel, UserRound, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { mediaDistributionRoute } from '@/config/media-distribution-route'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <header className="sticky top-0 z-50 bg-white text-[var(--slot4-page-text)] shadow-[0_1px_0_rgba(7,24,39,.08)]">
      <div className="mx-auto grid min-h-[74px] max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 lg:hidden" aria-label="Toggle navigation">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <Link href="/" className="flex max-w-[54vw] items-center justify-center gap-2 truncate text-center text-xl font-black text-[var(--slot4-page-text)]">
          <img src="/favicon.ico" alt="Logo" className="h-8 w-8 shrink-0 text-[var(--slot4-accent)]" />
          <span className="truncate">{SITE_CONFIG.name}</span>
        </Link>

        <div className="flex items-center justify-end gap-3">
          {session ? (
            <>
              <Link href="/create" className="hidden rounded-md bg-[var(--slot4-accent)] px-4 py-2.5 text-xs font-black uppercase tracking-[.12em] text-white sm:block">Create</Link>
              <span className="hidden max-w-[150px] items-center gap-2 truncate rounded-md bg-[var(--slot4-panel-bg)] px-3 py-2 text-sm font-black sm:inline-flex"><UserRound className="h-4 w-4" /> {session.name}</span>
              <button type="button" onClick={logout} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10" aria-label="Logout"><LogOut className="h-4 w-4" /></button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden text-xs font-black uppercase tracking-[.12em] sm:block">Log in</Link>
              <Link href="/signup" className="rounded-md bg-[var(--slot4-accent)] px-4 py-3 text-[10px] font-black uppercase tracking-[.14em] text-white sm:px-6">Sign up</Link>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-black/5 bg-[var(--slot4-dark-bg)] text-white">
        <div className="mx-auto flex min-h-[48px] max-w-[1280px] items-center gap-5 px-4 sm:px-6 lg:px-8">
          <nav className="hidden items-center gap-6 text-sm font-bold lg:flex">
            <Link href="/" className="text-[var(--slot4-accent)]">Home</Link>
            <Link href={mediaDistributionRoute} className="hover:text-[var(--slot4-accent)]">Media Distribution</Link>
            <Link href="/about" className="hover:text-[var(--slot4-accent)]">About</Link>
            <Link href="/contact" className="hover:text-[var(--slot4-accent)]">Contact</Link>
          </nav>
          <form action="/search" className="ml-auto flex min-w-0 flex-1 items-center rounded-md bg-white/10 lg:max-w-[310px] lg:flex-none">
            <Search className="ml-4 h-4 w-4 text-white/65" />
            <input name="q" type="search" placeholder="Search media coverage" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-xs font-bold outline-none placeholder:text-white/45" />
          </form>
          
        </div>
      </div>

      {open ? (
        <div className="border-t border-black/10 bg-white px-4 py-4 lg:hidden">
          <div className="grid gap-2">
            {[{ label: 'Home', href: '/' }, { label: 'Media Distribution', href: mediaDistributionRoute }, { label: 'Search', href: '/search' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }, ...(session ? [{ label: `Signed in as ${session.name}`, href: '/create' }, { label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => (
              <Link key={`${item.label}-${item.href}`} href={item.href} onClick={() => setOpen(false)} className="rounded-md bg-[var(--slot4-panel-bg)] px-4 py-3 text-sm font-black uppercase tracking-[.08em]">{item.label}</Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
