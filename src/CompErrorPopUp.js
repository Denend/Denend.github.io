import React, { Component } from 'react'
import { Button, Modal } from 'semantic-ui-react'

export default class CompErrorPopUp extends Component {
  state = { modalOpen: false }
  handleOpen = (err) => {
    this.setState({ modalOpen: true })
    document.getElementById("errHeader").innerHTML = err;
  }

  handleClose = () => this.setState({ modalOpen: false })
  render() {
    return (
      <Modal
        open = {this.state.modalOpen}
        onClose = {this.handleClose}
        basic
        size = 'small'
      >
        <div id = "errorAlert">
          <div className = "close-modal" onClick = {this.handleClose}> &#10006; </div>
          <div id = "alertErrorTopHeader">Ooops!
          </div>
        <h3 id = "errHeader"> ErrorText </h3>
        <Modal.Actions>
          <Button color = 'green' onClick = {this.handleClose} inverted>
            Close
          </Button>
        </Modal.Actions>
        </div>
      </Modal>
    )
  }
}
