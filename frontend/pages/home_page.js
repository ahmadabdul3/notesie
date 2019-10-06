import React, { Component } from 'react';
import appRoutes from 'src/constants/routes';
import { NavLink } from 'react-router-dom';
import FormInput from 'src/frontend/components/form_input';
import NotebookSummaryContainer from 'src/frontend/containers/notebook_summary_container';
import NotebookSummary from 'src/frontend/components/notebook_summary';
import Modal from 'src/frontend/components/modal';
import http from 'src/frontend/services/http';


export default class HomePage extends Component {
  state = {
    loading: false,
    newNotebookModalVisible: false,
  }

  addNotebook = ({ notebookName }) => {
    this.hideNewNotebookModal();
    this.props.addNotebook({ name: notebookName });
  }

  showNewNotebookModal = () => {
    this.setState({ newNotebookModalVisible: true });
  }

  hideNewNotebookModal = () => {
    this.setState({ newNotebookModalVisible: false });
  }

  goToDocPage = (id) => {
    // - will need to fetch the document data using the id
    //   but no need for now
    this.props.history.push(appRoutes.notebook(id));
  }

  // createUser = async () => {
  //   const user = { user: { email: 'abdul3@example.com', password: 'howdyho' }};
  //   const res = await http.post('/users', user);
  //   console.log(res);
  // }
  //
  // logIn = async () => {
  //   const session = { session: { email: 'abdul@example.com', password: 'howdy' }};
  //   const res = await http.post('/sessions', session);
  //   console.log(res);
  // }

  render() {
    const { loading, newNotebookModalVisible } = this.state;
    const { notebooks } = this.props;
    const notebookKeys = Object.keys(notebooks);

    return (
      <div className='home-page'>
        <NewNotebookModal
          visible={newNotebookModalVisible}
          addNotebook={this.addNotebook}
          cancelAction={this.hideNewNotebookModal} />
        <header className='home-page__header'>
          <div className='content'>
            <button
              className='new-notebook-button green-button'
              onClick={this.showNewNotebookModal}
            >
              <i className='fas fa-plus' /> New Notebook
            </button>
          </div>
        </header>
        <section className='home-page__docs'>
          {
            notebookKeys.length > 0 ? (
              notebookKeys.map(
                (notebookKey, key) => {
                  const notebook = notebooks[notebookKey];
                  return (
                    <NotebookSummaryContainer
                      key={key}
                      data={notebook}
                      click={() => this.goToDocPage(notebook.id)}
                    />
                  )
                }
              )
            ) : <NoNotebooks />
          }
        </section>
      </div>
    );
  }
}

function NoNotebooks() {
  const data = {
    id: 0,
    name: "No Notebooks",
  };
  const notesList = [
    {
      notesText: "You don't have any notebooks."
        + " Create one by clicking the add button"
    },
  ];

  return (
    <NotebookSummary data={data} notesList={notesList} />
  );
}

// - this is ok for now, might need to be connected to
//   redux later
class NewNotebookModal extends Component {
  state = {
    notebookName: '',
    nameMessage: '',
  };

  onChange = ({ name, value }) => {
    this.setState({ [name]: value });
  }

  addNotebook = (e) => {
    e.preventDefault();
    const trimmedNotebookName = this.state.notebookName.trim();
    if (!trimmedNotebookName) {
      this.setState({ nameMessage: 'Please provide a name for your document' });
      return;
    }

    const { notebookName } = this.state;
    this.resetState();
    this.props.addNotebook({ notebookName });
  }

  close = () => {
    this.resetState();
    this.props.cancelAction();
  }

  resetState() {
    this.setState({ notebookName: '', nameMessage: '' });
  }

  render() {
    const { notebookName, nameMessage } = this.state;
    const { cancelAction, visible } = this.props;

    return (
      <Modal onClose={this.close} open={visible}>
        <div className='new-note-document-modal'>
          <h2>
            Create a new notebook
          </h2>
          <form onSubmit={this.addNotebook}>
            <FormInput
              autoFocus
              labelText='Notebook Name'
              name='notebookName'
              value={notebookName}
              type='text'
              onChange={this.onChange}
              message={nameMessage} />

            <div className='form-buttons'>
              <button type='button' className='button' onClick={this.close}>
                Cancel
              </button>
              <button className='red-button'>
                Create Notebook
              </button>
            </div>
          </form>
        </div>
      </Modal>
    );
  }
}

function Table({ children, headers, loadMore, loading }) {
  return (
    <div className='table-container'>
      <table>
        <thead>
          <tr>
            {
              headers.map((header, index) => <th key={index}>{header}</th>)
            }
          </tr>
        </thead>
        <tbody>
          { children }
        </tbody>
      </table>
      <div className='table-load-more'>
        {
          loading ? <img src='https://media.giphy.com/media/fHgQPwQdKVMAg/giphy.gif' /> :
          <span onClick={loadMore}>Load More</span>
        }
      </div>
    </div>
  );
}

function TableRow({ transactionData }) {
  const { id, name, amount, transactionType } = transactionData;

  return (
    <tr>
      <td>
        { id }
      </td>
      <td>
        { name }
      </td>
      <td>
        { amount }
      </td>
      <td>
        { transactionType }
      </td>
    </tr>
  );
}
