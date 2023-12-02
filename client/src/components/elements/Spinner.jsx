import React from 'react';

function Spinner() {
  return (
    <div
      className="fixed top-0 right-0 bottom-0 left-0 bg-gray bg-opacity-50 flex justify-center items-center"
      style={{ zIndex: 5000 }}
    >
      <div
        className="w-16 h-16 border-8 border-t-8 border-black border-opacity-50 rounded-full"
        style={{
          borderColor: '#000 transparent #555 transparent',
          animation: 'spin 1.2s linear infinite',
        }}
      ></div>
    </div>
  );
}

export default Spinner;
