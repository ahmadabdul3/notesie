import React, { Component } from 'react';
import appRoutes from 'src/constants/routes';
import { NavLink } from 'react-router-dom';
import FormInput from 'src/frontend/components/form_input';
import NoteDocumentSummaryContainer from 'src/frontend/containers/note_document_summary_container';
import NoteDocumentSummary from 'src/frontend/components/note_document_summary';

export default class HomePage extends Component {
  state = {
    loading: false,
    newNoteDocumentModalVisible: false,
    // noteDocs: [],
  }

  constructor(props) {
    super(props);
  }

  addNoteDoc = ({ docName }) => {
    this.hideNewNoteDocumentModal();
    this.props.addNotesDocument({ name: docName });
  }

  showNewNoteDocumentModal = () => {
    this.setState({ newNoteDocumentModalVisible: true });
  }

  hideNewNoteDocumentModal = () => {
    this.setState({ newNoteDocumentModalVisible: false });
  }

  goToDocPage = (id) => {
    // - will need to fetch the document data using the id
    //   but no need for now
    this.props.history.push(appRoutes.noteDoc(id));
  }

  render() {
    const { loading, newNoteDocumentModalVisible } = this.state;
    const { notesDocuments } = this.props;
    const notesDocumentsKeys = Object.keys(notesDocuments);

    return (
      <div className='home-page'>
        { newNoteDocumentModalVisible ?
            <NewNoteDocumentModal
              addNoteDoc={this.addNoteDoc}
              cancelAction={this.hideNewNoteDocumentModal} />
            : null
        }
        <header className='home-page__header'>
          <div className='content'>
            <button className='green-button' onClick={this.showNewNoteDocumentModal}>
              <i className='fas fa-plus' /> New Note Doc
            </button>
          </div>
        </header>
        <section className='home-page__docs'>
          {
            notesDocumentsKeys.length > 0 ? (
              notesDocumentsKeys.map(
                (noteDocKey, key) => {
                  const noteDoc = notesDocuments[noteDocKey];
                  return (
                    <NoteDocumentSummaryContainer
                      key={key}
                      data={noteDoc}
                      click={ () => { this.goToDocPage(noteDoc.id); } } />
                  )
                }
              )
            ) : <NoNoteDocs />
          }
        </section>
      </div>
    );
  }
}

function NoNoteDocs() {
  const data = {
    id: 0,
    name: "No Docs",
  };
  const notesList = [
    {
      notesText: "You don't have any documents."
        + " Create one by clicking the add button"
    },
  ];

  return (
    <NoteDocumentSummary data={data} notesList={notesList} />
  );
}

// - this is ok for now, might need to be connected to
//   redux later
class NewNoteDocumentModal extends Component {
  state = {
    docName: '',
    nameMessage: '',
  };

  onChange = (name, value) => {
    this.setState({ [name]: value });
  }

  addNoteDoc = (e) => {
    e.preventDefault();
    const trimmedDocName = this.state.docName.trim();
    if (!trimmedDocName) {
      this.setState({ nameMessage: 'Please provide a name for your document' });
      return;
    }

    const { docName } = this.state;
    this.props.addNoteDoc({ docName });
  }

  render() {
    const { docName, nameMessage } = this.state;
    const { cancelAction } = this.props;

    return (
      <div className='black-overlay'>
        <div className='new-note-document-modal'>
          <h2>
            Create a new document
          </h2>
          <form onSubmit={this.addNoteDoc}>
            <FormInput
              autoFocus
              labelText='Document name'
              name='docName'
              value={docName}
              type='text'
              onChange={this.onChange}
              message={nameMessage} />

            <div className='form-buttons'>
              <button type='button' className='button' onClick={cancelAction}>
                Cancel
              </button>
              <button className='red-button'>
                Create Document
              </button>
            </div>
          </form>
        </div>
      </div>
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
