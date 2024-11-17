import { Alert, Text, View, StyleSheet, TouchableOpacity, TextInput, Modal, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { useUser } from '../context/UserContext';
import { fetchHostDetails, updateProperty, deleteProperty, addProperty } from '@/lib/appwrite';
import { HotelIcon, User2, EditIcon, TrashIcon, Trash2Icon, FilePlus } from 'lucide-react-native';
import { phoneFormatter } from '../../lib/phoneFormatter';

const Profile: React.FC = () => {
  const { hostId, userName, userMail, userPhone } = useUser();
  const [hostDetails, setHostDetails] = useState<any>(null);
  const [newPropertyName, setNewPropertyName] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<number | null>(null);

  useEffect(() => {
    const getHostDetails = async () => {
      if (hostId) {
        const details = await fetchHostDetails(hostId);
        setHostDetails(details);
      }
    };
    getHostDetails();
  }, [hostId]);

  // Handle adding a new property
  const handleAddProperty = async () => {
    if (newPropertyName) {
      try {
        const response = await addProperty(hostId, newPropertyName);
        setHostDetails(response); // Update state with new property
        setIsAddModalVisible(false);
        setNewPropertyName('');
        Toast.show({
          type: 'success',
          text1: 'Property Added',
          text2: 'New property has been successfully added.',
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Add Error',
          text2: 'Failed to add property.',
        });
        console.error("Error adding property:", error);
      }
    }
  };

  // Handle editing a property
  const handleEditProperty = async () => {
    if (propertyToEdit !== null && newPropertyName) {
      try {
        const oldName = hostDetails?.businessEntities[propertyToEdit];
        const response = await updateProperty(hostId, oldName, newPropertyName);
        setHostDetails(response);
        setIsEditModalVisible(false);
        setNewPropertyName('');
        setPropertyToEdit(null);
        Toast.show({
          type: 'success',
          text1: 'Property Updated',
          text2: 'Property name has been updated.',
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Update Error',
          text2: 'Failed to update property.',
        });
        console.error("Error updating property:", error);
      }
    }
  };

  // Handle deleting a property with confirmation
  const handleDeleteProperty = async (propertyName: string) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the property "${propertyName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              const response = await deleteProperty(hostId, propertyName);
              setHostDetails(response);
              Toast.show({
                type: 'success',
                text1: 'Property Deleted',
                text2: 'Property has been successfully deleted.',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Delete Error',
                text2: 'Failed to delete property.',
              });
              console.error("Error deleting property:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View >
         <Toast  position="top"  />
        <View className="p-5 " style={{zIndex:-1}} >   
        <View className="bg-white p-4 rounded-md shadow-md">
            <Text className="text-2xl font-bold">Host Information</Text>
            <View className="flex flex-row items-center gap-x-2 border-b border-gray-300 pb-8">
            <User2 height={30} width={30} color="gray" />
            <Text className="font-medium text-xl text-gray-500">{userName}</Text>
            </View>
            <View style={styles.infoSection}>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>{userMail}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>{phoneFormatter(userPhone)}</Text>
            </View>
            </View>
        </View>

        <View className="mt-5 bg-white p-4 rounded-md shadow-md">
            <View className='flex flex-row justify-between items-center'>
                <View>
                    <Text className="ml-1 mt-1 text-gray-600 text-xs">Properties you're currently managing</Text>
                    <Text className="text-xl font-bold">Managed Properties</Text>
                </View>
                <View className="pl-2">
                    <TouchableOpacity onPress={() => setIsAddModalVisible(true)} className="">
                        <View className='bg-white shadow-sm py-2 px-1 shadow-gray-900 rounded-lg'>
                            <FilePlus height={20} width={20} color={'black'} />
                        </View>
                    </TouchableOpacity>
                </View>
                
            </View>
            <View className="gap-y-2 mt-2">
            {hostDetails?.businessEntities?.map((entity: string, index: number) => (
                <View key={index} className="justify-between flex flex-row items-center bg-slate-50 shadow-sm shadow-black-100 rounded-md p-2">
                  <View className='flex flex-row gap-x-2 items-center'>
                    <HotelIcon height={15} width={15} color="gray" />
                    <Text className="text-gray-700 font-medium py-1 capitalize">{entity}</Text>   
                  </View>
                  <View className='flex flex-row gap-x-2 items-center'>
                    <TouchableOpacity onPress={() => { setPropertyToEdit(index); setNewPropertyName(entity); setIsEditModalVisible(true); }}>
                        <EditIcon height={18} width={18} color="green" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteProperty(entity)}>
                        <Trash2Icon height={18} width={18} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
            ))}
            </View>
        </View>

        

        {/* Add Property Modal */}
        <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text className="font-bold text-lg mb-3">Add New Property</Text>
                <TextInput
                value={newPropertyName}
                onChangeText={setNewPropertyName}
                style={styles.input}
                placeholder="Enter property name"
                />
                <Button title="Submit" onPress={handleAddProperty} />
                <Button title="Cancel" onPress={() => setIsAddModalVisible(false)} />
            </View>
            </View>
        </Modal>

        {/* Edit Property Modal */}
        <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text className="font-bold text-lg mb-3">Edit Property</Text>
                <TextInput
                value={newPropertyName}
                onChangeText={setNewPropertyName}
                style={styles.input}
                placeholder="Enter new property name"
                />
                <Button title="Submit" onPress={handleEditProperty} />
                <Button title="Cancel" onPress={() => setIsEditModalVisible(false)} />
            </View>
            </View>
        </Modal>
        </View>
    </View>
  );
};


const styles = StyleSheet.create({
  infoSection: {
    rowGap: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    columnGap: 10,
  },
  infoText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default Profile;
