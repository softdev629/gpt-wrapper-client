import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as mammoth from "mammoth";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import FullScreenLoader from "../components/FullScreenLoader";

const API_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;

const CheckPage = () => {
  const [textContent, setTextContent] = useState("");
  const [sourceResult, setSourceResult] = useState("");
  const [detailResult, setDetailResult] = useState("");
  const [factualResult, setFactualResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const logged_in = localStorage.getItem("logged_in");
  const navigate = useNavigate();
  if (!logged_in) navigate("/");

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setTextContent(result.value); // Set the extracted text
      } catch (error) {
        console.error("Error extracting text from Word document:", error);
      }
    }
  };

  const handleVerify = (type: string) => {
    if (textContent === "") {
      alert("Content is empty!!!");
      return;
    }
    setLoading(true);
    axios
      .post(`${API_ENDPOINT}/verify/${type}`, { text: textContent })
      .then(({ data }) => {
        console.log(data.result);
        switch (type) {
          case "source":
            setSourceResult(data.result);
            break;
          case "detail":
            setDetailResult(data.result);
            break;
          case "factual":
            setFactualResult(data.result);
            break;
        }
        setLoading(false);
      });
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 pb-5 relative">
      <div className="flex flex-col px-6 py-8 mx-auto min-h-screen lg:py-0 max-w-6xl gap-5 text-white">
        <h1 className="mt-8 text-3xl font-extrabold text-center">
          Fact Checker, Sources, and Detail Verification
        </h1>
        <h2 className="text-xl text-center">
          This tool is designed to assist you in verifying article details,
          sources, and facts. While it is a valuable resource, remember that it
          is not a replacement for careful research and diligence. Ensure all
          information in your work is fully supported by credible sources, and
          account for every claim with precision. Use this tool as a guide to
          refine your content, but do not over-rely on it. Proper research is
          essential for creating high-quality, reliable content.
        </h2>
        <div
          className="h-80 bg-[#05cf9a] my-2 rounded-lg p-2 w-full cursor-pointer hover:bg-[#04ac80]"
          onClick={handleUploadClick}
        >
          <div className="w-full h-full flex flex-col justify-center items-center border-dashed border rounded bg-[#04ac80]">
            <div>
              <div className="flex flex-col items-center">
                <svg
                  width="120"
                  height="78"
                  viewBox="0 0 120 78"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_49_1383)">
                    <path
                      d="M76.7455 43.1092C76.41 43.5371 75.995 43.8933 75.5242 44.1575C75.0535 44.4218 74.5363 44.5889 74.0021 44.6492C73.468 44.7096 72.9274 44.6621 72.4112 44.5093C71.8951 44.3566 71.4136 44.1017 70.9943 43.7592L64.0166 38.0598V57.1688C64.0166 58.2737 63.5858 59.3334 62.8191 60.1147C62.0523 60.896 61.0124 61.335 59.9281 61.335C58.8437 61.335 57.8038 60.896 57.037 60.1147C56.2703 59.3334 55.8396 58.2737 55.8396 57.1688V38.0598L48.8509 43.7592C48.0037 44.4494 46.9221 44.7684 45.844 44.646C44.766 44.5236 43.7798 43.9698 43.1025 43.1065C42.4251 42.2431 42.1121 41.141 42.2322 40.0424C42.3523 38.9439 42.8958 37.939 43.743 37.2488L57.355 26.15C58.0817 25.5516 58.9883 25.226 59.9226 25.2279H59.9335C60.9148 25.2279 61.8088 25.5834 62.512 26.1723L76.1077 37.2488C76.5275 37.5907 76.8771 38.0135 77.1364 38.4932C77.3957 38.9729 77.5597 39.4999 77.6189 40.0443C77.6782 40.5886 77.6315 41.1394 77.4816 41.6654C77.3318 42.1913 77.0816 42.6819 76.7455 43.1092Z"
                      fill="#E8EAED"
                    ></path>{" "}
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M40.1888 13.807C43.5529 8.47181 48.4871 4.3578 54.2851 2.05373C60.0831 -0.250342 66.4478 -0.626361 72.4683 0.979486C78.4888 2.58533 83.8565 6.09073 87.8031 10.994C91.7498 15.8973 94.0731 21.9471 94.4406 28.2776C97.6955 28.1214 100.948 28.6308 104.007 29.7759C107.066 30.9209 109.868 32.6784 112.25 34.9447C114.631 37.211 116.544 39.9402 117.874 42.9714C119.204 46.0027 119.925 49.2746 119.994 52.5944C120.064 55.9141 119.481 59.2144 118.279 62.3007C117.077 65.387 115.28 68.1969 112.996 70.5646C110.711 72.9323 107.985 74.81 104.977 76.087C101.969 77.364 98.7403 78.0143 95.4818 77.9998H31.9845C27.433 77.9937 22.935 76.999 18.7904 75.0822C14.6458 73.1654 10.9497 70.3703 7.94856 66.8834C4.9474 63.3965 2.71008 59.2978 1.38572 54.8604C0.0613673 50.4231 -0.319604 45.7491 0.268202 41.1499C0.856007 36.5507 2.39909 32.1321 4.79459 28.1884C7.1901 24.2447 10.383 20.8666 14.1605 18.2793C17.938 15.692 22.2133 13.9548 26.7015 13.1837C31.1896 12.4125 35.7876 12.625 40.1888 13.807ZM65.0033 8.32983C60.9897 8.3288 57.0574 9.48255 53.6589 11.6583C50.2603 13.834 47.5337 16.9434 45.7928 20.6284C45.3457 21.5721 44.566 22.3094 43.6093 22.6934C42.6525 23.0774 41.5889 23.0799 40.6303 22.7004C37.365 21.4125 33.8614 20.8729 30.3684 21.1202C26.8753 21.3674 23.4786 22.3954 20.4193 24.131C17.3601 25.8667 14.7134 28.2674 12.6673 31.1628C10.6212 34.0582 9.22578 37.3772 8.58023 40.884C7.93469 44.3908 8.05482 47.9994 8.9321 51.4536C9.80938 54.9078 11.4223 58.1227 13.6563 60.8702C15.8902 63.6176 18.6905 65.8301 21.8581 67.3505C25.0258 68.8709 28.4831 69.6619 31.9845 69.6674H95.4818C97.792 69.6666 100.075 69.1633 102.179 68.1913C104.284 67.2193 106.16 65.8009 107.683 64.0308C109.206 62.2608 110.341 60.1799 111.011 57.9272C111.682 55.6744 111.873 53.3018 111.572 50.9678C111.271 48.6338 110.484 46.3922 109.265 44.3928C108.045 42.3934 106.421 40.6822 104.501 39.3736C102.58 38.065 100.408 37.1891 98.1287 36.8045C95.8496 36.4199 93.5161 36.5354 91.2843 37.1432C90.6395 37.3193 89.9621 37.3318 89.3115 37.1797C88.6608 37.0275 88.0566 36.7153 87.5517 36.2704C87.0467 35.8254 86.6564 35.2612 86.4147 34.6271C86.1731 33.993 86.0875 33.3082 86.1654 32.6326C86.5229 29.5847 86.2423 26.4941 85.3421 23.5647C84.4419 20.6353 82.9426 17.9336 80.943 15.6378C78.9434 13.3419 76.4889 11.5041 73.7414 10.2453C70.9939 8.98663 68.0157 8.33012 65.0033 8.32983Z"
                      fill="#E8EAED"
                    ></path>
                  </g>{" "}
                  <defs>
                    <clipPath id="clip0_49_1383">
                      <rect width="120" height="78" fill="white"></rect>
                    </clipPath>
                  </defs>
                </svg>
                <span className="px-1 mt-3 text-center text-white">
                  Drop files or click here
                </span>
                <button className="flex bg-[#f8f9fa] text-[#212529] items-center gap-2 px-8 text-xl font-bold py-1 rounded hover:bg-[#e2e6ea] mt-3">
                  <svg
                    width="16"
                    height="18"
                    viewBox="0 0 16 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.4033 8.6V5L10.8033 1H2.40327C2.1911 1 1.98762 1.08429 1.83759 1.23431C1.68756 1.38434 1.60327 1.58783 1.60327 1.8V16.2C1.60327 16.4122 1.68756 16.6157 1.83759 16.7657C1.98762 16.9157 2.1911 17 2.40327 17H7.20327M11.6033 11V16.6M8.80327 13.8H14.4033"
                      stroke="#2E2E2E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{" "}
                    <path
                      d="M10.4033 1V5H14.4033"
                      stroke="#2E2E2E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  Choose File
                </button>
                <span className="mt-3 text-white">{fileName}</span>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".docx"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 flex-col text-black">
          <button
            className="bg-[#1266f1] text-white rounded py-2 px-5 hover:bg-[#1161e5]"
            onClick={() => handleVerify("source")}
          >
            SCAN FOR SOURCE VERIFICATION
          </button>
          <div className="px-8 py-5 bg-white border border-[#cbcbcb] rounded w-full">
            <ReactMarkdown>{sourceResult}</ReactMarkdown>
          </div>
          <button
            className="bg-[#1266f1] text-white rounded py-2 px-5 hover:bg-[#1161e5]"
            onClick={() => handleVerify("detail")}
          >
            SCAN FOR DETAIL VERIFICATION
          </button>
          <div className="px-8 py-5 bg-white border border-[#cbcbcb] rounded w-full">
            <ReactMarkdown>{detailResult}</ReactMarkdown>
          </div>
          <button
            className="bg-[#1266f1] text-white rounded py-2 px-5 hover:bg-[#1161e5]"
            onClick={() => handleVerify("factual")}
          >
            SCAN FOR FACTUAL VERIFICATION
          </button>
          <div className="px-8 py-5 bg-white border border-[#cbcbcb] rounded w-full">
            <ReactMarkdown>{factualResult}</ReactMarkdown>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed top-0">
          <FullScreenLoader />
        </div>
      )}
    </section>
  );
};

export default CheckPage;
