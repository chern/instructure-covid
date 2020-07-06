import React from 'react';
import '@instructure/canvas-theme';
import { AppNav } from '@instructure/ui-navigation';
import { Badge } from '@instructure/ui-badge';
import { IconButton } from '@instructure/ui-buttons';
import { ScreenReaderContent } from '@instructure/ui-a11y-content';
import {
    IconCoursesLine,
    IconPlusSolid,
    IconHamburgerLine,
} from '@instructure/ui-icons';

const totalItemsCount = 5

class AppNavExample extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      visibleItemsCount: totalItemsCount
    }
  }

  handleUpdate = ({ visibleItemsCount }) => {
    this.setState({ visibleItemsCount })
  }

  render () {
    const visibleItemsCount = this.state.visibleItemsCount;

    return (
      <AppNav
        screenReaderLabel="App navigation"
        visibleItemsCount={visibleItemsCount >= 2 ? visibleItemsCount : 0}
        onUpdate={this.handleUpdate}
        renderBeforeItems={
          <AppNav.Item
            renderLabel={<ScreenReaderContent>COVID-19</ScreenReaderContent>}
            renderIcon={<IconCoursesLine inline={false} size="medium" color="primary" />}
            href="https://covidtracking.com"
          />
        }
        renderAfterItems={
          <IconButton
            onClick={() => console.log('Add')}
            renderIcon={IconPlusSolid}
            margin="0 0 0 x-small"
            screenReaderLabel="Add something"
            withBorder={false}
            withBackground={false}
          />
        }
        renderTruncateLabel={function () {
          const hiddenItemsCount = totalItemsCount - visibleItemsCount
          if (visibleItemsCount >= 2) {
            return `${hiddenItemsCount} More`
          } else {
            return (
              <span>
                <IconHamburgerLine size="small" inline={false} />
                <ScreenReaderContent>{`${hiddenItemsCount} More`}</ScreenReaderContent>
              </span>
            )
          }
        }}
      >
        <AppNav.Item
          renderLabel="instructure-ui"
          href="http://instructure.design"
          renderAfter={
            <Badge
              type="notification"
              variant="success"
              standalone
              formatOutput={function () {
                return <ScreenReaderContent>You have notifications from instructure-ui</ScreenReaderContent>
              }}
            />
          }
        />
        <AppNav.Item
          isSelected
          renderLabel="Data"
          href="/"
        />
      </AppNav>
    )
  }
}

export default AppNavExample;