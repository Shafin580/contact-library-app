"use client"

import Login from "./Login"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { AppContext, UserInfoContextProps } from "@app-context"
import { getAPIResponse } from "@utils/helpers/misc"
import Button from "../../Button"
import dynamic from "next/dynamic"
import ModalBlank from "../../ModalBlank"
import ErrorText from "../ErrorText"
import { PATHS } from "app/(module)/router.config"

type loginCredentials = {
  username: string
  password: string
}

export default function LoginForm() {
  const router = useRouter()

  const [errorResponse, setErrorResponse] = useState("")
  const [showUnauthorizedModal, setShowUnauthorizedModal] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  // - context props
  const { login } = useContext(AppContext)

  // + Login Validate Function
  const loginValidation = async (obj: loginCredentials) => {
    setIsLoading(true)

    console.log("creds", obj)
    await getAPIResponse(
      process.env.NEXT_PUBLIC_SITE_URL as string,
      PATHS.LOGIN.root,
      "",
      "POST",
      JSON.stringify(obj)
    )
      .then((data) => {
        console.log("login Data", data)

        if (data["status"] == 200) {
          if (data["results"]["roles"][0] != "USER") {
            setErrorResponse("")

            const token: string = "Bearer " + String(data["results"]["token"])
            const user: UserInfoContextProps = {
              email:
              token:
            }

            login(token, user)

            setIsLoading(false)
          } else {
            setErrorResponse("Invalid Credentials!")
            setShowUnauthorizedModal(true)
            setIsLoading(false)
          }
        } else {
          setErrorResponse(data["message"])
          setShowUnauthorizedModal(true)
          setIsLoading(false)

          console.log("Login Failed", data["message"])
        }
      })
      .catch((error) => {
        console.log("login Error", error)
        setIsLoading(false)
      })
  }

  return (
    <>
      <Login
        className="mt-56 grow-0 md:!min-w-[512px]"
        errorTextPassword={errorResponse}
        textInputMinLength={1}
        textInputMaxLength={1000}
        passwordMinLength={1}
        passwordMaxLength={1000}
        showForgotPass={false}
        isSimplePassword={true}
        submitClicked={(e: any) => {
          loginValidation({ username: e.text, password: e.password })
        }}
        btnText="Sign In"
        btnHasSpinner={isLoading}
        isFetchingAPI={isLoading}
        textInputLabel="Email"
        loginFormLabel={
          <div className="-mt-92 rounded-md bg-primary px-4">
            <Image
              unoptimized={true}
              src="/img/logo-transparent.png"
              alt="avatar"
              width={100}
              height={100}
              className="px-8 py-40"
            />
          </div>
        }
        showSignUp={true}
        signUpLink={""}
      />

      {showUnauthorizedModal && (
        <ModalBlank
          modalSize="sm"
          onCloseModal={() => setShowUnauthorizedModal(false)}
          onClickOutToClose={true}
          showCrossButton={true}
        >
          <div className="space-y-20 text-center">
            <div>
              <ErrorText text={errorResponse} />
            </div>
            <div>
              <Button
                btnText="Ok"
                clicked={() => {
                  setShowUnauthorizedModal(false)
                }}
                variant="primary"
                className="w-full px-16"
              />
            </div>
          </div>
        </ModalBlank>
      )}
    </>
  )
}
