// import React, { useState } from "react";
// import Section from "./Section";
// import Heading from "./Heading";
// import { NavLink } from "react-router-dom";
// function Redact_doc() {
//   const [file, setFile] = useState(null);
//   const [gradation, setGradation] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const gradationDescriptions = {
//     1: "Level 1: GPE (City/Location)",
//     2: "Level 2: GPE, ORG (Organization)",
//     3: "Level 3: GPE, ORG, JOB_TITLE",
//     4: "Level 4: GPE, ORG, JOB_TITLE, PERSON (Name)",
//     5: "Level 5: GPE, ORG, JOB_TITLE, PERSON, TRANSACTION (Amount, Date), TIME (Meeting Time)",
//     6: "Level 6: GPE, ORG, JOB_TITLE, PERSON, TRANSACTION, TIME, PHONE_NUMBER, EMAIL",
//     7: "Level 7: GPE, ORG, JOB_TITLE, PERSON, TRANSACTION, TIME, PHONE_NUMBER, EMAIL, DRIVING_LICENSE, VOTER_ID",
//     8: "Level 8: GPE, ORG, JOB_TITLE, PERSON, TRANSACTION, TIME, PHONE_NUMBER, EMAIL, DRIVING_LICENSE, VOTER_ID, IFSC_CODE, UPI_ID, GSTIN",
//     9: "Level 9: GPE, ORG, JOB_TITLE, PERSON, TRANSACTION, TIME, PHONE_NUMBER, EMAIL, DRIVING_LICENSE, VOTER_ID, IFSC_CODE, UPI_ID, GSTIN, BANK_ACCOUNT, CREDIT_CARD, EPF_NUMBER",
//     10: "Level 10: GPE, ORG, JOB_TITLE, PERSON, TRANSACTION, TIME, PHONE_NUMBER, EMAIL, DRIVING_LICENSE, VOTER_ID, IFSC_CODE, UPI_ID, GSTIN, BANK_ACCOUNT, CREDIT_CARD, EPF_NUMBER, AADHAAR_NUMBER, PAN_NUMBER, PASSPORT_NUMBER",
//   };

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

//   const handleClearFile = () => {
//     setFile(null);
//   };

//   const handleRedact = async () => {
//     if (!file) {
//       alert("Please upload a document first!");
//       return;
//     }

//     setLoading(true);

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("gradation", gradation);

//     try {
//       const response = await fetch("http://localhost:5000/redact", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         const result = await response.json();
//         alert("Redaction successful!");
//       } else {
//         alert("Failed to redact the document.");
//       }
//     } catch (error) {
//       console.error("Error during redaction:", error);
//       alert("An error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fileType = file ? file.type.split("/")[0] : "";

//   return (
//     <>
//       <Section className="min-h-screen" id="roadmap">
//         <Heading className={`text-center flex flex-col items-center`} tag="REDACT YOUR FILE" title="Document Redaction Tool" text="" />

//         <div className="bg-[#02000e] text-white flex flex-col items-center justify-center px-4 ">
//           <div className="w-full max-w-2xl p-8 bg-gray-800 rounded-xl shadow-2xl ">
//             <div className="mb-6">
//               <label className="block text-xl font-medium text-gray-300 mb-4">
//                 Upload your Document
//               </label>
//               <label className="block bg-blue-700 text-white px-8 py-4 rounded-lg cursor-pointer hover:bg-blue-600 transition text-center">
//                 Choose File
//                 <input
//                   type="file"
//                   accept="image/*,application/pdf,.docx,.xml,text/plain"
//                   className="hidden"
//                   onChange={handleFileUpload}
//                 />
//               </label>
//               {file && (
//                 <div className="mt-4 text-sm text-gray-400">
//                   <p>{file.name}</p>
//                   <p className="text-xs text-gray-500">
//                     {fileType === "image" ? "Image File" : file.type}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {file && (
//               <div className="mb-6">
//                 <button
//                   onClick={handleClearFile}
//                   className="bg-red-600 px-4 py-2 w-full sm:w-auto rounded-lg text-lg text-white font-semibold hover:bg-red-500 transition"
//                 >
//                   Clear Document
//                 </button>
//               </div>
//             )}

//             <div className="mb-6">
//               <label
//                 htmlFor="gradation"
//                 className="block mb-4 text-lg font-medium text-gray-300"
//               >
//                 Gradation Level: {gradation}
//               </label>
//               <div className="relative">
//                 <input
//                   type="range"
//                   id="gradation"
//                   min="1"
//                   max="10"
//                   value={gradation}
//                   onChange={handleGradationChange}
//                   className="w-full h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg appearance-none cursor-pointer focus:outline-none"
//                 />
//                 <div className="absolute left-0 right-0 flex justify-between text-sm text-gray-400 mt-2">
//                   <span>1</span>
//                   <span>10</span>
//                 </div>
//               </div>
//               <p className="p-4 mt-6 text-sm text-gray-300 bg-gray-700 rounded-lg">
//                 {gradationDescriptions[gradation]}
//               </p>
//             </div>

//             <div className="flex flex-wrap gap-4 justify-center">
//               <button
//                 onClick={handlePreview}
//                 className="bg-green-600 px-4 py-2 rounded-lg text-lg text-white font-semibold hover:bg-green-500 transition w-full sm:w-auto"
//               >
//                 Preview Document
//               </button>
//               <button
//                 onClick={handleRedact}
//                 className={`bg-blue-600 px-4 py-2 rounded-lg text-lg text-white font-semibold hover:bg-blue-500 transition w-full sm:w-auto ${loading ? "opacity-50 cursor-not-allowed" : ""
//                   }`}
//                 disabled={loading}
//               >
//                 {loading ? "Processing..." : "Redact Document"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </Section>
//       <div>
//         <NavLink to="/" className="text-blue-400 hover:text-blue-300 transition font-semibold text-sm" >
//           BACK 
//         </NavLink>
//       </div>

