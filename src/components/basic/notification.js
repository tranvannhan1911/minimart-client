import {
    RadiusBottomrightOutlined,
} from '@ant-design/icons';
import { Button, Divider, notification, Space } from 'antd';
import React from 'react';
const openNotification = (placement) => {
    notification.info({
        message: `Notification ${placement}`,
        description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        placement,
    });
};

const Notification = () => (
    <>
        <Space>
            <Button
                type="primary"
                onClick={() => openNotification('bottomRight')}
                icon={<RadiusBottomrightOutlined />}
            >
                bottomRight
            </Button>
        </Space>
    </>
);
export default Notification;