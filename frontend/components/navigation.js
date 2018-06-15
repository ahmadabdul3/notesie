import React from 'react';

export default function() {
  return (
    <nav className='app-navigation'>
      <NavItem title='App' />
    </nav>
  );
}

function NavItem({ title }) {
  return (
    <div className='nav-item'>
      { title }
    </div>
  );
}
