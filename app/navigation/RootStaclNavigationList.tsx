export type Booking = {
  $id: string;
  booker: string;
  cottage: string;
  checkIn: string;
  checkOut: string;
  contact: string;
};

export type RootStackParamList = {
  Home: undefined;
  BookingDetail: { booking: Booking }; // Pass the entire booking object
};