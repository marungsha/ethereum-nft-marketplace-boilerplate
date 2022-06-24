import React, {useState} from 'react'
import { useMoralis } from "react-moralis";
import { message, Button, Upload, Image } from "antd";
import { UploadOutlined, FileSearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";

function IPFSUpload ({name= '', accept = '', uploadText = 'Click to upload', updateLoading, setUploadURI})  {
    const [sFile, setSFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const { Moralis } = useMoralis();

    const uploadProps = {
        name,
        accept,
        customRequest: async () => {
            console.log("Hello")
            setLoading(true)
            updateLoading(true)
            try {
                const iFile = new Moralis.File(name, sFile);
                await iFile.saveIPFS();
        
                const fileURI = iFile.ipfs();
                
                setUploadURI(fileURI)
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
            updateLoading(false)
            
            
        },
        beforeUpload: (file) => {
            const isCorrect = file.type.startsWith(accept.split('*')[0]);
            if (!isCorrect) {
              message.error(`${file.name} is not an ${accept} file`);
            } else setSFile(file)

            return isCorrect || Upload.LIST_IGNORE;
        },
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
      
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };
    return (
        <Upload {...uploadProps} showUploadList={false}>
            <Button loading={loading} block icon={<UploadOutlined />}>{uploadText}</Button>
            {sFile && accept==='image/*' && <img src={URL.createObjectURL(sFile)} style={{maxWidth: 150, marginTop: 20, marginBottom: 10}} />}
        </Upload>
    )
}

export default IPFSUpload