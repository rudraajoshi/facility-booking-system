// facility data structure
export const facilitiesData =[
    {
        id: '1',
        name: 'Conference Room A', 
        category: 'meeting-room',
        description: "Spacious conference room with modern AV equipment, perfect for presentations and large meetings, video conferencing capabilities, high-speed internet, as well as comfortable seating.",
        images: [
            '/images/conference-room-3.jpg'
        ],
        capacity: { min: 10, max: 20},
        pricing: {
            hourly: 50,
            halfDay: 180,
            fullDay: 320
        },
        operatingHours: {
            start: '08:00',
            end: '20:00'
        },
        amenities: [
            'Projector',
            'Whiteboard',
            'Video Conferencing',
            'High-speed internet',
            'Air conditioning',
            'Nespresso',
            'Parking'
        ],
        rules: [
            'No smoking',
            'No food or drinks around equipment',
            'Clean up after use',
            'Report damages if any immediately',
            'Max capacity must not be exceeded'
        ],
        location: 'Building 1, Floor3 3',
        features: [
            '4K projector',
            'Wireless presentation',
            'Soundproof walls',
            'Natural lighting',
            'Ergonomic chairs'
        ],
        rating: 4.5,
        reviewCount: 48,
        status: 'Available'
    },
    {
        id: '2',
        name: 'Meeting room B',
        category: 'meeting-room',
        description: 'Intimate meeting space perfect for small team meetings and brainstorming sessions. Equipped with modern furniture and collaboration tools.',
        images: [
            '/images/meeting-room-2.jpg'
        ],
        capacity: { mind: 4, max: 8},
        pricing: {
            hourly: 30,
            halfDay: 110,
            fullDay: 200
        },
        operatingHours: {
            start: '08:00',
            end: '20:00'
        },
        amenities: [
            'Whiteboard',
            'TV Screen',
            'Wifi',
            'Air Conditioning',
            'Water dispenser'
        ],
        rules: [
            'No smoking',
            'Maintain cleanliness',
            'Turn off lights when leaving',
            'Do not rearrange furniture'
        ],
        location: 'Building2, Floor 2',
        features: [
            'Smart TV',
            'Comfortable seating',
            'Natural light',
            'Quiet environment'
        ],
        rating: 4.3,
        reviewCount: 32,
        status: 'Limited'
    },
    {
        id: '3',
        name: 'Training hall',
        category: 'training-room',
        description: 'Large hall designed for workshops, training sessions and seminars. Features theatre-style seating and professional audio-visual setup.',
        images: [
            '/images/training-room-1.jpg'
        ],
        capacity: { min: 20, max: 50},
        pricing: {
            hourly: 100,
            halfDay: 380,
            fullDay: 680
        },
        operatingHours: {
            start: '08:00',
            end: '20:00'
        },
        amenities: [
            'Stage',
            'Professional audio system',
            'Multiple projectors',
            'Microphones',
            'Air conditioning',
            'Parking',
            'Pantry',
            'Restrooms'
        ],
        rules: [
            'No smoking',
            'Pantry usage must be approved',
            'Clean up post use',
            'Damage deposit required',
            'Sound levels to be under limit'
        ],
        location: 'Building 3, Ground floor',
        features: [
            'Theatre seating',
            'Professional lighting',
            'Raised stage',
            'Sound system',
            'Recording capability'
        ],
        rating: 4.7,
        reviewCount: 64,
        status: 'Booked'
    },
    {
        id: '4',
        name: 'Executive boardroom',
        category: 'meeting-room',
        description: 'Premium boardroom for executive meetings and client presentations. Elegant design with top-tier amenities',
        images: [
            '/images/boardroom-1.jpg'
        ],
        capacity: { min: 6, max: 12},
        pricing: {
            hourly: 80,
            halfDay: 300,
            fullDay: 550
        },
        operatingHours: {
            start: '08:00',
            end: '20:00'
        },
        amenities: [
            'Executive chairs',
            'Video conferencing',
            'Whiteboard',
            'Smart TV',
            'Coffee Service',
            'High-speed internet',
            'Privacy blinds'
        ],
        rules: [
            'Business attire recommended',
            'No smoking',
            'Respect confidentiality',
            'Advanced booking required'
        ],
        location: 'Building 1, Floor 5',
        features: [
            'Premium furniture',
            'City view',
            'Professional ambiance',
            'Soundproof walls'
        ],
        rating: 4.8,
        reviewCount: 35,
        status: 'Available'
    },
    {
        id: '5',
        name: 'Innovation lab',
        category: 'training-room',
        description: 'Creative workspace designed for innovative workshops, design thinking sessions and collaborative projects',
        images: [
            '/images/innovation-lab-1.jpg',
            '/images/innovation-lab-2.jpg'
        ],
        capacity: { min: 10, max: 25},
        pricing: {
            hourly: 60,
            halfDay: 220,
            fullDay: 400
        },
        operatingHours: {
            start: '08:00',
            end: '22:00'
        },
        amenities: [
            'Multiple whiteboards',
            'Movable furniture',
            'Brainstorming tools',
            'Wifi',
            'Projector',
            'Breakout areas',
            'Standing desks'
        ],
        rules: [
            'Encourage creativity',
            'No smoking',
            'Clean up post sessions',
            'Resepect peer space'
        ],
        location: 'Building 2, Floor 4',
        features: [
            'Flexible layout',
            'Attractive design',
            'Collaboration tools',
            'Natural lighting'
        ],
        rating: 4.6,
        reviewCount: 41,
        status: 'Available'
    }
];

export const facilities = facilitiesData;