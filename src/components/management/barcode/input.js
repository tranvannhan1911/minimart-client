import { message, Select} from 'antd';
import React, { useEffect, useState } from 'react';
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
        const audio = new Audio(require("../../../assets/beep.mp3"))
        audio.play()
    };

    const onSearch = (value) => {
        // console.log('search:', value);
    };

    const handleDataProduct = async () => {
        try {
          const response = await api.product.list();
          var results = response.data.data.results
          if(props.sellable){
            results = results.filter(elm => {
              return elm.have_price && elm.stock > 0;
            })
          }
          const options = results.map(elm => {
            return (
              <Option key={elm.id} value={elm.id} barcode={elm.barcode}>{elm.name}</Option>
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
            placeholder={props.placeholder ? props.placeholder : "Thêm sản phẩm vào đơn hàng"}
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option) => {
              return option.children.toLowerCase().includes(input.toLowerCase())
                | option.barcode.trim() == input.trim()
            }}
            value={value}
            style={props.style}
        >
            {productOptions}
        </Select>
    );
};

export default ProductSelect;