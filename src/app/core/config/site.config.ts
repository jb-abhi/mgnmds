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

export interface ReviewItem {
  name: string;
  quote: string;
  rating?: number; // 1 to 5 (ratings 4 and above are displayed)
  date?: string;   // e.g. "2 weeks ago"
  source?: 'google' | 'custom';
  authorPhoto?: string;
  sample?: boolean;
}

// EDIT THESE. Every value is a PLACEHOLDER until you replace it. Nothing here is a real business claim.
export const SITE = {
  // Increment this value when preparing each deployment.
  version: '1.0.2',
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
  // Latest videos from the YouTube channel are also fetched and merged dynamically via /api/youtube.
  youtubeVideos: [
    {
      title: 'MGN Motor Driving School - Karette Kilimanoor Overview',
      url: 'https://www.youtube.com/watch?v=w-Ujp1VYoqk',
      caption: 'Introduction to our school and courses',
      span: 'big',
    },
    {
      title: 'Steering Awareness & Control Guide',
      url: 'https://www.youtube.com/watch?v=SBGwr3PCo3g',
      caption: 'Essential steering control & wheel handling methods',
      span: 'wide',
    },
    // {
    //   title: 'Awareness Class for Driving Performance',
    //   url: 'https://www.youtube.com/watch?v=7PPPyI4mApA',
    //   caption: 'Guidance and driving awareness class by MGN',
    //   span: 'wide',
    // },
    // {
    //   title: 'Sudden Clutch with Accelerator Practice',
    //   url: 'https://www.youtube.com/watch?v=io3zUGpu4Xk',
    //   caption: 'Coordinating clutch and acceleration safely',
    //   span: 'normal',
    // },
    // {
    //   title: 'Importants of Steering Clutch and Accilarator',
    //   url: 'https://www.youtube.com/watch?v=WnhPK5b6kH8',
    //   caption: 'Practical driving lessons and pedal coordination',
    //   span: 'normal',
    // },
    // {
    //   title: 'Steering Practice Exercise',
    //   url: 'https://www.youtube.com/watch?v=jzUL4abCOTI',
    //   caption: 'Ground steering drill for precision handling',
    //   span: 'tall',
    // },
    // {
    //   title: 'H Practice Outside View - Important Points',
    //   url: 'https://www.youtube.com/watch?v=hnbwFZoMzfc',
    //   caption: 'External view and key guidance for the "H" track test',
    //   span: 'big',
    // },
    // {
    //   title: 'Cluster Meter and Other Control Switches',
    //   url: 'https://www.youtube.com/watch?v=2F61ebCThDE',
    //   caption: 'Instrument cluster and driver controls explained',
    //   span: 'wide',
    // },
    // {
    //   title: 'Steering Practice Ground Class',
    //   url: 'https://www.youtube.com/watch?v=0eS5vdxL-J0',
    //   caption: 'Ground practical training for beginner steering confidence',
    //   span: 'normal',
    // },
    // {
    //   title: 'Steering Analisation Class',
    //   url: 'https://www.youtube.com/watch?v=L78Seji7_Kc',
    //   caption: 'Analysing steering techniques and correcting habits',
    //   span: 'normal',
    // },
    // {
    //   title: 'Half Clutch Control for Beginners',
    //   url: 'https://www.youtube.com/watch?v=yUC3vor8veM',
    //   caption: 'Mastering the clutch friction point for smooth starts',
    //   span: 'wide',
    // },
    // {
    //   title: 'Half Clutch Technique & Uphill Driving',
    //   url: 'https://www.youtube.com/watch?v=eA6P4yYhBOQ',
    //   caption: 'Master clutch control on slopes & stops',
    //   span: 'normal',
    // },
    // {
    //   title: 'Two-Wheeler "8" Track Practice & Test Tips',
    //   url: 'https://www.youtube.com/watch?v=scdwqthBgQY',
    //   caption: 'Two-wheeler licence test track guide',
    //   span: 'tall',
    // },
  ] as GalleryVideo[],
  address: `MGN Motor Driving School,
            Pedikulam, Pulimath P.O.
            Thiruvananthapuram – 695612`,
  town: 'Pulimath', district: 'Thiruvananthapuram',
  hours: 'Mon - Sat: 6:00 AM to 5:00 PM',
  mapsEmbedUrl: 'https://www.google.com/maps?q=MGN+Motor+Driving+School,+Pulimath,+Thiruvananthapuram&output=embed',
  // Sample categories only. Confirm what the school actually offers.
  courses: [
    {
      name: 'Light Motor Vehicle (LMV)',
      text: 'Learn to drive a car, from the basics of vehicle control to safe driving skills and driving test preparation.'
    },
    {
      name: 'Motorcycle With Gear (MCWG)',
      text: 'Learn to ride a geared motorcycle, including gear shifting, vehicle control, road safety, and driving test preparation.'
    },
    {
      name: 'Motorcycle Without Gear (MCWOG)',
      text: 'Learn to ride a gearless two-wheeler, including scooter handling, balance, traffic awareness, and driving test preparation.'
    }
  ],
  serviceArea: 'Thiruvananthapuram, Kerala',
  images: {
    heroSlides: [
      { src: '/images/new-bg-8.webp', alt: 'Defensive driving course road view-4' },
      { src: '/images/new-bg-7.webp', alt: 'Defensive driving course road view-2' },
      { src: '/images/new-bg-6.webp', alt: 'Defensive driving course road view-2' },
      { src: '/images/new-bg-5.webp', alt: 'Defensive driving course road view-1' },
      { src: '/images/new-bg-4.webp', alt: 'Defensive driving course road view' },
      { src: '/images/new-bg-3.webp', alt: 'Professional driving instruction road view' }
    ],
    about: '/images/about-car.webp',
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
    { src: '/images/gallery-3.webp', alt: 'Training vehicles at MGN Driving School', caption: 'Our 4-Wheeler Training Fleet', span: 'big' },
    { src: '/images/gallery-2.webp', alt: 'Our First Driving School Vehicle', caption: 'Legacy', span: 'wide' },
    { src: '/images/gallery-1.webp', alt: 'Cars and motorcycles used for driving lessons', caption: 'Our Training Vehicles', span: 'wide' },
    { src: '/images/gallery-4.webp', alt: 'MGN Motor Driving School sign and entrance', caption: 'MGN MDS', span: 'wide' },
    { src: '/images/gallery-5.webp', alt: 'Motorcycles arranged inside the covered training area', caption: 'Covered Training Area', span: 'big' },
    { src: '/images/gallery-6.webp', alt: 'Driving practice equipment inside the training hall', caption: 'Car Chasis', span: 'wide' },
    { src: '/images/gallery-7.webp', alt: 'Driving school training boards inside the hall', caption: 'Learning Materials', span: 'big' },
    { src: '/images/gallery-9.webp', alt: 'Tables and seating in the lecture Hall', caption: 'Lecture Hall', span: 'wide' },
    { src: '/images/gallery-10.webp', alt: 'Driving training equipment and learning materials', caption: 'Working of an Engine', span: 'tall' },
    { src: '/images/gallery-11.webp', alt: 'Classroom seating and practical training area', caption: 'Inside the Demonstration Hall', span: 'wide' },
    { src: '/images/gallery-12.webp', alt: 'Driving school building surrounded by trees', caption: 'School Grounds (H)', span: 'big' },
    { src: '/images/gallery-14.webp', alt: 'Tree-lined outdoor area at the driving school', caption: 'Outdoor Practice Area (8)', span: 'tall' },
    { src: '/images/gallery-15.webp', alt: 'Driving school building and outdoor grounds', caption: 'School Building', span: 'big' },
    { src: '/images/gallery-16.webp', alt: 'Interior view of the driving school', caption: 'Mock Steering Practise', span: 'wide' },
    { src: '/images/gallery-17.webp', alt: 'Open driving practice ground beneath trees', caption: 'Motorcycle Practice Ground', span: 'big' }
  ] as GalleryImage[],
  // Google reviews settings & verified Google reviews (4 stars and above)
  googleRating: 4.8,
  googleReviewCount: 9,
  googleReviewWriteUrl: 'https://g.page/r/CS6ZBIJwW2_jEAE/review',
  googleBusinessProfileUrl: 'https://share.google/rNpWB9NRBG4eEJmGb',

  googleReviews: [
    // {
    //   name: 'Abhijith JB',
    //   rating: 5,
    //   date: 'Google Review',
    //   quote: 'MGN MDS തുടരും',
    //   source: 'google',
    // },
    // {
    //   name: 'Hariprasad R S',
    //   rating: 5,
    //   date: 'Google Review',
    //   quote: 'Only one institute I know where theory and practical classes do in a systematic way..',
    //   source: 'google',
    // },
    // {
    //   name: 'Vignesh AP',
    //   rating: 5,
    //   date: 'Google Review',
    //   quote: 'best driving class by experienced hands.. defenitly advisable',
    //   source: 'google',
    // },
    // {
    //   name: 'Suresh Kumar',
    //   rating: 5,
    //   date: 'Google Review',
    //   quote: 'Very good training and instruction.',
    //   source: 'google',
    // },
  ] as ReviewItem[],

  // Custom reviews / testimonials. You can add as many custom reviews here as you like.
  // Reviews with rating 4 or 5 stars will be displayed alongside Google reviews.
  testimonials: [
    // {
    //   name: 'Anjali R.',
    //   quote: 'The instructor explained each step clearly. I felt more relaxed and confident behind the wheel after every lesson.',
    //   rating: 5,
    //   date: 'Recent',
    //   source: 'custom',
    //   sample: true,
    // },
    // {
    //   name: 'Rahul K.',
    //   quote: 'The lessons were patient and easy to follow. Practising on local roads helped me feel ready for everyday driving.',
    //   rating: 5,
    //   date: 'Recent',
    //   source: 'custom',
    //   sample: true,
    // },
    // {
    //   name: 'Meera S.',
    //   quote: 'Dedicated instructors who ensure safety first. Very comfortable and encouraging environment for learning to drive.',
    //   rating: 5,
    //   date: 'Recent',
    //   source: 'custom',
    //   sample: true,
    // },
  ] as ReviewItem[],
};
