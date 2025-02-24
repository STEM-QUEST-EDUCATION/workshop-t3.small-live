export default function LoadingTicket() {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center mt-4">
        <div className="w-full max-w-[350px] h-auto bg-white rounded-lg p-4 relative animate-pulse">
          <div className="flex flex-col items-center">
            {/* Transaction Date */}
            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
  
            <div className="flex flex-col w-full gap-2 mt-8 ml-2">
              {/* Receipt/Transaction ID */}
              <div className="h-4 w-48 bg-gray-200 rounded mb-4" />
            </div>
  
            {/* Workshop Title */}
            <div className="h-8 w-56 bg-gray-200 rounded mb-2" />
  
            {/* Student Name */}
            <div className="h-10 w-40 bg-gray-200 rounded mb-2" />
  
            {/* Age */}
            <div className="h-4 w-20 bg-gray-200 rounded mb-4" />
  
            {/* Workshop Details Box */}
            <div className="bg-gray-100 rounded-2xl mt-2 pb-6 pt-4 px-6 w-full mb-4">
              <div className="h-5 w-36 bg-gray-200 rounded mb-3 mx-auto" />
  
              {/* Location */}
              <div className="flex items-center mb-3">
                <div className="w-5 h-5 bg-gray-200 rounded-full mr-2" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
  
              {/* Date */}
              <div className="flex items-center mb-3">
                <div className="w-4 h-4 bg-gray-200 rounded-full mr-2" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
              </div>
  
              {/* Time */}
              <div className="flex items-center">
                <div className="w-5 h-5 bg-gray-200 rounded-full mr-2" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
  
            {/* Payment Details */}
            <div className="text-left w-full px-6 mb-4 flex space-x-4">
              <div className="h-5 w-16 bg-gray-200 rounded" />
              <div className="h-5 w-24 bg-gray-200 rounded" />
            </div>
  
            {/* Footer */}
            <div className="flex space-x-2 mt-6">
              <div className="h-5 w-24 bg-gray-200 rounded" />
              <div className="h-5 w-8 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
  
        {/* Action Buttons */}
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="h-[52px] w-[330px] bg-gray-200 rounded-lg" />
          <div className="h-[52px] w-[330px] bg-gray-200 rounded-lg" />
        </div>
      </div>
    )
  }
  
  