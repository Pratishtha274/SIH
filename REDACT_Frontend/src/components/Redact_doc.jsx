// import React, { useState } from "react";

// function Redact_doc() {
//   const [file, setFile] = useState(null);
//   const [gradation, setGradation] = useState(1);

//   const handleFileUpload = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleGradationChange = (e) => {
//     setGradation(e.target.value);
//   };

//   const handlePreview = () => {
//     if (file) {
//       const fileURL = URL.createObjectURL(file);
//       window.open(fileURL, "_blank");
//     } else {
//       alert("Please upload a PDF first!");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#02000e] text-white flex flex-col items-center justify-center p-8">
//       <h1 className="text-4xl font-extrabold text-center text-gradient mb-10">
//         PDF Redaction
//       </h1>

//       <div className="mb-8">
//         <label className="block text-xl font-medium text-gray-300 mb-2">Upload your PDF</label>
//         <label
//           className="block bg-blue-700 text-white px-12 py-6 rounded-lg cursor-pointer hover:bg-blue-600 transition transform hover:scale-105"
//         >
//           Choose File
//           <input
//             type="file"
//             accept="application/pdf"
//             className="hidden"
//             onChange={handleFileUpload}
//           />
//         </label>
//         {file && <p className="mt-4 text-sm text-gray-400">{file.name}</p>}
//       </div>

//       {/* Gradation Scale Section */}
//       <div className="mb-8 w-full max-w-xs">
//         <label htmlFor="gradation" className="block mb-4 text-lg font-medium text-gray-300">
//           Gradation Level: {gradation}
//         </label>
//         <input
//           type="range"
//           id="gradation"
//           min="1"
//           max="10"
//           value={gradation}
//           onChange={handleGradationChange}
//           className="w-full h-2 bg-blue-600 rounded-lg cursor-pointer"
//         />
//         <div className="flex justify-between text-sm mt-2 text-gray-400">
//           <span>1</span>
//           <span>10</span>
//         </div>
//       </div>

//       {/* Preview Button */}
//       <div>
//         <button
//           onClick={handlePreview}
//           className="bg-green-600 px-6 py-3 rounded-lg text-lg text-white font-semibold hover:bg-green-500 transition transform hover:scale-105"
//         >
//           Preview PDF
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Redact_doc;


// import React, { useState } from "react";

// function Redact_doc() {
//   const [file, setFile] = useState(null);
//   const [gradation, setGradation] = useState(1);

//   const handleFileUpload = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleGradationChange = (e) => {
//     setGradation(e.target.value);
//   };

//   const handlePreview = () => {
//     if (file) {
//       const fileURL = URL.createObjectURL(file);
//       window.open(fileURL, "_blank");
//     } else {
//       alert("Please upload a document first!");
//     }
//   };

//   const fileType = file ? file.type.split("/")[0] : "";

//   return (
//     <div className="min-h-screen bg-[#02000e] text-white flex flex-col items-center justify-center p-8">
//       <h1 className="text-4xl font-extrabold text-center text-gradient mb-10">
//         Document Redaction Tool
//       </h1>

//       {/* Card Container */}
//       <div className="w-full max-w-lg bg-gradient-to-r from-blue-800 to-purple-800 p-8 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105">
//         {/* File Upload Section */}
//         <div className="mb-8">
//           <label className="block text-xl font-medium text-gray-300 mb-2">
//             Upload your Document
//           </label>
//           <label className="block bg-blue-700 text-white px-12 py-6 rounded-lg cursor-pointer hover:bg-blue-600 transition transform hover:scale-105">
//             Choose File
//             <input
//               type="file"
//               accept="image/*,application/pdf,.docx,.xml,text/*"
//               className="hidden"
//               onChange={handleFileUpload}
//             />
//           </label>
//           {file && (
//             <div className="mt-4 text-sm text-gray-400">
//               <p>{file.name}</p>
//               <p className="text-xs text-gray-500">
//                 {fileType === "image" ? "Image File" : file.type}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Gradation Scale Section */}
//         <div className="mb-8">
//           <label
//             htmlFor="gradation"
//             className="block mb-4 text-lg font-medium text-gray-300"
//           >
//             Gradation Level: {gradation}
//           </label>
//           <div className="relative">
//             <input
//               type="range"
//               id="gradation"
//               min="1"
//               max="10"
//               value={gradation}
//               onChange={handleGradationChange}
//               className="w-full h-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-lg appearance-none cursor-pointer focus:outline-none"
//             />
//             <div className="absolute left-0 right-0 flex justify-between text-sm text-gray-400 mt-2">
//               <span>1</span>
//               <span>10</span>
//             </div>
//           </div>
//         </div>

