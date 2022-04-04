import { Selector, t } from 'testcafe'
import logger from './logger'

const log = logger('selectors')

export class LoadingPanel {
  private readonly text: string

  constructor(title: string) {
    this.text = title
  }

  get title() {
    return Selector('span').withText(this.text)
  }
}

export class Channel {
  private readonly name: string

  constructor(name: string) {
    this.name = name
  }

  get title() {
    return Selector('h6').withText(`#${this.name}`)
  }

  get messagesList() {
    return Selector('ul').withAttribute('id', 'messages-scroll')
  }

  get messagesGroup() {
    return this.messagesList.find('li')
  }

  get messagesGroupContent() {
    return this.messagesGroup.find('p').withAttribute('data-testid', /messagesGroupContent-/)
  }

  get messageInput () {
    return Selector('div').withAttribute('data-testid', 'messageInput')
  }

  getUserMessages(username: string): Selector {
    return Selector('div').withAttribute('data-testid', new RegExp(`userMessages-${username}`))
  }

  async sendMessage(message: string) {
    await t.typeText(this.messageInput, message)
    await t.pressKey('enter')
  }
}

export class Sidebar {
  async openSettings () {
    const button = Selector('span').withAttribute('data-testid', 'settings-panel-button')
    await t.expect(button.exists).ok({timeout: 100000})
    await t.click(button)
    return new Settings()
  }
}

export class Settings {
  get title () {
    return Selector('h6').withText(`Settings`)
  }

  async switchTab(name: string) {
    await t.click(Selector('button').withAttribute('data-testid', `${name}-settings-tab`))
  }

  get invitationCode () {
    return Selector('p').withAttribute('data-testid', 'invitation-code')
  }

  async close() {
    const closeButton = Selector('div').withAttribute('data-testid', 'settingsModalActions').find('button')
    await t.expect(closeButton.exists).ok()
    log('Closing settings modal')
    await t.click(closeButton)
  }
}


export class JoinCommunityModal {
  get title() {
    return Selector('h3').withText('Join community')
  }

  async typeCommunityCode(code: string) {
    const communityNameInput = Selector('input').withAttribute('placeholder', 'Invite code')
    await t.typeText(communityNameInput, code)
  }

  async switchToCreateCommunity() {
    const link = Selector('a').withAttribute('data-testid', 'JoinCommunityLink')
    await t.expect(link.exists).ok()
    await t.click(link)
  }

  async submit() {
    const continueButton = Selector('button').withAttribute('data-testid', 'continue-joinCommunity')
    await t.click(continueButton)
  }
}

export class CreateCommunityModal {
  get title() {
    return Selector('h3').withText('Create your community')
  }

  async typeCommunityName(name: string) {
    log('typeCommunityName')
    const communityNameInput = Selector('input').withAttribute('placeholder', 'Community name')
    await t.typeText(communityNameInput, name)
    log('typed name')

  }

  async submit() {
    log('CreateCommunityModal submit')
    const continueButton = Selector('button').withAttribute('data-testid', 'continue-createCommunity')
    await t.click(continueButton)
    log('CreateCommunityModal submitted')

  }
}

export class RegisterUsernameModal {
  get title() {
    return Selector('h3').withText('Register a username')
  }

  async typeUsername(username: string) {
    const usernameInput = Selector('input').withAttribute('name', 'userName').filterVisible()
    await t.expect(usernameInput.exists).ok()
    await t.typeText(usernameInput, username)
  }

  async submit() {
    const submitButton = Selector('button').withText('Register')
    await t.click(submitButton)
  }
}

export class DebugModeModal {
  get title() {
    return Selector('h3').withText('App is running in debug mode')
  }

  async close() {
    if (await this.title.visible) {
      await t.click(Selector('button').withText('Understand'))
    }
  }
}
