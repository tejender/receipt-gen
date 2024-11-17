// components/GenerateBill.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

interface GenerateBillProps {
  orderItems: { name: string; price: number; quantity: number }[];
  bookingId: string;
  bookingDetails: any
}

const GenerateBill: React.FC<GenerateBillProps> = ({ orderItems, bookingId,bookingDetails }) => {
  const generatePdf = async () => {
    try {
      // Group items by name and aggregate quantities and prices
      const groupedItems = orderItems.reduce((acc, item) => {
        if (acc[item.name]) {
          acc[item.name].quantity += item.quantity;
          acc[item.name].totalPrice += item.price * item.quantity;
        } else {
          acc[item.name] = {
            name: item.name,
            quantity: item.quantity,
            totalPrice: item.price * item.quantity,
          };
        }
        return acc;
      }, {} as { [key: string]: { name: string; quantity: number; totalPrice: number } });

      // Calculate the total amount
      const totalFoodAmount = Object.values(groupedItems).reduce((total, item) => total + item.totalPrice, 0);
      const GrandTotal = bookingDetails.totalAmount + totalFoodAmount;
      const remainingBalance = GrandTotal - bookingDetails.tokenMoney;

      // Generate HTML for the PDF
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px 0px; }
              h1 { text-align: center; font-size: 24px; }
              .info { margin-bottom: 20px; font-size: 16px; }
              .items-table { width: 100%; border-collapse: collapse; }
              .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .total { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right; }
            </style>
          </head>
          <body>
           <div style="background-color: white; width: 100%; max-width: 800px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); font-size: 14px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="font-size: 24px; color: #2563eb; margin-bottom: 10px;">Winterfell Treehouse & Cottages</h1>
                    <p style="color: #6b7280; margin: 5px 0;">Village Mihar , Jibhi , Himachal Pradesh</p>
                    <p style="color: #6b7280; margin: 5px 0;">Tel: +91 9459995498</p>
                </div>

                <div style="border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; padding: 20px 0; margin-bottom: 30px;">
                    <h2 style="font-size: 18px; margin-bottom: 10px;">Guest Information</h2>
                    <p><span style="font-weight: 600;">Name:</span> ${bookingDetails.booker}</p>
                    <p><span style="font-weight: 600;">Check-in:</span> 2023-11-08</p>
                    <p><span style="font-weight: 600;">Check-out:</span> 2023-11-11</p>
                    <p><span style="font-weight: 600;">Room Type:</span> Deluxe Cottage</p>
                </div>

                <div style="margin-bottom: 30px; border-bottom: 1px solid #e5e7eb;padding-Bottom: 20px">
                    <h3 style="font-size: 16px; margin-bottom: 10px;">Accommodation Charges</h3>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>Total Amount :</span>
                        <span>${bookingDetails.totalAmount}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px; ">
                        <span>Advance Paid :</span>
                        <span>${bookingDetails.tokenMoney}</span>
                    </div>
                
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span>Remaining Accommodation Balance:</span>
                        <span>${bookingDetails.pendingAmount}</span>
                    </div>
                </div>

                <div style="margin-bottom: 30px;">
                    <h3 style="font-size: 16px; margin-bottom: 10px;">Food & Beverage Charges</h3>
                    <table class="items-table">
                            <tr><th>Item Name</th><th>Quantity</th><th>Price</th></tr>
                            ${Object.values(groupedItems)
                                .map(
                                (item) => `
                                    <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                    <td>₹${item.totalPrice}</td>
                                    </tr>
                                `
                                )
                                .join('')}
                            </table>
                    
                
                    <div style="display: flex; justify-content: space-between; margin-top: 10px; font-weight: 600;">
                        <span>Food & Beverage Total:</span>
                        <span>₹ ${totalFoodAmount}</span>
                    </div>
                </div>


                <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-bottom: 30px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: 700; font-size: 18px;">
                        <span>Grand Total:</span>
                        <span>${GrandTotal}   </span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 16px; color: #dc2626; margin-top: 10px;">
                        <span>Remaining Balance:</span>
                        <span>${remainingBalance}</span>
                    </div>
                </div>


                <div style="text-align: center; color: #6b7280; margin-top: 40px; padding-top: 20px;
                ">
                    <p style="margin: 5px 0;">Thank you for choosing Serene Resort & Spa!</p>
                    <p style="margin: 5px 0;">We hope you enjoyed your stay and look forward to welcoming you again.</p>
                </div>
                </div></body>
                        </html>
                    `;

      // Create and share the PDF
      const { uri } = await printToFileAsync({ html });
      await shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate and share PDF. Please try again.');
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={generatePdf}>
      <Text style={styles.buttonText}>Generate Bill</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'black',
    borderRadius: 5,

   
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GenerateBill;
