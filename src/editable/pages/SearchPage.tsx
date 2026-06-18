import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Media post'

  return (
    <Link href={href} className="group grid gap-5 rounded-[1rem] bg-white p-4 shadow-[0_14px_40px_rgba(25,56,69,.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(25,56,69,.14)] sm:grid-cols-[220px_1fr]">
      <img src={getEditablePostImage(post)} alt="" className="aspect-[16/10] w-full rounded-[.75rem] object-cover" />
      <div className="self-center">
        <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{taskLabel}</span>
        </div>
        <h2 className="mt-3 line-clamp-2 text-2xl font-black leading-tight tracking-[-0.025em] group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 180)}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em]">Open result <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : []
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="relative overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
          <img src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1800&q=80" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(25,56,69,.96),rgba(25,56,69,.55))]" />
          <div className="relative mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.search.hero.badge}</p>
            <h1 className="logistics-display mt-5 max-w-4xl text-6xl leading-[.92] sm:text-8xl">{pagesContent.search.hero.title}</h1>
            <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white/78">{pagesContent.search.hero.description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8">
          <form action="/search" className="-mt-24 rounded-[1.25rem] bg-white p-5 shadow-[0_22px_60px_rgba(25,56,69,.16)] sm:p-6">
            <input type="hidden" name="master" value="1" />
            <label className="flex items-center gap-3 rounded-md border border-black/10 bg-white px-4 py-3">
              <Search className="h-5 w-5 text-[var(--slot4-accent)]" />
              <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:text-current/35" />
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-3">
                <Filter className="h-4 w-4 text-[var(--slot4-accent)]" />
                <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-current/35" />
              </label>
              <select name="task" defaultValue={task} className="rounded-md border border-black/10 bg-white px-4 py-3 text-sm font-black outline-none">
                <option value="">All content types</option>
                {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
            </div>
            <button className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-md bg-[var(--slot4-accent)] px-6 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-[var(--slot4-dark-bg)]" type="submit">Search</button>
          </form>

          <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--slot4-soft-muted-text)]">{results.length} results</p>
              <h2 className="logistics-display mt-2 text-5xl leading-none">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/create" className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-xs font-black uppercase shadow-sm">Create post <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-8 grid gap-6">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-[1rem] border border-dashed border-black/20 bg-white p-10 text-center">
              <p className="text-2xl font-black tracking-[-0.04em]">No real posts matched this search.</p>
              <p className="mt-3 text-sm font-semibold text-[var(--slot4-muted-text)]">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
