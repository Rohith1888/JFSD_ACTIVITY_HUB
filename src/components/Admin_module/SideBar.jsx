import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Admin_Module/SideBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../../Assets/images/logo_footer.png';

const Sidebar = ({ isOpen, toggleSidebar, handleLogout, user }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="logo-container">
        <NavLink to="/admin">
          <img src={logo} alt="Logo" className="logo_sidebar" />
        </NavLink>
      </div>
      
      <ul>
        <li>
          <NavLink
            to="/admin/overview"
            onClick={toggleSidebar}
            activeClassName="active"
          >
            Overview
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/all"
            onClick={toggleSidebar}
            activeClassName="active"
          >
            Students
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/all-clubs"
            onClick={toggleSidebar}
            activeClassName="active"
          >
            Clubs
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/all-events"
            onClick={toggleSidebar}
            activeClassName="active"
          >
            Events
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/all-admins"
            onClick={toggleSidebar}
            activeClassName="active"
          >
            Admin's
          </NavLink>
        </li>
      </ul>
      
      <div className="logout">
        <NavLink to="/" onClick={() => { toggleSidebar(); handleLogout(); }}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
