'use client';

import React from 'react';


export interface ErrorComponentProps {
error:Error;
};

function ErrorComponent({}: ErrorComponentProps) {
    return (
        <div>Unexpected error inside slot sales</div>
    );
}

export default Error;