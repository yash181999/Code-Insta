import React from 'react'

function UploadModal() {
    return (
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <div className={classes.paper}>
            {modalType === "IMAGE" && (
              <div>
                <SwipeableViews
                  axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                  index={activeStep}
                  onChangeIndex={handleStepChange}
                  enableMouseEvents
                >
                  {image.map((step, index) => (
                    <div key={step}>
                      {Math.abs(activeStep - index) <= 2 ? (
                        <img
                          className={classes.modalImage}
                          src={URL.createObjectURL(step)}
                          alt={step}
                        />
                      ) : null}
                    </div>
                  ))}
                </SwipeableViews>
                <MobileStepper
                  steps={maxSteps}
                  position="static"
                  variant="dots"
                  activeStep={activeStep}
                  nextButton={
                    <Button
                      size="small"
                      onClick={handleNext}
                      disabled={activeStep === image.length - 1}
                    >
                      {theme.direction === "rtl" ? (
                        <KeyboardArrowLeft />
                      ) : (
                        <KeyboardArrowRight />
                      )}
                    </Button>
                  }
                  backButton={
                    <Button
                      size="small"
                      onClick={handleBack}
                      disabled={activeStep === 0}
                    >
                      {theme.direction === "rtl" ? (
                        <KeyboardArrowRight />
                      ) : (
                        <KeyboardArrowLeft />
                      )}
                    </Button>
                  }
                  className="photo__stepper"
                />

                {image.length > 0 && (
                  <Button
                    onClick={uploadImages}
                    className={classes.uploadButton}
                  >
                    Upload
                  </Button>
                )}
              </div>
            )}
            {/* image type close */}

            {/* video type start       */}

            {modalType === "VIDEO" && (
              <div>
                <video
                  style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  controls
                  width="500"
                >
                  <source src={video}></source>
                </video>
                {video && (
                  <Button
                    onClick={uploadVideo}
                    className={classes.uploadButton}
                  >
                    Upload
                  </Button>
                )}
              </div>
            )}
          </div>
        </Fade>
      </Modal>
    );
}

export default UploadModal
