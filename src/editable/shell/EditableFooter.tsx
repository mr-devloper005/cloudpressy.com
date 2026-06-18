'use client'

import Link from 'next/link'
import { ArrowRight, Mail, MapPin, ShipWheel } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { mediaDistributionRoute } from '@/config/media-distribution-route'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--slot4-page-bg)] px-4 pb-4 pt-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px] rounded-[1.5rem] bg-[var(--slot4-dark-bg)] px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
        <div className="flex flex-col gap-8 border-b border-white/20 pb-10 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3 text-xl font-black">
            <img src="/favicon.ico" alt="Logo" className="h-8 w-8 text-[var(--slot4-accent)]" />
            {SITE_CONFIG.name}
          </Link>
          
        </div>

        <div className="grid gap-10 pt-10 lg:grid-cols-[1.1fr_.65fr_.65fr_.9fr]">
          <div>
            <p className="max-w-sm text-base font-semibold leading-7 text-white/78">{globalContent.footer.description || SITE_CONFIG.description}</p>
            <p className="mt-8 text-sm font-bold text-white/70">Powered by {SITE_CONFIG.name}</p>
          </div>
          <div>
            <h3 className="text-lg font-black">Navigation</h3>
            <div className="mt-4 grid gap-3">
              <Link href="/" className="text-sm font-bold hover:text-[var(--slot4-accent)]">Home</Link>
              <Link href={mediaDistributionRoute} className="text-sm font-bold hover:text-[var(--slot4-accent)]">Media Distribution</Link>
              <Link href="/search" className="group inline-flex items-center gap-2 text-sm font-bold hover:text-[var(--slot4-accent)]">Search <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/contact" className="text-sm font-bold hover:text-[var(--slot4-accent)]">Contact</Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black">Publication</h3>
            <div className="mt-4 grid gap-3">
              <Link href="/about" className="text-sm font-bold hover:text-[var(--slot4-accent)]">About us</Link>
              {session ? (
                <>
                  <Link href="/create" className="text-sm font-bold hover:text-[var(--slot4-accent)]">Create</Link>
                  <button onClick={logout} className="text-left text-sm font-bold hover:text-[var(--slot4-accent)]">Logout {session.name}</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold hover:text-[var(--slot4-accent)]">Log in</Link>
                  <Link href="/signup" className="text-sm font-bold hover:text-[var(--slot4-accent)]">Sign up</Link>
                </>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black">Our Headquarter</h3>
            <p className="mt-4 max-w-sm text-sm font-semibold leading-7 text-white/78">Media Distribution Desk, Signal House 70, Digital Press Avenue.</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-white hover:text-[var(--slot4-accent)]">
             
            </Link>
          </div>
        </div>
      </div>
      <div className="px-4 py-5 text-center text-[10px] font-black uppercase tracking-[.18em] text-[var(--slot4-soft-muted-text)]">
        © {year} {SITE_CONFIG.name}. Media distribution intelligence.
      </div>
    </footer>
  )
}
