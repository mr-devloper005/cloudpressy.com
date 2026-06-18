'use client'

import { Facebook, Linkedin, Mail, MapPin, Megaphone, Phone, Youtube } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'



export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-white text-[var(--slot4-page-text)]">
        <section className="relative min-h-[430px] overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
          <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1800&q=80" alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(25,56,69,.92),rgba(25,56,69,.45))]" />
          <div className="relative mx-auto flex min-h-[430px] max-w-[1280px] items-center px-4 py-16 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.contact.eyebrow}</p>
              <h1 className="logistics-display mt-4 text-7xl leading-none sm:text-8xl">Contact</h1>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1280px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:py-24">
          <div>
            <h2 className="logistics-display text-6xl leading-[.95] sm:text-7xl">{pagesContent.contact.title}</h2>
            <p className="mt-6 max-w-xl text-xl font-semibold leading-8 text-[var(--slot4-muted-text)]">{pagesContent.contact.description}</p>
            <div className="mt-10 grid gap-4">
              {/* {contacts.map((item) => (
                <div key={item.label} className="flex items-center gap-4 text-lg font-semibold">
                  <item.icon className="h-5 w-5 text-[var(--slot4-accent)]" />
                  {item.label}
                </div>
              ))} */}
            </div>
          </div>
          <div className="rounded-[1rem] bg-[var(--slot4-panel-bg)] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Megaphone className="h-6 w-6 text-[var(--slot4-accent)]" />
              <h2 className="text-3xl font-black">{pagesContent.contact.formTitle}</h2>
            </div>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
