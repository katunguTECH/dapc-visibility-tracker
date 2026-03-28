{/* M-Pesa Popup Modal */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
      
      {/* STEP 1: Input Phone Number (Only shows if status is 'idle') */}
      {status === "idle" && (
        <>
          <h2 className="text-2xl font-bold mb-2">Unlock Pro Audit</h2>
          <p className="text-gray-600 mb-6">Enter your M-Pesa number to receive the payment prompt.</p>
          
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Number</label>
            <input
              type="text"
              placeholder="0712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-green-500 outline-none transition-all"
            />
          </div>

          <button
            onClick={handlePayment} // This calls the stk-push API
            disabled={!phoneNumber || phoneNumber.length < 10}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 disabled:bg-gray-300 transition-all"
          >
            Send M-Pesa Prompt
          </button>
        </>
      )}

      {/* STEP 2: Waiting for PIN (Only shows after handlePayment succeeds) */}
      {(status === "pending" || status === "awaiting") && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold">Awaiting M-Pesa PIN</h2>
          <p className="text-gray-600 mt-2">Check your phone for the pop-up and enter your PIN.</p>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-left">
            <p className="font-bold text-gray-700">Manual Payment Backup:</p>
            <p>Paybill: <span className="font-mono">516600</span></p>
            <p>Account: <span className="font-mono">0675749001</span></p>
          </div>
        </div>
      )}

      <button 
        onClick={() => { setIsModalOpen(false); setStatus("idle"); }}
        className="w-full mt-4 text-gray-400 text-sm hover:text-gray-600"
      >
        Cancel and Return
      </button>
    </div>
  </div>
)}