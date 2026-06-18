'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, ImageIcon, Lock, Megaphone, Newspaper, PlusCircle, RadioTower, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  mediaDistribution: Newspaper,
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowRight,
}

const fieldClass = 'rounded-md border border-black/10 bg-white px-4 py-3 text-sm font-bold text-[var(--slot4-page-text)] outline-none transition placeholder:text-current/35 focus:border-[var(--slot4-accent)] focus:ring-4 focus:ring-orange-100'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const defaultTask = (enabledTasks.find((item) => item.key === 'mediaDistribution')?.key || enabledTasks[0]?.key || 'mediaDistribution') as TaskKey
  const [task, setTask] = useState<TaskKey>(defaultTask)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks.find((item) => item.key === 'mediaDistribution') || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'media-distribution',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="bg-[var(--slot4-page-bg)] px-4 py-12 text-[var(--slot4-page-text)] sm:px-6 lg:px-8">
          <section className="mx-auto grid min-h-[calc(100vh-14rem)] max-w-[1120px] overflow-hidden rounded-[1.25rem] bg-white shadow-[0_20px_70px_rgba(25,56,69,.12)] lg:grid-cols-[.95fr_1.05fr]">
            <div className="relative flex flex-col justify-center bg-[var(--slot4-dark-bg)] p-8 text-white sm:p-12 lg:p-16">
              <Lock className="h-10 w-10 text-[var(--slot4-accent)]" />
              <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.create.locked.badge}</p>
              <h1 className="logistics-display mt-5 max-w-xl text-6xl leading-[0.92] sm:text-8xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-lg text-sm font-semibold leading-8 text-white/75">{pagesContent.create.locked.description}</p>
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
              <RadioTower className="h-8 w-8 text-[var(--slot4-accent)]" />
              <h2 className="mt-6 text-4xl font-black">Open the publishing workspace</h2>
              <p className="mt-4 text-base font-semibold leading-7 text-[var(--slot4-muted-text)]">Login to prepare a media distribution post with headline, source, campaign summary, image, and release body.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-md bg-[var(--slot4-accent)] px-6 py-3 text-sm font-black text-white">Login <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-6 py-3 text-sm font-black">Sign up</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="relative overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
          <img src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1800&q=80" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(25,56,69,.96),rgba(25,56,69,.55))]" />
          <div className="relative mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.create.hero.badge}</p>
            <h1 className="logistics-display mt-5 max-w-5xl text-6xl leading-[.92] sm:text-8xl">{pagesContent.create.hero.title}</h1>
            <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white/78">{pagesContent.create.hero.description}</p>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-8 lg:py-20">
          <aside className="space-y-6">
            <div className="rounded-[1rem] bg-white p-6 shadow-[0_16px_45px_rgba(25,56,69,.08)]">
              <Megaphone className="h-8 w-8 text-[var(--slot4-accent)]" />
              <h2 className="mt-5 text-3xl font-black">Distribution lanes</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-[var(--slot4-muted-text)]">Choose the content lane before drafting. Media distribution is selected by default for this site.</p>
              <div className="mt-6 grid gap-3">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  return (
                    <button key={item.key} type="button" onClick={() => setTask(item.key)} className={`rounded-md border p-4 text-left transition ${active ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent)] text-white shadow-[0_12px_30px_rgba(255,118,36,.25)]' : 'border-black/10 bg-[var(--slot4-panel-bg)] hover:-translate-y-0.5 hover:bg-white'}`}>
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-black">{item.label}</span>
                      </div>
                      <span className="mt-2 block text-xs font-semibold opacity-75">{item.description}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="rounded-[1rem] bg-[var(--slot4-dark-bg)] p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[.2em] text-[var(--slot4-accent)]">Signed in</p>
              <p className="mt-3 text-2xl font-black">{session.name}</p>
              <p className="mt-2 text-sm font-semibold text-white/65">{session.email}</p>
            </div>
          </aside>

          <form onSubmit={submit} className="rounded-[1rem] bg-white p-5 shadow-[0_18px_60px_rgba(25,56,69,.12)] sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Create {activeTask?.label || 'media post'}</p>
                <h2 className="mt-2 text-4xl font-black">{pagesContent.create.formTitle}</h2>
              </div>
              <span className="rounded-md bg-[var(--slot4-panel-bg)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em]">{task}</span>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-black">Headline
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Press release headline" required />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-black">Category
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Press release, campaign, coverage" />
                </label>
                <label className="grid gap-2 text-sm font-black">Source URL
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-black">Featured image URL
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Optional image for the release" />
              </label>
              <label className="grid gap-2 text-sm font-black">Distribution summary
                <textarea className={`${fieldClass} min-h-28`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary for cards and search results" required />
              </label>
              <label className="grid gap-2 text-sm font-black">Release body
                <textarea className={`${fieldClass} min-h-56`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main release content, campaign details, source notes, and calls to action" required />
              </label>
            </div>

            {created ? (
              <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <p className="flex items-center gap-2 text-sm font-black"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                <p className="mt-1 text-sm font-semibold opacity-80">{created.title}</p>
              </div>
            ) : null}

            <button type="submit" className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-md bg-[var(--slot4-accent)] px-6 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-[var(--slot4-dark-bg)]">
              <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
            </button>
          </form>
        </section>
      </main>
    </EditableSiteShell>
  )
}
