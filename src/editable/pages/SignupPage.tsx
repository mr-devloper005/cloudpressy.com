import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, PenLine } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] px-4 py-12 text-[var(--slot4-page-text)] sm:px-6 lg:px-8">
        <section className="mx-auto grid min-h-[calc(100vh-14rem)] max-w-[1120px] overflow-hidden rounded-[1.25rem] bg-white shadow-[0_20px_70px_rgba(25,56,69,.12)] lg:grid-cols-[.95fr_1.05fr]">
          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
            <PenLine className="h-8 w-8 text-[var(--slot4-accent)]" />
            <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Create account</p>
            <h1 className="mt-3 text-4xl font-black">{pagesContent.auth.signup.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className="mt-6 border-t border-black/10 pt-5 text-sm text-[var(--slot4-muted-text)]">
              Already have an account? <Link href="/login" className="font-black text-[var(--slot4-accent)] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link>
            </p>
          </div>
          <div className="flex flex-col justify-center bg-[var(--slot4-dark-bg)] p-8 text-white sm:p-12 lg:p-16">
            <CheckCircle2 className="h-10 w-10 text-[var(--slot4-accent)]" />
            <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.auth.signup.badge}</p>
            <h2 className="logistics-display mt-5 max-w-xl text-6xl leading-[0.92] sm:text-8xl">{pagesContent.auth.signup.title}</h2>
            <p className="mt-6 max-w-lg text-sm font-semibold leading-8 text-white/68">{pagesContent.auth.signup.description}</p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
