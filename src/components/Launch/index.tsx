import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import ContractTab from "../ContractTab";
import "./launch.scss";
import UnmintTab from '../UnmintTab';


const Launch = () => {

  const [isFirstRender, setIsFirstRender] = useState(true)



  useEffect(() => {
    setIsFirstRender(false)
  }, [])


  let data = [
    {
      label: "Contract",
      value: "contract",
      desc: <ContractTab />,
    },
    {
      label: "Unmint",
      value: "unmint",
      desc: <UnmintTab/>,
    },
    // {
    //   label: "Minting Tools",
    //   value: "mintingTools",
    //   desc: <></>,
    // },
  ];



  return (
    <div className="wrap-launch">
      <div className="box-launch p-4" style={{ height: `calc(100vh - 60px - 61px - 66px)` }}>

        <Tabs value="contract" className='w-full h-full overflow-visible'>
          <TabsHeader className='bg-white/100'>
            {data.map(({ label, value }, index) => (
              <Tab
                key={`Tab-${index}-{value}`} value={value}
                className='p-2'
              // className='p-2 w-fit'
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody
            className='bg-white m-0 mt-4 w-full border-2 border-gray/400 rounded-card'
            animate={{
              mount: { opacity: 1, transition: "opacity 1s ease-in", y: 0 },
              unmount: { opacity: 0, transition: "opacity 1s ease-out", y: -200 },
            }}
          >
            {!isFirstRender && data.map(({ value, desc }, index) => (
              <TabPanel
                className='overflow-auto'
                style={{ height: `calc(100vh - 60px - 61px - 100px)` }}
                key={`TabPanel-${index}-{value}`} value={value}>
                <div>
                  {desc}
                </div>
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>

      </div>
    </div >
  );
};

export default Launch;
