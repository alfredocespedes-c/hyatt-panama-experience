import { FormEvent, lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { createDataService } from './lib/dataService'
import { clearDraft, loadDraft, saveDraft } from './lib/formState'
import { FieldKey, FormData, validateField } from './lib/validation'

const ImmersiveModel = lazy(() => import('./scene/ImmersiveModel'))

type Phase = 'welcome' | 'journey' | 'form' | 'complete'

const fields: Array<{ key: FieldKey; label: string; hint: string; type: 'text' | 'email'; autoComplete: string }> = [
  { key: 'generalManager', label: 'Name of General Manager', hint: 'Who leads your property?', type: 'text', autoComplete: 'name' },
  { key: 'foodBeverageDirector', label: 'Name of Food & Beverage Director', hint: 'Who shapes the guest dining experience?', type: 'text', autoComplete: 'name' },
  { key: 'hotelName', label: 'Hotel Name', hint: 'Your property or place of work', type: 'text', autoComplete: 'organization' },
  { key: 'email', label: 'e-Mail contact', hint: 'Where may we reach you?', type: 'email', autoComplete: 'email' },
]

function canUseWebGL() {
  if (typeof window === 'undefined' || typeof window.WebGLRenderingContext === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

function ArchitecturalField({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const [modelReady, setModelReady] = useState(false)
  const [webGL] = useState(canUseWebGL)
  return (
    <div className={`architecture ${active ? 'architecture--active' : ''} ${modelReady ? 'architecture--webgl' : ''}`} aria-hidden="true">
      {webGL && (
        <Suspense fallback={null}>
          <ImmersiveModel active={active} reducedMotion={reducedMotion} onReady={() => setModelReady(true)} />
        </Suspense>
      )}
      <div className="model-fallback">
      <div className="latitude latitude--one" />
      <div className="latitude latitude--two" />
      <svg className="city" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
        <path className="coast" d="M-22 518 C55 473 117 506 168 471 C224 433 306 469 417 398" />
        <path className="avenue" d="M34 844 L177 440 M359 844 L225 440 M194 844 L202 428" />
        <g className="blocks">
          <path d="M18 706h72v138H18zM103 642h55v202h-55zM267 625h87v219h-87zM169 584h50v260h-50zM229 692h28v152h-28z" />
          <path d="M42 657h26v49H42zM119 601h24v41h-24zM287 571h44v54h-44zM181 524h28v60h-28z" />
        </g>
      </svg>
      <div className="approach-lines"><i /><i /><i /><i /></div>
      <div className="ballroom">
        <div className="ceiling"><i /><i /><i /></div>
        <div className="wall wall--left" />
        <div className="wall wall--right" />
        <div className="projection"><span /></div>
        <div className="floor-lines"><i /><i /><i /></div>
      </div>
      </div>
    </div>
  )
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('welcome')
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(() => loadDraft())
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reducedMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
  const inputRef = useRef<HTMLInputElement>(null)
  const service = useMemo(() => createDataService({
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  }), [])

  useEffect(() => {
    if (phase !== 'journey') return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    const timer = window.setTimeout(() => setPhase('form'), reduced ? 500 : 7600)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase === 'form') inputRef.current?.focus()
  }, [phase, step])

  function updateValue(value: string) {
    const next = { ...data, [fields[step].key]: value }
    setData(next)
    saveDraft(next)
    if (error) setError(null)
  }

  function advance(event: FormEvent) {
    event.preventDefault()
    const field = fields[step]
    const message = validateField(field.key, data[field.key])
    if (message) {
      setError(message)
      inputRef.current?.focus()
      return
    }
    setError(null)
    if (step < fields.length - 1) setStep((current) => current + 1)
    else void submit()
  }

  async function submit() {
    setIsSubmitting(true)
    setError(null)
    try {
      await service.submit(data)
      clearDraft()
      setPhase('complete')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not save your response. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const field = fields[step]

  return (
    <main className={`experience experience--${phase}`}>
      <ArchitecturalField active={phase !== 'welcome'} reducedMotion={reducedMotion} />
      <header className="masthead">
        <p className="wordmark">Hyatt <span aria-hidden="true">×</span> PepsiCo</p>
        <p className="place">Panama City · 19 Oct 2026</p>
      </header>

      {phase === 'welcome' && (
        <section className="welcome" aria-labelledby="welcome-title">
          <div className="welcome__measure">
            <p className="location">Calle 52 / Ricardo Arias</p>
            <h1 id="welcome-title">Enter the<br />Regency Ballroom</h1>
          </div>
          <div className="welcome__actions">
            <button className="primary-action" onClick={() => setPhase('journey')}>Begin the experience <span className="action-line" aria-hidden="true" /></button>
            <button className="text-action" onClick={() => setPhase('form')}>Skip directly to questions</button>
          </div>
        </section>
      )}

      {phase === 'journey' && (
        <section className="journey" aria-live="polite">
          <p className="journey__caption"><span>Approaching</span> Regency Ballroom · 483 m²</p>
          <button className="skip-action" onClick={() => setPhase('form')}>Skip to questions</button>
        </section>
      )}

      {phase === 'form' && (
        <section className="form-scene" aria-labelledby="question-title">
          <div className="form-progress" aria-label={`Question ${step + 1} of ${fields.length}`}>
            <span>{String(step + 1).padStart(2, '0')}</span>
            <div className="progress-rule"><i style={{ transform: `scaleX(${(step + 1) / fields.length})` }} /></div>
            <span>{String(fields.length).padStart(2, '0')}</span>
          </div>
          <form className="question" onSubmit={advance} noValidate>
            <p className="question__hint">{field.hint}</p>
            <h1 id="question-title">{field.label}</h1>
            <label className="sr-only" htmlFor={field.key}>{field.label}</label>
            <input
              ref={inputRef}
              id={field.key}
              name={field.key}
              type={field.type}
              autoComplete={field.autoComplete}
              value={data[field.key]}
              onChange={(event) => updateValue(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'field-error' : undefined}
              placeholder={field.type === 'email' ? 'name@hotel.com' : 'Type your answer'}
              disabled={isSubmitting}
            />
            <div className="question__footer">
              <div className="message" aria-live="assertive">
                {error ? <p id="field-error">{error}</p> : <p>Your progress is saved on this device.</p>}
              </div>
              <div className="question__controls">
                {step > 0 && <button type="button" className="back-action" onClick={() => { setStep((current) => current - 1); setError(null) }} disabled={isSubmitting}>Back</button>}
                <button type="submit" className="continue-action" disabled={isSubmitting}>
                  {isSubmitting ? <><span className="spinner" /> Saving</> : step === fields.length - 1 ? 'Submit response' : 'Continue'}
                </button>
              </div>
            </div>
          </form>
          <p className="privacy-note">Your four responses are used only for event follow-up.</p>
        </section>
      )}

      {phase === 'complete' && (
        <section className="complete" aria-labelledby="complete-title">
          <div className="complete__mark" aria-hidden="true"><i /><i /></div>
          <p>Response received</p>
          <h1 id="complete-title">Thank you.<br />You’re on the list.</h1>
          <div className="complete__details">
            <span>Regency Ballroom</span>
            <span>{service.mode === 'demo' ? 'Saved to this device · Demo mode' : 'Securely saved'}</span>
          </div>
        </section>
      )}
    </main>
  )
}
