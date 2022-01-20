import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { communities, errors, identity, publicChannels, socketActionTypes, connection } from '@zbayapp/nectar'
import CreateUsernameModalComponent from '../../../components/widgets/createUsername/CreateUsernameModal'
import { ModalName } from '../../../sagas/modals/modals.types'
import { useModal } from '../../hooks'
import { CommunityAction } from '../../../components/widgets/performCommunityAction/community.keys'
import { LoadingMessages } from '../loadingPanel/loadingMessages'
import { socketSelectors } from '../../../sagas/socket/socket.selectors'

export interface CreateUsernameModalProps {
  communityAction: CommunityAction
  communityData: string
}

const CreateUsernameModal = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')

  const id = useSelector(identity.selectors.currentIdentity)
  const certificate = useSelector(identity.selectors.currentIdentity)?.userCertificate
  const communityErrors = useSelector(errors.selectors.currentCommunityErrorsByType)
  const error = communityErrors?.[socketActionTypes.REGISTRAR]

  const currentCommunityId = useSelector(communities.selectors.currentCommunityId)
  const invitationUrl = useSelector(communities.selectors.registrarUrl(currentCommunityId))
  const channels = useSelector(publicChannels.selectors.publicChannels)
  const initializedCommunitiesCount = Object.keys(useSelector(connection.selectors.initializedCommunities)).length
  const allCommunitiesCount = useSelector(communities.selectors.allCommunities).length
  const allCommunitiesInitialized = allCommunitiesCount > 0 && initializedCommunitiesCount === allCommunitiesCount

  const createUsernameModal = useModal<CreateUsernameModalProps>(ModalName.createUsernameModal)
  const joinCommunityModal = useModal(ModalName.joinCommunityModal)
  const createCommunityModal = useModal(ModalName.createCommunityModal)
  const loadingCommunityModal = useModal(ModalName.loadingPanel)
  const unregisteredCommunitiesWithoutUserIdentity = useSelector(identity.selectors.unregisteredCommunitiesWithoutUserIdentity)

  const [isCreateUserNameStarted, setisCreateUserNameStarted] = useState('undecided')

  const isConnected = useSelector(socketSelectors.isConnected)

  const loadingStartApp = useModal(ModalName.loadingPanel)

  const unregisteredCommunities = useSelector(identity.selectors.unregisteredCommunities)
  const isOwner = useSelector(communities.selectors.isOwner)

  useEffect(() => {
    if (isConnected && unregisteredCommunitiesWithoutUserIdentity.length && isCreateUserNameStarted === 'undecided') {
      let communityAction: CommunityAction
      if (isOwner) {
        communityAction = CommunityAction.Create
      } else {
        communityAction = CommunityAction.Join
      }
      createUsernameModal.handleOpen({
        communityAction: communityAction,
        communityData: unregisteredCommunitiesWithoutUserIdentity[0].registrarUrl
      })
    }
  }, [unregisteredCommunitiesWithoutUserIdentity, isConnected, isCreateUserNameStarted])

  useEffect(() => {
    if (isConnected) {
      loadingStartApp.handleClose()
      let communityMessage: LoadingMessages

      if (unregisteredCommunities.length) {

        if (isOwner) {
          communityMessage = LoadingMessages.CreateCommunity
        } else {
          communityMessage = LoadingMessages.JoinCommunity
        }
        loadingCommunityModal.handleOpen({
          message: communityMessage
        })
      }
    }
  }, [isConnected, unregisteredCommunities])


  useEffect(() => {
    if (certificate && allCommunitiesInitialized && !unregisteredCommunitiesWithoutUserIdentity.length &&
      ((createUsernameModal.communityAction === CommunityAction.Join && channels.length) ||
        (createUsernameModal.communityAction === CommunityAction.Create && invitationUrl))) {
      loadingCommunityModal.handleClose()
      createUsernameModal.handleClose()
      joinCommunityModal.handleClose()
      createCommunityModal.handleClose()
    }
  }, [channels.length, invitationUrl, certificate, allCommunitiesInitialized])

  useEffect(() => {
    if (id?.hiddenService && !certificate) {
      dispatch(identity.actions.registerUsername(username))
    }
  }, [id?.hiddenService])

  const handleAction = (payload: { nickname: string }) => {
    const message = createUsernameModal.communityAction === CommunityAction.Create
      ? LoadingMessages.CreateCommunity
      : LoadingMessages.JoinCommunity
    loadingCommunityModal.handleOpen({
      message
    })
    setisCreateUserNameStarted('actionStarted')
    setUsername(payload.nickname)
    const value = createUsernameModal.communityData
    const action =
      createUsernameModal.communityAction === CommunityAction.Create
        ? communities.actions.createNewCommunity(value)
        : communities.actions.joinCommunity(value)
    /* Launch/create community */

    dispatch(action)
  }

  return (
    <CreateUsernameModalComponent
      {...createUsernameModal}
      handleRegisterUsername={handleAction}
      certificateRegistrationError={error?.message}
      certificate={certificate}
    />
  )
}

export default CreateUsernameModal
