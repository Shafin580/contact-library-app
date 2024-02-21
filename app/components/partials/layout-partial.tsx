"use client"

import { useCallback, useContext, useEffect, useState } from "react"
import MobileSidebar from "@library/molecules/navigation/MobileSidebar"
import Sidebar from "@library/molecules/navigation/Sidebar"
import { usePathname, useRouter } from "next/navigation"
import { ModuleItemProps } from "@library/molecules/navigation/SidebarProps"
import { ModuleListProps } from "@library/molecules/navigation/SidebarProps"
import ButtonIcon from "@library/ButtonIcon"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { Fragment } from "react"
import Link from "next/link"
import Icon from "@library/Icon"
import Avatar from "@library/Avatar"
import { AppContext } from "app/App.Context"
import { LINKS, PATHS } from "router.config"
import { getAPIResponse } from "@library/utils"
import twcolors from "tailwindcss/colors"
import UAParser from "ua-parser-js"
import dynamic from "next/dynamic"

const ModalAlert = dynamic(() => import("@components/library/ModalAlert"))
const BadgeNotification = dynamic(() => import("@components/library/BadgeNotification"))

export default function LayoutPartial({ children }: { children: React.ReactNode }) {
  const {
    // API_MASK_URL,
    SITE_URL,
    token,
    sideBarParams,
    updateSideBarParams,
    userInfo,
    logout,
    // API_RESOURCE_URL,
  } = useContext(AppContext)
  const router = useRouter()
  const pathname = usePathname()
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false)

  const [pendingProductCount, setPendingProductCount] = useState(0)
  const [unreviewedMessageCount, setUnreviewedMessageCount] = useState(0)

  const fallbackAvatarImageSrc = "/img/blank-user.jpg"

  // + Sidebar Module Switching Handler
  const handleModuleChange = useCallback(
    (e: number) => {
      let activeItemIndex = 0
      //update the module list to show the selected module as active and the rest as inactive
      updateSideBarParams((prevState) => {
        let updatedModuleList: ModuleListProps[] = prevState.moduleList
        let hasActiveItem = false
        updatedModuleList[e].items.forEach((item: ModuleItemProps, index: number) => {
          if (item.isActive && !hasActiveItem) {
            hasActiveItem = true
            activeItemIndex = index
          } else {
            updatedModuleList[e].items[index].isActive = false
          }
        })
        if (!hasActiveItem) {
          updatedModuleList[e].items[0].isActive = true
          activeItemIndex = 0
        }
        return {
          ...prevState,
          selectedModule: e,
          stateChange: (Math.random() * 1000) / 322,
          showMobileSidebar: false,
          moduleList: updatedModuleList,
        }
      })

      router.push(sideBarParams.moduleList[e].items[activeItemIndex].link as string)
      // Cookies.set("selected-module", e.toString())
    },
    [router, sideBarParams.moduleList]
  )

  const deviceType = new UAParser().getDevice().type
  const [screenWidth, setScreenWidth] = useState<number>(0)
  const allowedWidth = 640
  const [isMobileScreen, setIsMobileScreen] = useState(false)

  // + Sidebar Menu Item Click Handler for Navigation
  const handleMenuItemClick = useCallback(
    (e: number) => {
      // * on logout click
      if (e == -1) {
        setShowLogoutModal(true)
        updateSideBarParams((prevState) => {
          return {
            ...prevState,
            //Random number to force a re-render
            // stateChange: (Math.random() * 1000) / 322,
            showMobileSidebar: false,
          }
        })
        return
      }

      updateSideBarParams((prevState) => {
        let updatedModuleList: ModuleListProps[] = prevState.moduleList
        updatedModuleList[prevState.selectedModule].items.forEach((item: ModuleItemProps, index: number) => {
          if (e === index) {
            updatedModuleList[prevState.selectedModule].items[index].isActive = true
          } else {
            updatedModuleList[prevState.selectedModule].items[index].isActive = false
          }
        })
        return {
          ...prevState,
          //Random number to force a re-render
          stateChange: (Math.random() * 1000) / 322,
          showMobileSidebar: false,
          moduleList: updatedModuleList,
        }
      })
      router.push(sideBarParams.moduleList[sideBarParams.selectedModule].items[e].link as string)
    },
    [router, sideBarParams.moduleList, sideBarParams.selectedModule]
  )

  // + Sidebar Toggle Handler for desktop view
  const handleSideBarToggle = useCallback(() => {
    updateSideBarParams((prevState) => {
      // * update the local storage
      // localStorage.setItem("sidebar-open", `${!prevState?.sideBarStatus}`)
      return {
        ...prevState,
        showMobileSidebar: false,
        // stateChange: (Math.random() * 1000) / 322,
        sideBarStatus: !prevState?.sideBarStatus,
      }
    })
  }, [])

  // + Sidebar Toggle Handler for mobile view
  const handleMobileSidebarToggle = useCallback((e: boolean | undefined) => {
    updateSideBarParams((prevState) => {
      return { ...prevState, showMobileSidebar: !prevState.showMobileSidebar }
    })
  }, [])

  // + Notification state and handler
  const [notifications, setNotifications] = useState<Array<any>>([])

  console.log(
    "%c <<<<<<<<<<<<<< logging from AppContext.tsx >>>>>>>>>>>>>>",
    "background: #222; color: #bada55"
  )
  // console.log("%c API_MASK_URL >>>", "background: #222; color: #bada55", API_MASK_URL)
  console.log("%c SITE_URL >>>", "background: #222; color: #bada55", SITE_URL)
  console.log("%c token >>>", "background: #222; color: #bada55", token)
  console.log("%c userInfo >>>", "background: #222; color: #bada55", userInfo)
  console.log("%c sideBarParams >>>", "background: #222; color: #bada55", sideBarParams)

  // + UseEffect Calls to Get Device And Screen Width
  useEffect(() => {
    setScreenWidth(window.outerWidth)

    window
      .matchMedia(`(width < ${allowedWidth}px) or (orientation: portrait)`)
      .addEventListener("change", (windowChangeEvent) => {
        windowChangeEvent.matches ? setIsMobileScreen(true) : setIsMobileScreen(false)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (screenWidth < allowedWidth || !!deviceType?.match(/mobile|wearable|embedded/gi)) {
      setIsMobileScreen(true)
    } else {
      setIsMobileScreen(false)
    }
    console.log("screen width", screenWidth)
  }, [screenWidth])

  return (
    <>
      <aside>
        <MobileSidebar
          {...sideBarParams}
          isModuleChanged={handleModuleChange}
          onMenuItemChanged={handleMenuItemClick}
          hideMobileSidebar={handleMobileSidebarToggle}
        />
        <Sidebar
          {...sideBarParams}
          isModuleChanged={handleModuleChange}
          onMenuItemChanged={handleMenuItemClick}
          onSidebarToggle={handleSideBarToggle}
        />
      </aside>
      <div
        className={`fixed inset-0 ${
          sideBarParams.sideBarStatus
            ? "md:left-[232px] md:w-[calc(100vw-232px)]"
            : "md:left-[70px] md:w-[calc(100vw-70px)]"
        }`}
      >
        {/* // + topbar */}
        <header>
          <Disclosure
            as="nav"
            className="grid h-64 grid-cols-2 place-content-center items-center border-b border-slate-200 bg-slate-100 p-16 dark:border-slate-600 dark:bg-slate-700"
          >
            {/* // + topbar left container */}
            <div className="flex place-items-center gap-12">
              {/* // + menu toggle button */}
              <ButtonIcon
                className="md:hidden"
                iconName="menu-01"
                iconSize="24"
                iconColor={twcolors.slate[500]}
                clicked={() => {
                  handleMobileSidebarToggle(!sideBarParams.showMobileSidebar)
                }}
              />
              {/* // + back button */}
              {/* {backButtonState.prevPath.length > 0 && (
                <ButtonIcon
                  className="hidden md:block"
                  clicked={handleBackClick}
                  iconName="arrow-left"
            iconColor={twcolors.slate[500]}

                />
              )} */}
              <h4 className="text-lg sm:text-2xl">
                {/* {sideBarParams.moduleList[sideBarParams.selectedModule].items[
                  sideBarParams.moduleList[sideBarParams.selectedModule].items.findIndex(
                    (item) => item.link === router.pathname
                  )
                ].name} */}
              </h4>
            </div>
            {/* // + topbar right container */}
            <div className="flex place-content-end place-items-center gap-8">
              {/* // + notifications */}
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <span className="sr-only">Open notifications</span>
                    <div className="relative">
                      <Icon iconName="bell-03" className="p-8" iconColor={twcolors.slate[500]} />
                      {notifications.length != 0 && (
                        <BadgeNotification
                          className="absolute -right-8 -top-8"
                          count={notifications.length}
                        />
                      )}
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  {/* //- Dropdown Links */}
                  <Menu.Items className="absolute -right-44 z-40 mt-8 max-h-[40vh] w-[22rem] border-collapse origin-top-right overflow-auto rounded-md bg-white p-8 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:right-0">
                    {notifications.length > 0 &&
                      notifications.map((item, index) => (
                        <Menu.Item key={index}>
                          {({ active }: any) => (
                            // <Link
                            //   href={String(item["linkId"])}
                            //   className="block border-b border-dotted px-16 py-8 text-xs text-slate-600 sm:text-sm"
                            // >
                            //   {item["message"]}
                            // </Link>

                            <span className="block border-b border-dotted px-16 py-8 text-xs text-slate-600 sm:text-sm">
                              {item["message"]}
                            </span>
                          )}
                        </Menu.Item>
                      ))}
                  </Menu.Items>
                </Transition>
              </Menu>
              {/* // + user info */}
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="flex focus:outline-none">
                    <span className="sr-only">User info</span>
                    {userInfo != null && (
                      <Avatar
                        src={
                          // userInfo.image != null ? API_RESOURCE_URL + userInfo.image : "/img/blank-user.jpg"
                          "/img/blank-user.jpg"
                        }
                        fallbackImageSrc={fallbackAvatarImageSrc}
                        alt={`${userInfo.firstName} ${userInfo.lastName}: Avatar Image`}
                        personName={`${userInfo.firstName} ${userInfo.lastName}`}
                        size="xs"
                      />
                    )}
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  {/* //- Dropdown Links */}
                  <Menu.Items className="absolute right-0 z-40 mt-8 w-164 origin-top-right rounded-md bg-white py-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="block px-16 py-8 text-xs font-medium text-slate-500 ">
                      {userInfo && `${userInfo?.firstName} ${userInfo?.lastName}`}
                    </div>
                    <hr />
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </Disclosure>
        </header>
        {/* // + main content */}
        <main className={`h-screen overflow-auto bg-slate-50 pb-96 pt-20 dark:bg-slate-800`}>
          {children}
          {showLogoutModal && (
            <ModalAlert
              title="Are you sure you want to log out?"
              successText="Yes"
              cancelText="No"
              onSuccessClick={() => {
                setShowLogoutModal(false)

                //Log out from API and invalidate the token
                fetch(`auth/logout`, {
                  cache: "no-cache",
                  method: "GET",
                  headers: { Authorization: `${token}` },
                })
                // + clear app context state
                logout()
              }}
              onCancelClick={() => {
                setShowLogoutModal(false)
              }}
            />
          )}
        </main>
      </div>
    </>
  )
}
