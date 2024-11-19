import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import "../components/css/navbar.css";
import logo from '../Assets/images/logo_header.png';
import { Link } from "react-router-dom";

function Navbar({ user, isLoggedIn, handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    // Perform any updates when `user` changes
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
    }

  }, [user]);
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (size.width > 768 && menuOpen) {
      setMenuOpen(false);
    }
  }, [size.width, menuOpen]);

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setProfileImage(storedUser.profileImage || null);
    }
  }, []);

  const closeMenuHandler = () => {
    setMenuOpen(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (setting) => {
    if (setting === 'Logout') {
      handleLogout();
    }
    handleCloseUserMenu();
  };

  const settings = ['My Events', 'Leaderboard', 'Organizer', 'Logout'];

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__content__logo">
          <Link to="/"><img src={logo} alt="Logo" /></Link>
        </div>

        <div className="header__content__search">
          <div className="search__container">
            <AiOutlineSearch className="search__icon" />
            <input type="text" placeholder="Search..." className="search__input" />
          </div>
        </div>

        <nav className={`header__content__nav ${menuOpen ? "isMenu" : ""}`}>
          <ul className="nav_menu">
            <li>
              <Link to="/events" onClick={closeMenuHandler}>Events</Link>
            </li>
            <li>
              <Link to="/clubs" onClick={closeMenuHandler}>Clubs</Link>
            </li>
            <li>
              <Link to="/sports" onClick={closeMenuHandler}>Sports</Link>
            </li>
            <li>
              <Link to="/contact" onClick={closeMenuHandler}>Contact</Link>
            </li>
            <div style={{ marginRight: '70px' }}></div>
            {!isLoggedIn ? (
              <Link to="signin/">
                <button className="btn btn__login" onClick={closeMenuHandler}>Login/Register</button>
              </Link>
            ) : (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                      src={profileImage ? `data:image/jpeg;base64,${profileImage}` : ""} 
                      alt={user?.fullName.charAt(0) || "U"} 
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem>
                    <Link to="/profile"><Typography sx={{ textAlign: 'center' }}>Profile</Typography></Link>
                  </MenuItem>
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => handleMenuItemClick(setting)}>
                      <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
