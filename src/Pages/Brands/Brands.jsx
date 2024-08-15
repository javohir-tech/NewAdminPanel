import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Space, Table, Upload } from 'antd';
import Highlighter from 'react-highlight-words';
import { render } from 'react-dom';

const Brands = () => {
    const brandsUrl = 'https://autoapi.dezinfeksiyatashkent.uz/api/brands'
    const token = localStorage.getItem("tokenjon")
    // get method
    const [data, setData] = useState([]);
    const getData = () => {
        fetch(brandsUrl)
            .then((res) => res.json())
            .then((response) => {
                // console.log(response.data);

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

    // post method
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);

    const addBrands = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", name)
        formData.append("images", image)
        fetch(brandsUrl, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
            .then((res) => res.json())
            .then((response) => {
                if (response.success === true) {
                    getData()
                    message.success(response.message)
                    setImage(null)
                    setName('')
                    setIsModalOpen(false)
                } else {
                    message.error(response.message)
                }
            })
            .catch((error) => message.error(error, "xatolik yuz berdi "))
    }

    //modal js
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        addBrands();
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
            title: 'Name',
            dataIndex: 'title',
            key: 'title',
            width: '30%',
            ...getColumnSearchProps('title'),
        },
        {
            title: 'Image',
            dataIndex: 'image_src',
            key: 'image_rsc',
            render: (text) => <img src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${text}`} width={100} height={100} alt='img' />
        },
        {
            title: <Button type='primary' onClick={showModal}>Add</Button>,
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type='primary' >Edit</Button>
                </Space>
            )
        }
    ];
    return (
        <>
            <Table columns={columns} pagination={{ pageSize: 6 }} dataSource={data} />
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form>
                    <Form.Item>
                        <Input value={name} onChange={(e) => setName(e?.target?.value)} required />
                    </Form.Item>
                    <Form.Item label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
                        <Upload valuePropName="fileList" action="/upload.do" listType="picture-card" required
                            beforeUpload={(file) => {
                                setImage(file)
                                return false
                            }
                            }
                        >
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
                    <Button type='primary' onClick={addBrands}>Add</Button>
                </Form>
            </Modal>
        </>
    );
};
export default Brands;