//     </>
//   );
// }

// export default Redact_doc;


import React, { useState } from "react";
import Section from "./Section";
import Heading from "./Heading";
import { NavLink } from "react-router-dom";

function Redact_doc() {
  const [file, setFile] = useState(null);
  const [gradation, setGradation] = useState(1);
  const [loading, setLoading] = useState(false);

  const gradationDescriptions = {
    1: "Level 1: GPE (City/Location)",
    2: "Level 2: GPE, ORG (Organization)",
    3: "Level 3: GPE, ORG, JOB_TITLE",
    4: "Level 4: GPE, ORG, JOB_TITLE, PERSON (Name)",
    5: "Level 5: GPE, ORG, JOB_TITLE, PERSON, TRANSACTION (Amount, Date), TIME (Meeting Time)",
    6: "Level 6: GPE, ORG, JOB_TITLE, PERSON, TRANSACTION, TIME, PHONE_NUMBER, EMAIL",
    7: "Level 7: GPE, ORG, JOB_TITLE, PERSON, TRANSACTION, TIME, PHONE_NUMBER, EMAIL, DRIVING_LICENSE, VOTER_ID",
    8: "Level 8: GPE, ORG, JOB_TITLE, PERSON, TRANSACTION, TIME, PHONE_NUMBER, EMAIL, DRIVING_LICENSE, VOTER_ID, IFSC_CODE, UPI_ID, GSTIN",
    9: "Level 9: GPE, ORG, JOB_TITLE, PERSON, TRANSACTION, TIME, PHONE_NUMBER, EMAIL, DRIVING_LICENSE, VOTER_ID, IFSC_CODE, UPI_ID, GSTIN, BANK_ACCOUNT, CREDIT_CARD, EPF_NUMBER",
    10: "Level 10: GPE, ORG, JOB_TITLE, PERSON, TRANSACTION, TIME, PHONE_NUMBER, EMAIL, DRIVING_LICENSE, VOTER_ID, IFSC_CODE, UPI_ID, GSTIN, BANK_ACCOUNT, CREDIT_CARD, EPF_NUMBER, AADHAAR_NUMBER, PAN_NUMBER, PASSPORT_NUMBER",
  };

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
    setFile(null);
  };

  const handleRedact = async () => {
    if (!file) {
      alert("Please upload a document first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("gradation", gradation);

    try {
      const response = await fetch("http://localhost:5000/redact-doc", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        // alert("Redaction successful!");
      } else {
        alert("Failed to redact the document.");
      }
    } catch (error) {
      console.error("Error during redaction:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fileType = file ? file.type.split("/")[0] : "";

  return (
    <>
      <Section className="min-h-screen" id="roadmap">
        <Heading className="text-center flex flex-col items-center" tag="REDACT YOUR FILE" title="Document Redaction Tool" text="" />
        <div className="bg-blue-700 h-[30rem] w-[60rem] fixed blur-[2.5rem] transform translate-x-[30rem] rounded-full  z-[-1] opacity-50"></div>
        <div className="bg-[#02000e] text-white flex flex-col items-center justify-center px-4 pt-10 h-[35rem]">
          <div className="w-full max-w-2xl p-8 bg-[#030018] rounded-xl shadow-2xl ">
            <div className="mb-6">
              <label className="block text-xl font-medium text-gray-300 mb-4">
                Upload your Document
              </label>
              <label className="block bg-blue-700 text-white px-15 py-[1.5rem] rounded-lg cursor-pointer hover:bg-blue-600 transition text-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center  ">
                Choose File - ( PDF, DOCX, XML, CSV, TXT, PNG )
                <input
                  type="file"
                  accept="image/*,application/pdf,.docx,.xml,text/plain,.csv"
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
              <div className="mb-6">
                <button
                  onClick={handleClearFile}
                  className="bg-red-600 px-4 py-2 w-full sm:w-auto rounded-lg text-lg text-white font-semibold hover:bg-red-500 transition"
                >
                  Clear Document
                </button>
              </div>
            )}

            <div className="mb-6">
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
                  className="w-full h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg appearance-none cursor-pointer focus:outline-none"
                />
                <div className="absolute left-0 right-0 flex justify-between text-sm text-gray-400 mt-2">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>
              <p className="p-4 mt-8 text-sm text-gray-300 bg-gray-700 rounded-lg">
                {gradationDescriptions[gradation]}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handlePreview}
                className="bg-green-600 px-4 py-2 rounded-lg text-lg text-white font-semibold hover:bg-green-500 transition w-full sm:w-auto"
              >
                Preview Document
              </button>
              <button
                onClick={handleRedact}
                className={`bg-blue-600 px-4 py-2 rounded-lg text-lg text-white font-semibold hover:bg-blue-500 transition w-full sm:w-auto ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Redact Document"}
              </button>
            </div>
          </div>
          <div className="mt-6">
            <NavLink
              to="/get-started"
              className="bg-blue-900 opacity-50 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
            >
              BACK
            </NavLink>
          </div>
        </div>
      </Section>
    </>
  );
}

export default Redact_doc;
