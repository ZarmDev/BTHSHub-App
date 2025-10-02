// USAGE OF AI

import { styles } from '@/constants/styles';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Modal, Pressable, useColorScheme, View } from 'react-native';
import { Text } from 'react-native-paper';

// Import your modal components
import TeamInfoModal from '@/components/TeamInfoModal';

// Define modal types
export enum ModalType {
  NONE,
  TEAMINFO
}

// Map modal types to components
const modalComponents = {
  [ModalType.TEAMINFO]: TeamInfoModal,
};

// Context interface
interface ModalContextType {
  showModal: (type: ModalType, props?: any) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  showModal: () => {},
  hideModal: () => {},
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children, userData }: { children: ReactNode, userData: any }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [modalProps, setModalProps] = useState({});
  const colorScheme = useColorScheme();

  const showModal = (type: ModalType, props = {}) => {
    setModalType(type);
    setModalProps(props);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
  };

  const renderModal = () => {
    if (modalType === ModalType.NONE) return null;
    
    const ModalComponent = modalComponents[modalType];

    if (!ModalComponent) return null;

    
    return (
      <ModalComponent 
        {...userData} 
        {...modalProps} 
        setModalVisibleCallback={hideModal} 
      />
    );
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={hideModal}
      >
        <View style={[
          styles.modalView2,
          colorScheme === 'dark' ? { "backgroundColor": "#342E35" } : { "backgroundColor": "white" }
        ]}>
          {renderModal()}
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={hideModal}
          >
            <Text style={styles.bigPaddingButton}>Hide</Text>
          </Pressable>
        </View>
      </Modal>
    </ModalContext.Provider>
  );
};