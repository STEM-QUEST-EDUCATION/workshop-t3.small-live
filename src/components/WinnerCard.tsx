import Image from "next/image";
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti"; // Ensure you have installed react-confetti

interface WinnerCardProps {
  name: string;
  age: string;
  school: string;
  organization: string;
  scholarship: string;
  championType: string;
  imageSrc: string;
}

const WinnerCard: React.FC<WinnerCardProps> = ({
  name,
  age,
  school,
  organization,
  scholarship,
  championType,
  imageSrc,
}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="winner-card relative w-[374px] h-[206px] rounded-lg overflow-hidden shadow-lg mb-4">
      {/* Confetti Animation */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={100} // Reduce the number for smaller effects
        gravity={0.4} // Slower fall
        recycle={true} // Infinite loop
        wind={0.01} // Slight drift
      />

      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src="/WinnerCard/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay content */}
      <div className="relative">
        {/* Champion Banner */}
        <div className="flex items-center justify-center mt-2 relative">
          <div className="relative">
            <Image
              src="https://dashboard.codeparrot.ai/api/assets/Z39ohkjX1HzWCC2z"
              height={12}
              width={12}
              alt=""
              className="w-[213px] h-[24px] winner"
            />
            <Image
              src="/WinnerCard/winner.svg"
              alt="winner"
              height={10}
              width={10}
              className="w-[35px] h-[35px] absolute -left-3 -top-1"
            />
            <h2 className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
              {championType}
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex px-4">
          {/* Profile Image Section */}
          <div className="relative w-[134px] h-[153px]">
            {/* <img src="https://dashboard.codeparrot.ai/api/assets/Z39ohkjX1HzWCC20" alt="" className="absolute -top-2 left-20 w-[62px] h-[62px]" /> */}
            <Image
              src={imageSrc}
              alt="profile"
              width={118}
              height={115}
              className="rounded-lg mx-auto mt-2"
              priority // If this image is above the fold, it ensures faster loading
            />{" "}
            <Image
              src="/WinnerCard/trophy.svg"
              height={10}
              width={10}
              alt=""
              className="absolute right-[75px] top-[110px] w-[70px] z-10 h-[64px]"
            />
          </div>

          {/* Details Section */}
          <div className="ml-4 mt-2">
            <h3 className="text-[#0c5394] font-bold text-sm xxs:text-xs">
              {name}
            </h3>
            <div className="space-y-3 mt-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/WinnerCard/people.svg"
                  height={10}
                  width={10}
                  alt=""
                  className="w-3.5 h-3.5"
                />
                <span className="text-[#073763] text-xs font-semibold">
                  {age}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/WinnerCard/hat.svg"
                  height={10}
                  width={10}
                  alt=""
                  className="w-4 h-4"
                />
                <span className="text-[#073763] text-xs font-semibold">
                  {school}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/WinnerCard/book.svg"
                  height={10}
                  width={10}
                  alt=""
                  className="w-3.5 h-3.5"
                />
                <span className="text-[#073763] text-xs font-semibold">
                  {organization}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full z-0">
        <Image
          src="https://dashboard.codeparrot.ai/api/assets/Z4DwMQIBBLnlud3A"
          height={10}
          width={10}
          alt=""
          className="w-full h-9"
        />
        <div className="absolute bottom-1 left-20">
          <svg
            width="65"
            height="40"
            viewBox="0 0 55 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.6"
              y="17.6"
              width="53.8"
              height="11.8"
              rx="1.4"
              stroke="black"
              strokeWidth="1.2"
            />
            <path
              d="M4.82611 26V20.75H7.09861C7.56861 20.75 7.97361 20.8275 8.31361 20.9825C8.65361 21.1325 8.91611 21.35 9.10111 21.635C9.28611 21.92 9.37861 22.26 9.37861 22.655C9.37861 23.045 9.28611 23.3825 9.10111 23.6675C8.91611 23.9475 8.65361 24.1625 8.31361 24.3125C7.97361 24.4625 7.56861 24.5375 7.09861 24.5375H5.50111L6.04111 24.005V26H4.82611ZM8.16361 26L6.85111 24.095H8.14861L9.47611 26H8.16361ZM6.04111 24.14L5.50111 23.57H7.03111C7.40611 23.57 7.68611 23.49 7.87111 23.33C8.05611 23.165 8.14861 22.94 8.14861 22.655C8.14861 22.365 8.05611 22.14 7.87111 21.98C7.68611 21.82 7.40611 21.74 7.03111 21.74H5.50111L6.04111 21.1625V24.14ZM11.4588 22.865H13.9863V23.81H11.4588V22.865ZM11.5488 25.025H14.4062V26H10.3413V20.75H14.3088V21.725H11.5488V25.025ZM16.5597 26L14.8422 20.75H16.1022L17.5947 25.4H16.9647L18.5247 20.75H19.6497L21.1497 25.4H20.5422L22.0722 20.75H23.2347L21.5172 26H20.2122L18.8847 21.92H19.2297L17.8647 26H16.5597ZM23.0472 26L25.3872 20.75H26.5872L28.9347 26H27.6597L25.7397 21.365H26.2197L24.2922 26H23.0472ZM24.2172 24.875L24.5397 23.9525H27.2397L27.5697 24.875H24.2172ZM29.4794 26V20.75H31.7519C32.2219 20.75 32.6269 20.8275 32.9669 20.9825C33.3069 21.1325 33.5694 21.35 33.7544 21.635C33.9394 21.92 34.0319 22.26 34.0319 22.655C34.0319 23.045 33.9394 23.3825 33.7544 23.6675C33.5694 23.9475 33.3069 24.1625 32.9669 24.3125C32.6269 24.4625 32.2219 24.5375 31.7519 24.5375H30.1544L30.6944 24.005V26H29.4794ZM32.8169 26L31.5044 24.095H32.8019L34.1294 26H32.8169ZM30.6944 24.14L30.1544 23.57H31.6844C32.0594 23.57 32.3394 23.49 32.5244 23.33C32.7094 23.165 32.8019 22.94 32.8019 22.655C32.8019 22.365 32.7094 22.14 32.5244 21.98C32.3394 21.82 32.0594 21.74 31.6844 21.74H30.1544L30.6944 21.1625V24.14ZM34.9946 26V20.75H37.3796C37.9496 20.75 38.4521 20.86 38.8871 21.08C39.3221 21.295 39.6621 21.5975 39.9071 21.9875C40.1521 22.3775 40.2746 22.84 40.2746 23.375C40.2746 23.905 40.1521 24.3675 39.9071 24.7625C39.6621 25.1525 39.3221 25.4575 38.8871 25.6775C38.4521 25.8925 37.9496 26 37.3796 26H34.9946ZM36.2096 25.0025H37.3196C37.6696 25.0025 37.9721 24.9375 38.2271 24.8075C38.4871 24.6725 38.6871 24.4825 38.8271 24.2375C38.9721 23.9925 39.0446 23.705 39.0446 23.375C39.0446 23.04 38.9721 22.7525 38.8271 22.5125C38.6871 22.2675 38.4871 22.08 38.2271 21.95C37.9721 21.815 37.6696 21.7475 37.3196 21.7475H36.2096V25.0025ZM42.3084 22.865H44.8359V23.81H42.3084V22.865ZM42.3984 25.025H45.2559V26H41.1909V20.75H45.1584V21.725H42.3984V25.025ZM46.2226 26V20.75H48.6076C49.1776 20.75 49.6801 20.86 50.1151 21.08C50.5501 21.295 50.8901 21.5975 51.1351 21.9875C51.3801 22.3775 51.5026 22.84 51.5026 23.375C51.5026 23.905 51.3801 24.3675 51.1351 24.7625C50.8901 25.1525 50.5501 25.4575 50.1151 25.6775C49.6801 25.8925 49.1776 26 48.6076 26H46.2226ZM47.4376 25.0025H48.5476C48.8976 25.0025 49.2001 24.9375 49.4551 24.8075C49.7151 24.6725 49.9151 24.4825 50.0551 24.2375C50.2001 23.9925 50.2726 23.705 50.2726 23.375C50.2726 23.04 50.2001 22.7525 50.0551 22.5125C49.9151 22.2675 49.7151 22.08 49.4551 21.95C49.2001 21.815 48.8976 21.7475 48.5476 21.7475H47.4376V25.0025Z"
              fill="black"
            />
            <path
              d="M27.6902 3.17426L28.423 5.42959C28.664 6.17123 29.3551 6.67336 30.1349 6.67336H32.5063C32.5704 6.67336 32.6052 6.69143 32.6276 6.70873C32.6548 6.72979 32.6813 6.76476 32.6965 6.81155C32.7117 6.85834 32.7108 6.90223 32.7012 6.93527C32.6932 6.9624 32.6757 6.99751 32.6239 7.03516L30.7054 8.42902C30.0745 8.88738 29.8105 9.69985 30.0515 10.4415L30.7843 12.6968C30.8041 12.7577 30.7976 12.7965 30.7881 12.8231C30.7765 12.8555 30.7514 12.8915 30.7116 12.9204C30.6718 12.9493 30.6298 12.962 30.5954 12.9631C30.5671 12.9639 30.5283 12.9581 30.4765 12.9204L28.558 11.5265C27.9271 11.0682 27.0729 11.0682 26.442 11.5265L24.5235 12.9204C24.4717 12.9581 24.4329 12.9639 24.4046 12.9631C24.3702 12.962 24.3282 12.9493 24.2884 12.9204C24.2486 12.8915 24.2235 12.8555 24.2119 12.8231C24.2024 12.7965 24.1959 12.7577 24.2157 12.6968L24.9485 10.4415C25.1895 9.69984 24.9255 8.88738 24.2946 8.42902L22.3761 7.03516C22.3243 6.99751 22.3068 6.9624 22.2988 6.93527C22.2892 6.90223 22.2883 6.85834 22.3035 6.81155C22.3187 6.76476 22.3452 6.72979 22.3724 6.70873C22.3948 6.69143 22.4296 6.67336 22.4937 6.67336H24.8651C25.6449 6.67336 26.336 6.17123 26.577 5.42959L27.3098 3.17426C27.3296 3.11334 27.3575 3.08579 27.3809 3.06987C27.4093 3.05048 27.4508 3.03607 27.5 3.03607C27.5492 3.03607 27.5907 3.05048 27.6191 3.06987C27.6425 3.08579 27.6704 3.11334 27.6902 3.17426Z"
              stroke="black"
              strokeWidth="1.6"
            />
            <path
              d="M11.3098 5.17427C11.3296 5.11334 11.3575 5.08579 11.3809 5.06987C11.4093 5.05049 11.4508 5.03607 11.5 5.03607C11.5492 5.03607 11.5907 5.05049 11.6191 5.06987C11.6425 5.08579 11.6704 5.11334 11.6902 5.17426L12.1985 6.7386C12.4395 7.48024 13.1306 7.98237 13.9104 7.98237H15.5552C15.6193 7.98237 15.6541 8.00045 15.6765 8.01774C15.7037 8.03881 15.7302 8.07378 15.7455 8.12057C15.7607 8.16736 15.7598 8.21124 15.7501 8.24429C15.7422 8.27142 15.7246 8.30652 15.6728 8.34418L14.3421 9.31099C13.7112 9.76935 13.4472 10.5818 13.6882 11.3235L14.1965 12.8878C14.2163 12.9487 14.2099 12.9874 14.2003 13.014C14.1887 13.0464 14.1636 13.0825 14.1238 13.1114C14.084 13.1403 14.042 13.153 14.0076 13.1541C13.9794 13.1549 13.9405 13.149 13.8887 13.1114L12.558 12.1446C11.9271 11.6862 11.0729 11.6862 10.442 12.1446L9.11128 13.1114C9.05946 13.149 9.02064 13.1549 8.99239 13.1541C8.95798 13.153 8.91597 13.1403 8.87617 13.1114C8.83637 13.0825 8.8113 13.0464 8.79968 13.014C8.79014 12.9874 8.78372 12.9487 8.80351 12.8878L9.3118 11.3235C9.55277 10.5818 9.28879 9.76935 8.65791 9.31099L7.3272 8.34418C7.27538 8.30652 7.25782 8.27142 7.24989 8.24429C7.24025 8.21124 7.23935 8.16736 7.25455 8.12057C7.26975 8.07378 7.29627 8.03881 7.3235 8.01774C7.34586 8.00045 7.3807 7.98237 7.44476 7.98237H9.0896C9.86941 7.98237 10.5605 7.48024 10.8015 6.7386L11.3098 5.17427Z"
              stroke="black"
              strokeWidth="1.6"
            />
            <path
              d="M43.3098 5.17427C43.3296 5.11334 43.3575 5.08579 43.3809 5.06987C43.4093 5.05049 43.4508 5.03607 43.5 5.03607C43.5492 5.03607 43.5907 5.05049 43.6191 5.06987C43.6425 5.08579 43.6704 5.11334 43.6902 5.17426L44.1985 6.7386C44.4395 7.48024 45.1306 7.98237 45.9104 7.98237H47.5552C47.6193 7.98237 47.6541 8.00045 47.6765 8.01774C47.7037 8.03881 47.7302 8.07378 47.7455 8.12057C47.7607 8.16736 47.7598 8.21124 47.7501 8.24429C47.7422 8.27142 47.7246 8.30652 47.6728 8.34418L46.3421 9.31099C45.7112 9.76935 45.4472 10.5818 45.6882 11.3235L46.1965 12.8878C46.2163 12.9487 46.2099 12.9874 46.2003 13.014C46.1887 13.0464 46.1636 13.0825 46.1238 13.1114C46.084 13.1403 46.042 13.153 46.0076 13.1541C45.9794 13.1549 45.9405 13.149 45.8887 13.1114L44.558 12.1446C43.9271 11.6862 43.0729 11.6862 42.442 12.1446L41.1113 13.1114C41.0595 13.149 41.0206 13.1549 40.9924 13.1541C40.958 13.153 40.916 13.1403 40.8762 13.1114C40.8364 13.0825 40.8113 13.0464 40.7997 13.014C40.7901 12.9874 40.7837 12.9487 40.8035 12.8878L41.3118 11.3235C41.5528 10.5818 41.2888 9.76935 40.6579 9.31099L39.3272 8.34418C39.2754 8.30652 39.2578 8.27142 39.2499 8.24429C39.2402 8.21124 39.2393 8.16736 39.2545 8.12057C39.2698 8.07378 39.2963 8.03881 39.3235 8.01774C39.3459 8.00045 39.3807 7.98237 39.4448 7.98237H41.0896C41.8694 7.98237 42.5605 7.48024 42.8015 6.7386L43.3098 5.17427Z"
              stroke="black"
              strokeWidth="1.6"
            />
          </svg>
        </div>
        <div className="absolute -right-[3px] -top-9">
          <Image
            src="https://dashboard.codeparrot.ai/api/assets/Z39oh0jX1HzWCC29"
            height={10}
            width={10}
            alt=""
            className="w-[75px] h-[38px]"
          />
          <span className="absolute top-[10px] left-4  text-white font-bold text-xs">
            IIT - IIM
          </span>
        </div>
        {/* Scholarship */}
        <div className="absolute bottom-0 left-56 xs:left-48 xs:ml-5 xsm:left-48 xsm:mb-2 xxs:left-48 xxs:mb-2 transform -translate-x-1/2 mb-1">
          <p className="text-sm xxs:text-xs xxxs:text-[11px] xsm:text-xs font-semibold">
            {scholarship}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WinnerCard;
