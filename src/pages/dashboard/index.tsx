import React, { Fragment, useEffect, useState } from 'react'
import '../../styles/dashboard.scss'
import { Select, Option, Button } from "@material-tailwind/react";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { ModalAddCollection } from '../../components/ModalAddCollection';
import Header from '../../components/TopHeader';
import iconAllowList from '../../image/imageList.svg'
import iconContract from '../../image/imageContract.svg'
import { ModalAllowList } from '../../components/ModalAllowList';
import { ModalContract } from '../../components/ModalContract';
import { ModalCreateProject } from '../../components/ModalCreateProject';
import { id } from 'ethers/lib/utils';
import { useCollectionList } from '../../hooks/useCollectionList';
import { getImageBuild } from '../../utils';

type artContentProps = {
    data: any,
    isOpenModalAddCollection: any,
    setIsOpenModalAddCollection: any,
}

const ArtContent = (props: artContentProps) => {
    const {
        data,
        isOpenModalAddCollection,
        setIsOpenModalAddCollection,
    } = props
    return (
        <div className='artContentContainer'>
            <div className="hover:shadow-card overflow-hidden rounded-xl min-h-[350px]">
                <Card className="cardContainer" onClick={() => setIsOpenModalAddCollection(!isOpenModalAddCollection)}>
                    <CardBody className="cardBodyContainer">
                        <FontAwesomeIcon
                            size={'2x'}
                            icon={faPlus}
                            className="icon-search"
                        />
                    </CardBody>
                    <CardFooter className="cardFooterContainer text-center flex flex-row items-center !justify-center">
                        <label className="cardFooterContainerText TextTitle">
                            Create New
                        </label>
                    </CardFooter>
                </Card>
            </div>
            {data.length > 0 && data.map((item, index) => {
                // console.log('item', item)

                const api = import.meta.env.VITE_PUBLIC_API_BASE_URL
                const imgCover = item?.projectDir && item?.status == "completed" ? getImageBuild(item?.projectDir,'1') : null
                const tagColor =
                    item?.status == "completed" ? '#4BB04F' :
                        item?.status == "active" ? '#2197F3' :
                            item?.status == "process" ? '#FFC007' :
                                item?.status == "failed" ? '#F44336' : '#2197F3'
                return (
                    <div
                        key={`collection-${index}`}
                        onClick={() => {
                            window.location.href = item.status == "completed" ?
                                `export/?id=${item._id}` :
                                `app/?id=${item._id}`
                        }}
                        className="hover:shadow-card overflow-hidden rounded-xl "
                    >
                        <Card className="cardContainer hover:shadow-card">
                            <CardBody className={`cardBodyContainer ${imgCover ? ' ' : ' isShowBG'}`}>
                                <div>
                                    {imgCover &&
                                        <img
                                            src={imgCover}
                                            alt={`imgCollection-${index}`}
                                        />
                                    }
                                </div>
                            </CardBody>

                            <CardFooter className="cardFooterContainer  overflow-hidden rounded-xl ">
                                <label className="cardFooterContainerText TextTitle !min-h-[45px]">
                                    {item.name}
                                </label>
                                <label className="cardFooterContainerText !flex flex-row items-center pt-2">
                                    <span className="h-[10px] w-[10px] flex flex-row items-center mr-2">
                                        <span style={{ backgroundColor: tagColor }} className={`animate-ping absolute inline-flex h-[10px] w-[10px] rounded-full bg-${tagColor} opacity-35`} />
                                        <span style={{ backgroundColor: tagColor }} className={`relative inline-flex rounded-full h-[10px] w-[10px] bg-${tagColor}`} />
                                    </span>
                                    {`Status: ${item.status}`}
                                </label>
                            </CardFooter>
                        </Card>
                    </div>
                )
            })}
        </div>
    )
}

type ContentProps = {
    data: any,
}

const Content = (props: ContentProps) => {
    const {
        data,
    } = props
    const {
        type = 'allowlist',
        image = iconContract,
        title = 'Create your first allowlist',
        subtitle = 'With Bueno Allowlists, you can import or create an allowlist to control who can mint during your presale.',
        buttonText = 'Create New Allowlist',
        handleButtonContent,
    } = data
    return (
        <div className='contentContainer'>
            <img
                src={image}
                alt={`img${type}`}
            />
            <Typography
                variant={'h2'}
                className={'text-center w-4/5 mb-2'}
            >
                {title}
            </Typography>
            <Typography
                variant={'paragraph'}
                className={'text-center w-2/3'}
            >
                {subtitle}
            </Typography>

            <Button
                className='mt-8'
                variant="gradient"
                onClick={() => handleButtonContent({ btnType: type })} >
                <span>{buttonText}</span>
                <FontAwesomeIcon
                    size={'lg'}
                    icon={faPlus}
                    className="icon-search ml-4"
                />
            </Button>

        </div >
    )
}

type Props = {

}

