import { View, Text,Button, TouchableOpacity, ScrollView,Animated } from 'react-native'
import React, { useState,useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { printToFileAsync } from 'expo-print'
import { shareAsync } from 'expo-sharing'
import TextField from '@/components/TextField'
import DateField from '@/components/DateField'
import SelectPicker from '@/components/SelectPicker'
import { StatusBar } from 'expo-status-bar'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

const Home = () => {
    const [form, setForm] = useState({
        cottageName:'',
        guestName:'',
        adults:'',
        children:'',
        pets:'',
        checkIn: new Date(),
        checkOut: new Date(),
        totalAmount:'',
        depositedAmount:'',
        mealPlan:'',
        hostName:'',
        hostContact:'',
        supportContact:''
    })

    

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                display;felx;
                justify-content:center;
                align-items:center
                
            }
            .container {
                width: 80%;
                margin: auto;
                background-color: #fff;
                padding: 20px;
                border-radius: 10px;
                height:auto;
              
            }
            h1 {
                color: #333;
                text-align: center;
            }
            h2 {
                color: #555;
                text-align: center;
            }
            .receipt-details {
                margin-top: 20px;
                line-height: 1.6;
                
            }
            .receipt-details p {
                margin: 5px 0;
                color: #333;
                margin-left:20px;
            }
                .receipt-details p strong{
                
                color: #1B1212;
            }
                
            .footer {
                margin-top: 20px;
                text-align: center;
                color: #777;
            }
            .header, .footer p {
                text-align: left;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Booking Confirmation Receipt</h1>
            <h2>${form.cottageName}</h2>
            <div class="header">
                <b style="background-color:yellow;color:gray; padding:8px ;width:fit-content;border-radius:20px:">Dear ${form.guestName},</b>
                <p style="line-height:30px;">We are delighted to confirm your booking for the <b>${form.cottageName}</b>. Your stay is scheduled from <b> ${form.checkIn.toLocaleDateString()}</b> to <b>${form.checkOut.toLocaleDateString()}</b>.</p>
                <p>We have received your advance payment of <b>₹ ${form.depositedAmount}</b>. The remaining balance is due upon arrival.</p>
            </div>
            <div class="receipt-details">
                <h3>Booking Summary</h3>
                <p><strong>Cottage :</strong> ${form.cottageName} </p>
                <p><strong>Booked By :</strong> ${form.guestName}</p>
                <p><strong>Number of Guests :</strong> ${form.adults} Adults, ${form.children} Children, ${form.pets} Pets </p>
                <p><strong>Check-in :</strong> ${form.checkIn.toLocaleDateString()}</p>
                <p><strong>Check-out :</strong> ${form.checkOut.toLocaleDateString()}</p>
                <p><strong>Total Amount :</strong> ₹ ${form.totalAmount}</p>
                <p><strong>Advance Payment Received :</strong> ₹ ${form.depositedAmount}</p>
                <p><strong>Balance Due :</strong> ₹ ${parseFloat(form.totalAmount) - parseFloat(form.depositedAmount)}</p>
                <p><strong>Meal Plan :</strong> ${form.mealPlan} </p>
                <p><strong>Host Contact :</strong> <b style="color:brown">${form.hostName}</b> will be your point of contact during your stay. You can reach him/her at <b style="color:brown">${form.hostContact}</b> </p>
                </div>
            <div class="footer">
                <p>We can't wait to welcome you to ${form.cottageName}</p>
                <p>Sincerely,</p>
                <p>The ${form.cottageName} Team</p>
            </div>

            
            <p style=" margin-top:80px;border: 1px solid gray; padding:10px 10px 10px 10px  ">If you have any questions or issues, please contact us at ${form.supportContact}</p>
            
        </div>
    </body>
    </html>
    `;
    

    let genPdf = async ()=>{
        const file = await printToFileAsync({
            html:html,
            base64:false
        })
        await shareAsync(file.uri)
    }
    const scrollY = useRef(new Animated.Value(0)).current;
    const headerHeight = 70; // Adjust header height as needed
  
    const headerTranslate = scrollY.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -headerHeight],
        extrapolate: 'clamp',
      });
  return (
        <SafeAreaView className='bg-primary h-full justify-center '>
        <Header />
      
            <ScrollView
     >
                <View className='relative mt-[100] '>
                   
            <View className='px-4 '>
                    <TextField title='Cottage Name' value={form.cottageName}
                        handleChangeText ={(e:any)=>setForm({
                            ...form,cottageName:e
                        })} placeholder='Enter Cottage Name' required ={true} keyboardType=''/>

                    <TextField title='Booked By' value={form.guestName}
                        handleChangeText ={(e:any)=>setForm({
                            ...form,guestName:e
                        })} placeholder='Person Who made Reservation' required ={true} keyboardType=''/>

                    <View className='flex-row justify-between'>
                        <SelectPicker title='Adults' items={[{label:'1',value:'1'},
                        {label:2,value:2},{label:3,value:3},{label:4,value:4},
                        {label:5,value:'5'},{label:'6',value:'6'},{label:'7',value:'7'},
                        {label:8,value:8},{label:9,value:9},{label:10,value:10},
                        {label:11,value:11},{label:12,value:13},{label:14,value:14},{label:15,value:15},
                        {label:16,value:16},{label:17,value:17},{label:18,value:18},{label:19,value:19},{label:20,value:20}
                        ]} value={form.adults} otherStyles='w-[30%] pt-[3px]'
                        onValueChange={(itemValue:any) => setForm({ ...form, adults: itemValue })} required={true}/>
                
                        <SelectPicker title='Children' items={[{label:'0',value:'0'},{label:'1',value:'1'},
                        {label:2,value:2},{label:3,value:3},{label:4,value:4},
                        {label:5,value:'5'},{label:'6',value:'6'},{label:'7',value:'7'},
                        {label:8,value:8},{label:9,value:9},{label:10,value:10},
                        ]} value={form.children} otherStyles='w-[30%]'
                        onValueChange={(itemValue:any) => setForm({ ...form, children: itemValue })} required ={false}/>
                
                        <SelectPicker title='Pets' items={[{label:'0',value:'0'},{label:'1',value:'1'},
                        {label:2,value:2},{label:3,value:3}
                        ]} value={form.pets} otherStyles='w-[30%]'
                        onValueChange={(itemValue:any) => setForm({ ...form, pets: itemValue })} required ={false}/>
                    </View>    

                        <View className='flex-row  justify-between    '>
                            <DateField label='CheckIn Date' date={form.checkIn} setDate={(date:any) => setForm({ ...form, checkIn: date })} required ={true}/>
                            <DateField label='CheckOut Date' date={form.checkOut} setDate={(date:any) => setForm({ ...form, checkOut: date })} required ={true}/>
                        </View>

                        <View className='flex-row    justify-between  '>
                            <TextField title='Total Amount' value={form.totalAmount}
                            handleChangeText ={(e:any)=>setForm({
                                ...form,totalAmount:e
                            })} otherStyles = ' w-full' placeholder="Enter Total Amount" required ={true} keyboardType='number-pad'/>

                            <TextField title='Advance Received' value={form.depositedAmount}
                            handleChangeText ={(e:any)=>setForm({
                                ...form,depositedAmount:e
                            })} otherStyles = 'w-full' placeholder="Advance Received" required ={true} keyboardType='number-pad'/>
                        </View>

                    <SelectPicker title='Meal Plan' items={[{label:'European Plan',value:'European Plan (No Meal Included in Pricing)'},
                        {label:'Continental Plan',value:'Continental Plan (Breakfast Included)'},
                        {label:'American Plan',value:'American Plan (Breakfast, Lunch and Dinner Included)'},
                        {label:'Modified American Plan',value:'Modified American Plan (Breakfast, Lunch or Dinner Included)'}
                        ]} value={form.mealPlan} otherStyles='w-full'
                        onValueChange={(itemValue:any) => setForm({ ...form, mealPlan: itemValue })} required ={true}/>
                
                <View className='flex-row    justify-between  '>
                            <TextField title='Host Name' value={form.hostName}
                            handleChangeText ={(e:any)=>setForm({
                                ...form,hostName:e
                            })} otherStyles = ' w-full' placeholder="Host Name" required ={true} keyboardType=''/>

                            <TextField title="Host Contact" value={form.hostContact}
                            handleChangeText ={(e:any)=>setForm({
                                ...form,hostContact:e
                            })} otherStyles = 'w-full' placeholder="Host Contact" required ={true} keyboardType='phone-pad'/>
                        </View>

                        <TextField title='Suppot Contact' value={form.supportContact}
                            handleChangeText ={(e:any)=>setForm({
                                ...form,supportContact:e
                            })} otherStyles = '' placeholder="Support Contact" required ={true} keyboardType='phone-pad'/>
                </View>


                <TouchableOpacity className='bg-secondary-200 p-5   items-center my-5 mx-auto w-[95%]
                rounded-lg ' onPress={genPdf}>
                    <Text className='font-bold text-xl '>Generate Pdf</Text>
                </TouchableOpacity>
                <Footer/>
                </View>
                
                <StatusBar  backgroundColor='white' style='dark'/>
            </ScrollView>
        </SafeAreaView>
  )
}

export default Home