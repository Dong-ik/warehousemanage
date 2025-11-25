import React from "react";
import Header from "../../entities/header";
import Sidebar from "../../entities/sidebar";
import Footer from "../../entities/footer";

/**
 * @typedef {Object} LayoutProps
 * @property {React.ReactNode} children
 */

/**
 * @param {LayoutProps} props
 */
export const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};