import { Client, Account, ID, Databases, Query } from 'react-native-appwrite';

const databaseId = '672873b6001d81cb4224'; 
const menuCollectionId = '672873c500074e357c8d';
const bookingCollectionId = '6729cfe0000176e82412';
const cottagesCollectionId = '6729d7410025a7f1d089';
const ordersCollectionId = '672db87a001b21d38f1a';
const hostCollectionId = '6732faee001e59728e0c'




    const client = new Client();
    client
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('6728723e001f321adeda')   // Your Project ID
      .setPlatform('cottify');   // Your package name / bundle identifier

      const databases = new Databases(client);
      const account = new Account(client);

      export const fetchMenuItems = async () => {
        try {
          const response = await databases.listDocuments(databaseId, menuCollectionId,
            [
              Query.orderAsc('name'),  // Order by 'name' in ascending order
              Query.limit(100),  // Limit to 100 results
            ]
          );
          return response.documents.map(doc => ({
            id: doc.$id,
            name: doc.name,
            price: parseFloat(doc.price),
          }));
        } catch (error) {
          console.error('Error fetching menu items:', error);
          return [];
        }
      };
      
      // Other Appwrite-related methods can be added here as needed
      export default {
        fetchMenuItems,
      };

      export const loginWithEmail = async (email, password) => {
        return await account.createEmailPasswordSession(email, password);
      };
      
      export const getSession = async () => {
        return await account.get();
      };

      export const getCurrentUser = async () => {
        try {
          const user = await account.get();
          return user; // Returns the user object, including the user ID
        } catch (error) {
          console.error('Failed to fetch the current user:', error);
          return null; // Return null if the user is not authenticated
        }
      };

    
      export const logout = async () => {
        return await account.deleteSession('current'); // 'current' to log out the logged-in user
      };


      export const fetchHostDetails = async (hostId) => {
        try {
          const response = await databases.getDocument(databaseId, hostCollectionId,hostId);
          return response;
        } catch (error) {
          console.error("Failed to fetch host details:", error);
          throw error;
        }
      };

      export const saveBooking = async (bookingData) => {
        const documentId = `booking_${new Date().getTime()}`; // Use timestamp as document ID
        try {
          await databases.createDocument(databaseId, bookingCollectionId, documentId, bookingData);
        } catch (error) {
          console.error('Error saving booking:', error);
          throw error; // Propagate error
        }
      };


      // 
      export const getCottagesByHost= async (hostId) => {
        const response = await databases.listDocuments(databaseId, cottagesCollectionId);
        
        // Assuming response is an array, filter to get the document matching the hostId
        const document = response.documents.find(doc => doc.hostId === hostId);
        
        if (document) {
          return document;
        } else {
          throw new Error("No cottages found for this host.");
        }
      };


      // get future booking count 

      export const getFutureBookingCount = async (userId) => {
        try {
          const today = new Date().toISOString().split('T')[0];
          const response = await databases.listDocuments(databaseId, bookingCollectionId, [
            Query.equal('hostId', userId),
            Query.greaterThanEqual('checkIn', today),
          ]);
      
          return response.documents.length;
        } catch (error) {
          console.error('Error fetching future bookings count:', error);
          return 0;
        }
      };

      // Get future Bookings
      export const getUpcomingBookings = async (hostId) => {
  try {
    const todayDate = new Date().toISOString().split("T")[0]; 
    const response = await databases.listDocuments(
      databaseId,
      bookingCollectionId,
      [
        Query.equal("hostId", hostId),
        Query.greaterThanEqual("checkIn", todayDate), // Use date only to ignore time component
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Failed to fetch upcoming bookings:", error);
    throw error;
  }
};

export const getOnGoingBookings = async (hostId) => {
  try {
    const todayDate = new Date().toISOString().split("T")[0]; 
    const response = await databases.listDocuments(
      databaseId,
      bookingCollectionId,
      [
        Query.equal("hostId", hostId),
        Query.lessThanEqual("checkIn", todayDate), 
        Query.greaterThan("checkOut", todayDate),
      ]
    );
    return response.documents;
  } catch (error) {
    console.error("Failed to fetch upcoming bookings:", error);
    throw error;
  }
};


// Fetch bookings arriving today
export const getArrivingTodayBookings = async (hostId) => {
  const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
  const response = await databases.listDocuments(databaseId, bookingCollectionId, [
    Query.equal('hostId', hostId),
    Query.equal('checkIn', today),
    
  ]);
  return response.documents;
};

// Fetch currently hosting bookings
export const getCurrentlyHostingBookings = async (hostId) => {
  const today = new Date().toISOString().split("T")[0];
  const response = await databases.listDocuments(databaseId, bookingCollectionId, [
    Query.equal('hostId', hostId),
    Query.lessThanEqual('checkIn', today),
    Query.greaterThan('checkOut', today),
  ]);
  return response.documents;
};

// Fetch bookings checking out today
export const getCheckoutTodayBookings = async (hostId) => {
  const today = new Date().toISOString().split("T")[0];
  const response = await databases.listDocuments(databaseId, bookingCollectionId, [
    Query.equal('hostId', hostId),
    Query.equal('checkOut', today),
  ]);
  return response.documents;
};

export const getBookingDetail = async (bookingId) => {
  try {
    const response = await databases.getDocument(databaseId, bookingCollectionId, bookingId);
    return response;
  } catch (error) {
    console.error('Error fetching booking details: ', error);
    throw error;
  }
};

// food order code

export const addItemToOrder = async (itemId, quantity) => {
  try {
    await databases.updateDocument(databaseId, collectionId, itemId, {
      quantity: quantity,
    });
  } catch (error) {
    console.error('Error adding item:', error);
  }
};

export const removeItemFromOrder = async (itemId, quantity) => {
  try {
    await databases.updateDocument(databaseId, collectionId, itemId, {
      quantity: quantity,
    });
  } catch (error) {
    console.error('Error removing item:', error);
  }
};

export const getOrderItems = async () => {
  try {
    const items = await databases.listDocuments(databaseId, collectionId);
    return items.documents;
  } catch (error) {
    console.error('Error fetching order items:', error);
    return [];
  }
};

export const submitOrder = async (orders, userId) => {


  try {
    // Loop through each order and add it to the Appwrite database
    for (const order of orders) {
      await databases.createDocument(databaseId, ordersCollectionId,'unique()' ,{
          bookingId: userId,
          name: order.name,
          price: order.price,
          quantity: order.quantity,
     
      });
    }
    console.log("All items added to database");
  } catch (error) {
    console.error("Error adding items to database:", error);
    throw error;
  }
};


export const getOrdersByBookingId = async (userId) => {
  try {
    const response = await databases.listDocuments(databaseId, ordersCollectionId, [
      // Filter by booking ID, assuming each order is linked to a booking ID
      Query.equal('bookingId', userId)
    ]);
    return response.documents.map(doc => ({
      id: doc.$id,
      name: doc.name,
      price: doc.price,
      quantity: doc.quantity,
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const deleteOrderById = async (orderId) => {
  try {
    await databases.deleteDocument(databaseId, ordersCollectionId, orderId);
    console.log("Order deleted successfully.");
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};


export const addProperty = async (hostId, newPropertyName) => {
  try {
    // Fetch the current document
    const document = await databases.getDocument(databaseId, hostCollectionId, hostId);

    // Get the current businessEntities array
    const currentEntities = document.businessEntities || [];

    // Add the new property to the array
    const updatedEntities = [...currentEntities, newPropertyName];

    // Update the document with the new businessEntities array
    const updatedDocument = await databases.updateDocument(
      databaseId,
      hostCollectionId,
      hostId,
      {
        businessEntities: updatedEntities,
      }
    );

    return updatedDocument;
  } catch (error) {
    console.error("Error adding property:", error);
    throw error;
  }
};


// Function to delete a property from the array
export const deleteProperty = async (hostId, propertyName) => {
  try {
   

    // Fetch the current document
    const document = await databases.getDocument(databaseId, hostCollectionId, hostId);

    // Get the current businessEntities array
    const currentEntities = document.businessEntities || [];

    // Filter out the property to delete
    const updatedEntities = currentEntities.filter((property) => property !== propertyName);

    // Update the document with the new businessEntities array
    const updatedDocument = await databases.updateDocument(
      databaseId,
      hostCollectionId,
      hostId,
      {
        businessEntities: updatedEntities,
      }
    );

    return updatedDocument;
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
};


export const updateProperty = async (hostId, oldProperty, newProperty) => {
  try {
    const documentId = hostId; // Assuming hostId is the document ID for the host
     

    // Fetch the current document
    const document = await databases.getDocument(databaseId, hostCollectionId, documentId);

    // Get the current businessEntities array
    const businessEntities = document.businessEntities || [];

    // Update the array: replace the old property with the new one
    const updatedBusinessEntities = businessEntities.map((property) => 
      property === oldProperty ? newProperty : property
    );

    // Update the document with the new businessEntities array
    const updatedDocument = await databases.updateDocument(
      databaseId,
      hostCollectionId,
      documentId,
      {
        businessEntities: updatedBusinessEntities,
      }
    );  

    return updatedDocument;
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
};