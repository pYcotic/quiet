import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import directMessageChannel from '../../store/handlers/directMessageChannel'
import contactsHandlers from '../../store/handlers/contacts'
import channelHandlers from '../../store/handlers/channel'
import ChannelComponent from '../../components/pages/Channel'

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadRecipientAddress: directMessageChannel.actions.setDirectMessageRecipientAddress,
      loadRecipientUsername: directMessageChannel.actions.setDirectMessageRecipientUsername,
      cleanNewMessages: contactsHandlers.actions.cleanNewMessages,
      loadContact: contactsHandlers.epics.loadContact,
      resetChannel: channelHandlers.actions.resetChannel
    },
    dispatch
  )

const DirectMessages = ({
  match,
  loadRecipientUsername,
  loadRecipientAddress,
  cleanNewMessages,
  loadContact,
  resetChannel
}) => {
  useEffect(
    () => {
      resetChannel()
      loadRecipientAddress(match.params.id)
      loadRecipientUsername(match.params.username)
      cleanNewMessages({ contactAddress: match.params.id })
      loadContact(match.params.id)
    },
    [match.params.id]
  )
  return <ChannelComponent contactId={match.params.id} />
}

export default connect(
  null,
  mapDispatchToProps
)(DirectMessages)
