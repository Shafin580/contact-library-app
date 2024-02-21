import Button from "app/components/global/Button"
import TextField from "app/components/global/Form/TextField"
import ModalBlank from "app/components/global/ModalBlank"

const ContactDetails = ({ id = "0" }) => {
  return (
    <div>
      {showModal && (
        <ModalBlank
          modalSize="sm"
          onCloseModal={(e: any) => {
            setShowModal(false)
          }}
          onClickOutToClose
          showCrossButton
        >
          {/* <header>
                <div className="flex items-center gap-x-8">
                  <Icon
                    iconName="heart"
                    iconSize="24"
                    iconColor={variables.primary500}
                  />
                  <h5>User Update</h5>
                </div>
              </header> */}
          <div className="space-y-12 text-center">
            <p>{userUpdateMessage}</p>
          </div>
          <Button
            fullWidth={true}
            btnText="Ok"
            clicked={() => {
              setShowModal(false)
            }}
          />
        </ModalBlank>
      )}

      <div className="grid gap-20 lg:grid-cols-2">
        {/* // + left column */}
        <div className="flex flex-col gap-32 rounded bg-white p-40">
          <div>
            <h4 id="ai">Contact Information</h4>
          </div>

          <div className="grid gap-32 xl:grid-cols-2">
            <TextField
              label="Name"
              placeholder="e.g. John"
              value={name}
              onChange={(e) => {
                setName(String(e.data))
                setErrorResponse((prevData) => ({
                  ...prevData,
                  firstNameError: "",
                }))
              }}
              errorText={errorResponse.firstNameError}
            />
            <TextField
              label="Address"
              placeholder="e.g. Appleseed"
              value={address}
              onChange={(e) => {
                setAddress(String(e.data))
                setErrorResponse((prevData) => ({
                  ...prevData,
                  lastNameError: "",
                }))
              }}
              errorText={errorResponse.lastNameError}
            />
          </div>

          <div className="grid gap-32 xl:grid-cols-2">
            <TextField
              label="Email"
              placeholder="e.g. john@appleseed.com"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(String(e.data))
                setErrorResponse((prevData) => ({ ...prevData, emailError: "" }))
              }}
              errorText={errorResponse.emailError}
              isDisabled={true}
            />

            <TextField
              label="Phone Number"
              placeholder="e.g. 01712345678"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(String(e.data))
                setErrorResponse((prevData) => ({
                  ...prevData,
                  phoneError: "",
                }))
              }}
              isDisabled={true}
              errorText={errorResponse.phoneError}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactDetails