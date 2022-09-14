import React ,{useState} from 'react';
import AWS from 'aws-sdk'
import paths from './paths'
import makestr from './random'
import { message } from 'antd';

const S3_BUCKET ='minimart-tvn1911';
const REGION ='ap-southeast-1';


AWS.config.update({
    accessKeyId: 'AKIATD7BEVK2SY75EQWT',
    secretAccessKey: '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'
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

const uploadFile = async (options) => {
    const { onSuccess, onError, file, onProgress, prefix } = options;
    const filename = makestr(12)+"-"+file.name
    const path = `${prefix}/${filename}`
    const params = {
        ACL: 'public-read',
        Body: file,
        Bucket: S3_BUCKET,
        Key: path,
        ContentType: file.type
    };

    myBucket.putObject(params)
    .on('httpUploadProgress', (evt) => {
        console.log(evt.loaded)
        onProgress({ percent: Math.round((evt.loaded / evt.total) * 100) })
        // setProgress(Math.round((evt.loaded / evt.total) * 100))
    })
    .send((err) => {
        if (err) {
            console.log(err)
            onError({err})
            message.error("Không thể tải ảnh lên, vui lòng thử lại")
            return false;
        }
        onSuccess(paths.s3(path))
        return true;
    })
}

export default uploadFile;