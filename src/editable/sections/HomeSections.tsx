import Link from 'next/link'
import { ArrowRight, CheckCircle2, Search, Send, ShieldCheck, Timer, Truck } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { mediaDistributionRoute } from '@/config/media-distribution-route'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { CompactIndexCard, getEditableExcerpt, postHref, RailPostCard } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const heroImage = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1800&q=80'
const portImage = 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1400&q=80'
const trackingImage = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80'

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[0]
  const trending = posts.slice(1, 6)
  const heroTitle = pagesContent.home.hero.title.join(' ')

  return (
    <section className="bg-white">
      <div className="relative min-h-[680px] overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(25,56,69,.96),rgba(25,56,69,.68),rgba(25,56,69,.22))]" />
        <div className="relative mx-auto flex min-h-[680px] max-w-[1280px] flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <p className="animate-in-view text-xs font-black uppercase tracking-[.26em] text-[var(--slot4-accent)]">{pagesContent.home.hero.badge}</p>
          <h1 className="logistics-display animate-in-view mt-5 max-w-5xl text-6xl leading-[.92] sm:text-8xl lg:text-[8rem]">{heroTitle}</h1>
          <p className="animate-in-view mt-7 max-w-2xl text-lg font-semibold leading-8 text-white/78">{pagesContent.home.hero.description}</p>
          <div className="animate-in-view mt-9 flex flex-wrap gap-3">
            <Link href={mediaDistributionRoute} className={dc.button.accent}>Browse distribution <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/create" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/45 bg-white/10 px-7 py-3.5 text-xs font-black uppercase tracking-[.12em] text-white backdrop-blur transition hover:bg-white hover:text-[var(--slot4-dark-bg)]">Create release</Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-16 max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <form action="/search" className="grid gap-4 rounded-[1.25rem] bg-white p-5 shadow-[0_22px_60px_rgba(25,56,69,.16)] lg:grid-cols-[1fr_1fr_1fr_auto]">
          <label className="grid gap-2 text-sm font-black">Campaign
            <input name="q" placeholder="Product launch" className="h-14 rounded-md border border-black/10 px-4 text-sm font-semibold outline-none focus:border-[var(--slot4-accent)]" />
          </label>
          <label className="grid gap-2 text-sm font-black">Audience
            <input name="category" placeholder="Business media" className="h-14 rounded-md border border-black/10 px-4 text-sm font-semibold outline-none focus:border-[var(--slot4-accent)]" />
          </label>
          <label className="grid gap-2 text-sm font-black">Source
            <input placeholder={SITE_CONFIG.name} className="h-14 rounded-md border border-black/10 px-4 text-sm font-semibold outline-none focus:border-[var(--slot4-accent)]" />
          </label>
          <button className="mt-auto h-14 rounded-md bg-[var(--slot4-accent)] px-8 text-sm font-black uppercase tracking-[.12em] text-white">Search</button>
        </form>
      </div>

      {lead ? (
        <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div className="animate-in-view overflow-hidden rounded-[1.25rem]">
              <img src={portImage} alt="" className="aspect-[4/5] w-full object-cover" />
            </div>
            <div className="animate-in-view">
              <p className="text-xs font-black uppercase tracking-[.24em] text-[var(--slot4-accent)]">Featured distribution</p>
              <h2 className="logistics-display mt-4 max-w-xl text-6xl leading-[.95] text-[var(--slot4-page-text)] sm:text-7xl">{lead.title}</h2>
              <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-[var(--slot4-muted-text)]">{getEditableExcerpt(lead, 220)}</p>
              <Link href={postHref(primaryTask, lead, primaryRoute)} className={`${dc.button.primary} mt-8`}>Open release <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>

          {trending.length ? (
            <aside className="mt-16 rounded-[1.25rem] bg-[var(--slot4-panel-bg)] p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="logistics-display text-5xl leading-none">Active media briefs</h2>
                <Link href={primaryRoute} className="text-xs font-black uppercase tracking-[.16em] text-[var(--slot4-accent)]">View archive</Link>
              </div>
              <div className="mt-4 grid gap-x-8 lg:grid-cols-2">
                {trending.map((post, index) => <CompactIndexCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
              </div>
            </aside>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 8)
  if (!railPosts.length) return null
  return (
    <section className="bg-white">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[.24em] text-[var(--slot4-accent)]">Media cards</p>
          <h2 className="logistics-display mt-3 text-6xl leading-[.95] sm:text-7xl">Smart distribution for every announcement</h2>
        </div>
        <div className={`${dc.layout.rail} mt-12`}>
          {railPosts.map((post, index) => <RailPostCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit(_props: HomeSectionProps) {
  const services = [
    ['01', 'Press release routing', 'Package announcements for fast editorial pickup.'],
    ['02', 'Campaign syndication', 'Keep distributed stories consistent across channels.'],
    ['03', 'Audience targeting', 'Organize content by category, source, and intent.'],
    ['04', 'Archive visibility', 'Make every update searchable after launch.'],
    ['05', 'Response tracking', 'Create clear next steps for contacts and leads.'],
  ]

  return (
    <section className="bg-white">
      <div className={`${dc.shell.section} ${dc.shell.sectionY} grid gap-12 lg:grid-cols-[.9fr_1.1fr]`}>
        <div>
          <h2 className="logistics-display text-6xl leading-[.96] sm:text-7xl">Tailored solutions for your media needs</h2>
          <img src={trackingImage} alt="" className="mt-16 hidden aspect-square w-full max-w-[270px] rounded-[1rem] object-cover lg:block" />
        </div>
        <div className="self-center">
          {services.map(([number, title, body]) => (
            <div key={title} className="animate-in-view grid grid-cols-[70px_1fr] gap-8 border-b border-black/10 py-6">
              <span className="text-2xl font-black">{number}</span>
              <div>
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-3 text-lg text-[var(--slot4-muted-text)]">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const collected = timeSections.flatMap((section) => section.posts)
  const source = (collected.length ? collected : posts).slice(0, 6)
  if (!source.length) return null
  return (
    <section className="bg-[var(--slot4-dark-bg)] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px] rounded-[1.25rem]">
        <div className="grid gap-8 px-2 py-10 lg:grid-cols-[1fr_.75fr] lg:items-end">
          <h2 className="logistics-display text-6xl leading-[.94] sm:text-7xl">Real-time tracking, stay in control</h2>
          <p className="max-w-md text-lg font-semibold leading-8 text-white/78">Monitor media distribution posts at every stage with a searchable release archive and connected detail pages.</p>
        </div>
        <div className="relative overflow-hidden rounded-[1rem]">
          <img src={trackingImage} alt="" className="h-[520px] w-full object-cover opacity-85" />
          <div className="absolute bottom-6 left-6 grid max-w-lg gap-3 rounded-[1rem] bg-white/90 p-5 text-[var(--slot4-page-text)] shadow-xl backdrop-blur">
            {source.slice(0, 3).map((post) => (
              <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="flex items-start gap-3 border-b border-black/10 pb-3 last:border-b-0 last:pb-0">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--slot4-accent)]" />
                <span className="text-sm font-black leading-5">{post.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  const items = [
    ['How fast can a release be prepared?', 'Use the create page to draft the post immediately after login.'],
    ['Can I search old media posts?', 'Yes, the search page scans real published posts across the active feed.'],
    ['Do detail pages support follow-up actions?', 'Yes, all detail actions are links or buttons with functional targets.'],
    ['What content works best?', 'Announcements, campaign updates, press releases, and coverage notes.'],
  ]

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="logistics-display text-6xl leading-[.95] sm:text-7xl">Have questions? We have answers</h2>
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          {items.map(([question, answer]) => (
            <details key={question} className="group mb-3 rounded-md bg-white p-5 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black">{question}<span className="text-2xl text-[var(--slot4-accent)]">+</span></summary>
              <p className="mt-4 text-base font-semibold leading-7 text-[var(--slot4-muted-text)]">{answer}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/create" className={dc.button.accent}><Send className="h-4 w-4" /> Create post</Link>
          <Link href="/contact" className={dc.button.primary}>Contact desk</Link>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[[Truck, 'Fast routing'], [ShieldCheck, 'Verified structure'], [Timer, 'Timely updates']].map(([Icon, label]) => (
            <div key={String(label)} className="animate-in-view rounded-[1rem] border border-black/10 bg-white p-6 text-center">
              <Icon className="mx-auto h-7 w-7 text-[var(--slot4-accent)]" />
              <p className="mt-4 text-lg font-black">{String(label)}</p>
              <p className="mt-2 text-sm font-semibold text-[var(--slot4-muted-text)]">Designed for {taskLabel('mediaDistribution').toLowerCase()} workflows.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
