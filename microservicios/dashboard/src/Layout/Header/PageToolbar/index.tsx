import React from 'react';
import { 
  Button,
  ButtonVariant,
  KebabToggle,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownToggle,
  PageHeaderTools,
  PageHeaderToolsGroup,
  PageHeaderToolsItem,
  Avatar
} from '@patternfly/react-core';
import { BellIcon, CogIcon, HelpIcon } from '@patternfly/react-icons';

import imgAvatar from './avatar.svg'
export const userDropdownItems = [
  <DropdownItem key="1">Link</DropdownItem>,
  <DropdownItem key="2" component="button">Action</DropdownItem>,
  <DropdownItem key="3" isDisabled>Disabled Link</DropdownItem>,
  <DropdownItem key="4" isDisabled component="button">
    Disabled Action
  </DropdownItem>,
  <DropdownSeparator key="5" />,
  <DropdownItem key="6">Separated Link</DropdownItem>,
  <DropdownItem key="7" component="button">Separated Action</DropdownItem>
];

export const kebabDropdownItems = [
  <DropdownItem key="1">
    <BellIcon /> Notifications
  </DropdownItem>,
  <DropdownItem key="2">
    <CogIcon /> Settings
  </DropdownItem>
];

export function PageToolbar() {
  const [isKebabDropdownOpen, setIsKebabDropdownOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
      <PageHeaderTools>
        <PageHeaderToolsGroup
          visibility={{
            default: 'hidden',
            lg: 'visible'
          }} /** the settings and help icon buttons are only visible on desktop sizes and replaced by a kebab dropdown for other sizes */
        >
          <PageHeaderToolsItem>
            <Button aria-label="Settings actions" variant={ButtonVariant.plain}>
              <CogIcon />
            </Button>
          </PageHeaderToolsItem>
          <PageHeaderToolsItem>
            <Button aria-label="Help actions" variant={ButtonVariant.plain}>
              <HelpIcon />
            </Button>
          </PageHeaderToolsItem>
        </PageHeaderToolsGroup>
        <PageHeaderToolsGroup>
          <PageHeaderToolsItem
            visibility={{
              lg: 'hidden',
              '2xl?': "hidden"
            }} /** this kebab dropdown replaces the icon buttons and is hidden for desktop sizes */
          >
            <Dropdown
              isPlain
              position="right"
              onSelect={onKebabDropdownSelect}
              toggle={<KebabToggle onToggle={onKebabDropdownToggle} />}
              isOpen={isKebabDropdownOpen}
              dropdownItems={kebabDropdownItems}
            />
          </PageHeaderToolsItem>
          <PageHeaderToolsItem
            visibility={{ md: 'visible', '2xl?': "hidden" }} /** this user dropdown is hidden on mobile sizes */
          >
            <Dropdown
              isPlain
              position="right"
              onSelect={onDropdownSelect}
              isOpen={isDropdownOpen}
              toggle={<DropdownToggle onToggle={onDropdownToggle}>John Smith</DropdownToggle>}
              dropdownItems={userDropdownItems}
            />
          </PageHeaderToolsItem>
        </PageHeaderToolsGroup>
        <Avatar src={imgAvatar} alt="Avatar image" />
      </PageHeaderTools>
    );

  function onKebabDropdownSelect () {
    setIsKebabDropdownOpen(!isKebabDropdownOpen);
  }

  function onKebabDropdownToggle(isKebabDropdownOpen: boolean) {
    setIsKebabDropdownOpen(isKebabDropdownOpen);
  }

  function onDropdownSelect() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  function onDropdownToggle(isDropdownOpen: boolean) {
    setIsDropdownOpen(isDropdownOpen);
  }
}

export default PageToolbar;
