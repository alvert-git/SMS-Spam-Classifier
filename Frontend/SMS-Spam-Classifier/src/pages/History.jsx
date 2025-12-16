import React from 'react'
import Recent_Scan from '../components/common/Recent_Scan'

const History = () => {
  return (
   <div className="p-8">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        History
      </h1>
      <Recent_Scan/>
    </div>
  )
}

export default History