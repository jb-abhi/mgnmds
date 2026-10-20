export type CollageSpan = 'normal' | 'wide' | 'tall' | 'big';

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  /** Optional collage tile span. If omitted, the gallery arranges items automatically based on aspect ratio and collage rhythm. */
  span?: CollageSpan;
}

export interface GalleryVideo {
  title: string;
  /** Any YouTube link: https://www.youtube.com/watch?v=..., https://youtu.be/..., https://www.youtube.com/shorts/... */
  url: string;
  caption?: string;
  /** Optional collage tile span: 'normal', 'wide', 'tall', or 'big'. */
  span?: CollageSpan;
}

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
  // YouTube videos displayed in the gallery and videos section.
  // Add YouTube links here in any format: watch URL, youtu.be link, or Shorts URL.
  // Optional span ('normal' | 'wide' | 'tall' | 'big') lets you customise collage appearance.
  youtubeVideos: [
    {
      title: 'MGN Motor Driving School - Karette Kilimanoor Overview',
      url: 'https://www.youtube.com/watch?v=w-Ujp1VYoqk',
      caption: 'Introduction to our school and courses',
      span: 'big',
    },
    {
      title: 'Half Clutch Technique & Uphill Driving',
      url: 'https://www.youtube.com/watch?v=eA6P4yYhBOQ',
      caption: 'Master clutch control on slopes & stops',
      span: 'wide',
    },
    {
      title: 'Two-Wheeler "8" Track Practice & Test Tips',
      url: 'https://www.youtube.com/watch?v=scdwqthBgQY',
      caption: 'Two-wheeler licence test track guide',
      span: 'normal',
    },
    {
      title: 'Practical Driving Lesson & Road Skills',
      url: 'https://www.youtube.com/watch?v=WnhPK5b6kH8',
      caption: 'On-road defensive driving techniques',
      span: 'normal',
    },
  ] as GalleryVideo[],
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
  // Photo gallery images. You can add images of any resolution or size.
  // Optional span ('normal' | 'wide' | 'tall' | 'big') lets you set collage layout sizes, or omit to arrange automatically.
  gallery: [
    { src: '/images/gallery-3.jpg', alt: 'Training vehicles at MGN Driving School', caption: 'Our 4-Wheeler Training Fleet', span: 'big' },
    { src: '/images/gallery-2.jpg', alt: 'Driving school training ground and route', caption: 'Training Ground Route', span: 'wide' },
    { src: '/images/instructors.svg', alt: 'Certified driving instructors', caption: 'Certified Instructors', span: 'normal' },
    { src: '/images/gallery-1.jpg', alt: 'Modern training cars with dual controls', caption: 'Dual-Control Cars', span: 'wide' },
    { src: '/images/gallery-4.jpg', alt: 'MGN Motor Driving School facility', caption: 'MGN Campus & Fleet', span: 'wide' },
    { src: '/images/training.svg', alt: 'Defensive road training sessions', caption: 'On-Road Training', span: 'normal' },
    { src: '/images/facilities.svg', alt: 'Modern learning facilities and test ground', caption: 'Our Facilities', span: 'normal' },
    { src: '/images/lessons.svg', alt: 'Interactive theory and practical lessons', caption: 'Step-by-Step Lessons', span: 'normal' }
  ] as GalleryImage[],
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
