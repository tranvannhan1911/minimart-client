import { Cascader } from 'antd';
import React, { useEffect, useState } from 'react';
import api from '../../../api/apis';



const filter = (inputValue, path) =>
  path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);

const AddressSelect = (props) => {
    const [options, setOptions] = useState([])

    const handleData = async () => {
        const response = await api.address.to_select()
        const _data = response.data.data.results
        console.log(_data)
        setOptions(_data)
    }
    
    const onChange = (value, selectedOptions) => {
      props.setAddressValue(value)
    };

    useEffect(() => {
      handleData()
    }, [])

    

    useEffect(() => {
      console.log("props.value", props)
    }, [props])

    return (
    <Cascader
        style={{
          textAlign: 'left'
        }}
        options={options}
        onChange={onChange}
        placeholder="Chọn địa chỉ"
        showSearch={{
          filter,
        }}
        value={props.addressValue}
        onSearch={(value) => console.log(value)}
    />)
}

export default AddressSelect;