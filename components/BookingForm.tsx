import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import DateField from '../components/DateField';
import { saveBooking, getCurrentUser, getCottagesByHost } from '../lib/appwrite';
import SelectPicker from '@/components/SelectPicker';
import LabelText from '@/components/LabelText';
import Toast from 'react-native-toast-message';

interface BookingFormProps {
  onClose: () => void;
}

const Booking: React.FC<BookingFormProps> = ({ onClose }) => {
  const [form, setForm] = useState({
    booker: '',
    contact: '',
    adults: 1,
    children: 0,
    pets: 0,
    checkIn: new Date(),
    checkOut: new Date(),
    totalAmount: '',
    cottage: '',
    tokenMoney: '',
    remarks: '',
  });
  const [hostId, setHostId] = useState<string | null>(null);
  const [cottageOptions, setCottageOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchHostIdAndCottages = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setHostId(user.$id);
          const cottageData = await getCottagesByHost(user.$id);
          const cottages = cottageData.cottagename.map((cottage: string) => ({
            label: cottage,
            value: cottage,
          }));
          setCottageOptions(cottages);
        }
      } catch (error) {
        console.error("Failed to fetch cottages:", error);
      }
    };
    fetchHostIdAndCottages();
  }, []);

  const calculatePendingAmount = () => {
    const totalAmount = parseFloat(form.totalAmount) || 0;
    const advance = parseFloat(form.tokenMoney) || 0;
    return (totalAmount - advance).toFixed(2);
  };

  const handleBookingSubmit = async () => {
    if (!form.booker || !form.totalAmount || !form.cottage || !form.tokenMoney) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields.',
      });
      return;
    }

    try {
      const bookingData = {
        booker: form.booker,
        contact: form.contact,
        adults: form.adults,
       
        children: form.children === -1 ? 0 : form.children,
        pet: form.pets === -1 ? 0 : form.pets,
        checkIn: form.checkIn.toISOString().split('T')[0],
        checkOut: form.checkOut.toISOString().split('T')[0],
        totalAmount: parseFloat(form.totalAmount),
        cottage: form.cottage,
        tokenMoney: parseFloat(form.tokenMoney),
        pendingAmount: parseFloat(calculatePendingAmount()),
        hostId: hostId,
        remarks: form.remarks,
      };

      await saveBooking(bookingData);

      Toast.show({
        type: 'success',
        text1: 'Booking Successful',
        text2: 'The booking was saved successfully!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not save booking data. Please try again.',
      });
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
        
       <Toast  position="top" />

      <ScrollView  style={{zIndex:-1}}>
        <View className='relative'>
          <LabelText title="Booker's Name" required={true} />
          <TextInput
            placeholder="Booker's Name"
            value={form.booker}
            onChangeText={(text) => setForm({ ...form, booker: text })}
            style={styles.input}
          />
        </View>

        <View>
          <LabelText title="Booker's Contact" required={true} />
          <TextInput
            placeholder="Booker's Contact Number"
            value={form.contact}
            onChangeText={(text) => setForm({ ...form, contact: text })}
            style={styles.input}
          />
        </View>

        <View>
          <LabelText title="Cottage Name" required={true} />
          <SelectPicker
            title="Cottage Name"
            items={cottageOptions}
            value={form.cottage}
            onValueChange={(itemValue:any) => setForm({ ...form, cottage: itemValue })}
          />
        </View>

        <View style={styles.row}>
        <View className='w-[30%]'>
                            <LabelText title="Adults" required={true} />
                            <SelectPicker title='Adults' items={[{label:1,value:1},
                            {label:2,value:2},{label:3,value:3},{label:4,value:4},
                            {label:5,value:5},{label:6,value:6},{label:7,value:7},
                            {label:8,value:8},{label:9,value:9},{label:10,value:10},
                            {label:11,value:11},{label:12,value:13},{label:14,value:14},{label:15,value:15},
                            {label:16,value:16},{label:17,value:17},{label:18,value:18},{label:19,value:19},{label:20,value:20}
                            ]} value={form.adults} otherStyles=' '
                            onValueChange={(itemValue:any) => setForm({ ...form, adults: itemValue })} required={true}/>

                        </View>
                        <View className='w-[30%]'>
                            <LabelText title="Children" required={true} />
                            <SelectPicker title='Children' items={[{label:0,value:-1},{label:1,value:1},
                            {label:2,value:2},{label:3,value:3},{label:4,value:4},
                            {label:5,value:5},{label:6,value:6},{label:7,value:7},
                            {label:8,value:8},{label:9,value:9},{label:10,value:10},
                            ]} value={form.children} otherStyles=''
                            onValueChange={(itemValue:any) => setForm({ ...form, children: itemValue })} required ={false}/>
                        </View>
          <View style={styles.column}>
            <LabelText title="Pets" />
            <SelectPicker
              title="Pets"
              items={[{ label: 0, value: -1 }, { label: 1, value: 1 }, { label: 2, value: 2 }]}
              value={form.pets}
              onValueChange={(itemValue:any) => setForm({ ...form, pets: itemValue })}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <LabelText title="CheckIn" required={true} />
            <DateField
              date={form.checkIn}
              setDate={(date:any) => setForm({ ...form, checkIn: date })}
              style={styles.input}
            />
          </View>
          <View style={styles.column}>
            <LabelText title="CheckOut" required={true} />
            <DateField
              date={form.checkOut}
              setDate={(date:any) => setForm({ ...form, checkOut: date })}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <LabelText title="Total Amount" required={true} />
            <TextInput
              placeholder="Total Amount"
              value={form.totalAmount}
              onChangeText={(text) => setForm({ ...form, totalAmount: text })}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.column}>
            <LabelText title="Advance Payment" required={true} />
            <TextInput
              placeholder="Advance Payment"
              value={form.tokenMoney}
              onChangeText={(text) => setForm({ ...form, tokenMoney: text })}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        <View>
          <LabelText title="Remarks" />
          <TextInput
            placeholder="Remarks if any..."
            value={form.remarks}
            onChangeText={(text) => setForm({ ...form, remarks: text })}
            style={styles.textArea}
            multiline
          />
        </View>

        <TouchableOpacity onPress={handleBookingSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Submit Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  formContainer: {
    paddingBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  textArea: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Booking;
