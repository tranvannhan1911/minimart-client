import React from 'react'
import { CSVLink } from 'react-csv'
import { Button } from 'antd';
import {
    DownloadOutlined
} from '@ant-design/icons';

export const ExportReactCSV = ({ csvData, fileName }) => {
    return (
        <Button variant="warning">
            <CSVLink data={csvData} filename={fileName}> <DownloadOutlined /> Xuất Excel</CSVLink>
        </Button>
    )
}