import React from 'react'
import { Button, Form, Input, message } from 'antd';
import './Login.css'
import axios from 'axios';
import { useNavigate } from 'react-router';

export default function Login() {
    const Url = 'https://autoapi.dezinfeksiyatashkent.uz/api/auth/signin'
    const navigate = useNavigate();
    const onFinish = (values) => {
        console.log('Success:', values);
        axios({
            method:'POST',
            url:Url,
            data:values
        })
        .then((res) => {
            if(res.data.success===true){
                localStorage.setItem('tokenjon', res?.data?.data?.tokens?.accessToken?.token);
                message.success("Login Successful");
                navigate('/layout')
            }
        })
        .catch((err)=>{
            message.error("Login Failed")
        })
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className='login-box'>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Phone Number"
                    name="phone_number"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
