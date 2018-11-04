// @flow
import * as React from 'react'
import { body, appendDevContainer, removeDevContainer } from './dev.logic'

const KEY_CODE_K = 'K'.charCodeAt(0)
type Props = {|
  keyCode: number,
  useCtrl: boolean,
  useShift: boolean,
|}

export default function useKeyDownToggle({
  keyCode = KEY_CODE_K,
  useCtrl = true,
  useShift = true,
}: Props) {
  const [showOverlay, setShowOverlay] = React.useState(false)

  function onKeyDown(e: KeyboardEvent) {
    const pressedKey = e.keyCode || e.charCode || 0
    const ctrlKeyPressedOrNotRequired = !useCtrl || (e.ctrlKey || e.metaKey)
    const shiftKeyPressedOrNotRequired = !useShift || e.shiftKey

    if (
      ctrlKeyPressedOrNotRequired &&
      shiftKeyPressedOrNotRequired &&
      keyCode === pressedKey
    ) {
      setShowOverlay(!showOverlay)
    }
  }

  React.useEffect(() => {
    appendDevContainer()
    body().addEventListener('keydown', onKeyDown)

    return () => {
      removeDevContainer()
      body().removeEventListener('keydown', onKeyDown)
    }
  })

  return showOverlay
}
