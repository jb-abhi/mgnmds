// EDIT THESE. Every value is a PLACEHOLDER until you replace it. Nothing here is a real business claim.
export const SITE = {
  name: 'MGN Motor Driving School',
  url: 'https://mgnmotordrivingschool.com',
  tagline: 'Learn safe, defensive driving from an instructor with 25+ years of experience in Trivandrum, Kerala.',
  phone: '+918086058209',          // international format, digits only after +
  phoneDisplay: '+91 80860 58209',
  whatsapp: '918086058209',        // country code + number, no +
  email: 'mgnmotordrivingschool@gmail.com',
  social: {
    facebook: 'https://www.facebook.com/p/MGN-Motor-Driving-School-100057680490002/',
    youtube: 'https://www.youtube.com/@m.g.nmotordrivingschoolkar9486',
  },
  address: `MGN Motor Driving School,
            Pedikulam, Pulimath P.O.
            Thiruvananthapuram – 695612`,
  town: 'Pulimath', district: 'Thiruvananthapuram',
  hours: 'Mon - Sat: 9:00 AM to 6:00 PM',
  mapsEmbedUrl: 'https://www.google.com/maps?q=MGN+Motor+Driving+School,+Pulimath,+Thiruvananthapuram&output=embed',
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
    about: '/images/about-car.png',
    aboutAlt: 'Oldest Driving School Vehicle'
  },
  // Placeholders only. Replace with the school's genuine strengths.
  benefits: [
    { title: '[Key benefit 1]', text: '[One honest sentence about it.]' },
    { title: '[Key benefit 2]', text: '[One honest sentence about it.]' },
    { title: '[Key benefit 3]', text: '[One honest sentence about it.]' }
  ],
  gallery: [
    { src: '/images/instructors.svg', alt: 'Placeholder: instructor', caption: 'Instructors' },
    { src: '/images/gallery-3.jpg', alt: 'Placeholder: training vehicle', caption: '4 wheelers' },
    { src: '/images/gallery-1.jpg', alt: 'Placeholder: training vehicle', caption: 'Our vehicles' },
    { src: '/images/gallery-4.jpg', alt: 'Placeholder: MGN MDS', caption: 'MGN MDS' },
    { src: '/images/training.svg', alt: 'Placeholder: training session', caption: 'On the road' },
    { src: '/images/facilities.svg', alt: 'Placeholder: facility', caption: 'Our facility' },
    { src: '/images/lessons.svg', alt: 'Placeholder: lesson', caption: 'Lessons' }
  ],
  // These sample reviews should be replaced with genuine, permission-based testimonials before launch.
  testimonials: [
    {
      quote: 'The instructor explained each step clearly. I felt more relaxed and confident behind the wheel after every lesson.',
      name: 'Anjali R.',
      sample: true,
    },
    {
      quote: 'The lessons were patient and easy to follow. Practising on local roads helped me feel ready for everyday driving.',
      name: 'Rahul K.',
      sample: true,
    },
    {
      quote: 'MGN തുടരും',
      name: 'Meera S.',
      sample: true,
    },
  ] as { quote: string; name: string; sample?: boolean }[]
};
