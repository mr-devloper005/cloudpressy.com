import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-white text-[var(--slot4-page-text)]">
        <section className="relative overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
          <img src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1800&q=80" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(25,56,69,.96),rgba(25,56,69,.55))]" />
          <div className="relative mx-auto max-w-[1280px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.about.badge}</p>
            <h1 className="logistics-display mt-5 max-w-5xl text-6xl leading-[.92] sm:text-8xl">{pagesContent.about.title}</h1>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1280px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-24">
          <article>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">About {SITE_CONFIG.name}</p>
            <p className="mt-6 max-w-3xl text-3xl font-black leading-[1.2] sm:text-4xl">{pagesContent.about.description}</p>
            <div className="mt-8 grid gap-5 text-lg font-semibold leading-8 text-[var(--slot4-muted-text)]">
              {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <Link href="/search" className="mt-9 inline-flex items-center gap-2 rounded-md bg-[var(--slot4-accent)] px-6 py-4 text-xs font-black uppercase tracking-[.16em] text-white">
              Explore the archive <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
          <aside className="grid gap-4">
            {pagesContent.about.values.map((value, index) => (
              <div key={value.title} className="animate-in-view rounded-[1rem] border border-black/10 bg-[var(--slot4-panel-bg)] p-7">
                <div className="flex items-center justify-between">
                  <CheckCircle2 className="h-6 w-6 text-[var(--slot4-accent)]" />
                  <span className="text-xs font-black text-[var(--slot4-soft-muted-text)]">0{index + 1}</span>
                </div>
                <h2 className="mt-6 text-2xl font-black">{value.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
              </div>
            ))}
          </aside>
        </section>

        <section className="bg-[var(--slot4-dark-bg)] text-white">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <h2 className="logistics-display max-w-3xl text-5xl leading-none sm:text-6xl">Media updates built for reach and recall.</h2>
            <Link href="/contact" className="inline-flex w-fit rounded-md bg-[var(--slot4-accent)] px-6 py-4 text-xs font-black uppercase tracking-[0.18em]">Contact the desk</Link>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
