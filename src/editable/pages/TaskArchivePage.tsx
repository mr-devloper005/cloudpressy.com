import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Search, Newspaper, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { fetchSiteFeed, type SiteFeedPagination, type SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { mediaDistributionRoute } from '@/config/media-distribution-route'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
const getPostType = (post: SitePost) => asText(getContent(post).type).toLowerCase()
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const isPublishedPost = (post: SitePost) => {
  const status = typeof (post as any).status === 'string' ? String((post as any).status).toUpperCase() : ''
  return !status || status === 'PUBLISHED'
}

const isMediaDistributionPost = (post: SitePost) => {
  const type = getPostType(post)
  if (type === 'comment') return false
  if (['mediadistribution', 'media-distribution', 'media_distribution'].includes(type)) return true
  const configuredType = SITE_CONFIG.tasks.find((item) => item.key === 'mediaDistribution')?.contentType?.toLowerCase()
  if (configuredType && type === configuredType) return true
  const tags = Array.isArray(post.tags) ? post.tags.map((tag) => String(tag).toLowerCase()) : []
  return tags.some((tag) => ['mediadistribution', 'media-distribution', 'media_distribution', 'media', 'press', 'press-release', 'news'].includes(tag))
}

const paginateRealPosts = (posts: SitePost[], page: number, limit: number): { posts: SitePost[]; pagination: SiteFeedPagination } => {
  const total = posts.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  return {
    posts: posts.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    },
  }
}