//         {/* Preview Button */}
//         <div>
//           <button
//             onClick={handlePreview}
//             className="bg-green-600 px-6 py-3 rounded-lg text-lg text-white font-semibold hover:bg-green-500 transition transform hover:scale-105"
//           >
//             Preview Document
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Redact_doc;


import React, { useState } from "react";
import Section from './Section'
import Heading from './Heading'
import { NavLink } from "react-router-dom";

function Redact_doc() {
  const [file, setFile] = useState(null);
  const [gradation, setGradation] = useState(1);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleGradationChange = (e) => {
    setGradation(e.target.value);
  };

  const handlePreview = () => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    } else {
      alert("Please upload a document first!");
    }
  };

  const handleClearFile = () => {
    setFile(null); // Clears the selected file
  };

  const fileType = file ? file.type.split("/")[0] : "";

  return (
    <>
      <Section className="h-screen" id="roadmap">
      <Heading tag="REDACT YOUR FILE" title="Document Redaction Tool" text="" />
      <div className="bg-[#02000e] text-white flex flex-col items-center justify-center">

        <div className="w-full max-w-lg p-8 bg-gray-800 rounded-xl shadow-2xl ">
          <div className="mb-8">
            <label className="block text-xl font-medium text-gray-300 mb-2">
              Upload your Document
            </label>
            <label className="block bg-blue-700 text-white px-12 py-6 rounded-lg cursor-pointer hover:bg-blue-600 transition">
              Choose File
              <input
                type="file"
                accept="image/*,application/pdf,.docx,.xml,text/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            {file && (
              <div className="mt-4 text-sm text-gray-400">
                <p>{file.name}</p>
                <p className="text-xs text-gray-500">
                  {fileType === "image" ? "Image File" : file.type}
                </p>
              </div>
            )}
          </div>

          {file && (
            <div className="mb-8">
              <button
                onClick={handleClearFile}
                className="bg-red-600 px-6 py-3 rounded-lg text-lg text-white font-semibold hover:bg-red-500 transition"
              >
                Clear Document
              </button>
            </div>
          )}

          <div className="mb-8">
            <label
              htmlFor="gradation"
              className="block mb-4 text-lg font-medium text-gray-300"
            >
              Gradation Level: {gradation}
            </label>
            <div className="relative">
              <input
                type="range"
                id="gradation"
                min="1"
                max="10"
                value={gradation}
                onChange={handleGradationChange}
                className="w-full h-4 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg appearance-none cursor-pointer focus:outline-none"
              />
              <div className="absolute left-0 right-0 flex justify-between text-sm text-gray-400 mt-2">
                <span>1</span>
                <span>10</span>
              </div>
            </div>
          </div>

          {/* Preview Button */}
          <div>
            <button
              onClick={handlePreview}
              className="bg-green-600 px-6 py-3 rounded-lg text-lg text-white font-semibold hover:bg-green-500 transition"
            >
              Preview Document
            </button>
          </div>

        </div>
      </div>
      
    </Section>
    </>
  );
}

export default Redact_doc;




// const Redact_doc = () => {
//   return (
    // <Section className="h-screen" id="roadmap">
    //   <Heading tag="Ready baby" title="Document Redaction Tool" text="" />
    // </Section>
    
//   )
// }

// export default Redact_doc
