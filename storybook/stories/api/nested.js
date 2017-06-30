// @flow
import React from 'react'
import { number, select } from '@storybook/addon-knobs'
import { times } from 'lodash'
import { Grid, Col } from 'reflex'
import styles from '../../shared/stories.css'
import {
  Box,
  RootLayout,
  getPositionSelect,
  getMarginSelect,
} from '../../shared'

export default function() {
  const paddingMap = {
    None: [],
    All: [1],
    Horizontal: [0, 1],
    Vertical: [1, 0],
    'Top Left': [1, 0, 0, 1],
    Bottom: [0, 0, 1],
  }
  const paddingOptions = Object.keys(paddingMap)
  const items = number('Items', 6, { range: true, min: 1, max: 24 })
  const margin = getMarginSelect()
  const params = {
    padding: paddingMap[select('Padding', paddingOptions)],
    ...getPositionSelect(),
  }
  const height = {
    height: 150,
  }

  return (
    <RootLayout>
      <Col><h1>Nested Example</h1></Col>
      <Col>
        <Grid {...params} className={styles.colors2}>
          <Grid
            size={6}
            {...params}
            margin={margin}
            className={styles.colors1}
            style={height}
          >
            <Grid
              size={6}
              {...params}
              margin={margin}
              className={styles.colors3}
            >
              <Grid
                size={6}
                margin={margin}
                className={styles.colors4}
                align="center"
              >
                A
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Col>
      <Col><h1>With Offsets</h1></Col>
      <Col>
        <Grid {...params} className={styles.colors2}>
          <Box size={6} margin={margin} offset={3} type="A" />
          <Box size={4} margin={margin} type="A" />
          <Box size={4} margin={margin} offset={4} type="A" />
        </Grid>
      </Col>
      <Col><h1>With Overflow</h1></Col>
      <Grid>
        <Col size={6}>
          <Grid {...params} className={styles.colors2}>
            {times(items, index =>
              <Box size={2} margin={margin} key={index} type="A">
                {`${index * 2 % 12 + 2}`}
              </Box>
            )}
          </Grid>
        </Col>
      </Grid>
    </RootLayout>
  )
}