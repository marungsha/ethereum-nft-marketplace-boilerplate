import React, {useState} from 'react'
import { useMoralis } from "react-moralis";
import { message, Button, Upload } from "antd";
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
                // setNFT({...NFT, image: fileURI})
                // console.log(fileURI, NFT)
                setUploadURI(fileURI)
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
            updateLoading(false)
            
            // const metadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
            // await metadataFile.saveIPFS();
            // const metadataURI = metadataFile.ipfs();
        },
        beforeUpload: (file) => {
            const isCorrect = file.type.startsWith(accept.split('*')[0]);
            if (!isCorrect) {
              message.error(`${file.name} is not an ${accept} file`);
            } else setSFile(file)
            console.log(file)
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
        <Upload {...uploadProps} >
            <Button loading={loading} block icon={<UploadOutlined />}>{uploadText}</Button>
        </Upload>
    )
}

export default IPFSUpload