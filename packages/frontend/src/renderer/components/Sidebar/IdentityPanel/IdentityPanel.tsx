import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useModal } from '../../../containers/hooks'
import { Community } from '@quiet/nectar'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
    WebkitAppRegion: process.platform === 'win32' ? 'no-drag' : 'drag',
    paddingLeft: 16,
    paddingRight: 16
  },
  button: {
    color: theme.palette.colors.white,
    padding: 0,
    textAlign: 'left',
    opacity: 0.8,
    '&:hover': {
      opacity: 1,
      backgroundColor: 'inherit'
    }
  },
  buttonLabel: {
    justifyContent: 'flex-start',
    textTransform: 'none'
  },
  nickname: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 175,
    whiteSpace: 'nowrap'
  }
}))

export interface IdentityPanelProps {
  currentCommunity: Community
  accountSettingsModal: ReturnType<typeof useModal>
}

export const IdentityPanel: React.FC<IdentityPanelProps> = ({
  currentCommunity,
  accountSettingsModal
}) => {
  const classes = useStyles({})

  return (
    <div className={classes.root}>
      <Button
        onClick={event => {
          event.persist()
          accountSettingsModal.handleOpen()
        }}
        component='span'
        classes={{ root: classes.button, label: classes.buttonLabel }}>
        <Typography variant='h4' className={classes.nickname}>
          {currentCommunity?.name || ''}
        </Typography>
        <ExpandMoreIcon fontSize='small' />
      </Button>
    </div>
  )
}

export default IdentityPanel