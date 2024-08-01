import {SVG} from '../theme/assets';

export const APPJSONFILES = {
  dashboardQuantityTypes: [
    {label: '1 item', value: '1'},
    {label: '2 item', value: '2'},
    {label: '3 item', value: '3'},
    {label: '4 item', value: '4'},
    {label: '5 item', value: '5'},
    {label: '6 item', value: '6'},
    {label: '7 item', value: '7'},
    {label: '8 item', value: '8'},
  ],
  dashboardWeightTypes: [
    {label: '6 tons', value: '6'},
    {label: '8 tons', value: '8'},
    {label: '10 tons', value: '10'},
    {label: '12 tons', value: '12'},
    {label: '14 tons', value: '14'},
    {label: '16 tons', value: '16'},
    {label: '18 tons', value: '18'},
    {label: '20 tons', value: '20'},
  ],
  trucksData: [
    {
      id: 1,
      image: require('../theme/assets/images/truck1.png'),
      truckName: '125 bbl vacuum truck',
    },
    {
      id: 2,
      image: require('../theme/assets/images/truck2.png'),
      truckName: 'Winch Truck',
    },
    {
      id: 3,
      image: require('../theme/assets/images/truck1.png'),
      truckName: 'Heavy Haul with 52’ lowboy trailer',
    },
    // {
    //   id: 4,
    //   image: require('../theme/assets/images/truck2.png'),
    //   truckName: '20 yard belly dump truck',
    // },
    // {
    //   id: 5,
    //   image: require('../theme/assets/images/truck1.png'),
    //   truckName: '200 bbl oil hauler',
    // },
    // {
    //   id: 6,
    //   image: require('../theme/assets/images/truck2.png'),
    //   truckName: 'Truck with 48’ float trailer',
    // },
    // {
    //   id: 7,
    //   image: require('../theme/assets/images/truck1.png'),
    //   truckName: '16 yard dump truck',
    // },
  ],
  availableBidsDATA: [
    {
      id: '1',
      title: 'First Item',
      isChecked: false,
    },
    {
      id: '2',
      title: 'Second Item',
      isChecked: false,
    },
    {
      id: '3',
      title: 'Third Item',
      isChecked: false,
    },
  ],
  ratingAndReviewsDATA: [
    {
      name: 'John Doe',
      customerCompany: 'Customer Company',
      ratings: '4.5',
      ratingNumber: 4.5,
      daysCount: '1 day ago',
      descTxt:
        'As a customer, I was extremely happy with my experience working with the trucking company. The delivery was fast and on time, and the driver was very professional and helpful. The tracking feature of Truck Now made it easy for my to monitor the delivery process and know exactly where my package was at any given time.',
    },
    {
      name: 'John Sam',
      customerCompany: 'Customer Company',
      ratings: '4.1',
      ratingNumber: 4.1,
      daysCount: '3 day ago',
      descTxt:
        'As a customer, I was extremely happy with my experience working with the trucking company. The delivery was fast and on time, and the driver was very professional and helpful. The tracking feature of Truck Now made it easy for my to monitor the delivery process and know exactly where my package was at any given time.',
    },
    {
      name: 'John Sam',
      customerCompany: 'Customer Company',
      ratings: '4.1',
      ratingNumber: 4.1,
      daysCount: '3 day ago',
      descTxt:
        'As a customer, I was extremely happy with my experience working with the trucking company. The delivery was fast and on time, and the driver was very professional and helpful. The tracking feature of Truck Now made it easy for my to monitor the delivery process and know exactly where my package was at any given time.',
    },
  ],
  shipmentHistoryDATA: [
    {
      fromAreaName: 'Los Angeles, CA',
      fromCountryName: 'United States',
      toAreaName: 'Denver, CO',
      toCountryName: 'United States',
      pickupDate: 'October 24TH',
      pickupTime: '10:25 am',
      dropDate: 'October 24TH',
      dropTime: '02.00 pm',
      companyName: 'Trucking Company',
      truckName: 'Winch Truck',
      truckCharges: '$1,240',
    },
    {
      fromAreaName: 'Los Angeles, CA',
      fromCountryName: 'United States',
      toAreaName: 'Denver, CO',
      toCountryName: 'United States',
      pickupDate: 'October 24TH',
      pickupTime: '10:25 am',
      dropDate: 'October 24TH',
      dropTime: '02.00 pm',
      companyName: 'Trucking Company',
      truckName: 'Winch Truck',
      truckCharges: '$1,240',
    },
    {
      fromAreaName: 'Los Angeles, CA',
      fromCountryName: 'United States',
      toAreaName: 'Denver, CO',
      toCountryName: 'United States',
      pickupDate: 'October 24TH',
      pickupTime: '10:25 am',
      dropDate: 'October 24TH',
      dropTime: '02.00 pm',
      companyName: 'Trucking Company',
      truckName: 'Winch Truck',
      truckCharges: '$1,240',
    },
  ],
  shipmentSteps: [
    {
      id: 'pending',
      name: 'Pending',
      icon: SVG.icons.pendingIcon,
    },
    {
      id: 'ongoing',
      name: 'Ongoing',
      icon: SVG.icons.OngoingIcon,
    },
    {
      id: 'completed',
      name: 'Completed',
      icon: SVG.icons.completedIcon,
    },
    {
      id: 'cancel',
      name: 'Cancelled',
      icon: SVG.icons.cancelledIcon,
    },
  ],
  pinnedChatsDATA: [
    {
      id: 1,
      chatTitle: 'Swift',
      lastChat:
        'Hi, I noticed that my shipments status has been static for a long time',
      unreadCount: 2,
      chatTime: '10:25 am',
      chatCurrentScnee: 3,
    },
    {
      id: 2,
      chatTitle: 'Trucking',
      lastChat:
        'Brother, I noticed that my shipments status has been static for a long time',
      unreadCount: 4,
      chatTime: '01:25 pm',
      chatCurrentScnee: 3,
    },
    {
      id: 3,
      chatTitle: 'Swift Trucking',
      lastChat:
        'Hello, I noticed that my shipments status has been static for a long time',
      unreadCount: 0,
      chatTime: '02:25 am',
      chatCurrentScnee: 0,
    },
  ],
  simpleChatsDATA: [
    {
      id: 1,
      chatTitle: 'Swift',
      lastChat:
        'Hi, I noticed that my shipments status has been static for a long time',
      unreadCount: 0,
      chatTime: '10:25 am',
      chatCurrentScnee: 0,
    },
    {
      id: 2,
      chatTitle: 'Trucking',
      lastChat:
        'Brother, I noticed that my shipments status has been static for a long time',
      unreadCount: 1,
      chatTime: '01:25 pm',
      chatCurrentScnee: 3,
    },
    {
      id: 3,
      chatTitle: 'Swift Trucking',
      lastChat:
        'Hello, I noticed that my shipments status has been static for a long time',
      unreadCount: 0,
      chatTime: '02:25 am',
      chatCurrentScnee: 0,
    },
    {
      id: 4,
      chatTitle: 'Swift',
      lastChat:
        'Hi, I noticed that my shipments status has been static for a long time',
      unreadCount: 2,
      chatTime: '10:25 am',
      chatCurrentScnee: 3,
    },
    {
      id: 5,
      chatTitle: 'Trucking',
      lastChat:
        'Brother, I noticed that my shipments status has been static for a long time',
      unreadCount: 4,
      chatTime: '01:25 pm',
      chatCurrentScnee: 3,
    },
    {
      id: 6,
      chatTitle: 'Swift Trucking',
      lastChat:
        'Hello, I noticed that my shipments status has been static for a long time',
      unreadCount: 0,
      chatTime: '02:25 am',
      chatCurrentScnee: 0,
    },
  ],
  countryTypes: [
    {label: 'Pakistan', value: '1'},
    {label: 'America', value: '2'},
    {label: 'China', value: '3'},
    {label: 'England', value: '4'},
    {label: 'Russia', value: '5'},
    {label: 'India', value: '6'},
    {label: 'Japan', value: '7'},
    {label: 'Indonesia', value: '8'},
  ],
  cityTypes: [
    {label: 'New York ', value: '1'},
    {label: 'Los Angeles ', value: '2'},
    {label: 'Chicago', value: '3'},
    {label: 'Houston', value: '4'},
    {label: 'Phoenix', value: '5'},
    {label: 'Philadelphia', value: '6'},
    {label: 'San Antonio', value: '7'},
    {label: 'San Diego', value: '8'},
  ],
  hazardousMaterialTypes: [
    {label: 'Explosive ', value: 'Explosive'},
    {label: 'Flammable ', value: 'Flammable'},
    {label: 'Oxidising', value: 'Oxidising'},
    {label: 'Corrosive', value: 'Corrosive'},
    {label: 'Acute toxicity', value: 'Acute toxicity'},
    {label: 'Radioactive', value: 'Radioactive'},
    {label: 'Health hazard', value: 'Health hazard'},
    {label: 'Poison', value: 'Poison'},
  ],
};
