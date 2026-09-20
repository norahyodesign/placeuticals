import * as React from 'react'
import { PltPortalContext } from './plt-portal-context'

type PltRootProps = React.ComponentProps<'div'>

export const PltRoot = React.forwardRef<HTMLDivElement, PltRootProps>(
  function PltRoot({ className, children, ...props }, forwardedRef) {
    const [container, setContainer] = React.useState<HTMLDivElement | null>(null)

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        setContainer(node)
        if (typeof forwardedRef === 'function') forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      },
      [forwardedRef],
    )

    return (
      <div ref={setRefs} className={['plt-root', className].filter(Boolean).join(' ')} {...props}>
        <PltPortalContext.Provider value={container}>{children}</PltPortalContext.Provider>
      </div>
    )
  },
)
