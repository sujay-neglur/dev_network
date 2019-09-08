import React from 'react';

function Footer(props) {
    return (
        <footer className="bg-dark text-white mt-5 p-4 text-center">
            Copyright &copy; {new Date().getFullYear()} DevNetwork
        </footer>
    );
}

export default Footer;