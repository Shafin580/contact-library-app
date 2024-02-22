"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { validateBangladeshMobileNumber } from "@utils/helpers/misc"
import { QUERY_KEYS } from "app/(module)/query.config"
import { CreateUpdateContactAPIProps, createContact } from "app/(module)/services/api/contacts/create-contact"
import { updateContact } from "app/(module)/services/api/contacts/update-contact"
import { AppContext } from "app/App.Context"
import Button from "app/components/global/Button"
import { validateTextInputField } from "app/components/global/Form/Auth/Validation"
import TextField from "app/components/global/Form/TextField"
import ModalBlank from "app/components/global/ModalBlank"
import { ToastContext } from "app/components/global/Toast/Context"
import { useContext, useEffect, useState } from "react"

interface ContactCreateUpdateModalProps {
  apiData?: CreateUpdateContactAPIProps["data"]
  onConfirm: (e: boolean) => void
  onClose: (e: boolean) => void
  isUpdate?: boolean
}

const ContactCreateUpdateModal = ({
  apiData,
  onConfirm,
  onClose,
  isUpdate = false,
}: ContactCreateUpdateModalProps) => {
  const { updateLoadingStatus, token } = useContext(AppContext)
  const { renderToast } = useContext(ToastContext)

  const queryClient = useQueryClient()

  const Template = () => {
    const [formData, setFormData] = useState<CreateUpdateContactAPIProps["data"]>()
    const [errorField, setErrorField] = useState({
      nameError: "",
      emailError: "",
      phoneError: "",
    })

    // + Function to Validate Data
    const formValidation = (data: CreateUpdateContactAPIProps["data"]) => {
      let status = true
      if (
        data.phone_number &&
        data.phone_number.length > 0 &&
        validateBangladeshMobileNumber(data.phone_number).status == false
      ) {
        setErrorField((prev) => ({
          ...prev,
          phoneError: validateBangladeshMobileNumber(data.phone_number ?? "").message,
        }))
        status = false
      }

      if (validateTextInputField({ isEmail: false, required: true, value: data.name }).status == false) {
        setErrorField((prev) => ({
          ...prev,
          nameError: validateTextInputField({ isEmail: false, required: true, value: data.name }).message,
        }))
        status = false
      }

      if (validateTextInputField({ isEmail: true, required: true, value: data.email }).status == false) {
        setErrorField((prev) => ({
          ...prev,
          emailError: validateTextInputField({ isEmail: false, required: true, value: data.email }).message,
        }))
        status = false
      }

      return status
    }

    // + Function to Create Contact
    const createContactMutation = useMutation({
      mutationFn: async (data: CreateUpdateContactAPIProps["data"]) => {
        updateLoadingStatus(true, "Creating Contact...")
        const response = await createContact({
          data: {
            name: data.name,
            email: data.email,
            phone_number: data.phone_number ?? null,
            address: data.address ?? null,
          },
          token: token!,
        })

        if (response.status_code == 201) {
          updateLoadingStatus(false, undefined)
          renderToast([
            {
              message: response.message,
              variant: "success",
            },
          ])
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACT.LIST.key] })
        } else {
          updateLoadingStatus(false, undefined)
          renderToast([
            {
              message: "Error Creating Contact!",
              variant: "error",
            },
          ])
        }
      },
      onError: () => {
        updateLoadingStatus(false, undefined)
        renderToast([
          {
            message: "Server Error!",
            variant: "error",
          },
        ])
      },
    })

    // + Function to Update Contact
    const updateContactMutation = useMutation({
      mutationFn: async (data: CreateUpdateContactAPIProps["data"]) => {
        updateLoadingStatus(true, "Updating Contact...")
        const response = await updateContact({
          data: {
            id: data.id,
            name: data.name,
            email: data.email,
            phone_number: data.phone_number ?? null,
            address: data.address ?? null,
          },
          token: token!,
        })

        if (response.status_code == 200) {
          updateLoadingStatus(false, undefined)
          renderToast([
            {
              message: response.message,
              variant: "success",
            },
          ])
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACT.LIST.key] })
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACT.DYNAMIC(data.id ?? 0).key] })
        } else {
          updateLoadingStatus(false, undefined)
          renderToast([
            {
              message: "Error Updating Contact!",
              variant: "error",
            },
          ])
        }
      },
      onError: () => {
        updateLoadingStatus(false, undefined)
        renderToast([
          {
            message: "Server Error!",
            variant: "error",
          },
        ])
      },
    })

    useEffect(() => {
      if (isUpdate) {
        if (apiData) {
          setFormData((prev) => ({
            ...prev,
            name: apiData.name,
            email: apiData.email,
            id: apiData.id,
            address: apiData.address,
            phone_number: apiData.phone_number,
          }))
        }
      } else {
        setFormData((prev) => ({ ...prev, name: "", email: "", address: null, phone_number: null }))
      }
    }, [isUpdate, apiData])

    return (
      <form
        className="space-y-16"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <h3>{`${isUpdate ? "Update" : "Add New"} Contact`}</h3>

        <div className="grid grid-cols-2 gap-16">
          {/* // + Name Field */}
          <TextField
            value={formData?.name}
            label={"Name"}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev!, name: e.data as string }))
              setErrorField((prev) => ({ ...prev, nameError: "" }))
            }}
            errorText={errorField.nameError.length > 0 ? errorField.nameError : ""}
          />

          {/* // + Email Field */}
          <TextField
            value={formData?.email}
            label={"Email"}
            type="email"
            onChange={(e) => {
              setFormData((prev) => ({ ...prev!, email: e.data as string }))
              setErrorField((prev) => ({ ...prev, emailError: "" }))
            }}
            errorText={errorField.emailError.length > 0 ? errorField.emailError : ""}
          />

          {/* // + Phone Number Field */}
          <TextField
            value={formData?.phone_number ?? ""}
            label={"Phone Number"}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev!, phone_number: e.data as string }))
              setErrorField((prev) => ({ ...prev, phoneError: "" }))
            }}
            errorText={errorField.phoneError.length > 0 ? errorField.phoneError : ""}
          />

          {/* // + Address Field */}
          <TextField
            value={formData?.address ?? ""}
            label={"Address"}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev!, address: e.data as string }))
            }}
          />
        </div>

        <div className="flex justify-end">
          <Button
            btnText={!isUpdate ? "Create" : "Update"}
            type="submit"
            clicked={() => {
              if (formData) {
                console.log("formData", formData)

                const isFormInputsValid = formValidation(formData)

                if (isFormInputsValid) {
                  if (!isUpdate) {
                    createContactMutation.mutate(formData)
                  } else {
                    updateContactMutation.mutate(formData)
                  }
                }
              }
            }}
          />
        </div>
      </form>
    )
  }

  return (
    <>
      <ModalBlank
        modalSize="md"
        showCrossButton
        onCloseModal={() => onClose(false)}
        onClickOutToClose={false}
        className="max-h-[790px] overflow-y-scroll"
      >
        <Template />
      </ModalBlank>
    </>
  )
}

export default ContactCreateUpdateModal
