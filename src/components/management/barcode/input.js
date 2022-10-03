import { Input, message, Select, Tabs } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import api from '../../../api/apis';
import messages from '../../../utils/messages';
const { Option } = Select;

const ProductSelect = (props) => {
    const [value, setValue] = useState()
    const [productOptions, setProductOptions] = useState([])
    const onChange = (value) => {
        console.log(`selected ${value}`);
        setValue(null)
        props.onSelectProduct(value)
    };

    const onSearch = (value) => {
        // console.log('search:', value);
    };

    const handleDataProduct = async () => {
        try {
          const response = await api.product.list();
          const options = response.data.data.results.map(elm => {
            return (
              <Option key={elm.id} value={elm.id}>{elm.name}</Option>
            )
          })
          setProductOptions(options)
        } catch (error) {
          message.error(messages.ERROR)
        } 
      }

    useEffect(() => {
        handleDataProduct()
    }, [])

    useEffect(() => {
        // console.log(productOptions)
    }, [productOptions])

    return (
        <Select
            showSearch
            placeholder="Thêm sản phẩm vào đơn hàng"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={onSearch}
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            value={value}
        >
            {productOptions}
        </Select>
    );
};

export default ProductSelect;