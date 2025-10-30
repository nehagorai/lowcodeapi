import PropTypes from 'prop-types';
import React from 'react';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

function ModalBox(props) {
  const { isModalOpen, onClose, children } = props;

  return (
    <Modal open={isModalOpen} onClose={onClose} center>
      <div className="w-full" width="200">
        {children}
      </div>
    </Modal>
  );
}

ModalBox.propTypes = {
  isModalOpen: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.any,
};

export default ModalBox;
