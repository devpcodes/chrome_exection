import React from 'react';
import useIsLogin from './stateHook/useIsLogin';
import Login from './page/login/login';
import Default from './page/default/Default';
import './app.scss';
const App = () => {
    const {isLogin, loginHandler, ...userName} = useIsLogin();
    return(
        <div className="wrapper">
            {isLogin ? (
                <Default {...userName}/>
            ): (
                <Login loginHandler={ loginHandler }/>
            )}
        </div>
    )
};
export default App;