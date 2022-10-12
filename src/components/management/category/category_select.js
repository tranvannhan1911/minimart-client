import { Cascader } from 'antd';
import React, { useEffect, useState } from 'react';
import api from '../../../api/apis';



const filter = (inputValue, path) =>
  path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);

const ParentSelect = (props) => {
    const [options, setOptions] = useState([])

    const handleData = async () => {
        const response = await api.category.to_select()
        const _data = response.data.data.results
        console.log(_data)
        setOptions(_data)
    }
    
    const onChange = (value, selectedOptions) => {
      props.setCategoryParent(value)
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
        placeholder="Chọn ngành hàng"
        changeOnSelect 
        showSearch={{
          filter,
        }}
        value={props.categoryParent}
        onSearch={(value) => console.log(value)}
    />)
}

export default ParentSelect;