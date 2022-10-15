import React from 'react'
import { CSVLink } from 'react-csv'
import { Button } from 'antd';
import {
    DownloadOutlined
} from '@ant-design/icons';

export const ExportReactCSV = ({ csvData, fileName, header }) => {
    return (
        <Button variant="warning">
            <CSVLink data={csvData} filename={fileName} headers={header}> <DownloadOutlined /> Xuất Excel</CSVLink>
        </Button>
    )
}