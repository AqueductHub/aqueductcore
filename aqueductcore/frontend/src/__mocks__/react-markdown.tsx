import { PropsWithChildren } from 'react'

// issue: https://github.com/remarkjs/react-markdown/issues/635#issuecomment-1080109162
function ReactMarkdown({ children }: { children: PropsWithChildren }) {
  return <>{children}</>;
}

export default ReactMarkdown;