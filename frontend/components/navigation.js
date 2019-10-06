import React, { Component, PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import appRoutes from 'src/constants/routes';
import SignupModalContainer from 'src/frontend/containers/signup_modal_container';
import LoginModalContainer from 'src/frontend/containers/login_modal_container';

export default class Navigation extends PureComponent {
  state = {
    loginModalOpen: false,
    signupModalOpen: false,
  };

  closeLoginModal = () => {
    this.setState({ loginModalOpen: false });
  }

  openLoginModal = () => {
    this.setState({ loginModalOpen: true });
  }

  closeSignupModal = () => {
    this.setState({ signupModalOpen: false });
  }

  openSignupModal = () => {
    this.setState({ signupModalOpen: true });
  }

  logout = () => {
    localStorage.removeItem('notesie-access-token');
    this.props.logout();
    window.location.href = '/';
  }

  render() {
    const { loginModalOpen, signupModalOpen } = this.state;
    const {
      authenticated,
      user,
    } = this.props;

    return (
      <nav className='navigation'>
        <LoginModalContainer
          onClose={this.closeLoginModal}
          open={loginModalOpen}
          openSignupModal={this.openSignupModal} />
        <SignupModalContainer
          onClose={this.closeSignupModal}
          open={signupModalOpen}
          openLoginModal={this.openLoginModal} />
        <div className='nav-left'>
          <NavLink to={appRoutes.home} activeClassName='' className='nav-item__logo'>
            Notesie
          </NavLink>
        </div>
        <div className='nav-right'>
          <NavLinkWithRoute url={appRoutes.home} text='Home' />
          <NavItemSeparator />
          {
            !authenticated ?
              <NavButton text='Sign Up' onClick={this.openSignupModal} />
              : null
          }
          {
            !authenticated ?
              <NavButton text='Log In' onClick={this.openLoginModal} />
              : null
          }
          {
            authenticated ?
              <NavbarDropdown
                label={user.firstName ? 'Hi, ' + user.firstName : 'Hi, ' + user.email}
                renderDropdownOptions={() => (
                  <div className='nav-account-dropdown'>
                    <header className='nav-account-dropdown-header'>
                      {
                        !user.firstName ? null : (
                          <div>
                            <span>
                              { user.firstName + ' ' }
                            </span>
                            <span>
                              { user.lastName }
                            </span>
                          </div>
                        )
                      }
                      <div className='nav-account-dropdown-header__email'>
                        { user.email }
                      </div>
                    </header>
                    <div>
                      <NavLink
                        to={appRoutes.account}
                        className='nav-account-dropdown-option'>
                        <i className='fas fa-user-circle' />
                        Account
                      </NavLink>
                      <div
                        className='nav-account-dropdown-option'
                        onClick={this.logout}>
                        <i className='fas fa-sign-out-alt' />
                        Log Out
                      </div>
                    </div>
                  </div>
                )
                } />
              : null
          }
        </div>
      </nav>
    );
  }
}

function NavLinkWithRoute({ url, text }) {
  return (
    <NavLink exact to={url} activeClassName='selected' className='nav-item'>
      { text }
    </NavLink>
  );
}

function NavButton({ text, onClick }) {
  return (
    <a className='nav-item' onClick={onClick}>
      { text }
    </a>
  )
}

function NavItemSeparator() { return <div className='nav-item-seperator' />; }

class NavbarDropdown extends PureComponent {
  static defaultProps = {
    renderDropdownOptions: () => (<div className='no-options'>No Options</div>),
  };

  optionsRef;
  textContentRef;
  optionsCloseTimeout;
  state = {
    optionsVisible: false,
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    clearTimeout(this.optionsCloseTimeout);
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.textContentRef.contains(event.target)) return;
    else if (this.state.optionsVisible) {
      if (event.target.className.includes('nav-account-dropdown-option')) {
        this.optionsCloseTimeout = setTimeout(() => {
          this.setState({ optionsVisible: false });
        }, 200);
      } else if (!this.optionsRef.contains(event.target)) {
        this.setState({ optionsVisible: false });
      }
    }
  }

  toggleOptions = () => {
    const optionsVisible = !this.state.optionsVisible;
    this.setState({ optionsVisible });
  }

  render() {
    const { label, renderDropdownOptions } = this.props;
    const { optionsVisible } = this.state;
    const optionsVisibility = optionsVisible ? 'visible' : '';

    return (
      <div className='nav-item__dropdown'>
        <div
          className='filters-bar-dropdown__text-content'
          onClick={this.toggleOptions}
          ref={(r) => this.textContentRef = r}
        >
          <span className='text'>
            { label }
          </span>
          <i className='fas fa-caret-down' />
        </div>
        <div
          ref={(r) => this.optionsRef = r}
          className={`filters-bar-dropdown-options ${optionsVisibility}`}
        >
          { renderDropdownOptions() }
        </div>
      </div>
    );
  }
}
