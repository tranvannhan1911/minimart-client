import React from 'react'
import { CSVLink } from 'react-csv'
import { Button } from 'antd';
import {
    DownloadOutlined
} from '@ant-design/icons';

export const ExportTemplateReactCSV = ({ csvData, fileName, header, isManager }) => {

    // const content = () => {
    //     if(isManager)
    //         return (
    //             <Button variant="warning">
    //                 <CSVLink data={csvData} filename={fileName} headers={header}> <DownloadOutlined /> Xuất Excel</CSVLink>
    //             </Button>
    //         )
    //     else
    //         return <></>
    // }

    return (
        <Button variant="warning">
            <CSVLink data={csvData} filename={fileName} headers={header}> <DownloadOutlined /> Template</CSVLink>
        </Button>
    )
}