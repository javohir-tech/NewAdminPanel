import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Image, Input, message, Modal, Space, Table, Upload } from 'antd';
import Highlighter from 'react-highlight-words';
import { render } from 'react-dom';

export default function Cities() {
    const token = localStorage.getItem('tokenjon')
    const Url = 'https://autoapi.dezinfeksiyatashkent.uz/api/cities'

    //get ethod
    const [data, setData] = useState([])
    const getData = () => {
        fetch(Url)
            .then((res) => res.json())
            .then((response) => {
                const modifiedData = response.data.map((item, index) => ({
                    ...item,
                    key: item.id || index
                }))
                setData(modifiedData)
            })
    }

    useEffect(() => {
        getData()
    }, [])

    //post method
    const [name, setName] = useState('')
    const [text, setText] = useState('')
    const [img , setImg ] = useState(null)

    const addCities = (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append("name", name),
        formData.append("text", text),
        formData.append("images", img)

        fetch(Url, {
            method: 'POST',
            headers:{
                "Authorization":`Bearer ${token}`
            },
            body:formData
        })
        .then((res)=>res.json())
        .then((response)=>{
            if(response.success === true){
                getData()
                message.success(response.message)
                setIsModalOpen(false)
                setName('')
                setText('')
                setImg(null)
            }
            else{
                message.error(response.message)
            }
        })
    }

    // put (update) method

    // modal js
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    //upload js
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    // table search
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    // /table search

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Text',
            dataIndex: 'text',
            key: 'text',
            width: '20%',
            ...getColumnSearchProps('text'),
        },
        {
            title: 'Image',
            dataIndex: 'image_src',
            key: 'image_src',
            width: '20%',
            render: (text) => <Image src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${text}`} alt="cities img " width={100} height={100} />
        },
        {
            title: <Button type='primary' onClick={showModal}>Action</Button>,
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary">Edit</Button>
                    <Button type="primary" danger>Delete</Button>
                </Space>
            )
        }
    ];

    return (
        <>
            <Table columns={columns} pagination={{ pageSize: 4 }} dataSource={data} />
            <Modal title="Add Cities" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form onSubmitCapture={addCities}>
                    <h1>Add Cities</h1>
                    <Form.Item>
                        <Input value={name} placeholder="Name" onChange={(e)=>setName(e?.target?.value)} required/>
                    </Form.Item>
                    <Form.Item>
                        <Input value={text} placeholder='text' onChange={(e)=>setText(e?.target?.value)} required/>
                    </Form.Item>
                    <Form.Item  label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload valuePropName="fileList" action="/upload.do" listType="picture-card" required
                        beforeUpload={(file) =>{
                            setImg(file)
                            return false
                        }
                        }>
                        
                            <button
                                style={{
                                    border: 0,
                                    background: 'none',
                                }}
                                type="button"
                            >
                                <PlusOutlined />
                                <div
                                    style={{
                                        marginTop: 8,
                                    }}
                                >
                                    Upload
                                </div>
                            </button>
                        </Upload>
                    </Form.Item>
                    <Button htmlType='submit'>Add</Button>
                </Form>
            </Modal>
        </>
    )
}
