'use client';

import React from 'react';
import Button from "@/app/components/button";

export interface GlobalErrorProps{
    error: Error;
}

export default function GlobalError({error}: GlobalErrorProps) {
    return (
        <html>
        <body>
        <div>
            <p>{`Something globally went wrong. ${error.message}`}</p>

        </div>
        </body>
        </html>
    );
}