// EDIT THESE. Every value is a PLACEHOLDER until you replace it. Nothing here is a real business claim.
export const SITE = {
  name: 'MGN Motor Driving School',
  url: 'https://yourdrivingschool.in',
  tagline: 'Learn safe, defensive driving from an instructor with 25+ years of experience in Trivandrum, Kerala.',
  phone: '+918086058209',          // international format, digits only after +
  phoneDisplay: '+91 80860 58209',
  whatsapp: '918086058209',        // country code + number, no +
  address: 'Saraswathy Bhavan, Pedikulam, Pulimath PO, TRV, Keralam 695612',
  town: 'Pulimath', district: 'Thiruvananthapuram',
  hours: 'Mon-Sat: [opening time] to [closing time]',
  mapsEmbedUrl: 'https://share.google/BpMhCje1s7YRw57UN', // paste Google Maps "Embed a map" src URL
  // Sample categories only. Confirm what the school actually offers.
  courses: [
    { name: 'Light motor vehicle (car)', text: 'Learn to drive a car from the basics to the driving test.', fee: 'Fee on request' },
    { name: 'Two-wheeler', text: 'Scooter and motorcycle training for beginners.', fee: 'Fee on request' },
    { name: 'Heavy vehicle', text: 'Training for heavy motor vehicle licences.', fee: 'Fee on request' }
  ],
  serviceArea: 'Thiruvananthapuram, Kerala',
  images: {
    heroSlides: [
      { src: '/images/new-bg-8.jpg', alt: 'Defensive driving course road view-4' },
      { src: '/images/new-bg-7.jpg', alt: 'Defensive driving course road view-2' },
      { src: '/images/new-bg-6.jpg', alt: 'Defensive driving course road view-2' },
      { src: '/images/new-bg-5.jpg', alt: 'Defensive driving course road view-1' },
      { src: '/images/new-bg-4.jpg', alt: 'Defensive driving course road view' },
      { src: '/images/new-bg-3.jpg', alt: 'Professional driving instruction road view' }
    ],
    about: '/images/instructors.svg',
    aboutAlt: 'Placeholder: replace with a photo of the instructors'
  },
  // Placeholders only. Replace with the school's genuine strengths.
  benefits: [
    { title: '[Key benefit 1]', text: '[One honest sentence about it.]' },
    { title: '[Key benefit 2]', text: '[One honest sentence about it.]' },
    { title: '[Key benefit 3]', text: '[One honest sentence about it.]' }
  ],
  gallery: [
    { src: '/images/vehicles.svg', alt: 'Placeholder: training vehicle', caption: 'Our vehicles' },
    { src: '/images/instructors.svg', alt: 'Placeholder: instructor', caption: 'Instructors' },
    { src: '/images/training.svg', alt: 'Placeholder: training session', caption: 'On the road' },
    { src: '/images/facilities.svg', alt: 'Placeholder: facility', caption: 'Our facility' },
    { src: '/images/lessons.svg', alt: 'Placeholder: lesson', caption: 'Lessons' }
  ],
  // Genuine reviews only. The testimonials section stays hidden while this list is empty.
  testimonials: [] as { quote: string; name: string }[]
};
