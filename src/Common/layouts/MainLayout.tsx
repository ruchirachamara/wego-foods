import React, { FunctionComponent } from 'react';

import { LayoutProps } from '../../Types/Layout';

const Layout: FunctionComponent<LayoutProps> = (props: LayoutProps) => {

    return (
        <>
            <div className="app-area">
                <div className="main-area">
                    {props.children}
                </div>
            </div>
        </>
    );
};

export default Layout;