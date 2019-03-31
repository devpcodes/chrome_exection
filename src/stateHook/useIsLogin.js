import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import Axios from '../utils/axios';
const useIsLogin = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [userName, setUserName] = useState('');

    const fetchCheckLogin = async() => {
        console.log('process env',process.env.NODE_ENV);
        let res;
        if(process.env.NODE_ENV == 'development'){
            res = await axios.get('/json/checkLogin.json');// /api/current_user
        }else{
            res = await Axios.get('/api/current_user');// /api/current_user
        }
        
        if(res.data){
            if(typeof res.data.name !== 'undefined'){
                setIsLogin(true);
                setUserName(res.data.name);
            }
        }
    }

    useEffect(() => {
        fetchCheckLogin();
    }, [])

	return{
		isLogin,
		loginHandler: (userName) => {
            if(userName){
                setIsLogin(true);
                setUserName(userName);
            }
        },
        userName
	}
}

export default useIsLogin;