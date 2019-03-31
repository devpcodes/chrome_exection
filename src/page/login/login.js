import React from 'react';
import axios from '../../utils/axios'
import { Button,Form, Icon, Input } from 'antd';
import './login.scss'

var url = 'http://localhost/api/auth/google'
if(process.env.NODE_ENV === 'development'){
    url = 'http://localhost/api/auth/google'
}else{
    url = 'http://www.mynotemd.com/api/auth/google'
}
const login =  (props) => {
    const {
        getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = props.form;
    return (
        <div className="login__wrapper">
            <div className="login__box">
                <div className="box__header">
                    <h1 className="login__header-title">LOGIN NOTE</h1>
                </div>
                <Form>
                    <Form.Item 
                        label="輸入帳號"
                        hasFeedback
                    >
                        {
                            getFieldDecorator('account',{
                                initialValue: '',   
                                rules: [
                                    {
                                        required: true,
                                        message: '用戶名不能為空',
                                    },
                                    {
                                        validator: (rule, value, callback) => {
                                            if(value === ''){
                                                callback();
                                            }
                                            const patt = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
                                            if(patt.test(value)){
                                                callback();
                                            }else{
                                                callback('僅能輸入email格式');
                                            }
                                        }
                                    }
                                ]
                            })(
                                <Input /*prefix={<Icon type='user'/>} */ placeholder='account'/>
                            )
                        }
                    </Form.Item>
                    <Form.Item 
                        label="輸入密碼"
                        hasFeedback
                    >
                        {
                            getFieldDecorator('userPwd',{
                                initialValue: '',  /*初始值*/
                                rules: [
                                    {
                                        required: true,
                                        message: '密碼不能為空'
                                    },                                           
                                ]
                            })(
                                <Input type='password' placeholder='password'/>                                                
                            )
                        }
                    </Form.Item>
                </Form>
                <Button
                    style={{
                        width: '100%',
                        fontWeight: 'bold'
                    }}
                    onClick={async () => {
                        let userInfo = props.form.getFieldsValue();
                        const res = await axios.post('/api/login',{
                            "email": userInfo.account,
                            "password": userInfo.userPwd
                        },{
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        console.log('res',res.data);
                        // console.log('userInfo',userInfo);
                        // const res = await axios.get('/json/login.json');
                        if(res.data.name){
                            console.log('login msg',res.data);
                            props.loginHandler(res.data.name);
                        }
                    }}
                >
                    登入
                </Button>
                <div className="google__login">
                    <p>以社群帳號登入</p>
                    <Button icon="google" onClick={() => {
                        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
                        var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;
                    
                        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
                        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
                    
                        var left = ((width / 2) - (560 / 2)) + dualScreenLeft;
                        var top = ((height / 2) - (500 / 2)) + dualScreenTop;
                        window.open(url,'fbgoogle',`height=560,width=500,scrollbars=yes,top=${top},left=${left}`);
                    }}>
                        Google登入
                    </Button>
                </div>
            </div>

        </div>
        
    )
}

export default Form.create({})(login);