"use client"

import { tableURLWithParams } from "@utils/helpers/misc"
import { PATHS } from "app/(module)/router.config"
import { ContactListAPIProps } from "app/(module)/services/api/contacts/get-contact-by-id"
import { AppContext } from "app/App.Context"
import ButtonIcon from "app/components/global/ButtonIcon"
import TablePagy from "app/components/table/TablePagy"
import { useContext, useState } from "react"
import ContactCreateUpdateModal from "./Components/ContactCreateUpdateModal"
import ContactDeleteModal from "./Components/ContactDeleteModal"
import { QUERY_KEYS } from "app/(module)/query.config"
import Button from "app/components/global/Button"

const ContactList = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [selectedData, setSelectedData] = useState<ContactListAPIProps | null>(null)

  const { token } = useContext(AppContext)

  return (
    <div className="container">
      <h3 className="text-center text-primary">Contact List</h3>
      <Button btnText="Add New Contact" variant="primary" clicked={() => {setShowCreateModal(true)}} />
      {token != null && (
        <TablePagy
          // onRowClick={(e) => {
          //   viewPost(e.original.id);
          // }}
          url={tableURLWithParams(process.env.NEXT_PUBLIC_SITE_URL as string, PATHS.CONTACT.LIST.root, token)}
          startName="pageNo"
          sizeName="pageSize"
          totalRowName="totalRows"
          pageSize={30}
          rowPerPageOptions={[30, 40, 50]}
          queryParameters={{ queryKey: [QUERY_KEYS.CONTACT.LIST.key] }}
          columnHeadersLabel={[
            {
              accessorKey: "name",
              header: "Name",
            },
            {
              accessorKey: "email",
              header: "Email",
            },
            {
              id: "_actions",
              header: "Action",
              columnDefType: "display",
              Cell: ({ row }) => (
                <div className="flex flex-row space-x-6">
                  <ButtonIcon
                    clicked={() => {
                      setSelectedData(row.original as ContactListAPIProps)
                      setShowUpdateModal(true)
                      console.log("Selected Data", row.original)
                    }}
                    className="mx-auto"
                    iconName="edit-01"
                  />

                  <ButtonIcon
                    clicked={() => {
                      setSelectedData(row.original as ContactListAPIProps)
                      setShowDeleteModal(true)
                      console.log("Selected Data", row.original)
                    }}
                    className="mx-auto"
                    iconName="trash-01"
                  />
                </div>
              ),
            },
          ]}
        />
      )}

      {showCreateModal && (
        <ContactCreateUpdateModal
          isUpdate={false}
          onClose={(e) => {
            setShowCreateModal(e)
          }}
          onConfirm={(e) => {
            setShowCreateModal(e)
          }}
        />
      )}

      {showUpdateModal && selectedData != null && (
        <ContactCreateUpdateModal
          isUpdate={true}
          onClose={(e) => {
            setShowCreateModal(e)
          }}
          onConfirm={(e) => {
            setShowCreateModal(e)
          }}
          apiData={selectedData}
        />
      )}

      {showDeleteModal && selectedData != null && token != null && (
        <ContactDeleteModal
          contactId={selectedData.id}
          onCloseModal={(e) => {
            setShowUpdateModal(e)
          }}
          token={token}
        />
      )}
    </div>
  )
}

export default ContactList
