// @flow
import * as React from 'react'
import ReactDOM from 'react-dom'
import ConfigContext from '../configProvider/context'
import getStyles from './dev.styles'
import { getDevContainer } from './dev.logic'
import Grid from '../grid'
import Root from '../root'
import Layout from '../layout'
import { getValues, times } from '../utils'
import useKeyDownToggle from './useKeyDownToggle'

type Props = {|
  keyCode: number,
  useCtrl: boolean,
  useShift: boolean,
|}

export default function Dev(props: Props) {
  const showOverlay = useKeyDownToggle(props)

  if (!showOverlay) {
    return null
  }

  const context = React.useContext(ConfigContext)
  const values = getValues(context)
  const styles = getStyles(values)

  const content = (
    <Layout className={styles.gymnastOverlay}>
      <div className={styles.leftMargin} />
      <Root>
        {times(values.columns).map(key => (
          <Grid
            margin={[0, values.gutter / 2]}
            key={key}
            size={1}
            className={styles.col}
          />
        ))}
      </Root>
      <div className={styles.rightMargin} />
    </Layout>
  )

  return ReactDOM.createPortal(content, getDevContainer())
}
