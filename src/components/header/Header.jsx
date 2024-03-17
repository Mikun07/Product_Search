import React, { useEffect, useState } from "react";
import DP from "../../assets/DP.jpg";

const Header = () => {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date().toDateString());
  }, []);

  return (
    <>
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div>
            <img
              src={DP}
              alt="Display picture"
              className="h-[50px] w-[50px] rounded-full"
            />
          </div>
          <div className="">
            <p className="text-lg font-semibold">Welcome!</p>
            <p className="text-xs lg:text-base font-medium capitalize text-gray-500">
              Festus-Olaleye Ayomikun
            </p>
          </div>
        </div>

        <span className=" font-semibold text-xs lg:text-base">
          {date}
        </span>
      </header>
    </>
  );
};

export default Header;