export const Dashboard = (props: Props) => {

    const [isOpenModalAddCollection, setIsOpenModalAddCollection] = useState(false)
    const [isOpenModalContracts, setIsOpenModalContracts] = useState(false)
    const [isOpenModalAllowlists, setIsOpenModalAllowlists] = useState(false)
    const [isOpenModalCreateProject, setIsOpenModalCreateProject] = useState(false)

    const {
        collectionList,
    } = useCollectionList({})

    let optionsProject = [
        { optionName: 'My Project' },
        { optionName: 'Create Project' },
    ]
    let optionsSort = [
        { optionName: 'Last', optionSort: '' },
        { optionName: 'Oldest', optionSort: '' },
    ]

    let collectionListData = collectionList

    const data = [
        {
            label: "Art",
            value: "Art",
            desc: <ArtContent
                data={collectionListData}
                isOpenModalAddCollection={isOpenModalAddCollection}
                setIsOpenModalAddCollection={() => setIsOpenModalAddCollection(!isOpenModalAddCollection)}
            />,
        },
        // {
        //     label: "Contracts",
        //     value: "Contracts",
        //     desc:
        //         <Content
        //             data={{
        //                 image: iconContract,
        //                 type: 'contracts',
        //                 title: 'Create your first smart contract',
        //                 subtitle: 'A smart contract makes it possible for people to mint your tokens. Our no-code tool will make it easy to get your mint flow up & running.',
        //                 buttonText: 'Create New Contract',
        //                 handleButtonContent: (e) => handleButtonContent(e),
        //             }}
        //         />,
        // },
        // {
        //     label: "Allowlists",
        //     value: "Allowlists",
        //     desc:
        //         <Content
        //             data={{
        //                 image: iconAllowList,
        //                 type: 'allowlists',
        //                 title: 'Create your first allowlist',
        //                 subtitle: 'With Bueno Allowlists, you can import or create an allowlist to control who can mint during your presale.',
        //                 buttonText: 'Create New Allowlist',import { reverse } from 'lodash';

        //                 handleButtonContent: (e) => handleButtonContent(e),
        //             }}
        //         />,
        // },
    ];

    const handleButtonContent = (props: any) => {
        const { btnType = 'contracts' } = props
        if (btnType == 'contracts') {
            setIsOpenModalContracts(!isOpenModalContracts)
        } else if (btnType == 'allowlists') {
            setIsOpenModalAllowlists(!isOpenModalAllowlists)
        }
    }

    const handleSelectCollection = (props: any) => {
        console.log('props', props)
        if (props == "Create Project") {
            setIsOpenModalCreateProject(!isOpenModalCreateProject)
        }
    }

    const handleSelectSort = (props: any) => {
        console.log('props', props)
    }


    return (
        <Fragment>
            <div className='containerDashboard'>
                <Header />

                <div className='boxCollection '>
                    <div className='container '>
                        {/* <div className='boxSelectCollection my-4'>
                            <Select
                                label="My Project"
                                onChange={handleSelectCollection}
                            >
                                {optionsProject.map((item, index) => {
                                    return (
                                        <Option
                                            key={`optionsCollection-${index}`}
                                            value={item.optionName}
                                        >
                                            {item.optionName}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </div> */}
                        <div className='boxTabs'>
                            <Tabs value="Art">
                                {/* <TabsHeader>
                                    {data.map(({ label, value }) => (
                                        <Tab key={value} value={value}>
                                            {label}
                                        </Tab>
                                    ))}
                                </TabsHeader> */}
                                <TabsBody>
                                    {data.map(({ value, desc }) => (
                                        <TabPanel key={value} value={value} className='p-0'>
                                            <div className='py-8'>
                                                {value === 'Art' && (

                                                    <div className='boxSelectCollection mb-4'>
                                                        {/* <Select
                                                            label="Sort"
                                                            onChange={handleSelectSort}
                                                        >
                                                            {optionsSort.map((item, index) => {
                                                                return (
                                                                    <Option
                                                                        key={`optionsSort-${index}`}
                                                                        value={item.optionName}
                                                                    >
                                                                        {item.optionName}
                                                                    </Option>
                                                                )
                                                            })}
                                                        </Select> */}
                                                    </div>
                                                )}
                                                <div className='TabContent'>
                                                    {desc}
                                                </div>
                                            </div>
                                        </TabPanel>
                                    ))}
                                </TabsBody>
                            </Tabs>
                        </div>
                    </div>
                </div>


            </div>

            <ModalAddCollection
                isShowModal={isOpenModalAddCollection}
                handleOpen={() => setIsOpenModalAddCollection(!isOpenModalAddCollection)}
            />
            <ModalAllowList
                isShowModal={isOpenModalAllowlists}
                handleOpen={() => setIsOpenModalAllowlists(!isOpenModalAllowlists)}
            />
            <ModalContract
                isShowModal={isOpenModalContracts}
                handleOpen={() => setIsOpenModalContracts(!isOpenModalContracts)}
            />
            <ModalCreateProject
                isShowModal={isOpenModalCreateProject}
                handleOpen={() => setIsOpenModalCreateProject(!isOpenModalCreateProject)}
            />
        </Fragment>
    )
}