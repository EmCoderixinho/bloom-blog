import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

// Raw HTML is not enabled, so editor content can't inject markup.
const components: Components = {
  h2: (props) => <h2 className="mt-10 mb-3 text-2xl leading-tight font-bold tracking-tight" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-2 text-lg font-semibold" {...props} />,
  p: (props) => <p className="my-4" {...props} />,
  ul: (props) => <ul className="my-4 flex list-disc flex-col gap-1.5 pl-6 marker:text-primary" {...props} />,
  ol: (props) => <ol className="my-4 flex list-decimal flex-col gap-1.5 pl-6" {...props} />,
  a: (props) => <a className="font-semibold text-foreground underline underline-offset-4" {...props} />,
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  blockquote: (props) => <blockquote className="my-8 rounded-xl bg-muted px-6 py-5 [&>p]:my-0" {...props} />,
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="text-[17px] leading-[1.7] text-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
