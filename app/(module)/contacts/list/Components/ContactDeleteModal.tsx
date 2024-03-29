"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "app/(module)/query.config"
import { deleteContact } from "app/(module)/services/api/contacts/delete-contact-by-id"
import { AppContext } from "app/App.Context"
import Button from "app/components/global/Button"
import ModalBlank from "app/components/global/ModalBlank"
import { ToastContext } from "app/components/global/Toast/Context"
import { useContext, useState } from "react"

const ContactDeleteModal = ({
  contactId,
  onCloseModal,
  token,
}: {
  contactId: string | number
  onCloseModal: (e: boolean) => void
  token: string
}) => {
  const [showModal, setShowModal] = useState(true)
  const queryClient = useQueryClient()

  const { updateLoadingStatus } = useContext(AppContext)
  const { renderToast } = useContext(ToastContext)

  // + Function to Delete Contact
  const deleteContactMutation = useMutation({
    mutationFn: async () => {
      const response = await deleteContact({ id: contactId, token: token })
      updateLoadingStatus(true, "Deleting Contact...")
      if (response.status_code == 200) {
        updateLoadingStatus(false, undefined)
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACT.LIST.key] })
        renderToast([
          {
            message: response.message,
            variant: "success",
          },
        ])
        setShowModal(false)
        onCloseModal(false)
      } else {
        updateLoadingStatus(false, undefined)
        renderToast([
          {
            message: "Failed to Delete Contact!",
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

  return (
    <div>
      {showModal && (
        <ModalBlank
          onClickOutToClose={false}
          onCloseModal={() => {
            setShowModal(false)
            onCloseModal(false)
          }}
          showCrossButton={true}
          modalSize="sm"
          modalAlign="center"
        >
          <h5 className="!mb-28 text-center">
            {"Are you sure you want to delete this contact?"}
          </h5>
          <div className="grid grid-cols-2 gap-x-20">
            <Button
              btnText={"Cancel"}
              variant="neutral"
              textClassName="text-slate-500"
              fullWidth
              clicked={() => {
                setShowModal(false)
                onCloseModal(false)
              }}
            />
            <Button
              btnText={"Okay"}
              variant={"success"}
              fullWidth
              clicked={() => {
                deleteContactMutation.mutate()
              }}
            />
          </div>
        </ModalBlank>
      )}
    </div>
  )
}

export default ContactDeleteModal
