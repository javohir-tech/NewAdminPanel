import React, { useEffect, useRef, useState } from 'react';
import { DeleteColumnOutlined, DeleteFilled, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm, Space, Table, Modal, Form, Upload, message } from 'antd';
import Highlighter from 'react-highlight-words';
import { Image } from 'antd';
import { render } from 'react-dom';

const Categories = () => {

    // get method
    const [data, setData] = useState();
    const getData = () => {
        fetch('https://autoapi.dezinfeksiyatashkent.uz/api/categories')
            .then((res) => res.json())
            .then((response) => {
                const modifiedData = response.data.map((item, index) => ({
                    ...item,
                    key: item.id || index,
                }));
                setData(modifiedData);
            })
    }
    useEffect(() => {
        getData()
    }, [])

    // post method
    const [name_en, setName_en] = useState();
    const [name_ru, setName_ru] = useState();
    const [art, setArt] = useState();

    // yangila
    const newInputs = () =>{
       
        setArt(null);
        setName_en('');
        setName_ru('')
    }

    const addCategory = (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append("name_en", name_en);
        formData.append("name_ru", name_ru);
        formData.append("images", art);
        fetch('https://autoapi.dezinfeksiyatashkent.uz/api/categories', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('tokenjon')}`,
            },
            body: formData
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.success === true) {
                    getData()
                   message.success(response.message)
                   setIsModalOpen(false)
                //    newInputs()
                setArt(null);
                setName_en('');
                setName_ru('')
                }
                else {
                    message.error(response.message)
                }
            })
            .catch((error)=>{
                message.error(error.message)
            })
    }

    // modal  js
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

    // upload js
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    // table js
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
    const columns = [
        {
            title: 'Name(En)',
            dataIndex: 'name_en',
            key: 'name_en',
            width: '30%',
            ...getColumnSearchProps('name_en'),
        },
        {
            title: 'Name(Ru)',
            dataIndex: 'name_ru',
            key: 'name_en',
            width: '30%',
            ...getColumnSearchProps('name_ru'),
        },
        {
            title: 'Image',
            dataIndex: 'image_src',
            key: 'image_src',
            width: '20%',
            render: (text) => <Image src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${text}`} alt="image" width={100} height={100} />,
        },
        {
            title:
                <Button type="primary" onClick={showModal}>
                    Add Categories
                </Button>,
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Vazifani o'chirish"
                        description="Bu vazifani o'chirishni xohlaysizmi?"
                        okText="Ha"
                        cancelText="Yo'q"
                    >
                        <Button danger type="primary"><DeleteOutlined /></Button>
                    </Popconfirm>
                    <Button type="primary"><EditOutlined /></Button>
                </Space>
            ),
            key: 'action'
        }
    ];


    return (
        <>
            <Table columns={columns} pagination={{ pageSize: 4 }} dataSource={data} />
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 14,
                    }}
                    layout="horizontal"
                    style={{
                        maxWidth: 600,
                    }}
                >
                    <Form.Item label="Name(En)">
                        <Input value={name_en} onChange={(e) => setName_en(e?.target?.value)} />
                    </Form.Item>
                    <Form.Item label="Name(Ru)">
                        <Input value={name_ru} onChange={(e) => setName_ru(e?.target?.value)} />
                    </Form.Item>
                    <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload action="/upload.do" listType="picture-card"
                            beforeUpload={(file) => {
                                setArt(file);
                                // Mavjud fayllarni tozalash
                                return false;
                            }}
                            onChange={(e) => setArt(e?.fileList[0]?.originFileObj)}>
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
                    <Button onClick={addCategory}>Submit</Button>
                </Form>
            </Modal>
        </>


    );
};
export default Categories;