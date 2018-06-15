import React, { Component } from 'react';
import appRoutes from 'src/constants/routes';
import { NavLink } from 'react-router-dom';

export default class HomePage extends Component {
  state = {
    loading: false,
    // noteDocs: [],
  }

  constructor(props) {
    super(props);
  }

  addNoteDoc = () => {
    this.props.addNotesDocument({});
  }

  goToDocPage = (id) => {
    // - will need to fetch the document data using the id
    //   but no need for now
    console.log(' click button ');
    this.props.router.push(appRoutes.noteDoc);
  }

  render() {
    const { loading } = this.state;
    const { notesDocuments } = this.props;

    return (
      <div className='home-page'>
        <header className='home-page__header'>
          <div className='content'>
            <button className='green-button' onClick={this.addNoteDoc}>
              + New Note Doc
            </button>
          </div>
        </header>
        <section className='home-page__docs'>
          {
            notesDocuments.length > 0 ? (
              notesDocuments.map(
                (noteDoc, key) =>
                  <NoteDoc
                    key={key}
                    data={noteDoc}
                    click={ () => { this.goToDocPage(noteDoc.id); } } />
              )
            ) : <NoNoteDocs />
          }
        </section>
      </div>
    );
  }
}

function NoteDoc({ data, click }) {
  const { title, summary } = data;
  return (
    <div className='note-doc' onClick={click}>
      <header className='note-doc__header'>
        { title }
      </header>
      <article className='note-doc__summary'>
        { summary }
      </article>
    </div>
  );
}

function NoNoteDocs() {
  const data = {
    id: 0,
    title: "No Docs",
    summary: "You don't have any documents. Create one by clicking the add button"
  };

  return (
    <NoteDoc data={data} />
  );
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
