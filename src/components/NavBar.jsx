// Navbar.js

import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import "../components/css/navbar.css";
import logo from '../Assets/images/logo_header.png';
import { Link, useLocation } from "react-router-dom";

function Navbar({ user, isLoggedIn, handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
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

  const settings = ['Logout'];
  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__content__logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        <div className="header__content__search">
          <div className="search__container">
            <AiOutlineSearch className="search__icon" />
            <input type="text" placeholder="Search..." className="search__input" />
          </div>
        </div>

        <nav className={`header__content__nav ${menuOpen ? "isMenu" : ""}`}>
          <ul className="nav_menu">
            <li className={isActive("/") ? "active" : ""}>
              <Link to="/" onClick={closeMenuHandler}>
                Home
              </Link>
            </li>
            <li className={isActive("/events") ? "active" : ""}>
              <Link to="/events" onClick={closeMenuHandler}>
                Events
              </Link>
            </li>
            <li className={isActive("/clubs") ? "active" : ""}>
              <Link to="/clubs" onClick={closeMenuHandler}>
                Clubs
              </Link>
            </li>
            <li className={isActive("/sports") ? "active" : ""}>
              <Link to="/sports" onClick={closeMenuHandler}>
                Sports
              </Link>
            </li>
            <li className={isActive("/contact") ? "active" : ""}>
              <Link to="/contact" onClick={closeMenuHandler}>
                Contact
              </Link>
            </li>
            {!isLoggedIn ? (
              <Link to="/signin">
                <button className="btn btn__login" onClick={closeMenuHandler}>
                  Login/Register
                </button>
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
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem>
                    <Link to="/profile">
                      <Typography sx={{ textAlign: "center" }}>Profile</Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/organizer">
                      <Typography sx={{ textAlign: "center" }}>Organizer</Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/my-events">
                      <Typography sx={{ textAlign: "center" }}>My Events</Typography>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link to="/leaderboard">
                      <Typography sx={{ textAlign: "center" }}>LeaderBoard</Typography>
                    </Link>
                  </MenuItem>
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={() => handleMenuItemClick(setting)}>
                      <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
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
