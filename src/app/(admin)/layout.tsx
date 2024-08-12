import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from "@/app/components/sidebar";

export interface LayoutProps {
    children: React.ReactNode;
};

export default function Layout({children}: LayoutProps) {
    console.log('rendering')
    return (
        <>
            <Sidebar/>
            <div className="ml-60">{children}</div>
        </>
    );
}