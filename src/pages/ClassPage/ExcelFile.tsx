import React, { useState } from 'react'
import * as XLSX from 'xlsx'
const ExcelFile: React.FC = () => {
  const [fileName, setFileName] = useState('');
  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    setFileName(file.name)
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet= workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)
    console.log('====================================');
    console.log(jsonData);
    console.log('====================================');
  }
  return (

    <div>
      <h1>
        {fileName}
      </h1>
      <input type="file" onChange={e => handleFile(e)} />
    </div>

  )
}

export default ExcelFile