async function fetchEditableRealMediaPosts({ page, limit, category }: { page: number; limit: number; category: string }) {
  const normalizedCategory = category === 'all' ? '' : normalizeCategory(category)
  const configuredType = SITE_CONFIG.tasks.find((item) => item.key === 'mediaDistribution')?.contentType
  const attempts = [
    configuredType,
    'mediaDistribution',
    mediaDistributionRoute.replace(/^\//, ''),
    '',
  ].filter((value, index, list): value is string => typeof value === 'string' && list.indexOf(value) === index)

  const seen = new Map<string, SitePost>()
  for (const taskAlias of attempts) {
    const feed = await fetchSiteFeed<SitePost>(1000, {
      fresh: true,
      timeoutMs: 5000,
      ...(taskAlias ? { task: taskAlias } : {}),
      ...(normalizedCategory ? { category: normalizedCategory } : {}),
    }).catch(() => null)

    for (const post of feed?.posts || []) {
      if (!isPublishedPost(post) || getPostType(post) === 'comment') continue
      const rawCategory = getCategory(post, '')
      if (normalizedCategory && normalizeCategory(rawCategory) !== normalizedCategory) continue
      if (taskAlias || isMediaDistributionPost(post) || SITE_CONFIG.tasks.filter((item) => item.enabled).length === 1) {
        seen.set(post.slug || post.id || post.title, post)
      }
    }
    if (seen.size) break
  }

  return paginateRealPosts(Array.from(seen.values()), page, limit)
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  mediaDistribution: { icon: Newspaper, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Newswire cards prioritize source, category, headline, and publication-ready summaries.', badge: 'News' },
  article: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Readable editorial cards with room for headlines and excerpts.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Directory cards highlight company identity, location, contacts, and service details.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Offer-board cards prioritize price, location, condition, and quick action.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', promise: 'Gallery-first browsing with strong visuals and compact captions.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', promise: 'Bookmark cards stay mostly text-based so saved resources scan quickly.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards surface file context, download intent, and summary.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', promise: 'Profile cards focus on identity, short bio, and direct discovery.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  let { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category, fresh: true })
  if (task === 'mediaDistribution' && !posts.length) {
    const recovered = await fetchEditableRealMediaPosts({ page, limit: 24, category })
    posts = recovered.posts
    pagination = recovered.pagination
  }
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = { '--archive-bg': preset.colors.background, '--archive-text': preset.colors.foreground, '--archive-surface': preset.colors.surface, '--archive-accent': preset.colors.accent } as CSSProperties
  const dynamicCategories = Array.from(new Map([
    ...CATEGORY_OPTIONS,
    ...posts.map((post) => {
      const raw = getCategory(post, '')
      return raw ? { name: raw, slug: normalizeCategory(raw) } : null
    }).filter((item): item is { name: string; slug: string } => Boolean(item)),
  ].map((item) => [item.slug, item])).values())
  const categoryLabel = category === 'all' ? 'All categories' : dynamicCategories.find((item) => item.slug === category)?.name || category

  if (task === 'mediaDistribution' || task === 'article') {
    return (
      <EditorialArchive
        posts={posts}
        pagination={pagination}
        category={category}
        categoryLabel={categoryLabel}
        categories={dynamicCategories}
        basePath={basePath}
        label={label}
      />
    )
  }

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="rounded-[2.5rem] border border-[var(--editable-border)] bg-[var(--archive-surface)] p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--archive-accent)]"><Icon className="h-4 w-4" /> {label}</div>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.07em] sm:text-6xl">{voice?.headline || `Browse ${label}`}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 opacity-70">{voice?.description || SITE_CONFIG.description}</p>
            <div className="mt-6 rounded-[1.5rem] border border-[var(--editable-border)] bg-white/55 p-4 text-sm font-bold leading-7 opacity-75">{deck.promise}</div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={basePath} className="rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-[var(--archive-bg)]">Browse all</Link>
              <Link href="/search" className="rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-black">Search posts</Link>
            </div>
          </div>

          <form action={basePath} className="self-end rounded-[2rem] border border-[var(--editable-border)] bg-white/70 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] opacity-55"><Filter className="h-4 w-4" /> Filter</div>
            <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-2xl border border-[var(--editable-border)] bg-white px-4 text-sm font-bold outline-none">
              <option value="all">All categories</option>
              {dynamicCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="mt-3 h-12 w-full rounded-2xl bg-[var(--archive-text)] text-sm font-black text-[var(--archive-bg)]">Apply</button>
            <p className="mt-3 text-xs font-bold opacity-55">Showing: {categoryLabel}</p>
          </form>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-16 sm:px-6 lg:px-8">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[var(--editable-border)] bg-white/60 p-10 text-center">
              <Search className="mx-auto h-8 w-8 opacity-45" />
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">No posts found</h2>
              <p className="mt-2 text-sm opacity-65">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
            <span className="rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-[var(--archive-bg)]">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function EditorialArchive({
  posts,
  pagination,
  category,
  categoryLabel,
  categories,
  basePath,
  label,
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  categoryLabel: string
  categories: { name: string; slug: string }[]
  basePath: string
  label: string
}) {
  const page = pagination.page || 1
  const latest = posts.slice(0, 3)
  const services = ['Press Release Routing', 'Newswire Pickup', 'Campaign Syndication', 'Brand Announcements', 'Public Relations', 'Coverage Tracking']

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-white text-[var(--slot4-page-text)]">
        <section className="relative min-h-[430px] overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
          <img src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1800&q=80" alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(25,56,69,.95),rgba(25,56,69,.55))]" />
          <div className="relative mx-auto flex min-h-[430px] max-w-[1280px] items-center px-4 py-16 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Media distribution archive</p>
              <h1 className="logistics-display mt-4 max-w-4xl text-6xl leading-[.92] sm:text-8xl">
                {category === 'all' ? label : categoryLabel}
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/78">
                Real published posts, press-ready updates, campaign notes, and public announcements organized for fast discovery.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-white">
          <div className="mx-auto flex max-w-[1280px] gap-7 overflow-x-auto px-4 py-4 text-xs font-black uppercase tracking-[0.16em] sm:px-6 lg:px-8">
            <Link href={basePath} className={category === 'all' ? 'text-[var(--slot4-accent)]' : 'hover:text-[var(--slot4-accent)]'}>Latest</Link>
            {categories.slice(0, 8).map((item) => (
              <Link key={item.slug} href={pageHref(basePath, item.slug, 1)} className={category === item.slug ? 'text-[var(--slot4-accent)]' : 'whitespace-nowrap hover:text-[var(--slot4-accent)]'}>
                {item.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1280px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
          <div>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
              <h2 className="logistics-display text-5xl leading-none sm:text-6xl">Latest posts</h2>
              <form action={basePath} className="flex rounded-md border border-black/10 bg-white shadow-sm">
                <select name="category" defaultValue={category} className="h-12 min-w-44 bg-transparent px-3 text-xs font-black uppercase outline-none">
                  <option value="all">All categories</option>
                  {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                <button className="h-12 rounded-r-md bg-[var(--slot4-dark-bg)] px-5 text-xs font-black uppercase tracking-[0.14em] text-white">Filter</button>
              </form>
            </div>

            {posts.length ? (
              <div className="grid gap-8">
                {posts.map((post, index) => (
                  <Link key={post.id || post.slug} href={`${basePath}/${post.slug}`} className="group grid gap-6 rounded-[1rem] bg-white p-4 shadow-[0_16px_45px_rgba(25,56,69,.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(25,56,69,.14)] md:grid-cols-[320px_1fr]">
                    <img src={getImage(post)} alt="" className="aspect-[16/10] w-full rounded-[.75rem] object-cover" />
                    <div className="self-center">
                      <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <span>{getCategory(post, label)}</span>
                      </div>
                      <h3 className="mt-4 text-3xl font-black leading-[1.08] tracking-[-.025em] group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
                      
                      <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em]">Open media post <ArrowRight className="h-4 w-4" /></span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-[1rem] border border-dashed border-black/20 bg-[var(--slot4-panel-bg)] p-12 text-center">
                <Search className="mx-auto h-8 w-8" />
                <h2 className="mt-4 text-3xl font-black">No real posts found</h2>
                <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Publish a media distribution post or try another category.</p>
              </div>
            )}

            <div className="mt-10 flex items-center justify-center gap-2">
              {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-md border border-black/10 bg-white px-5 py-3 text-xs font-black uppercase">Previous</Link> : null}
              <span className="rounded-md bg-[var(--slot4-accent)] px-5 py-3 text-xs font-black uppercase text-white">Page {page} / {pagination.totalPages || 1}</span>
              {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-md border border-black/10 bg-white px-5 py-3 text-xs font-black uppercase">Next</Link> : null}
            </div>
          </div>

          <aside className="space-y-10">
            {latest.length ? (
              <div>
                <h3 className="flex items-center gap-4 text-lg font-black">Latest News <span className="h-px flex-1 bg-black/10" /></h3>
                <div className="mt-5 grid gap-5">
                  {latest.map((post) => (
                    <Link key={post.id || post.slug} href={`${basePath}/${post.slug}`} className="grid grid-cols-[96px_1fr] gap-4">
                      <img src={getImage(post)} alt="" className="h-24 w-24 rounded-lg object-cover" />
                      <h4 className="text-base font-black leading-snug hover:text-[var(--slot4-accent)]">{post.title}</h4>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
            <div>
              <h3 className="flex items-center gap-4 text-lg font-black">Our Services <span className="h-px flex-1 bg-black/10" /></h3>
              <div className="mt-5 rounded-[1rem] bg-[var(--slot4-panel-bg)] p-5">
                {services.map((service) => (
                  <Link key={service} href="/contact" className="flex items-center gap-3 border-b border-black/10 py-4 text-lg font-black last:border-b-0">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--slot4-accent)] text-xs text-white">+</span>
                    {service}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">{category}</span>
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--archive-accent)]">Story {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-2 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 opacity-65">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-[var(--editable-border)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--archive-bg)] ring-1 ring-[var(--editable-border)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--archive-text)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--archive-bg)]">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[var(--editable-border)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 opacity-65">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold opacity-70 sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[var(--archive-text)] p-5 text-[var(--archive-bg)]">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-black leading-[1] tracking-[-0.07em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold opacity-75">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt="" className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl object-cover opacity-80" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-65">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--archive-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.7rem] border border-[var(--editable-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-[var(--archive-text)] hover:text-[var(--archive-bg)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-70">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="group rounded-[2rem] border border-[var(--editable-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[var(--archive-text)] p-5 text-[var(--archive-bg)]"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[var(--archive-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">{category}</span>
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-65">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[2rem] border border-[var(--editable-border)] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--archive-bg)] ring-1 ring-[var(--editable-border)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 opacity-45" />}
      </div>
      <h2 className="mt-5 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-6 opacity-65">{getSummary(post)}</p>
    </Link>
  )
}
