import React, { Component } from 'react';
import appRoutes from 'src/constants/routes';
import { NavLink } from 'react-router-dom';
import FormInputStd from 'src/frontend/components/form_input_std';
import NotebookSummaryContainer from 'src/frontend/containers/notebook_summary_container';
import NotebookSummary from 'src/frontend/components/notebook_summary';
import Modal, {
  ModalTitle,
  ModalButton,
  ModalContent
} from 'src/frontend/components/modal';
import http from 'src/frontend/services/http';
import {
  getNotebooks,
  createNotebook,
} from 'src/frontend/clients/data_api/notebooks_client';


export default class HomePage extends Component {
  state = {
    loading: false,
    newNotebookModalVisible: false,
    notebooks: [],
  }

  componentDidMount() {
    if (this.props.userAuthenticated) this.fetchNotebooks();
  }

  componentDidUpdate(prevProps) {
    const { userAuthenticated } = this.props;
    if (userAuthenticated && userAuthenticated !== prevProps.userAuthenticated) {
      this.fetchNotebooks();
    }
  }

  async fetchNotebooks() {
    try {
      const { loadNotebooks } = this.props;
      const notebooksResult = await getNotebooks();
      loadNotebooks(notebooksResult.notebooks);
    } catch (e) {
      console.log(e);
    }
  }

  addNotebook = async ({ notebookName }) => {
    this.hideNewNotebookModal();
    const newNotebookResponse = await createNotebook({ data: { name: notebookName } });
    this.props.addNotebook(newNotebookResponse.notebook);
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

  render() {
    const { loading, newNotebookModalVisible } = this.state;
    const { notebooks } = this.props;

    return (
      <div className='home-page'>
        <NewNotebookModal
          visible={newNotebookModalVisible}
          addNotebook={this.addNotebook}
          cancelAction={this.hideNewNotebookModal}
        />
        <div className='notebook-list__header'>
          <h2 className='page-section__title'>
            Your Notebooks
          </h2>
          <button
            className='new-notebook-button green-button'
            onClick={this.showNewNotebookModal}
          >
              <i className='fas fa-plus' /> Add Notebook
          </button>
        </div>
        <section className='home-page__notebooks'>
          <div className='home-page__notebooks__margin-normalizer'>
            {
              notebooks.length > 0 ? (
                notebooks.map(
                  (notebook, key) => {
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
          </div>
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
      noteText: "You don't have any notebooks."
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
        <ModalTitle text='Create a new notebook' />
        <ModalContent>
          <form onSubmit={this.addNotebook}>
            <FormInputStd
              autoFocus
              labelText='Notebook Name'
              name='notebookName'
              value={notebookName}
              type='text'
              onChange={this.onChange}
              message={nameMessage}
            />
            <ModalButton text='Create Notebook' />
          </form>
        </ModalContent>
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
