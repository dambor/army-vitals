import React from 'react';
import skullIcon from '../assets/skull_icon.png';

const Navbar = ({ onSearch }) => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src={skullIcon} alt="Army Vitals" className="navbar-icon" />
                <span className="navbar-title">ARMY VITALS COMMAND</span>
            </div>
            <div className="navbar-search">
                <input
                    type="text"
                    placeholder="SEARCH SOLDIER ID..."
                    onChange={(e) => onSearch(e.target.value)}
                    className="search-input"
                />
            </div>
        </nav>
    );
};

export default Navbar;
