import type { ReactNode } from 'react'
import { ExternalLink, FileUp } from 'lucide-react'
import { InteractiveCodeBlock } from '@/components/interactive-code-block'
import { courseSectionId } from '@/lib/course-navigation'

function inline(text: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
  const parts = text.split(pattern).filter(Boolean)

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-foreground">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="rounded bg-secondary px-1.5 py-0.5 text-[0.9em] font-semibold text-secondary-foreground">{part.slice(1, -1)}</code>
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      const isDownload = link[2].startsWith('/downloads/')
      return (
        <a
          key={index}
          href={link[2]}
          {...(isDownload
            ? { download: '' }
            : { target: '_blank', rel: 'noopener noreferrer' })}
          className={
            isDownload
              ? 'inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90'
              : 'font-semibold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary'
          }
        >
          <span aria-hidden="true">{isDownload ? '⬇️' : '📖'}</span>
          {link[1]}
        </a>
      )
    }
    return part
  })
}

function isBlockStart(line: string, nextLine = '') {
  return (
    !line.trim() ||
    /^#{1,6} /.test(line) ||
    /^```/.test(line) ||
    /^> /.test(line) ||
    /^[-*] /.test(line) ||
    /^\d+\. /.test(line) ||
    /^---+$/.test(line) ||
    (line.includes('|') && /^\s*\|?[\s:|-]+\|/.test(nextLine))
  )
}

export function CourseMarkdown({
  markdown,
  delivery = {
    fileName: 'Modulo2_Nombre_Apellido.pdf',
    items: [
      'Nombre completo',
      'Nombre del curso',
      'Módulo 2',
      'Fecha',
      'Todas las partes en el orden solicitado',
    ],
  },
  deliveryVariants = [],
}: {
  markdown: string
  delivery?: {
    fileName: string
    items: string[]
  }
  deliveryVariants?: Array<{
    match: string
    fileName: string
    items: string[]
    title?: string
    stepLabel?: string
    description?: string
    itemsLabel?: string
    fileNameLabel?: string
    buttonLabel?: string
  }>
}) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const nodes: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed || /^---+$/.test(trimmed)) {
      index += 1
      continue
    }

    if (trimmed === '<details>') {
      const closingIndex = lines.findIndex(
        (candidate, candidateIndex) =>
          candidateIndex > index && candidate.trim() === '</details>',
      )
      if (closingIndex !== -1) {
        const summaryLine = lines[index + 1]?.trim() ?? ''
        const summary =
          summaryLine.match(/^<summary>(.+)<\/summary>$/)?.[1] ??
          'Mostrar contenido'
        const bodyStart = /^<summary>/.test(summaryLine) ? index + 2 : index + 1
        const body = lines.slice(bodyStart, closingIndex).join('\n').trim()

        nodes.push(
          <details
            key={index}
            className="my-6 rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <summary className="cursor-pointer font-bold text-primary">
              {summary}
            </summary>
            <div className="mt-5 border-t border-border pt-5">
              <CourseMarkdown
                markdown={body}
                delivery={delivery}
                deliveryVariants={deliveryVariants}
              />
            </div>
          </details>,
        )
        index = closingIndex + 1
        continue
      }
    }

    const youtube = trimmed.match(
      /^\[([^\]]+)\]\(https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]+)\)$/,
    )
    if (youtube) {
      nodes.push(
        <div key={index} className="my-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="aspect-video bg-foreground">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${youtube[2]}`}
              title={youtube[1]}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="p-4">
            <span className="mb-2 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
              🎥 {['kMxbcbmAZZs', 'aFQHlKGDEoM', '9GQBKXmegFM', 'M_7rdGVPmZY', '5NU9SUcdv6o', 'k8kPLA0FEQE'].includes(youtube[2]) ? 'Video opcional' : ['TePg7sCJr8E', 'wx92etmlHtc', 'rOQTEQkM96A', 'Bb7bUNu76gM', 'X5qFxPsVL4c', 'mbqXrtDbPIA', '4ILE0y58J00', '6ZKl3feb22I', 'bHuL0VvGZO0', 'cxbtYhXV78I', 'ps1WhgelV_E', 'IIbYX19L4dI', 'ldAfYgrjTi4', '6QzKFF_Bvfg', 'e4h5KmpH-oU', '8OQHGp6peSY', 'VkN96ZkyxzA', 'JRsEAhzXHGw', 'nNWV4eJUofg', 'FAJFMAaV9ao', 'MTkwmy1iizc', 'ZLY6X5u3zWw', 'eiQY3n8nNlw', 'BdWfEZ2aTAw', 'C-GZ-owYxEA', 'x-iTco25VGI', 'XpQ7uUXuPHg', 'pdZquGJGh0o', 'uCq7XP9CNag', '2ln694n-j1E', 'ErMT3ShkOL4', 'sxcKVwURuhk', 'oYBC7r5oSzk', 'hcn4Zc1T43A', 'jS01i00n78c', 'r2O59Rdcelw', 'JYmgIMfKjTQ', 'r4nzoY_NNbk', '_a_q6QAY62Y', 'DrhHkPI7spU', 'DoPChNy4NIc', 'xZnYIIkIaiw', 'wmNsecoZ_Go', 'NHRTC7iN9mI', 'HgXZAeonLQY', 'AWbeb-Z4DQg', 'PoUcplbntYo', 'DvXCPC8Z0KA'].includes(youtube[2]) ? 'Video recomendado' : 'Video obligatorio'}
            </span>
            <p className="font-bold text-card-foreground">{youtube[1]}</p>
          </div>
        </div>,
      )
      index += 1
      continue
    }

    const deliveryLink = trimmed.match(
      /^\[(Entregar [^\]]+)\]\((https:\/\/forms\.gle\/[^)]+)\)$/,
    )
    if (deliveryLink) {
      const variant = deliveryVariants.find((item) =>
        deliveryLink[1].toLowerCase().includes(item.match.toLowerCase()),
      )
      const deliveryContent = variant ?? delivery
      nodes.push(
        <div
          key={index}
          className="my-6 rounded-2xl border border-primary/20 bg-secondary p-5"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-background text-primary">
              <FileUp className="h-5 w-5" />
            </span>
            <div>
              <h4 className="font-bold text-foreground">
                {variant?.title ?? 'Entrega de la actividad'}
              </h4>
              <span className="mt-2 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                {variant?.stepLabel ?? 'Último paso del proyecto'}
              </span>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {variant?.description ??
                  'Una vez completado este proyecto, sube tu solución utilizando el siguiente formulario.'}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-background p-4 text-sm text-foreground">
            <p className="font-semibold">
              {variant?.itemsLabel ?? 'El archivo debe incluir:'}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {deliveryContent.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className="mt-3 text-muted-foreground">
              {variant?.fileNameLabel ?? 'Nombre del archivo'}:{' '}
              {deliveryContent.fileName}
            </p>
            <p className="mt-2 font-semibold text-primary">
              Antes de enviar, verifica que el archivo tenga el nombre solicitado.
            </p>
          </div>

          <a
            href={deliveryLink[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {variant?.buttonLabel ?? 'Entregar actividad'}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>,
      )
      index += 1
      continue
    }

    const heading = trimmed.match(/^(#{1,6}) (.+)$/)
    if (heading) {
      const level = heading[1].length
      const displayHeading = heading[2].replace(/^\d+\.\s*/, '')
      const content = inline(displayHeading)
      const id = courseSectionId(heading[2])
      const isPractice = /^Práctica guiada \d+/i.test(displayHeading)
      const isRequiredActivity = /^Actividad \d+/i.test(displayHeading)
      const isExercise =
        /^Ejercicio \d+/i.test(displayHeading) || isPractice || isRequiredActivity
      const isChallenge =
        /^Reto \d+/i.test(displayHeading) ||
        /producto con la línea de mayor importe/i.test(displayHeading)
      const isMiniProject =
        /mini proyecto|proyecto final|calculadora de compra|sistema de decisiones|plan de ahorro|clínica de algoritmos/i.test(displayHeading)
      const isEvaluation = /^Evaluación de dominio/i.test(displayHeading)
      if (level === 1) {
        nodes.push(
          <p id={id} key={index} className="mb-3 mt-10 scroll-mt-32 text-sm font-bold uppercase tracking-wide text-primary first:mt-0">
            {content}
          </p>,
        )
      } else if (level === 2) {
        nodes.push(
          <div id={id} key={index} className="scroll-mt-32">
            {(isExercise || isChallenge || isMiniProject || isEvaluation) && (
              <span className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                isChallenge
                  ? 'bg-accent text-accent-foreground'
                  : isMiniProject
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-primary'
              }`}>
                {isExercise && (
                  isPractice
                    ? '🧭 Práctica guiada'
                    : isRequiredActivity
                      ? '📝 Actividad obligatoria'
                      : '📝 Ejercicio'
                )}
                {isChallenge && '🚀 Reto'}
                {isMiniProject && '🎯 Mini proyecto'}
                {isEvaluation && '✅ Evaluación'}
              </span>
            )}
            <h2 className="mb-5 text-balance text-2xl font-extrabold text-foreground md:text-3xl">
              {content}
            </h2>
          </div>,
        )
      } else {
        nodes.push(
          <h3 id={id} key={index} className={`mb-3 mt-7 scroll-mt-32 text-xl font-bold text-foreground ${
            /^Pregunta \d+/i.test(displayHeading)
              ? 'rounded-xl border border-border bg-secondary px-4 py-3'
              : ''
          }`}>
            {content}
          </h3>,
        )
      }
      index += 1
      continue
    }

    if (/^```/.test(trimmed)) {
      const code: string[] = []
      index += 1
      while (index < lines.length && !/^```/.test(lines[index].trim())) {
        code.push(lines[index])
        index += 1
      }
      index += 1
      nodes.push(<InteractiveCodeBlock key={index}>{code.join('\n')}</InteractiveCodeBlock>)
      continue
    }

    if (/^> /.test(trimmed)) {
      const quote: string[] = []
      while (index < lines.length && /^> /.test(lines[index].trim())) {
        quote.push(lines[index].trim().slice(2))
        index += 1
      }
      nodes.push(
        <blockquote key={index} className="my-5 rounded-2xl border-l-4 border-accent bg-card p-5 text-lg leading-relaxed text-foreground shadow-sm">
          {quote.map((item, quoteIndex) => <p key={quoteIndex}>{inline(item)}</p>)}
        </blockquote>,
      )
      continue
    }

    if (/^[-*] /.test(trimmed)) {
      const items: string[] = []
      while (index < lines.length && /^[-*] /.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*] /, ''))
        index += 1
      }
      nodes.push(
        <ul key={index} className="my-4 space-y-2 pl-1">
          {items.map((item, itemIndex) => {
            const checkbox = item.match(/^\[([ xX])\] (.+)$/)
            return (
              <li key={itemIndex} className="flex items-start gap-3 leading-relaxed text-muted-foreground">
                <span className="mt-2 h-2 w-2 flex-none rounded-full bg-primary" />
                <span>{inline(checkbox ? checkbox[2] : item)}</span>
              </li>
            )
          })}
        </ul>,
      )
      continue
    }

    if (/^\d+\. /.test(trimmed)) {
      const items: string[] = []
      while (index < lines.length && /^\d+\. /.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\. /, ''))
        index += 1
      }
      nodes.push(
        <ol key={index} className="my-4 list-decimal space-y-2 pl-6 text-muted-foreground marker:font-bold marker:text-primary">
          {items.map((item, itemIndex) => <li key={itemIndex} className="pl-1 leading-relaxed">{inline(item)}</li>)}
        </ol>,
      )
      continue
    }

    if (
      line.includes('|') &&
      index + 1 < lines.length &&
      /^\s*\|?[\s:|-]+\|/.test(lines[index + 1])
    ) {
      const rows: string[][] = []
      const parseRow = (row: string) =>
        row.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim())
      const headers = parseRow(line)
      index += 2
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(parseRow(lines[index]))
        index += 1
      }
      nodes.push(
        <div key={index} className="my-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-max border-collapse text-left text-sm">
            <thead className="bg-secondary text-secondary-foreground">
              <tr>{headers.map((cell, cellIndex) => <th key={cellIndex} className="px-4 py-3 font-bold">{inline(cell)}</th>)}</tr>
            </thead>
            <tbody className="bg-card text-muted-foreground">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-border">
                  {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3">{inline(cell)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }

    const paragraph: string[] = [trimmed]
    index += 1
    while (
      index < lines.length &&
      !isBlockStart(lines[index], lines[index + 1] ?? '')
    ) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    nodes.push(
      <p key={index} className="my-4 leading-relaxed text-muted-foreground">
        {inline(paragraph.join(' '))}
      </p>,
    )
  }

  return <>{nodes}</>
}
