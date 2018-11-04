// @flow
import * as React from 'react'
import type { DisplayValues } from '../types'
import log from '../log'
import { getValue } from '../utils'
import errors from '../errors'
import { register, unregister, supportsMatchMedia } from './mediaQuery'
import ConfigContext from '../configProvider/context'
import {
  checkShouldShow,
  getMediaQueries,
  getSingleResolutionProps,
  hasTrueValues,
  isObject,
  type ShouldShow,
  sharedResolutionProperties,
} from './useResolution.logic'

type Props = { show?: DisplayValues }
type State = {
  shouldShow?: ShouldShow,
}

function useMedia({ show, combinedResolutionKeys, context, props }) {
  const queries = getQueries(show)
  const [shouldShow, setShouldShow] = React.useState(checkShouldShow(queries))

  function onMediaQueryChange(mq?: any = {}, alias: string) {
    if (shouldShow[alias] !== mq.matches) {
      setShouldShow({
        ...shouldShow,
        [alias]: mq.matches,
      })
    }
  }

  function getQueries(show?: DisplayValues) {

    const displayAliases = getValue(context, 'displayAliases')
    let queries = show

    if (!show && anyPropsUseResolutionFormat()) {
      queries = Object.keys(displayAliases)
    }

    return getMediaQueries(queries, displayAliases)
  }

  function anyPropsUseResolutionFormat() {
    return combinedResolutionKeys.some(key => {
      const { [key]: prop } = props

      return isObject(prop)
    })
  }


  React.useEffect(() => {
    Object.keys(queries).forEach(alias => {
      register(queries[alias], alias, onMediaQueryChange)
    })

    return () => Object.keys(queries).forEach(alias => {
      unregister(queries[alias], alias, onMediaQueryChange)
    })

  }, [show])

  return shouldShow
}

export default function useResolution(
  resolutionKeys: Array<string>,
  { show, ...restProps },
  coercedSupport?: boolean = supportsMatchMedia
) {
  const combinedResolutionKeys = sharedResolutionProperties.concat(
    resolutionKeys
  )

  if (!coercedSupport) {
    log.warn(errors.NOMATCHMEDIA)
    return { ...restProps, show }
  }

  const context = React.useContext(ConfigContext)
  const shouldShow = useMedia({ show, combinedResolutionKeys, context, props: restProps })

  if (show && shouldShow && !hasTrueValues(shouldShow)) {
    return null
  }

  const props = getSingleResolutionProps({
    props: restProps,
    shouldShow,
    resolutionKeys: combinedResolutionKeys,
    fallbackDisplayKey: getValue(context, 'fallbackDisplayKey'),
  })

  return { ...props, show }
}
